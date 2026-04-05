"""
Inject a prototype reference into an entity in Product Agent's store.json.

Prototypes are written directly to public/prototypes/{productLineSlug}/ by Claude.
This script only adds the Prototype block to the entity in store.json.

Usage:
    python ProductSkills/prototype-builder/inject_prototype.py _prototype_input.json

Input JSON shape:
{
  "productLineId": "productagent-1773131237459",
  "entityId": "uuid-of-solution-or-test",
  "prototypeFilename": "my-prototype.html",
  "blockContent": "Markdown content for the Prototype block..."
}

The script:
  1. Validates input fields
  2. Verifies the prototype HTML exists in public/prototypes/{productLineSlug}/
  3. Adds or updates a "Prototype" accordion block on the entity
  4. Writes store.json back
"""

import json
import re
import sys
import time
from pathlib import Path

STORE_PATH = Path("Product-Agent-app/data/store.json")
APP_PATH = Path("Product-Agent-app")


def slugify(name: str) -> str:
    """Convert a product line name to a folder-safe slug."""
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug

LIMITS = {
    "prototypeFilename": 120,
    "blockContent": 3000,
}


def validate_input(spec: dict) -> list[str]:
    errors = []

    filename = spec.get("prototypeFilename", "")
    if not filename:
        errors.append("Missing prototypeFilename")
    elif not filename.endswith(".html"):
        errors.append(f"prototypeFilename must end in .html, got: {filename!r}")
    elif len(filename) > LIMITS["prototypeFilename"]:
        errors.append(f"prototypeFilename too long ({len(filename)}/{LIMITS['prototypeFilename']})")

    block_content = spec.get("blockContent", "")
    if not block_content:
        errors.append("Missing blockContent")
    elif len(block_content) > LIMITS["blockContent"]:
        errors.append(f"blockContent too long ({len(block_content)}/{LIMITS['blockContent']})")

    if not spec.get("productLineId"):
        errors.append("Missing productLineId")

    if not spec.get("entityId"):
        errors.append("Missing entityId")

    return errors


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

    # Validate input fields
    errors = validate_input(spec)
    if errors:
        print("Validation errors:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)

    pl_id = spec["productLineId"]
    entity_id = spec["entityId"]
    filename = spec["prototypeFilename"]
    block_content = spec["blockContent"]

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

    # Get product line name and slugify for folder path
    pl_name = pl.get("name")
    if not pl_name:
        print(f"Error: product line '{pl_id}' has no name set")
        sys.exit(1)

    pl_slug = slugify(pl_name)

    # Verify the prototype HTML exists in public/prototypes/{slug}/
    proto_file = APP_PATH / "public" / "prototypes" / pl_slug / filename
    if not proto_file.exists():
        print(f"Error: prototype file not found at {proto_file}")
        print(f"  Claude should write it there before running this script.")
        sys.exit(1)

    # Find entity
    entity = pl.get("entities", {}).get(entity_id)
    if not entity:
        print(f"Error: entity '{entity_id}' not found in product line '{pl_id}'")
        sys.exit(1)

    # Add or update the "Prototype" block
    ts = int(time.time() * 1000)
    blocks = entity.setdefault("blocks", [])

    existing_block = next((b for b in blocks if b.get("label") == "Prototype"), None)

    if existing_block:
        existing_block["content"] = block_content
        action = "Updated"
    else:
        block_id = f"{entity_id}-b{ts}1"
        blocks.append({
            "id": block_id,
            "type": "accordion",
            "label": "Prototype",
            "content": block_content,
        })
        action = "Added"

    # Write store back
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, ensure_ascii=False)

    print(f"{action} Prototype block on entity '{entity.get('title', entity_id)[:60]}'")
    print(f"Prototype available at: http://localhost:3000/prototypes/{pl_slug}/{filename}")


if __name__ == "__main__":
    main()
