"""
Inject solution entities into Product Agent's store.json.

Usage:
    python ProductSkills/solutions-brainstormer/inject_solutions.py solutions.json

The input JSON file must have this shape:
{
  "productLineId": "productagent-1773131237459",
  "opportunityId": "bf154a7e-...",
  "solutions": [
    {
      "title": "Solution Title",
      "description": "What this solution does...",
      "blocks": [
        { "label": "Why It Works", "content": "..." },
        { "label": "Trade-offs", "content": "..." },
        { "label": "High-Level User Journey", "content": "..." }
      ]
    }
  ]
}

The script:
  1. Generates UUID v4 for each solution entity and block IDs
  2. Validates field length limits (title ≤120, description ≤500, label ≤40, content ≤800)
  3. Adds entities to the product line's entities map
  4. Appends entity IDs to the parent opportunity's children array
  5. Writes back to store.json with minimal formatting changes
"""

import json
import sys
import uuid
import time
from pathlib import Path

STORE_PATH = Path("Product-Agent-app/data/store.json")

LIMITS = {
    "title": 120,
    "description": 500,
    "block_label": 40,
    "block_content": 800,
}


def validate_solution(sol: dict, index: int) -> list[str]:
    """Return a list of validation errors (empty = OK)."""
    errors = []
    title = sol.get("title", "")
    desc = sol.get("description", "")

    if not title:
        errors.append(f"Solution {index + 1}: missing title")
    elif len(title) > LIMITS["title"]:
        errors.append(f"Solution {index + 1}: title too long ({len(title)}/{LIMITS['title']})")

    if not desc:
        errors.append(f"Solution {index + 1}: missing description")
    elif len(desc) > LIMITS["description"]:
        errors.append(f"Solution {index + 1}: description too long ({len(desc)}/{LIMITS['description']})")

    for bi, block in enumerate(sol.get("blocks", [])):
        label = block.get("label", "")
        content = block.get("content", "")
        if len(label) > LIMITS["block_label"]:
            errors.append(f"Solution {index + 1}, block {bi + 1}: label too long ({len(label)}/{LIMITS['block_label']})")
        if len(content) > LIMITS["block_content"]:
            errors.append(f"Solution {index + 1}, block {bi + 1} ({label}): content too long ({len(content)}/{LIMITS['block_content']})")

    return errors


def build_entity(sol: dict, opportunity_id: str) -> dict:
    """Build a full solution entity from the input shape."""
    entity_id = str(uuid.uuid4())
    ts = int(time.time() * 1000)

    blocks = []
    for i, block in enumerate(sol.get("blocks", [])):
        blocks.append({
            "id": f"{entity_id}-b{ts}{i + 1}",
            "type": "accordion",
            "label": block["label"],
            "content": block["content"],
        })

    return {
        "id": entity_id,
        "level": "solution",
        "title": sol["title"],
        "icon": "Puzzle",
        "description": sol["description"],
        "status": "explore",
        "parentId": opportunity_id,
        "children": [],
        "blocks": blocks,
    }


def main():
    if len(sys.argv) != 2:
        print(f"Usage: python {sys.argv[0]} <solutions.json>")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Error: {input_path} not found")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        spec = json.load(f)

    pl_id = spec["productLineId"]
    opp_id = spec["opportunityId"]
    solutions_input = spec["solutions"]

    # Validate all solutions before touching store.json
    all_errors = []
    for i, sol in enumerate(solutions_input):
        all_errors.extend(validate_solution(sol, i))

    if all_errors:
        print("Validation errors:")
        for err in all_errors:
            print(f"  - {err}")
        sys.exit(1)

    # Read store
    if not STORE_PATH.exists():
        print(f"Error: {STORE_PATH} not found")
        sys.exit(1)

    with open(STORE_PATH, "r", encoding="utf-8") as f:
        store = json.load(f)

    pl = store.get(pl_id)
    if not pl:
        print(f"Error: product line '{pl_id}' not found in store")
        sys.exit(1)

    opp = pl.get("entities", {}).get(opp_id)
    if not opp:
        print(f"Error: opportunity '{opp_id}' not found in product line '{pl_id}'")
        sys.exit(1)

    # Build and inject entities
    entities_added = []
    for sol in solutions_input:
        entity = build_entity(sol, opp_id)
        pl["entities"][entity["id"]] = entity
        opp["children"].append(entity["id"])
        entities_added.append(entity)

    # Write back
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, ensure_ascii=False)

    # Report
    print(f"Injected {len(entities_added)} solutions under opportunity '{opp['title'][:60]}...'")
    print(f"Opportunity children: {opp['children']}")
    for e in entities_added:
        block_sizes = [len(b["content"]) for b in e["blocks"]]
        print(f"  OK: {e['title']} (title={len(e['title'])}, desc={len(e['description'])}, blocks={block_sizes})")


if __name__ == "__main__":
    main()
