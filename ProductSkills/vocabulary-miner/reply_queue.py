"""
reply_queue.py — Top reply opportunities for Bucket 1 and Bucket 2

Fetches posts from builder subreddits, filters to:
  Bucket 1 - MARKETING:   "I built it, now how do I get users?"
  Bucket 2 - DISCOVERY:   "I built the wrong thing / didn't validate"

Ranks by reply-worthiness:
  - Recency (fresher = better)
  - Comment count (low = open field, but not zero = no engagement)
  - Pain genuine (not advisory/success stories)

Outputs top 10 per bucket to:
  public/prototypes/product-builder-agent/reply-queue-YYYY-MM-DD.md

Usage:
    python reply_queue.py
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

PUBLIC_OUTPUT = Path(__file__).parent.parent.parent / "Product-Agent-app/public/prototypes/product-builder-agent"

SUBREDDITS = "vibecoding+buildinpublic+SideProject+saas+microsaas+AppBusiness+EntrepreneurRideAlong"
LIMIT_PER_KEYWORD = 25
MAX_BODY_CHARS = 500

# ── Skip these — they're advisory, promotional, or researcher posts ───────────
SKIP_SIGNALS = [
    "looking to chat with", "looking to talk with", "looking to interview",
    "would love to chat", "15-20 min chat", "conducting research",
    "happy to jump on a call", "here's everything i learned",
    "here's what i learned", "here is what i learned",
    "here's how i", "here is how i",
    "i tracked every", "i tracked my",
    "this is how i", "how i got", "how we got",
    "our path to", "my path to",
    "$10k mrr", "$5k mrr", "$1k mrr", "10k mrr", "5k mrr",
    "i interview", "i spoke to",
    "build-in-public backwards",
    "letting you pick",
    # Success stories / advisory content
    "first 1k took", "first $1k", "went from $0",
    "went from 0 to", "0 to $", "from zero to",
    "here's my honest", "here's the real", "here is the real",
    "i'm offering", "i am offering", "free sessions",
    "change my mind",   # debate/opinion post
    "1. engage in", "2. experiment",  # listicle how-to
    "mrr and the consistency", "consistency is actual",
    "497k", "497,432",
    "90 days ago i almost", "hit #1",
]

# ── Bucket 1: Marketing & Distribution ───────────────────────────────────────
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
    "no one sees it", "can't find customers", "distribution gap",
    "launched no one came", "launched and nobody",
]

# ── Bucket 2: Discovery & Outcome Thinking ───────────────────────────────────
B2_TRIGGERS = [
    "built wrong thing", "built the wrong", "wrong problem",
    "no one has this problem", "didn't validate", "didn't talk to users",
    "should have validated", "jumped straight to building", "jumped to building",
    "feature nobody uses", "feature no one uses", "wasted months",
    "wrong solution", "wrong market", "spent weeks on a feature",
    "spent 3 weeks", "nobody uses it", "no one uses it",
    "built without talking to", "no one needs", "nobody asked for this",
    "built for myself", "assumed people wanted", "frankenstein",
    "feature creep", "crickets", "built it nobody wants",
    "doesn't solve", "wrong direction", "guessed what to build",
    "only think about users after", "only thought about users after",
    "only think about monetization after", "build first ship first",
    "no success metric", "how do i know if it's working",
    "how do you measure success", "what metrics should i track",
    "don't know what to track", "months of building zero",
    "months building zero", "launched to crickets",
    "validated backwards", "validate backwards",
    "build fast launch crickets",
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
]

KEYWORDS_B2 = [
    "built wrong thing",
    "didn't validate idea",
    "no one has this problem",
    "months building zero traction",
    "crickets after launch",
    "feature nobody uses",
    "built the wrong thing",
    "guessed what to build",
    "launched to crickets",
    "validate backwards",
    "only think about users after building",
]


def classify(title, body, triggers):
    text = (title + " " + body).lower()
    return any(t in text for t in triggers)


def is_advisory(title, body):
    text = (title + " " + body).lower()
    return any(s in text for s in SKIP_SIGNALS)


def reply_score(post):
    """
    Score a post for reply worthiness.
    Higher = better opportunity.
    Factors:
      - Recency: max 100 pts (drops off with age)
      - Comment count: sweet spot 1-15 (open but not dead)
      - Score (upvotes): signal of engagement
    """
    now = datetime.now(timezone.utc)
    age_hours = (now - datetime.fromtimestamp(post.created_utc, tz=timezone.utc)).total_seconds() / 3600

    # Recency score: full marks under 24h, decays to 0 at 72h
    if age_hours <= 24:
        recency = 100
    elif age_hours <= 48:
        recency = 60
    elif age_hours <= 72:
        recency = 30
    else:
        recency = max(0, 30 - (age_hours - 72) * 0.5)

    # Comment openness: 1-15 is ideal, 0 is low-engagement, 16+ is crowded
    c = post.num_comments
    if c == 0:
        comment_score = 20   # some signal but no engagement yet
    elif c <= 5:
        comment_score = 100  # sweet spot - open but alive
    elif c <= 15:
        comment_score = 70
    elif c <= 30:
        comment_score = 40
    else:
        comment_score = 10   # likely saturated

    # Upvote signal (capped)
    upvote_score = min(post.score * 3, 60)

    return recency * 0.5 + comment_score * 0.35 + upvote_score * 0.15


def format_age(created_utc):
    now = datetime.now(timezone.utc)
    delta = now - datetime.fromtimestamp(created_utc, tz=timezone.utc)
    h = int(delta.total_seconds() / 3600)
    if h < 1:
        return f"{int(delta.total_seconds() / 60)}m ago"
    if h < 24:
        return f"{h}h ago"
    return f"{h // 24}d ago"


def fetch_bucket(reddit, keywords, triggers, label):
    seen = set()
    candidates = []

    for kw in keywords:
        try:
            results = reddit.subreddit(SUBREDDITS).search(
                kw, sort="new", limit=LIMIT_PER_KEYWORD, time_filter="month"
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
                if not classify(post.title, body, triggers):
                    continue

                candidates.append(post)

        except Exception as e:
            print(f"  Warning: '{kw}' failed - {e}", file=sys.stderr)

    # Rank by reply-worthiness
    candidates.sort(key=reply_score, reverse=True)
    return candidates[:10]


def render_queue(posts, bucket_num, bucket_title, bucket_desc):
    lines = [
        f"## {bucket_title}",
        "",
        f"_{bucket_desc}_",
        "",
    ]

    if not posts:
        lines.append("_No qualifying posts found in the past 7 days._\n")
        return "\n".join(lines)

    for i, p in enumerate(posts, 1):
        body = p.selftext.strip()
        if not body or body in ("[deleted]", "[removed]"):
            excerpt = "(title only)"
        else:
            excerpt = body[:350].rstrip()
            if len(p.selftext) > 350:
                excerpt += "..."

        url = f"https://reddit.com{p.permalink}"
        age = format_age(p.created_utc)
        score = round(reply_score(p))

        lines += [
            f"### {i}. {p.title}",
            "",
            f"**r/{p.subreddit}** · {p.score} pts · {p.num_comments} comments · {age} · Reply score: {score}/100",
            "",
            f"> {excerpt}",
            "",
            f"**[Reply here]({url})**",
            "",
            "---",
            "",
        ]

    return "\n".join(lines)


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
        user_agent="reply-queue/1.0 (Product Builder Agent outreach)",
    )

    today = datetime.now().strftime("%Y-%m-%d")

    print("Fetching Bucket 1 (Marketing & Distribution)...")
    b1_posts = fetch_bucket(reddit, KEYWORDS_B1, B1_TRIGGERS,
                            "Bucket 1 - Marketing & Distribution")
    print(f"  {len(b1_posts)} qualifying posts")

    print("Fetching Bucket 2 (Discovery & Outcome Thinking)...")
    b2_posts = fetch_bucket(reddit, KEYWORDS_B2, B2_TRIGGERS,
                            "Bucket 2 - Discovery & Outcome Thinking")
    print(f"  {len(b2_posts)} qualifying posts")

    header = [
        f"# Reply Queue - {today}",
        "",
        "Top 10 reply opportunities per bucket, ranked by: recency (50%) + comment openness (35%) + engagement (15%).",
        "",
        "**Reply score guide:** 80+ = act now · 50-79 = good · below 50 = low priority",
        "",
        "---",
        "",
    ]

    b1_section = render_queue(
        b1_posts, 1,
        "📣 Bucket 1 - Marketing & Distribution (top 10)",
        "Builder shipped something functional but can't get users. Problem framed as marketing or visibility."
    )

    b2_section = render_queue(
        b2_posts, 2,
        "🔍 Bucket 2 - Discovery & Outcome Thinking (top 10)",
        "Builder skipped validation, built the wrong thing, or can't measure if it's working."
    )

    content = "\n".join(header) + b1_section + "\n" + b2_section

    PUBLIC_OUTPUT.mkdir(parents=True, exist_ok=True)
    out_file = PUBLIC_OUTPUT / f"reply-queue-{today}.md"
    out_file.write_text(content, encoding="utf-8")

    print(f"\nSaved to: public/prototypes/product-builder-agent/reply-queue-{today}.md")


if __name__ == "__main__":
    main()
