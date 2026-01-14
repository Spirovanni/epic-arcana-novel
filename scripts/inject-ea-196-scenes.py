#!/usr/bin/env python3
"""
Safe injection script for EA-196 enhanced scenes into l_outline.json
Preserves all existing chapter metadata, only updates the scenes array.
"""

import json
import sys
from pathlib import Path

def inject_scenes_for_chapter(outline_path, scenes_path, chapter_id):
    """
    Safely inject scenes for a specific chapter, preserving all metadata.
    
    Args:
        outline_path: Path to l_outline.json
        scenes_path: Path to enhanced-scenes.json
        chapter_id: Chapter identifier (e.g., "EA-196")
    """
    # Load outline
    print(f"Loading outline from {outline_path}...")
    with open(outline_path, 'r', encoding='utf-8') as f:
        outline = json.load(f)
    
    # Load scenes
    print(f"Loading scenes from {scenes_path}...")
    with open(scenes_path, 'r', encoding='utf-8') as f:
        new_scenes = json.load(f)
    
    print(f"Loaded {len(new_scenes)} scenes for {chapter_id}")
    
    # Navigate the outline structure to find the chapter
    found = False
    books = outline.get('SelfImprovementSeries', {}).get('Books', {}).get('trilogies', {})
    
    for trilogy_key, trilogy in books.items():
        trilogy_books = trilogy.get('trilogy_books', {})
        for book_key, book in trilogy_books.items():
            task_masters = book.get('task_masters', {})
            for tm_key, tm in task_masters.items():
                major_task_groups = tm.get('major_task_groups', {})
                for mtg_key, mtg in major_task_groups.items():
                    specific_task_groups = mtg.get('Specific_task_groups', {})
                    for stg_key, stg in specific_task_groups.items():
                        if stg.get('id') == chapter_id:
                            print(f"Found {chapter_id} at path: {trilogy_key} > {book_key} > {tm_key} > {mtg_key} > {stg_key}")
                            
                            # Preserve scene count if it exists
                            existing_scenes = stg.get('scenes', [])
                            print(f"Existing scenes: {len(existing_scenes)}")
                            print(f"New scenes: {len(new_scenes)}")
                            
                            # Update scenes array
                            stg['scenes'] = new_scenes
                            found = True
                            
                            print(f"✓ Updated scenes array for {chapter_id}")
                            break
                    if found:
                        break
                if found:
                    break
            if found:
                break
        if found:
            break
    
    if not found:
        print(f"ERROR: Could not find chapter {chapter_id} in outline")
        sys.exit(1)
    
    # Write updated outline
    print(f"Writing updated outline to {outline_path}...")
    with open(outline_path, 'w', encoding='utf-8') as f:
        json.dump(outline, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Successfully injected {len(new_scenes)} scenes for {chapter_id}")
    print(f"✓ Preserved all chapter metadata")
    print(f"✓ JSON structure validated")

if __name__ == "__main__":
    # Paths
    project_root = Path(__file__).parent.parent
    outline_path = project_root / "data" / "l_outline.json"
    scenes_path = project_root / "scripts" / "ea-196-enhanced-scenes.json"
    chapter_id = "EA-196"
    
    print(f"EA-196 Scene Injection Script")
    print(f"=" * 50)
    
    inject_scenes_for_chapter(outline_path, scenes_path, chapter_id)
    
    print(f"=" * 50)
    print(f"✓ Injection complete")
