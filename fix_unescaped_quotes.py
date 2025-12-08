#!/usr/bin/env python3
"""
Fix unescaped quotes within JSON string values.
This handles quotes that appear in dialog within JSON strings.
"""
import re

def fix_unescaped_quotes(filepath):
    """Fix unescaped quotes in JSON string values."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Backup
    backup_path = filepath + '.before_escape_fix'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'📦 Created backup: {backup_path}')
    
    # Strategy: Find JSON string values and escape quotes within them
    # Match pattern: "key": "value with possible "quotes" inside"
    # We need to find string values and escape internal quotes
    
    # This regex finds: ": "content"
    # where content might have unescaped quotes
    pattern = r'(": ")([^"]*(?:"[^"]*)*?)("(?:,|\s*\}))'
    
    def escape_internal_quotes(match):
        prefix = match.group(1)  # ": "
        value = match.group(2)    # the content
        suffix = match.group(3)   # closing ", or "}
        
        # Escape any quotes in the value
        # But be careful not to double-escape already escaped quotes
        value_fixed = value.replace(r'\"', '\x00')  # Temporarily mark already escaped
        value_fixed = value_fixed.replace('"', r'\"')  # Escape unescaped quotes
        value_fixed = value_fixed.replace('\x00', r'\"')  # Restore marked ones
        
        return prefix + value_fixed + suffix
    
    # Actually, let's use a simpler approach:
    # Just fix the specific line we know is problematic
    
    # Read line by line
    lines = content.split('\n')
    fixed_lines = []
    
    for i, line in enumerate(lines, 1):
        # Check if this is line 10207
        if i == 10207:
            # Find the setup field and fix quotes in the dialog
            if '"setup":' in line:
                # Replace the specific problematic dialog
                line = line.replace(
                    'echo: "Intense force lies dormant until crisis awakens it."',
                    'echo: \\"Intense force lies dormant until crisis awakens it.\\"'
                )
                print(f'✅ Fixed line 10207')
        
        fixed_lines.append(line)
    
    # Write back
    content = '\n'.join(fixed_lines)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✅ Fixed unescaped quotes in {filepath}')
    
    # Validate
    import json
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        print('✅ JSON is now valid!')
        return True
    except json.JSONDecodeError as e:
        print(f'❌ Still has JSON errors at line {e.lineno}, column {e.colno}')
        print(f'   {e.msg}')
        # Show context
        if e.lineno <= len(fixed_lines):
            line = fixed_lines[e.lineno - 1]
            start = max(0, e.colno - 50)
            end = min(len(line), e.colno + 50)
            print(f'   Context: ...{line[start:end]}...')
        return False

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print('Usage: python3 fix_unescaped_quotes.py <json_file>')
        sys.exit(1)
    
    filepath = sys.argv[1]
    success = fix_unescaped_quotes(filepath)
    sys.exit(0 if success else 1)

