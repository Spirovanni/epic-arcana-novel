
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea097():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-097
    target_id = "EA-097"
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
    stg_found["save_the_cat_beat_goal"] = "Achieve a major 'Triumph' (Nine of Cups) by locating the Keystone, marking the Midpoint climax."
    stg_found["plot"] = "Midpoint: The intel from EA-091 + the strategy from EA-094 pay off. They locate the 'Sunken Crypt' where the Keystone is hidden. They launch a mission to breach it. It is difficult, but they are ready. They solve the puzzle lock. They defeat the guardian. They don't retrieve the object yet (it's guarded by a temporal field), but they confirm it is there. The Nine of Cups—the 'Wish' is granted. They have found the grail. The celebration is raucous, bordering on hubris."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Victor. He feels unstoppable. The 'Nine of Cups' smuggess.",
        "La_Signora": "Cautious. She knows the Tarot; she knows what comes after the 9.",
        "The_Scribe": "Overjoyed that the research was correct."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "keystone_location": "Definitively placing the MacGuffin.",
        "team_competence": "Showing them winning a major objective."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_sunken_crypt": "Atmospheric, watery, ancient.",
        "the_puzzle_door": "A test of their combined skills."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_crypt_guardian": "Hints at who built the Keystone (The Ancients)."
    }
    
    # Update Summary
    stg_found["summary"] = "The expedition reaches the Crypt. It's underwater (partially). They use 'Mental Agility' to breathe. They navigate the traps. They reach the central chamber. There, floating in a stasis field, is the Keystone. It hums with power. Francisco laughs. It is the laugh of 'Triumph.' He toasts the Nine of Cups (figuratively). 'We have won,' he says. 'It's just a matter of time.' They retreat to plan the extraction, high on success."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Euphoria",
    stg_found["scene_tone"] = "Epic/Victorious"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Descent",
            "setup": "The entrance to the Sunken Crypt. Dark water. Francisco leads the way. He is confident now. 'Trust the math,' he tells the Scribe. They dive.",
            "symbolism": "Into the Subconscious (Water).",
            "beat_goal": "The Threshold. Entering the danger zone.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Excitement",
            "scene_tone": "Adventure",
            "timeline_date": "Day",
            "timeline_variant": "Crypt",
            "location": "Entrance",
            "narrative_function": "The Journey.",
            "learning_objective_integration": "Reflects 'Grit'—persistence."
        },
        {
            "scene_number": 2,
            "scene_title": "The Guardian",
            "setup": "The Puzzle Door. A construct guards it. It asks a riddle of time. Francisco answers it, not with magic, but with philosophy (learned in EA-093). The door opens. The construct bows.",
            "symbolism": "The Sphinx.",
            "beat_goal": "The Test. Proving worthiness.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Confidence",
            "scene_tone": "Mythic",
            "timeline_date": "Day",
            "timeline_variant": "Crypt",
            "location": "Inner Chamber",
            "narrative_function": "The Obstacle.",
            "sudowrite_visual_details": [
                "The grinding of stone.",
                "The bioluminescent moss.",
                "The calm voice of the construct."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Prize",
            "setup": "The Keystone revealed. It is beautiful. It pulses with light. The team stares in awe. Francisco touches the barrier. It is strong. He smiles. 'We know where it is. That is enough for today.'",
            "symbolism": "The Grail. The Wish.",
            "beat_goal": "The Discovery. The midpoint high.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Greed/Desire",
            "scene_tone": "Wondrous",
            "timeline_date": "Day",
            "timeline_variant": "Crypt",
            "location": "Sanctum",
            "narrative_function": "The Climax (Discovery).",
            "learning_objective_integration": "Reflects 'Man's Search for Meaning'—finding the aim."
        },
        {
            "scene_number": 4,
            "scene_title": "The Hubris",
            "setup": "Campfire outside the crypt. They pass a bottle. Everyone is celebrating. Francisco feels like a god. 'Nothing can stop us.' La Signora watches the shadows. She sees the Nine of Cups reversed in the embers.",
            "symbolism": "The Gluttony. The False Peak.",
            "beat_goal": "Resolution. Setting up the fall.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Arrogance",
            "scene_tone": "Ominous Celebration",
            "timeline_date": "Night",
            "timeline_variant": "Crypt Entrance",
            "location": "Campfire",
            "narrative_function": "The Pivot to Ch 18.",
            "sudowrite_character_moments": [
                "Francisco's loud voice.",
                "The spilled wine.",
                "La Signora's crossed arms."
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
    update_ea097()
