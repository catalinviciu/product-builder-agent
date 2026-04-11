"""
categorize_pain.py — Pain bucket analysis for Product Builder Agent

Fetches a wider dataset from Reddit builder communities and categorizes posts
into 3 buckets reflecting the core problems the target persona faces:

  Bucket 1 - MARKETING:   "I built it, now how do I get users?"
  Bucket 2 - DISCOVERY:   "I built the wrong thing / didn't validate / no outcome thinking"
  Bucket 3 - AGENT CTX:   "My AI agent doesn't have enough context to build what I mean"

Posts can fall into multiple buckets. The report shows counts, overlap, and
representative examples for each bucket.

Usage:
    python categorize_pain.py

Output:
    Product-Agent-app/data/ProductBuilder/pain-analysis-YYYY-MM-DD.md
    Product-Agent-app/public/prototypes/product-builder-agent/pain-analysis-YYYY-MM-DD.md

Requirements:
    pip install praw
    REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in .env
"""

import os
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent.parent / ".env")
except ImportError:
    pass

DATA_OUTPUT = Path(__file__).parent.parent.parent / "Product-Agent-app/data/ProductBuilder"
PUBLIC_OUTPUT = Path(__file__).parent.parent.parent / "Product-Agent-app/public/prototypes/product-builder-agent"

# Wider net than find_leads.py — more subreddits, looser signal threshold
SUBREDDITS = "vibecoding+buildinpublic+SideProject+saas+microsaas+AppBusiness+EntrepreneurRideAlong"

# Higher volume fetch
LIMIT_PER_KEYWORD = 25
MAX_BODY_CHARS = 600

RESEARCHER_SIGNALS = [
    "looking to chat with", "looking to talk with", "looking to interview",
    "would love to chat", "15-20 min chat", "15 min call", "drop a comment or dm",
    "i'm doing research", "conducting research", "happy to jump on a call",
]

# ─── Bucket Definitions ──────────────────────────────────────────────────────
# Each bucket has triggers (lowercase substring matches) and a short label.
# A post matches a bucket if any trigger appears in title+body.

BUCKETS = {
    "marketing": {
        "label": "Bucket 1 - Marketing & Distribution",
        "description": "Builder shipped something functional but has no idea how to get users. The problem is framed as a marketing, distribution, or visibility gap.",
        "emoji": "📣",
        "triggers": [
            "how to get users", "how do i get users", "how to market", "can't get users",
            "getting users is", "distribution is hard", "distribution is harder",
            "no one knows about it", "nobody knows about", "can't get traction",
            "no traffic", "no downloads", "no signups", "how to promote",
            "no audience", "how do you find customers", "how to reach",
            "nobody found it", "marketing is harder", "i'm not a marketer",
            "how to sell", "getting paying users", "how do you get people",
            "how to get people to", "no one is signing up", "nobody is signing up",
            "how do i find", "how to get first", "product hunt",
            "launch strategy", "launch failed", "zero users zero budget",
            "how do you sell", "get my first", "find my first",
            "no one sees it", "invisible to", "can't find customers",
        ],
    },
    "discovery": {
        "label": "Bucket 2 - Discovery & Outcome Thinking",
        "description": "Builder skipped problem validation, jumped straight to a solution, and ended up with something nobody wanted — or can't measure whether it's working.",
        "emoji": "🔍",
        "triggers": [
            "built wrong thing", "built the wrong", "wrong problem",
            "no one has this problem", "didn't validate", "didn't talk to users",
            "should have validated", "jumped straight to building", "jumped to building",
            "feature nobody uses", "feature no one uses", "wasted months",
            "wrong solution", "wrong market", "no problem-solution",
            "spent weeks on a feature", "spent 3 weeks", "spent months building",
            "nobody uses it", "no one uses it", "built without talking",
            "no one needs", "nobody asked for this", "built for myself",
            "assumed people wanted", "too many features", "frankenstein",
            "feature creep", "crickets", "built it nobody wants",
            "doesn't solve", "wrong direction", "guessed what to build",
            "only think about users after", "only thought about users after",
            "only think about monetization after", "only thought about monetization",
            "build first", "ship first then", "no success metric",
            "how do i know if", "how do you measure", "what metrics",
            "how to measure success", "don't know if it's working",
            "don't know what to track", "no idea if this is",
            "build fast launch crickets", "months of building zero",
        ],
    },
    "agent_context": {
        "label": "Bucket 3 - Agent Context & AI Direction",
        "description": "Builder is using AI coding tools (Claude Code, Cursor, Lovable, etc.) but the agent lacks enough product context — builds the wrong feature, loses direction, or goes off track.",
        "emoji": "🤖",
        "triggers": [
            "agent lost", "ai forgot", "claude forgot", "cursor forgot",
            "ai doesn't understand my", "can't give context", "context window",
            "ai keeps breaking", "ai went off track", "ai building wrong",
            "agent context", "system prompt", "gave cursor", "gave claude",
            "prompt too long", "ai doesn't know", "ai built wrong",
            "vibe coded and lost", "ai lost track", "keep having to re-explain",
            "ai keeps forgetting", "ai rebuilt", "ai made wrong",
            "context to build", "instructions to ai", "tell the ai",
            "ai misunderstood", "ai went in wrong direction",
            "claude code", "cursor context", "windsurf", "lovable",
            "built with ai", "vibe cod",
            "ai just keeps", "ai doesn't follow", "the ai ignores",
            "ai added features i didn't", "ai changed things i didn't",
            "how to give ai context", "how to prompt", "prompting strategy",
            "ai doesn't remember", "every new chat", "lose context",
            "no brakes", "time bombs", "security audit",
            "ai overengineering", "ai overthinking", "ai yoloing",
        ],
    },
}

