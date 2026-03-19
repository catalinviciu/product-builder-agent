"""
Inject or update an opportunity entity in Product Agent's store.json.

Usage:
    python ProductSkills/opportunity-writer/inject_opportunity.py opportunity.json

The input JSON file must have this shape:

For NEW opportunities:
{
  "mode": "create",
  "productLineId": "productagent-1773131237459",
  "parentId": "parent-entity-uuid",
  "opportunity": {
    "title": "One-sentence pain statement (≤120 chars)",
    "description": "Full context of the unmet need (≤500 chars)",
    "personaId": "persona-id-or-omit",
    "iceScore": { "i": 8, "c": 7, "e": 6 },
    "blocks": [
      { "label": "Trigger", "content": "..." },
      { "label": "Current Workaround", "content": "..." },
      { "label": "Competition View", "content": "..." },
      { "label": "Expected Outcome", "content": "..." }
    ]
  }
}

For UPDATES to existing opportunities:
{
  "mode": "update",
  "productLineId": "productagent-1773131237459",
  "entityId": "existing-opportunity-uuid",
  "opportunity": {
    "title": "Updated title (≤120 chars)",
    "description": "Updated description (≤500 chars)",
    "blocks": [
      { "label": "Trigger", "content": "..." },
      { "label": "Current Workaround", "content": "..." },
      { "label": "Competition View", "content": "..." },
      { "label": "Expected Outcome", "content": "..." }
    ]
  }
}

The script:
  - Validates field length limits before touching store.json
  - For creates: generates UUID v4, block IDs, sets level/status/icon, appends to parent's children
  - For updates: overwrites title, description, and blocks in place (preserves all other fields)
  - Writes back to store.json
  - Prints a verification summary
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


def validate_opportunity(opp: dict) -> list[str]:
    """Return a list of validation errors (empty = OK)."""
    errors = []
    title = opp.get("title", "")
    desc = opp.get("description", "")

    if not title:
        errors.append("Missing title")
    elif len(title) > LIMITS["title"]:
        errors.append(f"Title too long ({len(title)}/{LIMITS['title']})")

    if not desc:
        errors.append("Missing description")
    elif len(desc) > LIMITS["description"]:
        errors.append(f"Description too long ({len(desc)}/{LIMITS['description']})")

    for bi, block in enumerate(opp.get("blocks", [])):
        label = block.get("label", "")
        content = block.get("content", "")
        if len(label) > LIMITS["block_label"]:
            errors.append(f"Block {bi + 1}: label too long ({len(label)}/{LIMITS['block_label']})")
        if len(content) > LIMITS["block_content"]:
            errors.append(f"Block {bi + 1} ({label}): content too long ({len(content)}/{LIMITS['block_content']})")

    return errors


def create_opportunity(store: dict, spec: dict) -> None:
    """Create a new opportunity entity and add it to the store."""
    pl_id = spec["productLineId"]
    parent_id = spec["parentId"]
    opp = spec["opportunity"]

    pl = store.get(pl_id)
    if not pl:
        print(f"Error: product line '{pl_id}' not found in store")
        sys.exit(1)

    parent = pl.get("entities", {}).get(parent_id)
    if not parent:
        print(f"Error: parent entity '{parent_id}' not found in product line '{pl_id}'")
        sys.exit(1)

    entity_id = str(uuid.uuid4())
    ts = int(time.time() * 1000)

    blocks = []
    for i, block in enumerate(opp.get("blocks", [])):
        blocks.append({
            "id": f"{entity_id}-b{ts}{i + 1}",
            "type": "accordion",
            "label": block["label"],
            "content": block["content"],
        })

    entity = {
        "id": entity_id,
        "level": "opportunity",
        "title": opp["title"],
        "icon": "Lightbulb",
        "description": opp["description"],
        "status": "draft",
        "parentId": parent_id,
        "children": [],
        "blocks": blocks,
    }

    # Optional fields
    if opp.get("personaId"):
        entity["personaId"] = opp["personaId"]
    if opp.get("iceScore"):
        entity["iceScore"] = opp["iceScore"]

    pl["entities"][entity_id] = entity
    parent["children"].append(entity_id)

    print(f"Created opportunity '{opp['title']}' ({entity_id})")
    print(f"Parent '{parent['title']}' children: {parent['children']}")
    block_sizes = [len(b["content"]) for b in blocks]
    print(f"  title={len(opp['title'])}, desc={len(opp['description'])}, blocks={block_sizes}")


def update_opportunity(store: dict, spec: dict) -> None:
    """Update an existing opportunity's title, description, and blocks."""
    pl_id = spec["productLineId"]
    entity_id = spec["entityId"]
    opp = spec["opportunity"]

    pl = store.get(pl_id)
    if not pl:
        print(f"Error: product line '{pl_id}' not found in store")
        sys.exit(1)

    entity = pl.get("entities", {}).get(entity_id)
    if not entity:
        print(f"Error: entity '{entity_id}' not found in product line '{pl_id}'")
        sys.exit(1)

    if entity.get("level") != "opportunity":
        print(f"Error: entity '{entity_id}' is level '{entity.get('level')}', not 'opportunity'")
        sys.exit(1)

    ts = int(time.time() * 1000)

    # Update title and description
    entity["title"] = opp["title"]
    entity["description"] = opp["description"]

    # Rebuild blocks
    blocks = []
    for i, block in enumerate(opp.get("blocks", [])):
        blocks.append({
            "id": f"{entity_id}-b{ts}{i + 1}",
            "type": "accordion",
            "label": block["label"],
            "content": block["content"],
        })
    entity["blocks"] = blocks

    # Optional fields — only update if provided
    if "personaId" in opp:
        entity["personaId"] = opp["personaId"]
    if "iceScore" in opp:
        entity["iceScore"] = opp["iceScore"]

    print(f"Updated opportunity '{opp['title']}' ({entity_id})")
    block_sizes = [len(b["content"]) for b in blocks]
    print(f"  title={len(opp['title'])}, desc={len(opp['description'])}, blocks={block_sizes}")


def main():
    if len(sys.argv) != 2:
        print(f"Usage: python {sys.argv[0]} <opportunity.json>")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Error: {input_path} not found")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        spec = json.load(f)

    mode = spec.get("mode")
    if mode not in ("create", "update"):
        print(f"Error: 'mode' must be 'create' or 'update', got '{mode}'")
        sys.exit(1)

    # Validate
    errors = validate_opportunity(spec["opportunity"])
    if errors:
        print("Validation errors:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)

    # Read store
    if not STORE_PATH.exists():
        print(f"Error: {STORE_PATH} not found")
        sys.exit(1)

    with open(STORE_PATH, "r", encoding="utf-8") as f:
        store = json.load(f)

    # Execute
    if mode == "create":
        create_opportunity(store, spec)
    else:
        update_opportunity(store, spec)

    # Write back
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, ensure_ascii=False)

    print("Done — store.json updated.")


if __name__ == "__main__":
    main()
