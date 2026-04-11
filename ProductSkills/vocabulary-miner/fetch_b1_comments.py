"""
fetch_b1_comments.py — Fetch Bucket 1 posts + top comments for advice analysis

Fetches posts where builders can't get users (Bucket 1 - Marketing & Distribution),
then fetches the top comments for each post.

Output: structured markdown showing each post + the advice given in comments,
        so we can analyze whether advice is tactical (distribution pipeline)
        vs. diagnostic (you don't know your problem/user).

Usage:
    python fetch_b1_comments.py
"""

import os
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent.parent / ".env")
except ImportError:
    pass

SUBREDDITS = "vibecoding+buildinpublic+SideProject"
LIMIT_PER_KEYWORD = 30
TOP_COMMENTS_PER_POST = 8   # top-level comments only, by score
MIN_COMMENT_WORDS = 10       # skip one-liners and "congrats!" noise
MAX_POSTS = 20               # cap total posts to avoid rate limits

SKIP_SIGNALS = [
    "looking to chat with", "looking to interview", "conducting research",
    "happy to jump on a call", "here's everything i learned", "here's how i",
    "how i got", "how we got", "$10k mrr", "$5k mrr", "$1k mrr",
    "first 1k took", "first $1k", "went from $0", "went from 0 to",
    "0 to $", "from zero to", "change my mind", "1. engage in",
    "mrr and the consistency", "497k", "90 days ago i almost", "hit #1",
    "i'm offering", "free sessions",
]

B1_TRIGGERS = [
    "how to get users", "how do i get users", "how to market", "can't get users",
    "getting users is", "distribution is hard", "distribution is harder",
    "no one knows about it", "nobody knows about", "can't get traction",
    "no traffic", "no downloads", "no signups", "how to promote",
    "how do you find customers", "how to reach",
    "nobody found it", "marketing is harder", "i'm not a marketer",
    "how to sell", "getting paying users", "how do you get people to",
    "how to get people to", "no one is signing up", "nobody is signing up",
    "how do i find", "how to get first", "zero users zero budget",
    "no one sees it", "can't find customers",
    "launched no one came", "launched and nobody",
]

KEYWORDS_B1 = [
    "how to get users",
    "distribution harder than building",
    "launched no users",
    "shipped no users",
    "how to market my product",
    "can't get traction",
    "zero users zero budget",
    "no signups after launch",
    "getting paying users",
    "how do you get first users",
    "no one uses my app",
    "built it nobody came",
    "how do i find customers",
]


def is_advisory(title, body):
    text = (title + " " + body).lower()
    return any(s in text for s in SKIP_SIGNALS)


def classify_b1(title, body):
    text = (title + " " + body).lower()
    return any(t in text for t in B1_TRIGGERS)


def format_age(created_utc):
    now = datetime.now(timezone.utc)
    delta = now - datetime.fromtimestamp(created_utc, tz=timezone.utc)
    h = int(delta.total_seconds() / 3600)
    if h < 1:
        return f"{int(delta.total_seconds() / 60)}m ago"
    if h < 24:
        return f"{h}h ago"
    return f"{h // 24}d ago"


def fetch_top_comments(post, limit=TOP_COMMENTS_PER_POST):
    """Fetch top-level comments sorted by score, filtering noise."""
    try:
        post.comments.replace_more(limit=0)
        comments = []
        for c in post.comments.list():
            if c.author is None:
                continue
            if str(c.author) in ("AutoModerator", "reddit", "[deleted]"):
                continue
            body = c.body.strip()
            if body in ("[deleted]", "[removed]"):
                continue
            word_count = len(body.split())
            if word_count < MIN_COMMENT_WORDS:
                continue
            comments.append(c)

        comments.sort(key=lambda c: c.score, reverse=True)
        return comments[:limit]
    except Exception as e:
        return []


def main():
    try:
        import praw
    except ImportError:
        print("Error: praw not installed. Run: pip install praw")
        sys.exit(1)

    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    if not client_id or not client_secret:
        print("Error: REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET not set.")
        sys.exit(1)

    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent="b1-comment-analysis/1.0 (Product Builder Agent research)",
    )

    seen = set()
    candidates = []

    print(f"Fetching Bucket 1 posts...")
    for kw in KEYWORDS_B1:
        try:
            results = reddit.subreddit(SUBREDDITS).search(
                kw, sort="top", limit=LIMIT_PER_KEYWORD, time_filter="month"
            )
            for post in results:
                if post.id in seen:
                    continue
                seen.add(post.id)
                body = post.selftext.strip()
                if body in ("[deleted]", "[removed]"):
                    continue
                if is_advisory(post.title, body):
                    continue
                if not classify_b1(post.title, body):
                    continue
                if post.num_comments < 3:
                    continue  # need enough comments to see advice patterns
                candidates.append(post)
        except Exception as e:
            print(f"  Warning: '{kw}' failed - {e}", file=sys.stderr)

    # Sort by comment count (most discussed = richest advice signal)
    candidates.sort(key=lambda p: p.num_comments, reverse=True)
    candidates = candidates[:MAX_POSTS]
    print(f"  {len(candidates)} qualifying posts with comments")

    # Build output
    today = datetime.now().strftime("%Y-%m-%d")
    lines = [
        f"# Bucket 1 Comment Analysis - {today}",
        "",
        "**Focus:** What advice do people actually give when a builder says 'I can't get users'?",
        "",
        "**Analysis question:** Is the advice tactical (distribution pipeline) or diagnostic (you don't know your problem/user)?",
        "",
        "---",
        "",
    ]

    for i, post in enumerate(candidates, 1):
        age = format_age(post.created_utc)
        excerpt = post.selftext.strip()[:400].rstrip()
        if len(post.selftext) > 400:
            excerpt += "..."
        url = f"https://reddit.com{post.permalink}"

        lines += [
            f"## Post {i}: {post.title}",
            "",
            f"**r/{post.subreddit}** · {post.score} pts · {post.num_comments} comments · {age}",
            "",
            f"> {excerpt}",
            "",
            f"[View post]({url})",
            "",
            "### Top comments",
            "",
        ]

        print(f"  [{i}/{len(candidates)}] Fetching comments: {post.title[:60]}...")
        comments = fetch_top_comments(post)

        if not comments:
            lines.append("_(No qualifying comments found)_\n")
        else:
            for j, c in enumerate(comments, 1):
                comment_text = c.body.strip()
                # Truncate very long comments
                if len(comment_text) > 600:
                    comment_text = comment_text[:600].rstrip() + "..."
                lines += [
                    f"**Comment {j}** (score: {c.score})",
                    "",
                    f"> {comment_text}",
                    "",
                ]

        lines += ["---", ""]

    content = "\n".join(lines)

    out_dir = Path(__file__).parent.parent.parent / "Product-Agent-app/data/ProductBuilder"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"b1-comment-analysis-{today}.md"
    out_file.write_text(content, encoding="utf-8")

    print(f"\nSaved to: data/ProductBuilder/b1-comment-analysis-{today}.md")
    print(f"Posts analyzed: {len(candidates)}")


if __name__ == "__main__":
    main()
