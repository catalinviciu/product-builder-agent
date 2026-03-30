"""
Inject a Business Outcome, Product Outcome, and optional Opportunities
into an existing product line in Product Agent's store.json.

Usage:
    python ProductSkills/new-product-line-setup/inject_setup.py _setup_input.json

Input JSON shape:
{
  "productLineId": "productagent-1773131237459",
  "businessOutcome": {
    "title": "...",
    "description": "...",
    "blocks": [
      { "type": "metric", "metric": "...", "currentValue": "...", "targetValue": "...", "timeframe": "..." },
      { "type": "accordion", "label": "Strategic Alignment", "content": "..." },
      { "type": "accordion", "label": "Why Now", "content": "..." },
      { "type": "accordion", "label": "Risk of Inaction", "content": "..." }
    ]
  },
  "productOutcome": {
    "title": "...",
    "description": "...",
    "personaId": "<optional>",
    "blocks": [
      { "type": "metric", "metric": "...", "currentValue": "...", "targetValue": "...", "timeframe": "..." },
      { "type": "accordion", "label": "Strategic Alignment", "content": "..." },
      { "type": "accordion", "label": "Constraints", "content": "..." },
      { "type": "accordion", "label": "Trade-offs", "content": "..." }
    ]
  },
  "opportunities": [
    {
      "title": "...",
      "description": "...",
      "blocks": [
        { "label": "Trigger", "content": "..." },
        { "label": "Current Workaround", "content": "..." }
      ]
    }
  ]
}

The script:
  - Validates field length limits before touching store.json
  - Generates UUID v4 for each entity
  - Writes BO as root entity (appended to tree.rootChildren)
  - Writes PO as child of BO
  - Writes each Opportunity as child of PO
  - All entities created with status "draft"
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
    "description": 800,
    "block_label": 40,
    "block_content": 3000,
}


def validate_entity(name: str, entity: dict) -> list[str]:
    errors = []
    title = entity.get("title", "")
    desc = entity.get("description", "")

    if not title:
        errors.append(f"{name}: missing title")
    elif len(title) > LIMITS["title"]:
        errors.append(f"{name}: title too long ({len(title)}/{LIMITS['title']})")

    if not desc:
        errors.append(f"{name}: missing description")
    elif len(desc) > LIMITS["description"]:
        errors.append(f"{name}: description too long ({len(desc)}/{LIMITS['description']})")

    for bi, block in enumerate(entity.get("blocks", [])):
        if block.get("type") == "metric":
            # Validate metric fields are present
            for field in ("metric", "currentValue", "targetValue", "timeframe"):
                if not block.get(field):
                    errors.append(f"{name} metric block: missing '{field}'")
        else:
            label_str = block.get("label", "")
            content = block.get("content", "")
            if len(label_str) > LIMITS["block_label"]:
                errors.append(f"{name} block {bi + 1}: label too long ({len(label_str)}/{LIMITS['block_label']})")
            if len(content) > LIMITS["block_content"]:
                errors.append(f"{name} block {bi + 1} ({label_str}): content too long ({len(content)}/{LIMITS['block_content']})")

    return errors


def build_blocks(entity_id: str, blocks_spec: list, ts: int) -> list:
    blocks = []
    for i, block in enumerate(blocks_spec):
        block_id = f"{entity_id}-b{ts}{i + 1}"
        if block.get("type") == "metric":
            blocks.append({
                "id": block_id,
                "type": "metric",
                "metric": block["metric"],
                "currentValue": block["currentValue"],
                "targetValue": block["targetValue"],
                "timeframe": block["timeframe"],
            })
        else:
            blocks.append({
                "id": block_id,
                "type": "accordion",
                "label": block["label"],
                "content": block["content"],
            })
    return blocks


def main():
    if len(sys.argv) != 2:
        print(f"Usage: python {sys.argv[0]} <input.json>")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Error: {input_path} not found")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        spec = json.load(f)

    pl_id = spec.get("productLineId")
    bo_spec = spec.get("businessOutcome")
    po_spec = spec.get("productOutcome")
    opps_spec = spec.get("opportunities", [])

    if not pl_id:
        print("Error: missing productLineId")
        sys.exit(1)
    if not bo_spec:
        print("Error: missing businessOutcome")
        sys.exit(1)
    if not po_spec:
        print("Error: missing productOutcome")
        sys.exit(1)

    # Validate all entities before touching store.json
    errors = []
    errors += validate_entity("businessOutcome", bo_spec)
    errors += validate_entity("productOutcome", po_spec)
    for i, opp in enumerate(opps_spec):
        errors += validate_entity(f"opportunities[{i}]", opp)

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

    pl = store.get(pl_id)
    if not pl:
        print(f"Error: product line '{pl_id}' not found in store")
        sys.exit(1)

    ts = int(time.time() * 1000)

    # --- Create Business Outcome ---
    bo_id = str(uuid.uuid4())
    bo_blocks = build_blocks(bo_id, bo_spec["blocks"], ts)
    bo_entity = {
        "id": bo_id,
        "level": "business_outcome",
        "title": bo_spec["title"],
        "icon": "TrendingUp",
        "description": bo_spec["description"],
        "status": "draft",
        "children": [],
        "blocks": bo_blocks,
    }
    pl["entities"][bo_id] = bo_entity
    pl["tree"]["rootChildren"].append(bo_id)
    print(f"Created Business Outcome '{bo_spec['title']}' ({bo_id})")

    # --- Create Product Outcome ---
    po_id = str(uuid.uuid4())
    po_blocks = build_blocks(po_id, po_spec["blocks"], ts + 1)
    po_entity = {
        "id": po_id,
        "level": "product_outcome",
        "title": po_spec["title"],
        "icon": "TrendingUp",
        "description": po_spec["description"],
        "status": "draft",
        "parentId": bo_id,
        "children": [],
        "blocks": po_blocks,
    }
    if po_spec.get("personaId"):
        po_entity["personaId"] = po_spec["personaId"]
    pl["entities"][po_id] = po_entity
    bo_entity["children"].append(po_id)
    print(f"Created Product Outcome '{po_spec['title']}' ({po_id})")

    # --- Create Opportunities ---
    for i, opp_spec in enumerate(opps_spec):
        opp_id = str(uuid.uuid4())
        opp_blocks = build_blocks(opp_id, opp_spec["blocks"], ts + 2 + i)
        opp_entity = {
            "id": opp_id,
            "level": "opportunity",
            "title": opp_spec["title"],
            "icon": "Lightbulb",
            "description": opp_spec["description"],
            "status": "draft",
            "parentId": po_id,
            "children": [],
            "blocks": opp_blocks,
        }
        if opp_spec.get("personaId"):
            opp_entity["personaId"] = opp_spec["personaId"]
        pl["entities"][opp_id] = opp_entity
        po_entity["children"].append(opp_id)
        print(f"Created Opportunity '{opp_spec['title']}' ({opp_id})")

    # Write back
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, ensure_ascii=False)

    print("\nDone — store.json updated.")
    print("\nSummary:")
    print(f"  Business Outcome : {bo_id}")
    print(f"  Product Outcome  : {po_id}")
    if opps_spec:
        print(f"  Opportunities    : {len(opps_spec)} created")


if __name__ == "__main__":
    main()
