#!/usr/bin/env python3
import json
import sys

def extract_epic_arcana_content(file_path):
    """Extract all Epic Arcana novel content from the JSON file."""
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    epic_content = []
    
    def search_for_epic_content(obj, path=""):
        """Recursively search for Epic Arcana content in the JSON structure."""
        if isinstance(obj, dict):
            if 'chapter' in obj and 'epic_novel_pages' in obj:
                # Found a chapter with Epic Arcana content
                chapter_data = {
                    'chapter': obj.get('chapter', ''),
                    'epic_novel_pages': obj.get('epic_novel_pages', ''),
                    'epic_chapter_focus': obj.get('epic_chapter_focus', ''),
                    'epic_preliminary_scene_focus': obj.get('epic_preliminary_scene_focus', ''),
                    'epic_preliminary_scene_description': obj.get('epic_preliminary_scene_description', ''),
                    'epic_novel_chapter_focus': obj.get('epic_novel_chapter_focus', ''),
                    'epic_novel_section_name': obj.get('epic_novel_section_name', ''),
                    'specific_task_group_title': obj.get('specific_task_group_title', ''),
                    'focus_area': obj.get('focus_area', ''),
                    'connection_to_the_major_task_group': obj.get('connection_to_the_major_task_group', ''),
                    'specific_task_group_description': obj.get('specific_task_group_description', ''),
                    'specific_task_group_tagline': obj.get('specific_task_group_tagline', ''),
                }
                epic_content.append(chapter_data)
            
            # Continue searching in nested objects
            for key, value in obj.items():
                search_for_epic_content(value, f"{path}.{key}")
        
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                search_for_epic_content(item, f"{path}[{i}]")
    
    # Start the search
    search_for_epic_content(data)
    
    # Sort by chapter number
    epic_content.sort(key=lambda x: int(x['chapter'].split()[-1]) if x['chapter'] else 0)
    
    return epic_content

def main():
    if len(sys.argv) != 2:
        print("Usage: python extract_epic_arcana.py <json_file>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    epic_content = extract_epic_arcana_content(file_path)
    
    print("=" * 80)
    print("EPIC ARCANA NOVEL - BOOK 2: EXTRACTED CONTENT")
    print("=" * 80)
    print(f"Total chapters found: {len(epic_content)}")
    print()
    
    for i, chapter in enumerate(epic_content, 1):
        print(f"CHAPTER {i}: {chapter['chapter']}")
        print("-" * 50)
        print(f"Pages: {chapter['epic_novel_pages']}")
        print(f"Chapter Focus: {chapter['epic_chapter_focus']}")
        print(f"Scene Focus: {chapter['epic_preliminary_scene_focus']}")
        print(f"Scene Description: {chapter['epic_preliminary_scene_description']}")
        print(f"Novel Chapter Focus: {chapter['epic_novel_chapter_focus']}")
        print(f"Section Name: {chapter['epic_novel_section_name']}")
        print(f"Task Group Title: {chapter['specific_task_group_title']}")
        print(f"Focus Area: {chapter['focus_area']}")
        print(f"Connection: {chapter['connection_to_the_major_task_group']}")
        print(f"Description: {chapter['specific_task_group_description']}")
        print(f"Tagline: {chapter['specific_task_group_tagline']}")
        print()
    
    # Export to JSON for further processing
    output_file = file_path.replace('.json', '_epic_arcana_extracted.json')
    with open(output_file, 'w') as f:
        json.dump(epic_content, f, indent=2)
    
    print(f"Exported to: {output_file}")

if __name__ == "__main__":
    main()