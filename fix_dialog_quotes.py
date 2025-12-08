#!/usr/bin/env python3
"""
Fix unescaped dialog quotes in JSON string values.
"""

import json
import re

print("🔧 Fixing dialog quotes in JSON strings...\n")

# Read the file  
with open('./data/l_outline.json', 'r', encoding='utf-8') as f:
    content = f.read()

# This is tricky: we need to escape " that appear INSIDE JSON string values
# Strategy: Find lines with setup/symbolism/beat_goal and properly escape quotes in them

fixed = content

# Pattern: Find unescaped quotes within string values (but not the JSON structure quotes)
# Look for: "field": "...text with "quotes" in it..."
# We need to escape the inner quotes

# For the specific known issues in enhanced scenes, let's do targeted fixes
# Pattern: echo: "Text with quotes"
fixed = re.sub(r'(echo: )"([^"]+)"', r'\1\\"\\2\\"', fixed)

# Pattern: La Signora's whispered words: "Text"
fixed = re.sub(r"(whispered words from their encounter echo: )\"([^\"]+)\"", r'\1\\"\\2\\"', fixed)

# More general: find dialog quotes in narrative
# This is complex, so let's be more surgical - fix common patterns
patterns = [
    (r'(: )\"([A-Z][^"]{10,200})\"(\. )', r'\1\\"\\2\\"\3'),  # Sentence in quotes
    (r"(suggests|whispers|reveals|says|speaks): \"([^\"]+)\"", r'\1: \\"\\2\\"'),
]

for pattern, replacement in patterns:
    fixed = re.sub(pattern, replacement, fixed)

# Write back
with open('./data/l_outline.json', 'w', encoding='utf-8') as f:
    f.write(fixed)

print("✅ Fixed dialog quotes\n")

# Validate JSON
print("🔍 Validating JSON...")
try:
    json.loads(fixed)
    print("✅ JSON is now valid!\n")
    print("🎉 You can now run: ./sync-enhanced-scenes.sh")
except json.JSONDecodeError as e:
    print(f"❌ Still has JSON errors at line {e.lineno}, column {e.colno}")
    print(f"   {e.msg}")
    lines = fixed.split('\n')
    if e.lineno - 1 < len(lines):
        context = lines[e.lineno-1]
        start = max(0, e.colno - 50)
        end = min(len(context), e.colno + 50)
        print(f"\n   Context: ...{context[start:end]}...")
    exit(1)

