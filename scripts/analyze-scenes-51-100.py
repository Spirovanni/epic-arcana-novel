#!/usr/bin/env python3
import json
import re
from pathlib import Path

# Read the raw scenes
raw_scenes_path = Path(__file__).parent / 'scenes-51-100-raw.json'
with open(raw_scenes_path, 'r') as f:
    raw_scenes = json.load(f)

def extract_characters_from_scene(scene):
    """Extract character names from scene content"""
    # Common character names in Epic Arcana
    character_names = [
        'Francisco', 'Zara', 'Roger', 'Sofia', 'Marcus', 'Elena',
        'Viktor', 'Alexei', 'Dmitri', 'Natasha', 'Ivan',
        'Dr. Patel', 'Dr. Chen', 'Colonel Hayes', 'General Morrison',
        'Ambassador Chen', 'Minister Volkov', 'President Liu',
        'Master Lumina', 'Guardian', 'Council'
    ]

    # Collect all text from the scene
    scene_data = scene.get('scene_data', {})
    text_fields = [
        scene.get('setup', ''),
        scene.get('description', ''),
        scene.get('focus', ''),
        scene_data.get('preliminary_scene_description', ''),
        scene_data.get('preliminary_scene_focus', ''),
        scene_data.get('chapter_scene_focus', ''),
        scene_data.get('scene_title', ''),
        ' '.join(scene_data.get('sudowrite_character_moments', [])),
        ' '.join(scene_data.get('foreshadowing_elements', []))
    ]

    all_text = ' '.join(text_fields).lower()

    found_characters = []
    for name in character_names:
        if name.lower() in all_text:
            found_characters.append(name)

    # Also get from characters list
    char_list = scene.get('characters_involved', [])
    if char_list:
        found_characters.extend(char_list)

    # Deduplicate while preserving order
    seen = set()
    unique_characters = []
    for char in found_characters:
        if char not in seen:
            seen.add(char)
            unique_characters.append(char)

    return unique_characters

def extract_pov_character(pov_string):
    """Extract the actual POV character name from POV field"""
    if not pov_string:
        return None

    # Look for patterns like "Third Person Limited - Francisco" or "3rd Person Limited (Francisco)"
    match = re.search(r'[-\(]\s*([A-Z][a-z]+)', pov_string)
    if match:
        return match.group(1)

    return None

def analyze_character_dynamics(scene):
    """Analyze character relationships and conflicts in the scene"""
    scene_data = scene.get('scene_data', {})

    dynamics = []

    # Check character moments for interpersonal dynamics
    char_moments = scene_data.get('sudowrite_character_moments', [])
    for moment in char_moments:
        moment_lower = moment.lower()
        if any(word in moment_lower for word in ['conflict', 'tension', 'disagree', 'oppose', 'resist', 'challenge']):
            dynamics.append(('conflict', moment))
        elif any(word in moment_lower for word in ['support', 'ally', 'help', 'cooperate', 'trust']):
            dynamics.append(('support', moment))
        elif any(word in moment_lower for word in ['mediate', 'balance', 'synthesize', 'integrate']):
            dynamics.append(('mediation', moment))

    # Check description and setup for dynamics
    all_text = f"{scene.get('setup', '')} {scene.get('description', '')} {scene_data.get('preliminary_scene_description', '')}"
    all_text_lower = all_text.lower()

    if any(word in all_text_lower for word in ['faction', 'division', 'disagreement', 'opposed', 'skepticism', 'resistance']):
        dynamics.append(('group_conflict', 'Group tensions or factional divisions'))

    if any(word in all_text_lower for word in ['alliance', 'collaboration', 'together', 'unified', 'collective']):
        dynamics.append(('collaboration', 'Collaborative efforts or alliance building'))

    if any(word in all_text_lower for word in ['mediat', 'reconcil', 'synthesiz', 'bridge']):
        dynamics.append(('mediation', 'Mediation or synthesis of different perspectives'))

    return dynamics

