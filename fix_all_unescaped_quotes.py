#!/usr/bin/env python3
"""
Comprehensively fix all unescaped quotes in JSON string values.
"""
import json
import re

def find_and_fix_all_unescaped_quotes(filepath):
    """Iteratively find and fix all unescaped quotes."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Backup
    backup_path = filepath + '.comprehensive_backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'📦 Created backup: {backup_path}')
    
    max_iterations = 1000  # Safety limit
    iteration = 0
    
    while iteration < max_iterations:
        iteration += 1
        
        try:
            # Try to parse
            json.loads(content)
            print(f'✅ JSON is valid after {iteration-1} fixes!')
            break
        except json.JSONDecodeError as e:
            print(f'Iteration {iteration}: Error at line {e.lineno}, column {e.colno}')
            
            # Get the problematic line
            lines = content.split('\n')
            if e.lineno > len(lines):
                print(f'❌ Line number {e.lineno} exceeds file length')
                break
            
            line_idx = e.lineno - 1
            line = lines[line_idx]
            
            # Find the unescaped quote around the error position
            # The error is usually at the unescaped quote
            col = e.colno - 1  # Convert to 0-indexed
            
            # Check if there's a quote at or near this position
            if col < len(line):
                # Look for pattern: text"text where " is unescaped
                # We need to escape quotes that are inside string values
                
                # Find if we're inside a JSON string value
                # Look backwards for the opening quote of the string
                search_start = max(0, col - 200)
                search_text = line[search_start:col + 100]
                
                # Simple heuristic: find ": " pattern before the error, and quote after
                if '": "' in search_text or '"' in search_text:
                    # Find the quote near the error position
                    for offset in range(-5, 6):
                        check_pos = col + offset
                        if 0 <= check_pos < len(line) and line[check_pos] == '"':
                            # Check if it's already escaped
                            if check_pos > 0 and line[check_pos - 1] != '\\':
                                # Check if this quote is inside a string value
                                # by counting quotes before it
                                before = line[:check_pos]
                                # Count unescaped quotes
                                quote_count = 0
                                i = 0
                                while i < len(before):
                                    if before[i] == '"' and (i == 0 or before[i-1] != '\\'):
                                        quote_count += 1
                                    i += 1
                                
                                # If odd number of quotes, we're inside a string
                                if quote_count % 2 == 1:
                                    # This quote should be escaped
                                    line = line[:check_pos] + '\\' + line[check_pos:]
                                    lines[line_idx] = line
                                    content = '\n'.join(lines)
                                    print(f'  ✓ Escaped quote at column {check_pos + 1}')
                                    break
                    else:
                        print(f'  ⚠ Could not find quote to escape near error position')
                        # Try a different approach: look for common dialog patterns
                        # Pattern: word: "dialog"
                        dialog_pattern = r'([a-z]+: ")([^"]+)"([^"]+)"'
                        def escape_dialog(match):
                            return match.group(1) + match.group(2).replace('"', r'\"') + r'\"' + match.group(3) + r'\"'
                        
                        new_line = re.sub(dialog_pattern, escape_dialog, line)
                        if new_line != line:
                            lines[line_idx] = new_line
                            content = '\n'.join(lines)
                            print(f'  ✓ Applied dialog pattern fix')
                        else:
                            print(f'  ❌ Could not fix line {e.lineno}')
                            print(f'  Context: {line[max(0, col-50):col+50]}')
                            break
            else:
                print(f'❌ Column {e.colno} exceeds line length')
                break
    else:
        print(f'❌ Reached maximum iterations ({max_iterations})')
        return False
    
    # Write fixed content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✅ Saved fixed JSON to {filepath}')
    
    # Final validation
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        print('✅ Final validation: JSON is valid!')
        return True
    except json.JSONDecodeError as e:
        print(f'❌ Final validation failed at line {e.lineno}, column {e.colno}')
        return False

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print('Usage: python3 fix_all_unescaped_quotes.py <json_file>')
        sys.exit(1)
    
    filepath = sys.argv[1]
    success = find_and_fix_all_unescaped_quotes(filepath)
    sys.exit(0 if success else 1)

