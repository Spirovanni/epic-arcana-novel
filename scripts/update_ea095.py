
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea095():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-095
    target_id = "EA-095"
    stg_found = None
    
    def find_stg(obj, target_id):
        if isinstance(obj, dict):
            if obj.get("id") == target_id:
                return obj
            for k, v in obj.items():
                result = find_stg(v, target_id)
                if result:
                    return result
        elif isinstance(obj, list):
            for item in obj:
                result = find_stg(item, target_id)
                if result:
                    return result
        return None

    stg_found = find_stg(data, target_id)
    
    if not stg_found:
        print(f"Could not find {target_id} in outline.")
        return

    print(f"Found {target_id}. Updating fields...")
    
    # Update Metadata
    stg_found["save_the_cat_beat_goal"] = "Transition to the 'New World' by showing the cost of leadership: 'Focused Anguish' (Nine of Swords)."
    stg_found["plot"] = "New World (Setup): The Order is established, but safety is an illusion. Francisco suffers from the 'Nine of Swords'—sleepless nights, anxiety, nightmares of ruin. But he channels this into 'Focused Anguish.' He uses his insomnia to patrol, to check the wards, to simulate attacks. The group thinks he is paranoid. Then, a Vatican scout is caught probing their defenses exactly where Francisco predicted. His anguish saved them."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Sleepless Watchman. Learning that anxiety can be data.",
        "La_Signora": "Worried about his health, trying to make him rest.",
        "The_Scout": "Respects Francisco's foresight."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "vatican_response": "Showing that the enemy is active and hunting.",
        "leadership_toll": "The physical cost of being the 'Hierophant'."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_sanctuary_walls": "Patrolled at night.",
        "franciscos_quarters": "A place of no rest, filled with maps and candles."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "prophetic_dreams": "Hints that his nightmares might be timelines bleeding through."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco wakes up screaming. The Nine of Swords. He cannot sleep. He wanders the Sanctuary. He sees flaws in the defense that no one else sees. He wakes the guards. He insists on drills. The order grumbles. 'He is losing it.' But that night, shadows creep over the wall. Francisco is there waiting. He repels the scout. The Order realizes: his burden keeps them safe. 'I sleep so you don't have to,' he doesn't say, but they know."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Dread",
    stg_found["scene_tone"] = "Misty/Paranoid"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Nightmare",
            "setup": "Francisco’s room. 3 AM. He wakes from a vision of the Sanctuary burning. The Nine of Swords imagery—swords hanging over his bed. He can't go back to sleep. He feels the 'Anguish' of potential failure.",
            "symbolism": "The Hanging Swords. The Sweat.",
            "beat_goal": "The Motivation. The internal threat.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Panic",
            "scene_tone": "Dark",
            "timeline_date": "Night",
            "timeline_variant": "Sanctuary",
            "location": "Quarters",
            "narrative_function": "The Hook.",
            "learning_objective_integration": "Reflects 'Emotional Agility'—acknowledging the signal of fear."
        },
        {
            "scene_number": 2,
            "scene_title": "The Patrol",
            "setup": "Francisco walks the perimeter. The fog is thick. He checks the magical wards. He finds a hairline fracture in the north wall. A small thing, but fatal. He wakes the sentries. They are groggy, annoyed. He is intense, manic.",
            "symbolism": "The Crack in the Wall.",
            "beat_goal": "The Action. Preparation.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Urgency",
            "scene_tone": "Tense",
            "timeline_date": "Pre-Dawn",
            "timeline_variant": "Sanctuary",
            "location": "North Wall",
            "narrative_function": "The Conflict (Internal).",
            "sudowrite_visual_details": [
                "The mist clinging to the stone.",
                "The torch sputtering.",
                "The look of doubt in the sentry's eyes."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Intruder",
            "setup": "Just before dawn. The mist shifts. A shadow moves at the North Wall—right where Francisco fixed the ward. The ward flares. Francisco is there instantly. A brief skirmish. The intruder escapes, but is marked. It was a Vatican assassin.",
            "symbolism": "The shadow in the fog.",
            "beat_goal": "The Validation. The fear was real.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Vindication",
            "scene_tone": "Action/Surprise",
            "timeline_date": "Dawn",
            "timeline_variant": "Sanctuary",
            "location": "North Wall",
            "narrative_function": "The Twist.",
            "learning_objective_integration": "Reflects 'The Upside of Stress'—harnessing anxiety."
        },
        {
            "scene_number": 4,
            "scene_title": "The Burden",
            "setup": "Morning. The Order sees the blood on the wall. They look at Francisco differently. Not with annoyance, but with awe (and pity). La Signora brings him coffee. 'You need to sleep,' she says. 'Not yet,' he replies. He is the focused guardian.",
            "symbolism": "The Coffee. The Blood.",
            "beat_goal": "Resolution. Acceptance of the burden.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Weariness",
            "scene_tone": "Somber",
            "timeline_date": "Morning",
            "timeline_variant": "Sanctuary",
            "location": "Courtyard",
            "narrative_function": "The Theme Stated.",
            "sudowrite_character_moments": [
                "The trembling of his hand holding the cup.",
                "The sun breaking through the mist.",
                "The silent nod of the sentry."
            ]
        }
    ]
    
    # Save back
    try:
        with open(OUTLINE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print("File updated successfully.")
    except Exception as e:
        print(f"Error saving file: {e}")

if __name__ == "__main__":
    update_ea095()