def enhance_internal_conflict(scene):
    """Create enhanced internal conflict incorporating multi-character dynamics"""
    pov_string = scene.get('pov', '')
    pov_character = extract_pov_character(pov_string)

    current_conflict = scene.get('current_internal_conflict', '')
    scene_data = scene.get('scene_data', {})

    # Get all scene text
    setup = scene.get('setup', '')
    description = scene.get('description', '')
    focus = scene.get('focus', '')
    prelim_desc = scene_data.get('preliminary_scene_description', '')
    prelim_focus = scene_data.get('preliminary_scene_focus', '')

    # Extract characters and dynamics
    characters = extract_characters_from_scene(scene)
    dynamics = analyze_character_dynamics(scene)

    # Build enhanced conflict
    enhanced_parts = []

    # Start with current conflict if it exists
    if current_conflict:
        enhanced_parts.append(current_conflict)

    # If no current conflict, try to infer from scene content
    elif pov_character and focus:
        enhanced_parts.append(f"{pov_character}'s challenge: {focus}")
    elif prelim_focus:
        enhanced_parts.append(prelim_focus)

    # Add multi-character dimensions
    other_characters = [c for c in characters if c != pov_character and c not in ['Council', 'Guardian']]

    if other_characters and dynamics:
        # Analyze the types of dynamics
        has_conflict = any(d[0] in ['conflict', 'group_conflict'] for d in dynamics)
        has_support = any(d[0] == 'support' for d in dynamics)
        has_mediation = any(d[0] == 'mediation' for d in dynamics)

        if has_conflict and pov_character:
            if len(other_characters) == 1:
                enhanced_parts.append(f"This internal struggle is intensified by tensions with {other_characters[0]}")
            else:
                enhanced_parts.append(f"This internal struggle occurs amid group tensions involving {', '.join(other_characters[:3])}")

        elif has_mediation and pov_character:
            enhanced_parts.append(f"{pov_character} must navigate and potentially mediate between different perspectives represented by {', '.join(other_characters[:3])}")

        elif has_support and len(other_characters) > 0:
            enhanced_parts.append(f"While {', '.join(other_characters[:2])} offer support, accepting help creates its own internal complexity")

        elif len(other_characters) > 1:
            # General multi-character context
            enhanced_parts.append(f"The presence of {', '.join(other_characters[:3])} adds layers of interpersonal complexity to this challenge")

    # Add specific insights from character moments
    conflict_moments = [d[1] for d in dynamics if d[0] == 'conflict']
    if conflict_moments and len(enhanced_parts) <= 2:
        # Add a specific conflict dimension
        first_moment = conflict_moments[0]
        if len(first_moment) < 200:  # Only if not too long
            enhanced_parts.append(f"Specifically: {first_moment[:150]}")

    # Combine all parts
    if enhanced_parts:
        enhanced_conflict = '. '.join(enhanced_parts)
        # Clean up any double periods
        enhanced_conflict = enhanced_conflict.replace('..', '.')
        # Ensure it ends with a period
        if not enhanced_conflict.endswith('.'):
            enhanced_conflict += '.'
        return enhanced_conflict
    else:
        return "Internal conflict details to be developed based on scene content."

# Process each scene
analyzed_scenes = []

for scene in raw_scenes:
    characters = extract_characters_from_scene(scene)
    pov_character = extract_pov_character(scene.get('pov', ''))

    # Ensure POV character is first in the list if present
    if pov_character and pov_character in characters:
        characters.remove(pov_character)
        characters.insert(0, pov_character)
    elif pov_character and pov_character not in characters:
        characters.insert(0, pov_character)

    enhanced_conflict = enhance_internal_conflict(scene)
    scene_data = scene.get('scene_data', {})

    analyzed_scene = {
        'scene_index': scene['scene_index'],
        'chapter_id': scene['chapter_id'],
        'scene_number': scene['scene_number'],
        'title': scene.get('title', '') or scene_data.get('scene_title', ''),
        'pov': scene['pov'],
        'current_internal_conflict': scene['current_internal_conflict'],
        'characters_involved': characters,
        'proposed_enhanced_conflict': enhanced_conflict
    }

    analyzed_scenes.append(analyzed_scene)

# Save the analysis
output_path = Path(__file__).parent / 'scenes-51-100-analysis.json'
with open(output_path, 'w') as f:
    json.dump(analyzed_scenes, f, indent=2)

print(f"Analyzed {len(analyzed_scenes)} scenes")
print(f"Saved analysis to: {output_path}")

# Print summary statistics
scenes_with_conflict = sum(1 for s in analyzed_scenes if s['current_internal_conflict'])
scenes_with_enhanced = sum(1 for s in analyzed_scenes if s['proposed_enhanced_conflict'] and s['proposed_enhanced_conflict'] != "Internal conflict details to be developed based on scene content.")
scenes_with_multiple_chars = sum(1 for s in analyzed_scenes if len(s['characters_involved']) > 1)

print(f"\nSummary:")
print(f"  Scenes with existing internal conflict: {scenes_with_conflict}")
print(f"  Scenes with meaningful enhanced conflict: {scenes_with_enhanced}")
print(f"  Scenes with multiple characters: {scenes_with_multiple_chars}")

# Character appearance statistics
all_chars = {}
for scene in analyzed_scenes:
    for char in scene['characters_involved']:
        all_chars[char] = all_chars.get(char, 0) + 1

print(f"\nCharacter appearances (scenes 51-100):")
for char, count in sorted(all_chars.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"  {char}: {count} scenes")

# Show a few examples
print(f"\n=== Example Scenes ===")
for i in [0, 10, 20, 30, 40]:
    if i < len(analyzed_scenes):
        scene = analyzed_scenes[i]
        print(f"\nScene {scene['scene_index']}: {scene['chapter_id']}.{scene['scene_number']} - {scene['title']}")
        print(f"  POV: {scene['pov']}")
        print(f"  Characters: {', '.join(scene['characters_involved'][:5])}")
        print(f"  Current: {scene['current_internal_conflict'][:120] if scene['current_internal_conflict'] else '(none)'}...")
        print(f"  Enhanced: {scene['proposed_enhanced_conflict'][:120]}...")
