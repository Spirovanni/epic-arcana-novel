#!/usr/bin/env python3
"""
Enhance Epic Arcana personality profiles with rich chapter data from l_outline.json
"""

import json
import os
from datetime import datetime

def load_json_file(filepath):
    """Load and return JSON data from file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def save_json_file(data, filepath):
    """Save JSON data to file with proper formatting"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Successfully saved enhanced profiles to {filepath}")
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def enhance_personality_profile(profile, chapter_data):
    """Enhance a single personality profile with chapter data"""
    chapter_num = profile.get('chapter')
    chapter_key = f"chapter_{chapter_num:02d}"
    
    if chapter_key not in chapter_data.get('chapters', {}):
        print(f"Warning: No chapter data found for chapter {chapter_num}")
        return profile
    
    chapter_info = chapter_data['chapters'][chapter_key]
    
    # Enhanced profile structure
    enhanced_profile = profile.copy()
    
    # Update display name and theme with real chapter data
    enhanced_profile['display_name'] = chapter_info.get('chapter_title', profile['display_name'])
    enhanced_profile['theme'] = chapter_info.get('specific_task_group_title', profile['theme'])
    
    # Enhanced summary with richer description
    enhanced_summary = f"This personality embodies the essence of {chapter_info.get('specific_task_group_title', 'Chapter ' + str(chapter_num))}, focusing on {chapter_info.get('focus_area', 'personal development')}. "
    enhanced_summary += chapter_info.get('specific_task_group_description', '')[:200] + "..."
    enhanced_profile['summary'] = enhanced_summary
    
    # Enhanced traits based on chapter themes and character development
    character_arcs = chapter_info.get('character_arcs', {})
    
    # Extract strengths from positive character developments
    strengths = []
    for character, arc in character_arcs.items():
        if isinstance(arc, str) and any(word in arc.lower() for word in ['strength', 'growth', 'power', 'ability', 'talent', 'skill']):
            strengths.append(f"Embodies {character.lower()}'s capacity for growth and development")
    
    if not strengths:
        strengths = [
            f"Natural affinity for {chapter_info.get('focus_area', 'growth').lower()}",
            f"Embodies the essence of {chapter_info.get('specific_task_group_title', 'development').lower()}",
            f"Strong connection to {chapter_info.get('tarot_family', 'universal').lower()} archetypal energy"
        ]
    
    # Extract shadows from challenging aspects
    shadows = []
    for character, arc in character_arcs.items():
        if isinstance(arc, str) and any(word in arc.lower() for word in ['challenge', 'struggle', 'conflict', 'despair', 'doubt', 'fear']):
            shadows.append(f"May struggle with {character.lower()}'s challenges around growth")
    
    if not shadows:
        shadows = [
            f"Potential over-identification with {chapter_info.get('specific_task_group_title', 'theme').lower()}",
            f"May become overwhelmed by {chapter_info.get('focus_area', 'development').lower()} demands",
            f"Risk of neglecting other areas while focused on core theme"
        ]
    
    # Growth focus from learning objectives
    growth_focus = []
    learning_objectives = chapter_info.get('specific_task_group_books_influenced_by', {})
    for book_key, book_info in learning_objectives.items():
        if 'terminal_learning_objectives' in book_info:
            objectives = book_info['terminal_learning_objectives']
            for obj_key, objective in objectives.items():
                if objective:
                    growth_focus.append(objective[:100] + "..." if len(objective) > 100 else objective)
    
    if not growth_focus:
        growth_focus = [
            f"Develop deeper understanding of {chapter_info.get('focus_area', 'personal growth').lower()}",
            f"Integrate {chapter_info.get('specific_task_group_title', 'theme').lower()} wisdom into daily life",
            f"Balance archetypal energy with practical application"
        ]
    
    enhanced_profile['traits'] = {
        'strengths': strengths[:3],
        'shadow': shadows[:3], 
        'growth_focus': growth_focus[:3]
    }
    
    # Enhanced book association
    enhanced_profile['book_association'].update({
        'chapter_title': chapter_info.get('chapter_title', ''),
        'focus_area': chapter_info.get('focus_area', ''),
        'tarot_connection': {
            'family': chapter_info.get('tarot_family', ''),
            'card': chapter_info.get('tarot_card_item', ''),
            'link': chapter_info.get('tarot_card_link', '')
        }
    })
    
    # Add character development data
    enhanced_profile['character_development'] = {
        'hero_journey_stage': chapter_info.get('epic_novel_chapter_focus', ''),
        'narrative_arc': {
            'pages': chapter_info.get('epic_novel_pages', ''),
            'focus': chapter_info.get('epic_chapter_focus', ''),
            'scene_description': chapter_info.get('epic_preliminary_scene_description', '')
        },
        'character_arcs': character_arcs
    }
    
    # Add literary influences
    influenced_by = chapter_info.get('specific_task_group_books_influenced_by', {})
    literary_influences = []
    
    for book_key, book_info in influenced_by.items():
        literary_influences.append({
            'title': book_info.get('title', ''),
            'author': book_info.get('author', ''),
            'focus_section': book_info.get('section_of_focus', ''),
            'connection': book_info.get('connection_focus_area', ''),
            'key_insights': list(book_info.get('connect_points', {}).values())[:3]
        })
    
    enhanced_profile['literary_influences'] = literary_influences
    
    # Update color alignment with chapter-specific color data
    if chapter_info.get('hex_code'):
        enhanced_profile['color_alignment'].update({
            'color_name': chapter_info.get('color_name', ''),
            'rgb_hex': chapter_info.get('hex_code', ''),
            'rgb_values': {
                'red': chapter_info.get('red', 0),
                'green': chapter_info.get('green', 0), 
                'blue': chapter_info.get('blue', 0)
            }
        })
    
    # Add thematic essence
    enhanced_profile['thematic_essence'] = {
        'tagline': chapter_info.get('specific_task_group_tagline', ''),
        'core_theme': chapter_info.get('specific_task_group_title', ''),
        'focus_area': chapter_info.get('focus_area', ''),
        'connection_to_major_theme': chapter_info.get('connection_to_major_task_group', ''),
        'archetypal_family': chapter_info.get('tarot_family', '')
    }
    
    # Enhanced daily prompt and story hook
    enhanced_profile['daily_prompt'] = f"How did you embody the essence of {chapter_info.get('specific_task_group_title', 'growth')} today? Reflect on your journey with {chapter_info.get('focus_area', 'development').lower()}."
    enhanced_profile['story_hook'] = f"In the world of Laurasia, {chapter_info.get('epic_preliminary_scene_description', 'a transformative moment awaits where the themes of this chapter become a pivotal choice.')}"
    
    return enhanced_profile

