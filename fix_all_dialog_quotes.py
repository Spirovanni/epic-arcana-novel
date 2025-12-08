#!/usr/bin/env python3
"""
Comprehensive fix for all dialog quotes in enhanced scenes (chapters 36-47).
Converts all dialog quotes to use indirect speech or removes quotes.
"""

import json
import re

print("🔧 Comprehensively fixing all dialog quotes in enhanced scenes...\n")

with open('./data/l_outline.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Strategy: Find all instances of : "Dialog text here" and convert to : Dialog text here
# This removes the need for escaping

# Pattern 1: echo/whispers/says/reveals pattern with quotes
content = re.sub(r"(echo|whispers?|says?|reveals?|suggests?|speaks?|offers?): ['\"]([^'\"]+)['\"]", r'\1: \2', content)

# Pattern 2: La Signora's/Dante's pattern
content = re.sub(r"(La Signora's|Dante's|conductor's) ([a-z ]+): ['\"]([^'\"]+)['\"]", r"\1 \2: \3", content)

# Pattern 3: Generic pattern - any colon followed by quoted speech
content = re.sub(r': ["\']([A-Z][^"\']{5,200})["\']([,.\)])', r': \1\2', content)

with open('./data/l_outline.json', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Converted all dialog quotes to indirect speech\n")

# Validate JSON
print("🔍 Validating JSON...")
try:
    data = json.loads(content)
    print("✅ JSON is now VALID!\n")
    print("🎉 Success! You can now run: ./sync-enhanced-scenes.sh")
except json.JSONDecodeError as e:
    print(f"❌ JSON error at line {e.lineno}, column {e.colno}: {e.msg}\n")
    
    lines = content.split('\n')
    if e.lineno - 1 < len(lines):
        line = lines[e.lineno - 1]
        start = max(0, e.colno - 60)
        end = min(len(line), e.colno + 60)
        print(f"Context around error:")
        print(f"{line[start:end]}\n")
    exit(1)

