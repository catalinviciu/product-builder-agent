"""
Inject a prototype reference into an entity in Product Agent's store.json,
and copy the HTML file into the product line's public/prototypes/ folder.

Usage:
    python ProductSkills/prototype-builder/inject_prototype.py _prototype_input.json

Input JSON shape:
{
  "productLineId": "productagent-1773131237459",
  "entityId": "uuid-of-solution-or-test",
  "prototypeFilename": "my-prototype.html",
  "blockContent": "Markdown content for the Prototype block..."
}

codePath is read directly from the product line record in store.json.

The script:
  1. Validates input fields and file existence
  2. Reads codePath from the product line record
  3. Copies the HTML file to {codePath}/public/prototypes/
  4. Adds or updates a "Prototype" accordion block on the entity
  5. Writes store.json back
"""

import json
import shutil
import sys
import time
import uuid
from pathlib import Path

STORE_PATH = Path("Product-Agent-app/data/store.json")

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

    # Get codePath from product line
    code_path = pl.get("codePath")
    if not code_path:
        print(f"Error: product line '{pl_id}' has no codePath set")
        sys.exit(1)

    # Locate source file
    source_file = Path(code_path) / "Prototypes" / filename
    if not source_file.exists():
        print(f"Error: prototype file not found at {source_file}")
        sys.exit(1)

    # Copy to public/prototypes/
    dest_dir = Path(code_path) / "public" / "prototypes"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_file = dest_dir / filename
    shutil.copy2(source_file, dest_file)
    print(f"Copied: {source_file} → {dest_file}")

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
    print(f"Prototype available at: http://localhost:3000/prototypes/{filename}")


if __name__ == "__main__":
    main()
