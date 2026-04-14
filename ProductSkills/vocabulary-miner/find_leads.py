"""
find_leads.py — Reddit engagement lead finder for vocabulary-miner skill

Fetches posts from builder-focused subreddits where the "shipped it, nobody uses it"
pain is expressed. Writes an actionable engagement queue to leads.md (markdown),
sorted by post score so the most-engaged threads come first.

Usage:
    python find_leads.py

Requirements:
    pip install praw

Environment variables (get free keys at reddit.com/prefs/apps — choose "script" type):
    REDDIT_CLIENT_ID      Your Reddit app client ID
    REDDIT_CLIENT_SECRET  Your Reddit app client secret

No API key? The script will print manual LinkedIn search queries instead.

Output:
    Product-Agent-app/data/ProductBuilder/leads.md — overwritten on each run
"""

import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Load .env from repo root (D:\Projects\2.ProductAgent\.env)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent.parent / ".env")
except ImportError:
    pass  # dotenv not installed — fall back to system env vars

OUTPUT_PATH = Path(__file__).parent.parent.parent / "Product-Agent-app/data/ProductBuilder/leads.md"

# Primary subreddits — targeting Product Manager persona
# PMs struggling with artifact labor, context fragmentation, and outcome discipline
SUBREDDITS = "productmanagers+agile+scrum+OKRs+startups+vibecoding+buildinpublic"

KEYWORDS = [
    # Artifact labor / tedious PM work
    "writing PRDs is",
    "hate writing tickets",
    "spend all day writing docs",
    "documentation takes forever",
    "too much time on slides",
    "writing specs nobody reads",
    "PRD takes hours",
    "updating confluence",
    "maintaining wiki",
    # Context fragmentation
    "context lost between teams",
    "scattered across docs",
    "tribal knowledge",
    "context switching kills",
    "team doesn't have context",
    "onboarding takes forever",
    "nobody reads the docs",
    "knowledge silos",
    # Outcome discipline
    "feature factory",
    "building wrong thing",
    "shipped nobody uses",
    "no clear outcome",
    "output over outcomes",
    "lost track of why",
    "roadmap theater",
    "stakeholder whack-a-mole",
    # AI for PM work
    "AI for product management",
    "AI product manager",
    "using AI for PM work",
    "chatgpt for product",
    "AI writing PRDs",
    "AI roadmap",
]

# Posts matching these patterns are researchers/interviewers, not builders in pain.
# Skip them — they're looking for the same people we are.
RESEARCHER_SIGNALS = [
    "looking to chat with",
    "looking to talk with",
    "looking to interview",
    "would love to chat",
    "15-20 min chat",
    "15 min call",
    "drop a comment or dm",
    "i'm doing research",
    "conducting research",
    "survey",
    "happy to jump on a call",
]

# Canonical pain signal labels — source of truth.
# Must match pain_signal values in vocabulary-bank.json reply_templates.
# First-match priority: order matters.
PAIN_SIGNALS = {
    "artifact-labor":       ["writing PRDs", "writing specs", "writing tickets", "updating docs", "maintaining wiki", "confluence", "documentation takes", "slides deck", "spend all day writing"],
    "context-fragmentation":["context lost", "scattered across", "tribal knowledge", "knowledge silo", "nobody reads the doc", "onboarding takes", "team doesn't have context", "context switching"],
    "feature-factory":      ["feature factory", "output over outcome", "roadmap theater", "building wrong", "shipped nobody", "no clear outcome", "lost track of why", "stakeholder whack"],
    "ai-for-pm":            ["ai for product", "ai product manager", "chatgpt for product", "ai writing prd", "ai roadmap", "using ai for pm"],
    "shipped-no-users":     ["no users", "zero users", "nobody using", "nobody uses", "no one uses"],
    "self-implication":     ["i broke", "i stopped being", "i preach", "i tell my clients", "my own rules"],
}

LIMIT_PER_KEYWORD = 10
MAX_BODY_CHARS = 400


def classify_pain(title, body):
    """Return the first matching pain signal label, or None if no match."""
    text = (title + " " + body).lower()
    for label, triggers in PAIN_SIGNALS.items():
        if any(t in text for t in triggers):
            return label
    return None


def format_age(created_utc):
    """Return a human-readable age string like '3 hours ago' or '2 days ago'."""
    now = datetime.now(timezone.utc)
    post_time = datetime.fromtimestamp(created_utc, tz=timezone.utc)
    delta = now - post_time
    total_seconds = int(delta.total_seconds())

    if total_seconds < 3600:
        mins = total_seconds // 60
        return f"{mins} minute{'s' if mins != 1 else ''} ago"
    elif total_seconds < 86400:
        hours = total_seconds // 3600
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    else:
        days = total_seconds // 86400
        return f"{days} day{'s' if days != 1 else ''} ago"


