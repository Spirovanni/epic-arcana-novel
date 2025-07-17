#!/usr/bin/env python3
"""
Script to update l_outline.json with detailed chapter information from Book_1_Only_Outline.json
"""

import json
import sys
import os
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

def extract_chapter_data(book_outline):
    """Extract chapter data from Book_1_Only_Outline.json"""
    chapters = {}
    
    if "structure" in book_outline:
        for section in book_outline["structure"]:
            if "chapters" in section:
                for chapter in section["chapters"]:
                    chapter_num = chapter.get("chapter")
                    if chapter_num and chapter_num >= 2 and chapter_num <= 40:
                        chapters[chapter_num] = {
                            "title": chapter.get("title", ""),
                            "plot": chapter.get("plot", ""),
                            "summary": chapter.get("summary", ""),
                            "character_arcs": chapter.get("character_arcs", {}),
                            "story_gaps_addressed": chapter.get("story_gaps_addressed", {}),
                            "location_details": chapter.get("location_details", {}),
                            "series_connections": chapter.get("series_connections", {})
                        }
    
    return chapters

def update_l_outline_file(l_outline_path, chapters):
    """Update l_outline.json with the extracted chapter data"""
    # Read the original file
    with open(l_outline_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Keep track of modifications
    modifications = []
    
    # For each chapter, find and update the structure
    for chapter_num, chapter_data in chapters.items():
        # Find the pattern for the specific chapter in Book 1
        # Look for the first occurrence of "Chapter X" in the Book 1 section
        pattern = rf'"chapter": "Chapter {chapter_num}"'
        matches = list(re.finditer(pattern, content))
        
        if matches:
            # Use the first match (should be Book 1)
            match = matches[0]
            
            # Find the end of this chapter's structure
            start_pos = match.start()
            
            # Find the closing brace for this chapter
            brace_count = 0
            pos = start_pos
            while pos < len(content):
                if content[pos] == '{':
                    brace_count += 1
                elif content[pos] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_pos = pos + 1
                        break
                pos += 1
            
            # Extract the current chapter structure
            current_structure = content[start_pos:end_pos]
            
            # Add the missing summary field if it's not present
            if '"summary":' not in current_structure:
                # Find the position to insert the summary
                insert_pos = current_structure.find('"character_arcs":')
                if insert_pos != -1:
                    # Insert summary before character_arcs
                    summary_line = f'          "summary": "{chapter_data["summary"].replace('"', '\\"')}",\n          '
                    updated_structure = current_structure[:insert_pos] + summary_line + current_structure[insert_pos:]
                    
                    # Update the content
                    content = content[:start_pos] + updated_structure + content[end_pos:]
                    modifications.append(f"Added summary to Chapter {chapter_num}")
    
    # Write the updated content back
    with open(l_outline_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return modifications

def main():
    # File paths
    book_outline_path = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/json/storyline/Book_1_Only_Outline.json"
    l_outline_path = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json"
    
    # Load the Book_1_Only_Outline.json
    book_outline = load_json_file(book_outline_path)
    if not book_outline:
        return 1
    
    # Extract chapter data
    chapters = extract_chapter_data(book_outline)
    
    # Print the extracted data for verification
    print("Extracted chapter data:")
    for chapter_num, data in sorted(chapters.items()):
        print(f"\nChapter {chapter_num}:")
        print(f"  Title: {data['title']}")
        print(f"  Plot: {data['plot']}")
        print(f"  Summary: {data['summary'][:100]}...")
        print(f"  Character arcs: {list(data['character_arcs'].keys())}")
        print(f"  Story gaps: {list(data['story_gaps_addressed'].keys())}")
        print(f"  Location details: {list(data['location_details'].keys())}")
        print(f"  Series connections: {list(data['series_connections'].keys())}")
    
    # Update the l_outline.json file
    print("\nUpdating l_outline.json...")
    modifications = update_l_outline_file(l_outline_path, chapters)
    
    print("\nModifications made:")
    for modification in modifications:
        print(f"  - {modification}")
    
    print(f"\nTotal modifications: {len(modifications)}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())