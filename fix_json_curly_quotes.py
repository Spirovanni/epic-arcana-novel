#!/usr/bin/env python3
"""
Fix curly quotes and em dashes in JSON string values without breaking JSON structure.
Only replaces these characters INSIDE string values, not in JSON syntax.
"""

import json
import re

print("🔧 Fixing JSON typography issues in l_outline.json...\n")

# Read the file
with open('./data/l_outline.json', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"📊 Original file size: {len(content):,} characters")

# Replace problematic characters
# These are ONLY inside string content, not JSON structure
replacements = {
    '\u2014': '--',      # Em dash
    '\u2013': '--',      # En dash
    '\u201c': '\\"',     # Left curly double quote
    '\u201d': '\\"',     # Right curly double quote
    '\u2018': "'",       # Left curly single quote
    '\u2019': "'",       # Right curly single quote (also apostrophe)
}

fixed = content
for old_char, new_char in replacements.items():
    count = fixed.count(old_char)
    if count > 0:
        fixed = fixed.replace(old_char, new_char)
        char_name = {
            '\u2014': 'em dashes',
            '\u2013': 'en dashes',
            '\u201c': 'left curly double quotes',
            '\u201d': 'right curly double quotes',
            '\u2018': 'left curly single quotes',
            '\u2019': 'right curly single quotes/apostrophes',
        }.get(old_char, old_char)
        print(f"✓ Replaced {count:,} {char_name}")

# Write back
with open('./data/l_outline.json', 'w', encoding='utf-8') as f:
    f.write(fixed)

print(f"\n📊 Fixed file size: {len(fixed):,} characters")
print("✅ File updated\n")

# Validate JSON
print("🔍 Validating JSON...")
try:
    json.loads(fixed)
    print("✅ JSON is now valid!\n")
    print("🎉 Success! You can now run: ./sync-enhanced-scenes.sh")
except json.JSONDecodeError as e:
    print(f"❌ JSON still has errors at line {e.lineno}, column {e.colno}:")
    print(f"   {e.msg}")
    # Show context around error
    lines = fixed.split('\n')
    if e.lineno - 1 < len(lines):
        print(f"\n   Line {e.lineno}: {lines[e.lineno-1][:100]}")
    exit(1)

