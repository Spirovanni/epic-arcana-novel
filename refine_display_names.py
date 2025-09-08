#!/usr/bin/env python3
"""
Refine display names for Epic Arcana personality profiles with more sophisticated
theme-based and literary-influenced naming
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
    """Save JSON file"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def get_sophisticated_modifier(profile):
    """Generate more sophisticated descriptive modifier based on comprehensive profile analysis"""
    
    # Extract all available information
    theme = profile.get('theme', '').lower()
    focus_area = profile.get('thematic_essence', {}).get('focus_area', '').lower()
    tarot_family = profile.get('thematic_essence', {}).get('archetypal_family', '').lower()
    hero_stage = profile.get('character_development', {}).get('hero_journey_stage', '').lower()
    
    # Extract chapter information
    chapter = profile.get('chapter', 0)
    wing_bin = profile.get('position', {}).get('wing_bin', 0)
    dev_bin = profile.get('position', {}).get('development_bin', 0)
    
    # Extract literary influences for deeper theming
    literary_influences = profile.get('literary_influences', [])
    character_arcs = profile.get('character_development', {}).get('character_arcs', {})
    
    # Sophisticated theme-based modifiers with emotional depth
    sophisticated_modifiers = {
        # Emotional & Psychological States
        'despair': ['Wounded', 'Shadow-Walking', 'Sorrow-Touched', 'Dark-Navigating', 'Depth-Seeking'][dev_bin],
        'guileless': ['Truth-Speaking', 'Pure-Hearted', 'Honest-Souled', 'Clear-Eyed', 'Authentic'][dev_bin],
        'vibratile': ['Energy-Shifting', 'Frequency-Attuned', 'Resonance-Finding', 'Vibration-Mastering', 'Harmonic'][dev_bin],
        'explosive': ['Power-Unleashing', 'Force-Channeling', 'Energy-Erupting', 'Volcanic', 'Thunder-Calling'][dev_bin],
        'implementation': ['Vision-Manifesting', 'Dream-Building', 'Purpose-Driven', 'Goal-Achieving', 'Reality-Shaping'][dev_bin],
        'ownership': ['Authority-Claiming', 'Responsibility-Taking', 'Leadership-Embracing', 'Command-Wielding', 'Sovereign'][dev_bin],
        'dominion': ['Realm-Ruling', 'Territory-Claiming', 'Power-Mastering', 'Empire-Building', 'Throne-Holding'][dev_bin],
        'transformation': ['Shape-Shifting', 'Form-Changing', 'Metamorphic', 'Alchemical', 'Phoenix-Rising'][dev_bin],
        'determination': ['Will-Forged', 'Purpose-Driven', 'Resolve-Strengthened', 'Unbreakable', 'Iron-Willed'][dev_bin],
        'structure': ['Order-Creating', 'Framework-Building', 'Foundation-Laying', 'Architecture-Designing', 'System-Mastering'][dev_bin],
        'acceptance': ['Peace-Finding', 'Flow-Following', 'Surrender-Embracing', 'Harmony-Seeking', 'Unity-Discovering'][dev_bin],
        'celebration': ['Joy-Spreading', 'Light-Bringing', 'Festive', 'Exuberant', 'Radiance-Sharing'][dev_bin],
        'potentiality': ['Possibility-Seeing', 'Future-Visioning', 'Potential-Unlocking', 'Seed-Nurturing', 'Becoming'][dev_bin],
        'breakdown': ['Barrier-Breaking', 'Limitation-Shattering', 'Wall-Crumbling', 'Breakthrough-Making', 'Freedom-Winning'][dev_bin],
        'confidence': ['Self-Assured', 'Certainty-Radiating', 'Strength-Showing', 'Bold-Standing', 'Courage-Embodying'][dev_bin],
        
        # Growth & Development themes
        'growth': ['Seed-Sprouting', 'Branch-Extending', 'Bloom-Unfolding', 'Fruit-Bearing', 'Tree-Becoming'][dev_bin],
        'wisdom': ['Knowledge-Gathering', 'Insight-Developing', 'Understanding-Deepening', 'Truth-Grasping', 'Sage-Becoming'][dev_bin],
        'healing': ['Wound-Mending', 'Pain-Soothing', 'Wholeness-Restoring', 'Balance-Bringing', 'Sacred-Healing'][dev_bin],
        'leadership': ['Path-Showing', 'Way-Leading', 'Direction-Giving', 'Vision-Casting', 'Legacy-Creating'][dev_bin],
        'creativity': ['Art-Making', 'Beauty-Creating', 'Vision-Expressing', 'Form-Giving', 'Wonder-Crafting'][dev_bin],
        'innovation': ['Future-Forging', 'New-Ways-Finding', 'Boundary-Pushing', 'Pioneering', 'Revolution-Sparking'][dev_bin],
        'service': ['Others-Serving', 'Need-Meeting', 'Care-Providing', 'Support-Offering', 'Love-Expressing'][dev_bin],
        'justice': ['Right-Seeking', 'Fairness-Upholding', 'Balance-Maintaining', 'Truth-Defending', 'Righteousness-Embodying'][dev_bin],
        'freedom': ['Chains-Breaking', 'Liberation-Seeking', 'Independence-Claiming', 'Spirit-Freeing', 'Wildness-Embracing'][dev_bin],
        'unity': ['Connection-Weaving', 'Oneness-Seeking', 'Harmony-Creating', 'Peace-Making', 'Wholeness-Finding'][dev_bin],
        
        # Mystical & Spiritual themes
        'enlightenment': ['Light-Seeking', 'Illumination-Finding', 'Awareness-Expanding', 'Consciousness-Raising', 'Divine-Touching'][dev_bin],
        'transcendence': ['Limitation-Transcending', 'Boundary-Crossing', 'Higher-Reaching', 'Beyond-Seeing', 'Eternal-Touching'][dev_bin],
        'mystery': ['Secret-Keeping', 'Hidden-Revealing', 'Depth-Exploring', 'Unknown-Embracing', 'Veil-Lifting'][dev_bin],
        'sacred': ['Holy-Touching', 'Divine-Connecting', 'Sacred-Honoring', 'Reverent', 'Blessed-Walking'][dev_bin]
    }
    
    # Hero's journey stage modifiers
    journey_modifiers = {
        'ordinary world': 'Beginning', 'call': 'Called', 'threshold': 'Crossing',
        'mentor': 'Guided', 'allies': 'Allied', 'test': 'Testing', 'ordeal': 'Facing',
        'reward': 'Rewarded', 'road back': 'Returning', 'resurrection': 'Reborn', 'elixir': 'Transformed'
    }
    
    # Tarot family sophisticated modifiers
    tarot_sophisticated = {
        'swords': ['Mind-Sharpening', 'Truth-Cutting', 'Clarity-Bringing', 'Wisdom-Wielding', 'Intellect-Mastering'][dev_bin],
        'cups': ['Heart-Opening', 'Love-Flowing', 'Emotion-Honoring', 'Feeling-Deep', 'Soul-Touching'][dev_bin],
        'wands': ['Fire-Igniting', 'Passion-Kindling', 'Spirit-Awakening', 'Energy-Channeling', 'Power-Wielding'][dev_bin],
        'disks': ['Earth-Grounding', 'Reality-Shaping', 'Foundation-Building', 'Manifestation-Mastering', 'Material-Wisdoms'][dev_bin],
        'major arcana': ['Destiny-Walking', 'Fate-Weaving', 'Cosmic-Aligned', 'Universe-Dancing', 'Eternal-Touching'][dev_bin]
    }
    
    # First priority: use sophisticated theme-based modifier
    if theme in sophisticated_modifiers:
        return sophisticated_modifiers[theme]
    
    # Second priority: use focus area if available
    if focus_area in sophisticated_modifiers:
        return sophisticated_modifiers[focus_area]
    
    # Third priority: use tarot family
    if tarot_family in tarot_sophisticated:
        return tarot_sophisticated[tarot_family]
    
    # Fourth priority: use hero's journey stage
    for stage_key in journey_modifiers:
        if stage_key in hero_stage:
            return journey_modifiers[stage_key]
    
    # Default progression based on development
    development_defaults = ['Awakening', 'Emerging', 'Growing', 'Flowering', 'Mastering'][dev_bin]
    return development_defaults

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