def main():
    """Main function to enhance personality profiles"""
    base_dir = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel"
    
    # Load existing personality profiles
    profiles_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json"
    chapter_mapping_path = f"{base_dir}/epic_arcana_book1_chapter_mapping.json"
    
    print("Loading personality profiles...")
    profiles_data = load_json_file(profiles_path)
    if not profiles_data:
        print("Failed to load personality profiles")
        return
    
    print("Loading chapter mapping data...")
    chapter_data = load_json_file(chapter_mapping_path)
    if not chapter_data:
        print("Failed to load chapter mapping data")
        return
    
    print(f"Enhancing {len(profiles_data)} personality profiles...")
    enhanced_profiles = []
    
    for i, profile in enumerate(profiles_data):
        chapter_num = profile.get('chapter', i + 1)
        
        # Only enhance profiles for chapters 1-40 (first book) where we have chapter data
        if 1 <= chapter_num <= 40:
            enhanced_profile = enhance_personality_profile(profile, chapter_data['epic_arcana_book_1_chapters'])
            enhanced_profiles.append(enhanced_profile)
            if chapter_num <= 5 or chapter_num % 10 == 0:
                print(f"Enhanced Chapter {chapter_num}: {enhanced_profile.get('display_name', 'Unknown')}")
        else:
            # Keep original profile for chapters beyond 40
            enhanced_profiles.append(profile)
    
    # Save enhanced profiles
    output_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_enhanced.json"
    if save_json_file(enhanced_profiles, output_path):
        print(f"Successfully enhanced {len(enhanced_profiles)} personality profiles")
        
        # Also create a backup of the original
        backup_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical_backup.json"
        save_json_file(profiles_data, backup_path)
        print(f"Original profiles backed up to: {backup_path}")
    else:
        print("Failed to save enhanced profiles")

if __name__ == "__main__":
    main()