# ─── Helpers ─────────────────────────────────────────────────────────────────

def classify_buckets(title, body):
    """Return list of bucket keys that match this post. Can return multiple."""
    text = (title + " " + body).lower()
    matched = []
    for key, bucket in BUCKETS.items():
        if any(t in text for t in bucket["triggers"]):
            matched.append(key)
    return matched


def format_age(created_utc):
    now = datetime.now(timezone.utc)
    post_time = datetime.fromtimestamp(created_utc, tz=timezone.utc)
    delta = now - post_time
    total_seconds = int(delta.total_seconds())
    if total_seconds < 3600:
        mins = total_seconds // 60
        return f"{mins}m ago"
    elif total_seconds < 86400:
        hours = total_seconds // 3600
        return f"{hours}h ago"
    else:
        days = total_seconds // 86400
        return f"{days}d ago"


def truncate(text, n=300):
    if len(text) <= n:
        return text
    return text[:n].rstrip() + "..."


# ─── Search keywords — wider than find_leads.py ──────────────────────────────

KEYWORDS = [
    # Bucket 1 - marketing
    "how to get users",
    "distribution harder than building",
    "launched no users",
    "shipped no users",
    "how to market my product",
    "can't get traction",
    "zero users",
    "no signups after launch",
    "getting paying users",
    # Bucket 2 - discovery
    "built wrong thing",
    "didn't validate",
    "no one has this problem",
    "months building zero traction",
    "crickets after launch",
    "feature nobody uses",
    "built the wrong",
    "guessed what to build",
    "only think about users after",
    "what metrics should i track",
    # Bucket 3 - agent context
    "claude code lost context",
    "cursor went off track",
    "vibe coded wrong feature",
    "ai doesn't understand my product",
    "how to give ai context",
    "ai building wrong thing",
    "lovable wrong direction",
    "vibe coding built wrong",
    "ai lost track",
    "context for vibe coding",
]


