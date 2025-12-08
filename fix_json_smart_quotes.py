#!/usr/bin/env python3
"""
Fix smart quotes in JSON file that break JSON parsing.
Replaces curly quotes with straight quotes ONLY within string values.
"""
import json
import re

def fix_smart_quotes_in_json(filepath):
    """Read JSON as text, fix smart quotes in string values, write back."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Backup original
    backup_path = filepath + '.before_quote_fix'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'📦 Created backup: {backup_path}')
    
    # Replace smart quotes with straight quotes
    # Left and right double curly quotes → straight double quote
    content = content.replace('"', '"').replace('"', '"')
    
    # Left and right single curly quotes → straight single quote
    content = content.replace(''', "'").replace(''', "'")
    
    # Write fixed content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✅ Fixed smart quotes in {filepath}')
    
    # Validate
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        print('✅ JSON is now valid!')
        return True
    except json.JSONDecodeError as e:
        print(f'❌ Still has JSON errors at line {e.lineno}, column {e.colno}')
        print(f'   {e.msg}')
        # Show context
        lines = content.split('\n')
        if e.lineno <= len(lines):
            line = lines[e.lineno - 1]
            start = max(0, e.colno - 50)
            end = min(len(line), e.colno + 50)
            print(f'   Context: ...{line[start:end]}...')
        return False

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print('Usage: python3 fix_json_smart_quotes.py <json_file>')
        sys.exit(1)
    
    filepath = sys.argv[1]
    success = fix_smart_quotes_in_json(filepath)
    sys.exit(0 if success else 1)

