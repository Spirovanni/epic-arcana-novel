#!/usr/bin/env python3
"""
Generate insightful display names for Epic Arcana personality profiles
following the established naming convention: "The [Descriptive Modifier] [Core Archetype]"
"""

import json
import re

def load_json_file(filepath):
    """Load JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def save_json_file(data, filepath):
    """Save JSON file with proper formatting"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Successfully saved enhanced profiles to {filepath}")
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def get_core_archetype_from_family(family_number):
    """Map Enneagram family number to core archetype"""
    archetype_map = {
        1: "Reformer",     # The Reformer - Order/Systems
        2: "Helper",       # The Helper - Belonging/Care  
        3: "Achiever",     # The Achiever - Ambition/Mastery
        4: "Individualist", # The Individualist - Authenticity/Expression
        5: "Investigator", # The Investigator - Insight/Knowledge
        6: "Loyalist",     # The Loyalist - Security/Loyalty
        7: "Enthusiast",   # The Enthusiast - Freedom/Discovery
        8: "Challenger",   # The Challenger - Sovereignty/Protection
        9: "Peacemaker"    # The Peacemaker - Harmony/Integration
    }
    return archetype_map.get(family_number, "Unknown")

def get_descriptive_modifier(profile):
    """Generate descriptive modifier based on profile characteristics"""
    
    # Extract key information
    theme = profile.get('theme', '').lower()
    focus_area = profile.get('thematic_essence', {}).get('focus_area', '').lower()
    tarot_family = profile.get('thematic_essence', {}).get('archetypal_family', '').lower()
    hero_stage = profile.get('character_development', {}).get('hero_journey_stage', '').lower()
    family = profile.get('family', '').lower()
    chapter = profile.get('chapter', 0)
    
    # Development stage patterns based on wing_bin and development_bin
    wing_bin = profile.get('position', {}).get('wing_bin', 0)
    dev_bin = profile.get('position', {}).get('development_bin', 0)
    
    # Create modifier based on theme, focus area, and development
    modifiers = {
        # Mental Health & Emotional themes
        'despair': 'Wounded', 'hopelessness': 'Struggling', 'depression': 'Recovering',
        'mental health': 'Healing', 'emotional': 'Feeling', 'empathy': 'Compassionate',
        
        # Honesty & Truth themes  
        'guileless': 'Truthful', 'honesty': 'Authentic', 'truth': 'Clear-Sighted',
        'transparent': 'Open', 'sincere': 'Genuine', 'direct': 'Straightforward',
        
        # Growth & Development
        'growth': 'Evolving', 'development': 'Growing', 'improvement': 'Advancing',
        'learning': 'Studying', 'education': 'Teaching', 'wisdom': 'Wise',
        
        # Leadership & Authority
        'leadership': 'Leading', 'authority': 'Commanding', 'power': 'Empowered',
        'influence': 'Influential', 'guidance': 'Guiding', 'management': 'Organizing',
        
        # Creativity & Expression
        'creativity': 'Creative', 'artistic': 'Artistic', 'expression': 'Expressive',
        'imagination': 'Imaginative', 'innovation': 'Innovative', 'design': 'Designing',
        
        # Relationships & Social
        'relationships': 'Connecting', 'social': 'Social', 'community': 'Communal',
        'collaboration': 'Collaborative', 'teamwork': 'Team-Building', 'networking': 'Networking',
        
        # Spiritual & Mystical
        'spirituality': 'Spiritual', 'mystical': 'Mystical', 'sacred': 'Sacred',
        'divine': 'Divine', 'transcendent': 'Transcendent', 'enlightened': 'Enlightened',
        
        # Action & Adventure
        'adventure': 'Adventurous', 'exploration': 'Exploring', 'discovery': 'Discovering',
        'courage': 'Courageous', 'bravery': 'Brave', 'heroic': 'Heroic',
        
        # Knowledge & Wisdom
        'knowledge': 'Knowledgeable', 'learning': 'Learning', 'study': 'Studious',
        'research': 'Researching', 'analysis': 'Analytical', 'insight': 'Insightful',
        
        # Change & Transformation
        'transformation': 'Transforming', 'change': 'Changing', 'evolution': 'Evolving',
        'revolution': 'Revolutionary', 'reform': 'Reforming', 'renewal': 'Renewing'
    }
    
    # Tarot-based modifiers
    tarot_modifiers = {
        'swords': ['Sharp-Minded', 'Blade-Wielding', 'Truth-Seeking', 'Cutting-Edge', 'Mental-Warrior'],
        'cups': ['Heart-Centered', 'Feeling-Deep', 'Emotionally-Wise', 'Cup-Bearer', 'Love-Guided'],
        'wands': ['Fire-Spirited', 'Passion-Driven', 'Spark-Igniting', 'Energy-Wielding', 'Flame-Keeper'],
        'disks': ['Earth-Grounded', 'Material-Wise', 'Resource-Managing', 'Foundation-Building', 'Practical-Minded'],
        'major arcana': ['Fate-Touched', 'Destiny-Bound', 'Archetypal', 'Soul-Deep', 'Cosmic-Aligned']
    }
    
    # Development stage modifiers
    development_modifiers = {
        0: 'Awakening', 1: 'Emerging', 2: 'Developing', 3: 'Mature', 4: 'Mastering'
    }
    
    # Hero journey stage modifiers
    journey_modifiers = {
        'ordinary world': 'Beginning', 'call': 'Called', 'threshold': 'Crossing',
        'mentor': 'Guided', 'test': 'Testing', 'ordeal': 'Facing', 'reward': 'Rewarded',
        'road back': 'Returning', 'resurrection': 'Reborn', 'elixir': 'Transformed'
    }
    
    # Chapter progression modifiers (early, middle, late in each book)
    chapter_progression = {
        range(1, 14): 'Nascent',     # Early chapters - just beginning
        range(14, 27): 'Flourishing', # Middle chapters - in full development  
        range(27, 41): 'Masterful'   # Later chapters - approaching mastery
    }
    
    # First, try theme-based modifier
    modifier = modifiers.get(theme, None)
    
    # If no theme match, try focus area
    if not modifier:
        modifier = modifiers.get(focus_area, None)
    
    # If still no match, use tarot-based modifier
    if not modifier and tarot_family in tarot_modifiers:
        import random
        random.seed(chapter)  # Consistent selection based on chapter
        modifier = random.choice(tarot_modifiers[tarot_family])
    
    # If still no match, use development stage
    if not modifier:
        modifier = development_modifiers.get(dev_bin, 'Evolving')
    
    # Add chapter progression nuance
    for chapter_range, progression_mod in chapter_progression.items():
        if chapter in chapter_range:
            if modifier in ['Evolving', 'Growing', 'Developing', 'Awakening', 'Emerging']:
                modifier = progression_mod
            break
    
    return modifier or 'Awakening'