def fetch_and_categorize():
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
        user_agent="pain-categorizer/1.0 (Product Builder Agent research tool)",
    )

    seen_ids = set()
    all_posts = []       # (post, [bucket_keys])
    skipped = 0

    print(f"Fetching posts from r/{SUBREDDITS}...")

    for keyword in KEYWORDS:
        try:
            results = reddit.subreddit(SUBREDDITS).search(
                keyword, sort="new", limit=LIMIT_PER_KEYWORD, time_filter="month"
            )
            for post in results:
                if post.id in seen_ids:
                    continue
                seen_ids.add(post.id)

                body = post.selftext.strip()
                if body in ("[deleted]", "[removed]"):
                    skipped += 1
                    continue

                combined = (post.title + " " + body).lower()
                if any(r in combined for r in RESEARCHER_SIGNALS):
                    skipped += 1
                    continue

                buckets_matched = classify_buckets(post.title, body)
                if not buckets_matched:
                    skipped += 1
                    continue

                all_posts.append((post, buckets_matched))

        except Exception as e:
            print(f"Warning: search '{keyword}' failed - {e}", file=sys.stderr)
            continue

    total = len(all_posts)
    print(f"Collected {total} posts ({skipped} skipped)")

    # ── Count per bucket ─────────────────────────────────────────
    bucket_counts = defaultdict(int)
    bucket_posts = defaultdict(list)

    for post, matched in all_posts:
        for b in matched:
            bucket_counts[b] += 1
            bucket_posts[b].append(post)

    # Sort each bucket's posts by score
    for b in bucket_posts:
        bucket_posts[b].sort(key=lambda p: p.score, reverse=True)

    # Overlap analysis
    only_one = sum(1 for _, m in all_posts if len(m) == 1)
    two_buckets = sum(1 for _, m in all_posts if len(m) == 2)
    all_three = sum(1 for _, m in all_posts if len(m) == 3)

    # ── Build report ─────────────────────────────────────────────
    today = datetime.now().strftime("%Y-%m-%d")
    lines = []

    lines += [
        f"# Pain Bucket Analysis - {today}",
        "",
        f"**Source:** r/vibecoding, r/buildinpublic, r/SideProject",
        f"**Posts analyzed:** {total} | **Skipped (no signal):** {skipped}",
        f"**Note:** A post can match multiple buckets (multi-label).",
        "",
        "---",
        "",
        "## Summary",
        "",
        "| Bucket | Posts | % of total |",
        "|--------|-------|-----------|",
    ]

    for key, bucket in BUCKETS.items():
        count = bucket_counts[key]
        pct = round(count / total * 100) if total > 0 else 0
        bar = "█" * (pct // 5) + "░" * (20 - pct // 5)
        lines.append(f"| {bucket['emoji']} {bucket['label'].split(' - ')[1]} | {count} | {pct}% `{bar}` |")

    lines += [
        "",
        f"**Overlap:** {only_one} posts fit exactly 1 bucket · {two_buckets} fit 2 · {all_three} fit all 3",
        "",
        "---",
        "",
    ]

    # ── Per-bucket detail ─────────────────────────────────────────
    for key, bucket in BUCKETS.items():
        count = bucket_counts[key]
        pct = round(count / total * 100) if total > 0 else 0
        posts = bucket_posts[key][:5]  # top 5 by score

        lines += [
            f"## {bucket['emoji']} {bucket['label']}",
            "",
            f"**{count} posts ({pct}% of dataset)**",
            "",
            f"_{bucket['description']}_",
            "",
            "### Top examples",
            "",
        ]

        if not posts:
            lines.append("_No posts matched this bucket in today's dataset._\n")
        else:
            for i, p in enumerate(posts, 1):
                body = p.selftext.strip()
                if not body or body in ("[deleted]", "[removed]"):
                    body = "(title only)"
                excerpt = truncate(body, 280)
                url = f"https://reddit.com{p.permalink}"
                age = format_age(p.created_utc)
                lines += [
                    f"**{i}.** r/{p.subreddit} · {p.score} pts · {p.num_comments} comments · {age}",
                    "",
                    f"> **{p.title}**",
                    "",
                    f"> {excerpt}",
                    "",
                    f"[View post]({url})",
                    "",
                ]

        lines.append("---")
        lines.append("")

    # ── Observations ─────────────────────────────────────────────
    lines += [
        "## Observations",
        "",
        "_(Fill in after reviewing the data)_",
        "",
        "- Which bucket is largest surprises or confirms what?",
        "- What specific phrases recur inside the top bucket?",
        "- Any posts that don't fit neatly - what do they suggest about a 4th bucket?",
        "",
    ]

    content = "\n".join(lines)

    # Write to both locations
    DATA_OUTPUT.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.mkdir(parents=True, exist_ok=True)

    data_file = DATA_OUTPUT / f"pain-analysis-{today}.md"
    public_file = PUBLIC_OUTPUT / f"pain-analysis-{today}.md"

    data_file.write_text(content, encoding="utf-8")
    public_file.write_text(content, encoding="utf-8")

    print(f"Report saved to:")
    print(f"  data/ProductBuilder/pain-analysis-{today}.md")
    print(f"  public/prototypes/product-builder-agent/pain-analysis-{today}.md")
    print()
    print("BUCKET COUNTS:")
    for key, bucket in BUCKETS.items():
        count = bucket_counts[key]
        pct = round(count / total * 100) if total > 0 else 0
        print(f"  {bucket['emoji']}  {bucket['label']}: {count} ({pct}%)")
    print(f"\n  Multi-bucket overlap: {two_buckets} posts in 2 buckets, {all_three} in all 3")


if __name__ == "__main__":
    fetch_and_categorize()
