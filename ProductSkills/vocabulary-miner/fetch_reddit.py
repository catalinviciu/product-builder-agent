"""
fetch_reddit.py — Reddit post fetcher for vocabulary-miner skill

Fetches posts from builder-focused subreddits where the "shipped it, nobody uses it"
pain is expressed. Output is plain text ready to paste into Claude for Mode B analysis.

Usage:
    python fetch_reddit.py

Requirements:
    pip install praw

Environment variables (get free keys at reddit.com/prefs/apps — choose "script" type):
    REDDIT_CLIENT_ID      Your Reddit app client ID
    REDDIT_CLIENT_SECRET  Your Reddit app client secret

No API key? The script will print manual LinkedIn search queries instead.
"""

import os
import sys
from pathlib import Path

# Load .env from repo root (D:\Projects\2.ProductAgent\.env)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent.parent / ".env")
except ImportError:
    pass  # dotenv not installed — fall back to system env vars

SUBREDDITS = "SideProject+vibecoding+entrepreneur+indiehackers+buildinpublic"

KEYWORDS = [
    "shipped no users",
    "built nobody uses",
    "no traction after launch",
    "vibe coded nobody",
    "built the wrong thing",
    "shipped and nobody cares",
    "months building zero users",
    "launched no signups",
]

LIMIT_PER_KEYWORD = 8
MAX_BODY_CHARS = 400

MANUAL_FALLBACK_QUERIES = [
    '"shipped" "no users"',
    '"vibe coding" "nobody"',
    '"vibe coded" "no traction"',
    '"built the wrong thing"',
    '"months of building" "no one uses"',
    '"shipped it" "nobody cares"',
    '"telling my clients" "but I"',
    '"I preach" "but I"',
]


def fetch_posts():
    """Fetch posts using PRAW and return as formatted plain text."""
    try:
        import praw
    except ImportError:
        print("Error: praw not installed. Run: pip install praw")
        sys.exit(1)

    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")

    if not client_id or not client_secret:
        print_manual_fallback()
        return

    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent="vocabulary-miner/1.0 (Product Builder Agent research tool)",
    )

    seen_ids = set()
    output_lines = [
        "REDDIT VOCABULARY HARVEST",
        f"Subreddits: {SUBREDDITS}",
        f"Keywords: {len(KEYWORDS)} search terms",
        "=" * 60,
        "",
        "Paste everything below this line into Claude with the prompt:",
        '"Extract the 5 most emotionally resonant phrases these builders',
        'use to describe the problem. What vocabulary do they reach for?"',
        "",
        "=" * 60,
        "",
    ]

    post_count = 0

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
                if not body or body == "[deleted]" or body == "[removed]":
                    body = "(no body — title only)"
                else:
                    body = body[:MAX_BODY_CHARS]
                    if len(post.selftext) > MAX_BODY_CHARS:
                        body += "..."

                output_lines.extend([
                    f"---",
                    f"[r/{post.subreddit}] {post.title}",
                    f"{body}",
                    "",
                ])
                post_count += 1

        except Exception as e:
            print(f"Warning: search for '{keyword}' failed — {e}", file=sys.stderr)
            continue

    output_lines.extend([
        "=" * 60,
        f"Total posts: {post_count}",
    ])

    print("\n".join(output_lines))


def print_manual_fallback():
    """Print manual LinkedIn search instructions when no API key is present."""
    print()
    print("No Reddit API key found (REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET).")
    print()
    print("MANUAL SEARCH INSTRUCTIONS")
    print("=" * 60)
    print()
    print("REDDIT (reddit.com/search or old.reddit.com/search):")
    print("  - Set filter: Posts, sort by New, past month")
    print("  - Try these queries one at a time:")
    for q in MANUAL_FALLBACK_QUERIES[:4]:
        print(f'    {q}')
    print()
    print("LINKEDIN (linkedin.com/search/results/content/):")
    print("  - Switch to Posts tab, filter by Latest")
    print("  - Try these queries:")
    for q in MANUAL_FALLBACK_QUERIES[4:]:
        print(f'    {q}')
    print()
    print("  Also try these hashtags:")
    print("    #buildinpublic  #vibecoding  #indiedev  #solopreneur")
    print()
    print("Collect 8-10 posts, copy the text, paste into Claude.")
    print("Use prompt: 'Extract the 5 most emotionally resonant phrases")
    print("these builders use to describe the problem.'")
    print()
    print("To get a free Reddit API key:")
    print("  1. Go to reddit.com/prefs/apps")
    print("  2. Click 'create another app'")
    print("  3. Choose 'script' type")
    print("  4. Set redirect URI to: http://localhost:8080")
    print("  5. Copy client ID (under app name) and secret")
    print("  6. Set as env vars: REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET")
    print()


if __name__ == "__main__":
    fetch_posts()