def create_display_name(profile):
    """Create display name following the pattern 'The [Descriptive Modifier] [Core Archetype]'"""
    
    family_number = profile.get('position', {}).get('family_number', 1)
    core_archetype = get_core_archetype_from_family(family_number)
    descriptive_modifier = get_descriptive_modifier(profile)
    
    return f"The {descriptive_modifier} {core_archetype}"

def enhance_display_names(profiles_data):
    """Enhance all profiles with insightful display names"""
    
    enhanced_profiles = []
    
    for i, profile in enumerate(profiles_data):
        enhanced_profile = profile.copy()
        
        # Generate new display name
        display_name = create_display_name(profile)
        enhanced_profile['display_name'] = display_name
        
        enhanced_profiles.append(enhanced_profile)
        
        # Progress reporting
        if (i + 1) % 40 == 0 or (i + 1) <= 10:
            print(f"Enhanced {i + 1}: {display_name} (Chapter {profile.get('chapter', i + 1)})")
    
    return enhanced_profiles

def main():
    """Main function to generate display names"""
    base_dir = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel"
    
    # Load personality profiles
    profiles_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json"
    
    print("Loading personality profiles...")
    profiles_data = load_json_file(profiles_path)
    if not profiles_data:
        print("Failed to load personality profiles")
        return
    
    print(f"Generating display names for {len(profiles_data)} personality profiles...")
    
    # Generate enhanced profiles with display names
    enhanced_profiles = enhance_display_names(profiles_data)
    
    # Save enhanced profiles
    output_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json"
    if save_json_file(enhanced_profiles, output_path):
        print(f"\nSuccessfully generated display names for {len(enhanced_profiles)} personality profiles")
        
        # Show sample names from each book
        print("\nSample Display Names by Book:")
        for book in range(1, 10):
            book_profiles = [p for p in enhanced_profiles if p.get('position', {}).get('family_number') == book]
            if book_profiles:
                sample = book_profiles[0]  # First in each book
                print(f"Book {book}: {sample['display_name']} (Theme: {sample.get('theme', 'Unknown')})")
    
    print("\n✅ Display name generation complete!")

if __name__ == "__main__":
    main()