def create_refined_display_name(profile):
    """Create refined display name with sophisticated theming"""
    
    family_number = profile.get('position', {}).get('family_number', 1)
    core_archetype = get_core_archetype_from_family(family_number)
    descriptive_modifier = get_sophisticated_modifier(profile)
    
    return f"The {descriptive_modifier} {core_archetype}"

def refine_display_names(profiles_data):
    """Refine all profiles with sophisticated display names"""
    
    refined_profiles = []
    
    for i, profile in enumerate(profiles_data):
        refined_profile = profile.copy()
        
        # Generate refined display name
        display_name = create_refined_display_name(profile)
        refined_profile['display_name'] = display_name
        
        refined_profiles.append(refined_profile)
        
        # Progress reporting
        if (i + 1) % 40 == 0 or (i + 1) <= 15:
            theme = profile.get('theme', 'Unknown')
            print(f"Refined {i + 1:3d}: {display_name} (Theme: {theme})")
    
    return refined_profiles

def main():
    """Main function to refine display names"""
    base_dir = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel"
    
    # Load personality profiles
    profiles_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json"
    
    print("Loading personality profiles...")
    profiles_data = load_json_file(profiles_path)
    if not profiles_data:
        print("Failed to load personality profiles")
        return
    
    print(f"Refining display names for {len(profiles_data)} personality profiles...")
    
    # Generate refined profiles with sophisticated display names
    refined_profiles = refine_display_names(profiles_data)
    
    # Save refined profiles
    output_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json"
    if save_json_file(refined_profiles, output_path):
        print(f"\n✅ Successfully refined display names for {len(refined_profiles)} personality profiles")
        
        # Show sample refined names from each book
        print("\nRefined Display Names by Book (First in Each):")
        for book in range(1, 10):
            book_profiles = [p for p in refined_profiles if p.get('position', {}).get('family_number') == book]
            if book_profiles:
                sample = book_profiles[0]  # First in each book
                theme = sample.get('theme', 'Unknown')
                print(f"Book {book}: {sample['display_name']} (Theme: {theme})")

if __name__ == "__main__":
    main()