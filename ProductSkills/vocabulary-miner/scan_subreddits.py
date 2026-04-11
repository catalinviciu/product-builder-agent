"""
scan_subreddits.py — Find which subreddits have the richest signal for each pain bucket

Tests a broad list of candidate subreddits and counts how many posts per bucket
each one yields. Helps identify where Bucket 2 (Discovery / Outcome Thinking)
signal is hiding beyond the current vibecoding+buildinpublic+SideProject set.

Usage:
    python scan_subreddits.py

Output:
    Prints a ranked table per bucket + saves markdown to data/ProductBuilder/
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

LIMIT_PER_SUBREDDIT = 100   # posts to scan per subreddit (hot+new mix)
TIME_FILTER = "month"

# ── Candidate subreddits to test ─────────────────────────────────────────────
CANDIDATE_SUBREDDITS = [
    # Core PM communities
    "ProductManagement",
    "productmanagers",
    "product_design",
    # Agile / methodology
    "agile",
    "scrum",
    "OKRs",
    # Startup (PM-adjacent)
    "startups",
    "Entrepreneur",
    "EntrepreneurRideAlong",
    "saas",
    "microsaas",
    # AI + PM intersection
    "ChatGPTPro",
    "ClaudeAI",
    "artificial",
    # Builder communities (secondary — keep for comparison)
    "vibecoding",
    "buildinpublic",
    "SideProject",
    "indiehackers",
    # UX / Design
    "UXDesign",
    "userexperience",
    # Tech leadership
    "ExperiencedDevs",
    "engineering_managers",
    "CTO",
]

SKIP_SIGNALS = [
    "looking to chat with", "looking to interview", "conducting research",
    "happy to jump on a call", "here's everything i learned", "here's how i",
    "how i got", "how we got", "$10k mrr", "first 1k took",
    "went from $0", "went from 0 to", "0 to $", "from zero to",
    "change my mind", "i'm offering", "free sessions",
    "hit #1", "90 days ago",
]

# ── Bucket trigger sets ───────────────────────────────────────────────────────

# B1 = Artifact labor & context fragmentation (PM productivity pain)
B1_TRIGGERS = [
    "writing PRDs", "writing specs", "writing tickets", "hate writing docs",
    "documentation takes", "spend all day writing", "updating confluence",
    "maintaining wiki", "slides take forever", "specs nobody reads",
    "too much time on docs", "artifact", "busy work",
    "context lost", "scattered across", "tribal knowledge",
    "knowledge silo", "nobody reads the doc", "onboarding takes",
    "team doesn't have context", "context switching",
    "lost between handoff", "scattered docs", "no single source",
    "copy paste between tools", "too many tools",
]

# B2 = Outcome discipline & feature factory (PM strategic pain)
B2_TRIGGERS = [
    "feature factory", "output over outcome", "roadmap theater",
    "building wrong thing", "shipped nobody uses", "no clear outcome",
    "lost track of why", "stakeholder whack", "built the wrong",
    "wrong problem", "didn't validate", "didn't talk to users",
    "feature nobody uses", "feature no one uses", "wasted months",
    "nobody uses it", "no one uses it", "feature creep",
    "guessed what to build", "no success metric",
    "what metrics should i track", "don't know what to track",
    "problem validation", "product market fit",
    "opportunity solution tree", "continuous discovery",
    "outcome thinking", "outcome driven", "discovery habits",
    "prioritization framework", "how do you decide what to build",
    "ai for product management", "ai product manager",
    "chatgpt for product", "ai writing prd", "ai roadmap",
]

# Broader search terms — cast a wider net per subreddit
SEARCH_TERMS = [
    "writing PRDs",
    "feature factory",
    "context lost between teams",
    "scattered docs",
    "outcome driven",
    "opportunity solution tree",
    "continuous discovery",
    "AI product management",
    "roadmap prioritization",
    "specs nobody reads",
    "tribal knowledge problem",
    "too many tools PM",
    "built wrong thing",
    "didn't validate",
]


def is_skip(title, body):
    text = (title + " " + body).lower()
    return any(s in text for s in SKIP_SIGNALS)


def classify(title, body):
    text = (title + " " + body).lower()
    b1 = any(t in text for t in B1_TRIGGERS)
    b2 = any(t in text for t in B2_TRIGGERS)
    return b1, b2


def scan_subreddit(reddit, sub_name):
    """Return (b1_count, b2_count, total_scanned, example_b2_titles)"""
    seen = set()
    b1_count = 0
    b2_count = 0
    total = 0
    b2_examples = []

    for term in SEARCH_TERMS:
        try:
            results = reddit.subreddit(sub_name).search(
                term, sort="new", limit=25, time_filter=TIME_FILTER
            )
            for post in results:
                if post.id in seen:
                    continue
                seen.add(post.id)

                body = post.selftext.strip()
                if body in ("[deleted]", "[removed]"):
                    continue
                if is_skip(post.title, body):
                    continue

                total += 1
                b1, b2 = classify(post.title, body)
                if b1:
                    b1_count += 1
                if b2:
                    b2_count += 1
                    if len(b2_examples) < 3:
                        b2_examples.append(post.title[:80])

        except Exception as e:
            err = str(e).lower()
            if "banned" in err or "private" in err or "404" in err or "forbidden" in err:
                return None  # subreddit not accessible
            # other errors: skip quietly
            continue

    return b1_count, b2_count, total, b2_examples


def main():
    try:
        import praw
    except ImportError:
        print("Error: praw not installed.")
        sys.exit(1)

    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    if not client_id or not client_secret:
        print("Error: REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET not set.")
        sys.exit(1)

    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent="subreddit-scanner/1.0 (Product Builder Agent research)",
    )

    results = {}
    total_subs = len(CANDIDATE_SUBREDDITS)

    for i, sub in enumerate(CANDIDATE_SUBREDDITS, 1):
        print(f"  [{i:2}/{total_subs}] r/{sub}...", end=" ", flush=True)
        result = scan_subreddit(reddit, sub)
        if result is None:
            print("SKIPPED (private/banned)")
            continue
        b1, b2, total, examples = result
        results[sub] = (b1, b2, total, examples)
        print(f"B1={b1}  B2={b2}  (of {total} posts scanned)")

    # ── Rank by B2 signal (the underrepresented bucket) ──────────────────────
    ranked_b2 = sorted(results.items(), key=lambda x: x[1][1], reverse=True)
    ranked_b1 = sorted(results.items(), key=lambda x: x[1][0], reverse=True)

    today = datetime.now().strftime("%Y-%m-%d")

    lines = [
        f"# Subreddit Signal Scan - {today}",
        "",
        "Scanning for pain bucket signal across candidate subreddits.",
        "B1 = Marketing & Distribution | B2 = Discovery & Outcome Thinking",
        "",
        "---",
        "",
        "## Ranked by Bucket 2 signal (Discovery / Outcome Thinking)",
        "",
        "| Subreddit | B2 posts | B1 posts | Total scanned | B2 example titles |",
        "|-----------|----------|----------|---------------|-------------------|",
    ]

    for sub, (b1, b2, total, examples) in ranked_b2:
        ex = " / ".join(f'"{e}"' for e in examples) if examples else "-"
        lines.append(f"| r/{sub} | **{b2}** | {b1} | {total} | {ex} |")

    lines += [
        "",
        "---",
        "",
        "## Ranked by Bucket 1 signal (Marketing & Distribution)",
        "",
        "| Subreddit | B1 posts | B2 posts | Total scanned |",
        "|-----------|----------|----------|---------------|",
    ]

    for sub, (b1, b2, total, _) in ranked_b1:
        lines.append(f"| r/{sub} | **{b1}** | {b2} | {total} |")

    lines += [
        "",
        "---",
        "",
        "## Top B2 subreddits — example titles",
        "",
    ]

    for sub, (b1, b2, total, examples) in ranked_b2[:8]:
        if b2 == 0:
            break
        lines.append(f"**r/{sub}** ({b2} B2 posts)")
        for ex in examples:
            lines.append(f"- {ex}")
        lines.append("")

    content = "\n".join(lines)

    out_dir = Path(__file__).parent.parent.parent / "Product-Agent-app/data/ProductBuilder"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"subreddit-scan-{today}.md"
    out_file.write_text(content, encoding="utf-8")

    print(f"\nResults saved to: data/ProductBuilder/subreddit-scan-{today}.md")
    print(f"\nTop 5 subreddits for B2 signal:")
    for sub, (b1, b2, total, _) in ranked_b2[:5]:
        print(f"  r/{sub}: {b2} B2 posts")


if __name__ == "__main__":
    main()
