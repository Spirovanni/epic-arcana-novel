#!/usr/bin/env python3
"""
Script to verify that all chapters 2-40 have the required structure in l_outline.json
"""

import json
import sys
import re

def load_json_file(file_path):
    """Load JSON file and return parsed content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File {file_path} not found")
        return None
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {file_path}: {e}")
        return None

def find_book1_chapters(content):
    """Find all chapters 2-40 in Book 1 section"""
    chapters_found = {}
    
    # Look for the Book1 section first
    book1_pattern = r'"Book1":\s*{'
    book1_match = re.search(book1_pattern, content)
    
    if book1_match:
        # Find the end of Book1 section
        book1_start = book1_match.start()
        
        # Find the end of Book1 by looking for the next "Book2" pattern
        book2_pattern = r'"Book2":\s*{'
        book2_match = re.search(book2_pattern, content[book1_start:])
        
        if book2_match:
            book1_end = book1_start + book2_match.start()
            book1_content = content[book1_start:book1_end]
        else:
            book1_content = content[book1_start:]
        
        # Now find all chapters 2-40 in Book1 section
        for chapter_num in range(2, 41):
            pattern = rf'"chapter": "Chapter {chapter_num}"'
            matches = list(re.finditer(pattern, book1_content))
            
            if matches:
                # Take the first match
                match = matches[0]
                
                # Find the structure around this match
                start_pos = match.start()
                
                # Find the enclosing object
                brace_count = 0
                pos = start_pos
                while pos >= 0:
                    if book1_content[pos] == '}':
                        brace_count += 1
                    elif book1_content[pos] == '{':
                        brace_count -= 1
                        if brace_count == 0:
                            obj_start = pos
                            break
                    pos -= 1
                
                # Find the closing brace
                brace_count = 0
                pos = obj_start
                while pos < len(book1_content):
                    if book1_content[pos] == '{':
                        brace_count += 1
                    elif book1_content[pos] == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            obj_end = pos + 1
                            break
                    pos += 1
                
                chapter_structure = book1_content[obj_start:obj_end]
                
                # Check for required fields
                required_fields = [
                    'hero_journey_beat',
                    'hero_journey_beat_objective',
                    'plot',
                    'summary',
                    'character_arcs',
                    'story_gaps_addressed',
                    'location_details',
                    'series_connections'
                ]
                
                found_fields = []
                for field in required_fields:
                    if f'"{field}":' in chapter_structure:
                        found_fields.append(field)
                
                chapters_found[chapter_num] = {
                    'found_fields': found_fields,
                    'missing_fields': [f for f in required_fields if f not in found_fields],
                    'has_all_fields': len(found_fields) == len(required_fields)
                }
    
    return chapters_found

def main():
    # File path
    l_outline_path = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json"
    
    # Read the file as text for regex processing
    try:
        with open(l_outline_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File {l_outline_path} not found")
        return 1
    
    # Find all chapters 2-40 in Book 1
    chapters = find_book1_chapters(content)
    
    print("Chapter Structure Verification Report")
    print("=" * 50)
    
    total_chapters = 0
    complete_chapters = 0
    
    for chapter_num in range(2, 41):
        if chapter_num in chapters:
            chapter_data = chapters[chapter_num]
            total_chapters += 1
            
            status = "✓ COMPLETE" if chapter_data['has_all_fields'] else "✗ MISSING FIELDS"
            print(f"Chapter {chapter_num:2d}: {status}")
            
            if chapter_data['has_all_fields']:
                complete_chapters += 1
            else:
                print(f"  Missing: {', '.join(chapter_data['missing_fields'])}")
        else:
            print(f"Chapter {chapter_num:2d}: ✗ NOT FOUND")
    
    print("\n" + "=" * 50)
    print(f"Summary: {complete_chapters}/{total_chapters} chapters have complete structure")
    print(f"Success rate: {(complete_chapters/total_chapters)*100:.1f}%")
    
    if complete_chapters == total_chapters:
        print("✓ All chapters 2-40 have the required structure!")
        return 0
    else:
        print("✗ Some chapters are missing required fields")
        return 1

if __name__ == "__main__":
    sys.exit(main())