"""
Inject assumption and test entities into Product Agent's store.json.

Usage:
    python ProductSkills/assumption-tester/inject_assumptions.py _assumptions_input.json

The input JSON file must have this shape:
{
  "productLineId": "productagent-1773131237459",
  "solutionId": "517d4021-...",
  "assumptions": [
    {
      "title": "Users will act on the assumption prompt without guidance",
      "description": "What this assumption is and why it matters...",
      "assumptionType": "usability",
      "blocks": [
        { "label": "Impact if True", "content": "..." },
        { "label": "Evidence", "content": "..." }
      ],
      "test": {
        "title": "5-second task with 3 builders",
        "description": "How we will test this assumption...",
        "testType": "prototype",
        "blocks": [
          { "label": "Define Test", "content": "..." },
          { "label": "Pass / Fail Criteria", "content": "..." }
        ]
      }
    }
  ]
}

The script:
  1. Validates all fields against length limits
  2. Validates assumptionType and testType enum values
  3. Creates assumption entities under the solution
  4. Creates test entities under each assumption (if provided)
  5. Writes back to store.json
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

VALID_ASSUMPTION_TYPES = {"desirability", "usability", "feasibility", "viability", "ethical"}
VALID_TEST_TYPES = {"prototype", "survey", "data_mining", "research_spike"}


def validate_assumption(assumption: dict, index: int) -> list[str]:
    """Return a list of validation errors (empty = OK)."""
    errors = []
    prefix = f"Assumption {index + 1}"

    title = assumption.get("title", "")
    desc = assumption.get("description", "")
    assumption_type = assumption.get("assumptionType", "")

    if not title:
        errors.append(f"{prefix}: missing title")
    elif len(title) > LIMITS["title"]:
        errors.append(f"{prefix}: title too long ({len(title)}/{LIMITS['title']})")

    if not desc:
        errors.append(f"{prefix}: missing description")
    elif len(desc) > LIMITS["description"]:
        errors.append(f"{prefix}: description too long ({len(desc)}/{LIMITS['description']})")

    if not assumption_type:
        errors.append(f"{prefix}: missing assumptionType")
    elif assumption_type not in VALID_ASSUMPTION_TYPES:
        errors.append(f"{prefix}: invalid assumptionType '{assumption_type}' — must be one of {sorted(VALID_ASSUMPTION_TYPES)}")

    for bi, block in enumerate(assumption.get("blocks", [])):
        label = block.get("label", "")
        content = block.get("content", "")
        if len(label) > LIMITS["block_label"]:
            errors.append(f"{prefix}, block {bi + 1}: label too long ({len(label)}/{LIMITS['block_label']})")
        if len(content) > LIMITS["block_content"]:
            errors.append(f"{prefix}, block {bi + 1} ({label}): content too long ({len(content)}/{LIMITS['block_content']})")

    # Validate test if present
    test = assumption.get("test")
    if test:
        errors.extend(validate_test(test, index))

    return errors


def validate_test(test: dict, assumption_index: int) -> list[str]:
    """Return a list of validation errors for a test (empty = OK)."""
    errors = []
    prefix = f"Assumption {assumption_index + 1} test"

    title = test.get("title", "")
    desc = test.get("description", "")
    test_type = test.get("testType", "")

    if not title:
        errors.append(f"{prefix}: missing title")
    elif len(title) > LIMITS["title"]:
        errors.append(f"{prefix}: title too long ({len(title)}/{LIMITS['title']})")

    if not desc:
        errors.append(f"{prefix}: missing description")
    elif len(desc) > LIMITS["description"]:
        errors.append(f"{prefix}: description too long ({len(desc)}/{LIMITS['description']})")

    if not test_type:
        errors.append(f"{prefix}: missing testType")
    elif test_type not in VALID_TEST_TYPES:
        errors.append(f"{prefix}: invalid testType '{test_type}' — must be one of {sorted(VALID_TEST_TYPES)}")

    for bi, block in enumerate(test.get("blocks", [])):
        label = block.get("label", "")
        content = block.get("content", "")
        if len(label) > LIMITS["block_label"]:
            errors.append(f"{prefix}, block {bi + 1}: label too long ({len(label)}/{LIMITS['block_label']})")
        if len(content) > LIMITS["block_content"]:
            errors.append(f"{prefix}, block {bi + 1} ({label}): content too long ({len(content)}/{LIMITS['block_content']})")

    return errors


def build_assumption_entity(assumption: dict, solution_id: str) -> dict:
    """Build a full assumption entity from the input shape."""
    entity_id = str(uuid.uuid4())
    ts = int(time.time() * 1000)

    blocks = []
    for i, block in enumerate(assumption.get("blocks", [])):
        blocks.append({
            "id": f"{entity_id}-b{ts}{i + 1}",
            "type": "accordion",
            "label": block["label"],
            "content": block["content"],
        })

    return {
        "id": entity_id,
        "level": "assumption",
        "title": assumption["title"],
        "icon": "HelpCircle",
        "description": assumption["description"],
        "status": "explore",
        "assumptionType": assumption["assumptionType"],
        "parentId": solution_id,
        "children": [],
        "blocks": blocks,
    }


def build_test_entity(test: dict, assumption_id: str) -> dict:
    """Build a full test entity from the input shape."""
    entity_id = str(uuid.uuid4())
    ts = int(time.time() * 1000)

    blocks = []
    for i, block in enumerate(test.get("blocks", [])):
        blocks.append({
            "id": f"{entity_id}-b{ts}{i + 1}",
            "type": "accordion",
            "label": block["label"],
            "content": block["content"],
        })

    return {
        "id": entity_id,
        "level": "test",
        "title": test["title"],
        "icon": "FlaskConical",
        "description": test["description"],
        "status": "draft",
        "testType": test["testType"],
        "parentId": assumption_id,
        "children": [],
        "blocks": blocks,
    }


def main():
    if len(sys.argv) != 2:
        print(f"Usage: python {sys.argv[0]} <assumptions.json>")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Error: {input_path} not found")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        spec = json.load(f)

    pl_id = spec["productLineId"]
    solution_id = spec["solutionId"]
    assumptions_input = spec["assumptions"]

    # Validate all assumptions (and their tests) before touching store.json
    all_errors = []
    for i, assumption in enumerate(assumptions_input):
        all_errors.extend(validate_assumption(assumption, i))

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

    solution = pl.get("entities", {}).get(solution_id)
    if not solution:
        print(f"Error: solution '{solution_id}' not found in product line '{pl_id}'")
        sys.exit(1)

    # Build and inject entities
    assumptions_added = []
    tests_added = []

    for assumption_input in assumptions_input:
        # Create assumption entity
        assumption_entity = build_assumption_entity(assumption_input, solution_id)
        pl["entities"][assumption_entity["id"]] = assumption_entity
        solution["children"].append(assumption_entity["id"])
        assumptions_added.append(assumption_entity)

        # Create test entity if provided
        test_input = assumption_input.get("test")
        if test_input:
            test_entity = build_test_entity(test_input, assumption_entity["id"])
            pl["entities"][test_entity["id"]] = test_entity
            assumption_entity["children"].append(test_entity["id"])
            tests_added.append(test_entity)

    # Write back
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, ensure_ascii=False)

    # Report
    print(f"Injected {len(assumptions_added)} assumption(s) and {len(tests_added)} test(s) under solution '{solution['title'][:60]}'")
    print(f"Solution children: {solution['children']}")
    for a in assumptions_added:
        block_sizes = [len(b["content"]) for b in a["blocks"]]
        print(f"  Assumption: {a['title'][:60]} (type={a['assumptionType']}, title={len(a['title'])}, desc={len(a['description'])}, blocks={block_sizes})")
        for t in tests_added:
            if t["parentId"] == a["id"]:
                t_block_sizes = [len(b["content"]) for b in t["blocks"]]
                print(f"    Test: {t['title'][:60]} (type={t['testType']}, title={len(t['title'])}, desc={len(t['description'])}, blocks={t_block_sizes})")


if __name__ == "__main__":
    main()
