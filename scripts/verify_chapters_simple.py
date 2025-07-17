#!/usr/bin/env python3
"""
Simple script to verify specific chapters have the required structure
"""

import json
import sys
import re

def main():
    # File path
    l_outline_path = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json"
    
    # Read the file as text
    try:
        with open(l_outline_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File {l_outline_path} not found")
        return 1
    
    # Test specific chapters we know exist
    test_chapters = [2, 3, 5, 10, 20, 30, 40]
    
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
    
    print("Testing specific chapters...")
    
    for chapter_num in test_chapters:
        # Look for the specific chapter pattern (first occurrence should be Book 1)
        pattern = rf'"chapter": "Chapter {chapter_num}"'
        matches = list(re.finditer(pattern, content))
        
        if matches:
            match = matches[0]  # Take the first match (should be Book 1)
            
            # Look in a reasonable range around the match
            start_pos = max(0, match.start() - 2000)
            end_pos = min(len(content), match.end() + 3000)
            chapter_section = content[start_pos:end_pos]
            
            found_fields = []
            for field in required_fields:
                if f'"{field}":' in chapter_section:
                    found_fields.append(field)
            
            missing_fields = [f for f in required_fields if f not in found_fields]
            
            print(f"Chapter {chapter_num:2d}: {len(found_fields)}/{len(required_fields)} fields found")
            if missing_fields:
                print(f"  Missing: {', '.join(missing_fields)}")
            else:
                print(f"  ✓ Complete")
        else:
            print(f"Chapter {chapter_num:2d}: NOT FOUND")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())