def format_lead_md(post, number, pain_label):
    """Return a markdown section string for a single lead."""
    body = post.selftext.strip()
    if not body or body in ("[deleted]", "[removed]"):
        body = "(title only - click link for full post)"
    elif len(body) > MAX_BODY_CHARS:
        body = body[:MAX_BODY_CHARS] + "..."

    url = f"https://reddit.com{post.permalink}"
    age = format_age(post.created_utc)

    lines = [
        f"## Lead {number} - {pain_label}",
        "",
        f"**r/{post.subreddit}** · {post.score} pts · {post.num_comments} comments · {age}",
        "",
        f"> {post.title}",
        "",
        body,
        "",
        f"[Reply here]({url})",
        "",
        "---",
        "",
    ]
    return "\n".join(lines)


def fetch_leads():
    """Fetch Reddit posts, classify by pain signal, write leads.md."""
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
        user_agent="lead-finder/1.0 (Product Builder Agent outreach tool)",
    )

    seen_ids = set()
    leads = []
    skipped = 0

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

                # Skip researcher/interviewer posts — they're looking for the same
                # people we are, not builders actively expressing pain
                combined = (post.title + " " + body).lower()
                if any(r in combined for r in RESEARCHER_SIGNALS):
                    skipped += 1
                    continue

                pain_label = classify_pain(post.title, body)
                if not pain_label:
                    skipped += 1
                    continue

                leads.append((post, pain_label))

        except Exception as e:
            print(f"Warning: search for '{keyword}' failed - {e}", file=sys.stderr)
            continue

    # Sort by score descending so most-engaged threads come first
    leads.sort(key=lambda x: x[0].score, reverse=True)

    today = datetime.now().strftime("%Y-%m-%d")
    subreddit_list = " · ".join(f"r/{s}" for s in SUBREDDITS.split("+"))

    header_lines = [
        f"# Reddit Engagement Leads - {today}",
        "",
        f"Subreddits: {subreddit_list}",
        f"Posts found: {len(leads)} | Skipped (no signal): {skipped}",
        "",
        "Paste any lead section into Claude to trigger Mode A reply generation.",
        "Or say **Mode C** to triage the full list together.",
        "",
        "---",
        "",
    ]

    lead_sections = []
    for i, (post, pain_label) in enumerate(leads, start=1):
        lead_sections.append(format_lead_md(post, i, pain_label))

    if not leads:
        lead_sections.append("_No leads found matching the pain signal patterns. Try again later or adjust keywords._\n")

    content = "\n".join(header_lines) + "\n".join(lead_sections)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(content, encoding="utf-8")

    print(f"Leads saved to data/ProductBuilder/leads.md ({len(leads)} found, {skipped} skipped)")


def print_manual_fallback():
    """Print manual search instructions when no Reddit API key is present."""
    print()
    print("No Reddit API key found (REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET).")
    print()
    print("MANUAL SEARCH INSTRUCTIONS")
    print("=" * 60)
    print()
    print("REDDIT (reddit.com/search or old.reddit.com/search):")
    print("  - Set filter: Posts, sort by New, past month")
    print("  - Try these queries one at a time:")
    print('    "shipped" "no users"')
    print('    "vibe coded" "wrong"')
    print('    "months of building" "no traction"')
    print('    "launched" "crickets"')
    print()
    print("LINKEDIN (linkedin.com/search/results/content/):")
    print("  - Switch to Posts tab, filter by Latest")
    print("  - Try these queries one at a time:")
    print('    "shipped" "no users"')
    print('    "vibe coded" "wrong"')
    print('    "months of building" "no traction"')
    print('    "launched" "nobody cares"')
    print('    "I preach" "but I"')
    print()
    print("  Also try these hashtags (Posts tab, Latest):")
    print("    #vibecoding  #buildinpublic  #indiehacker")
    print()
    print("Copy the full text of any matching post and paste into Claude.")
    print("Say 'Mode A' to generate reply variants for a single post.")
    print("Say 'Mode C' to triage multiple posts together.")
    print()
    print("To get a free Reddit API key:")
    print("  1. Go to reddit.com/prefs/apps")
    print("  2. Click 'create another app'")
    print("  3. Choose 'script' type")
    print("  4. Set redirect URI to: http://localhost:8080")
    print("  5. Copy client ID (under app name) and secret")
    print("  6. Add to D:\\Projects\\2.ProductAgent\\.env:")
    print("     REDDIT_CLIENT_ID=your_client_id")
    print("     REDDIT_CLIENT_SECRET=your_client_secret")
    print()


if __name__ == "__main__":
    fetch_leads()
