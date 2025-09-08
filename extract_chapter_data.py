#!/usr/bin/env python3
import json
import re

def extract_chapter_data():
    # Read the JSON file
    with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lsa-assessment/data/l_outline.json', 'r') as f:
        data = json.load(f)

    chapter_mapping = {}

    def search_chapters(obj, path=''):
        if isinstance(obj, dict):
            # Check if this is a chapter entry for chapters 1-40
            if 'chapter' in obj and obj['chapter'].startswith('Chapter '):
                chapter_match = re.match(r'Chapter (\d+)', obj['chapter'])
                if chapter_match:
                    chapter_num = int(chapter_match.group(1))
                    if 1 <= chapter_num <= 40:
                        # Extract all available data
                        chapter_data = {
                            'chapter_number': chapter_num,
                            'chapter_title': obj.get('chapter_title', ''),
                            'specific_task_group_title': obj.get('specific_task_group_title', ''),
                            'focus_area': obj.get('focus_area', ''),
                            'connection_to_major_task_group': obj.get('connection_to_the_major_task_group', ''),
                            'specific_task_group_description': obj.get('specific_task_group_description', ''),
                            'specific_task_group_tagline': obj.get('specific_task_group_tagline', ''),
                            
                            # Tarot and color information
                            'tarot_family': obj.get('tarot_family', ''),
                            'new_tarot_family': obj.get('new_tarot_family', ''),
                            'tarot_card_item': obj.get('tarot_card_item', ''),
                            'tarot_card_link': obj.get('tarot_card_link', ''),
                            'color_name': obj.get('color_name', ''),
                            'hex_code': obj.get('hex_code', ''),
                            'red': obj.get('red', ''),
                            'green': obj.get('green', ''),
                            'blue': obj.get('blue', ''),
                            
                            # Epic novel structure
                            'epic_novel_pages': obj.get('epic_novel_pages', ''),
                            'epic_chapter_focus': obj.get('epic_chapter_focus', ''),
                            'epic_preliminary_scene_focus': obj.get('epic_preliminary_scene_focus', ''),
                            'epic_preliminary_scene_description': obj.get('epic_preliminary_scene_description', ''),
                            'epic_novel_chapter_focus': obj.get('epic_novel_chapter_focus', ''),
                            'epic_novel_section_name': obj.get('epic_novel_section_name', ''),
                            
                            # System information
                            'type': obj.get('type', ''),
                            'unique_identifier': obj.get('unique_identifier', ''),
                            
                            # Hero journey and character arcs
                            'character_arcs': obj.get('character_arcs', {}),
                            'hero_journey_beats': obj.get('hero_journey_beats', {}),
                            'terminal_learning_objectives': obj.get('terminal_learning_objectives', {}),
                            
                            # Books and learning resources
                            'specific_task_group_books_influenced_by': obj.get('specific_task_group_books_influenced_by', {})
                        }
                        
                        # Only add if we haven't seen this chapter number yet (avoid duplicates)
                        if chapter_num not in chapter_mapping:
                            chapter_mapping[chapter_num] = chapter_data
            
            # Recursively search in nested objects
            for key, value in obj.items():
                search_chapters(value, path + '.' + key if path else key)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                search_chapters(item, path + f'[{i}]')

    # Extract the data
    search_chapters(data)
    
    return chapter_mapping

def main():
    chapter_mapping = extract_chapter_data()
    
    # Create the final structured output
    output = {
        "epic_arcana_book_1_chapters": {
            "description": "Chapter-specific data mapping for Epic Arcana Book 1 (Chapters 1-40)",
            "total_chapters": len(chapter_mapping),
            "chapters": {}
        }
    }
    
    # Sort chapters by number and add to output
    for chapter_num in sorted(chapter_mapping.keys()):
        chapter_key = f"chapter_{chapter_num:02d}"
        output["epic_arcana_book_1_chapters"]["chapters"][chapter_key] = chapter_mapping[chapter_num]
    
    # Write the output to a JSON file
    output_file = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/epic_arcana_book1_chapter_mapping.json'
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"Chapter mapping created successfully!")
    print(f"Output file: {output_file}")
    print(f"Total chapters mapped: {len(chapter_mapping)}")
    
    # Print summary of first few chapters
    print("\nSample chapter data:")
    for i in range(1, min(4, len(chapter_mapping) + 1)):
        if i in chapter_mapping:
            ch = chapter_mapping[i]
            print(f"\nChapter {i}:")
            print(f"  Title: {ch['chapter_title']}")
            print(f"  Theme: {ch['specific_task_group_title']}")
            print(f"  Focus: {ch['focus_area']}")
            print(f"  Color: {ch['color_name']} ({ch['hex_code']})")
            print(f"  Tarot: {ch['tarot_family']} - {ch['tarot_card_item']}")

if __name__ == "__main__":
    main()