
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea080():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-080
    target_id = "EA-080"
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
    stg_found["save_the_cat_beat_goal"] = "Reflect on the journey's cost in 'Isolation' (Four of Disks), securing the lessons learned before returning to the ordinary world."
    stg_found["plot"] = "Book 2 Finale: 'Master of Two Worlds'. Safe on the rescue ship, Francisco is isolated in medical quarantine. The adrenaline fades. He holds the Four of Disks—possession, stability, but also walls. He realizes he has changed too much to ever truly go back. He prepares to hoard his secrets."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Veteran. He has survived, but feels the weight of 'The Wall' he built in EA-078. He is guarded.",
        "Novella": "Tries to reach him through the glass of the quarantine bay.",
        "The_Survivors": "They look at Francisco differently now. He is their savior, but he is scary."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "psychological_toll": "Addresses the PTSD from the siege and flight.",
        "secrets_kept": "Explains why he doesn't tell the Generals everything."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "med_bay_quarantine": "Sterile, white, silent. A sharp contrast to the purple chaos of the raw timeline.",
        "the_airlock": "The threshold back to 'civilization'."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_hidden_trauma": "The isolation he feels here grows into the 'Ivory Tower' problem in later books.",
        "the_four_coins": "He keeps a physical token from the raw timeline (Ace of Disks seed)."
    }
    
    # Update Summary
    stg_found["summary"] = "The rescue is successful. But safety brings silence. Francisco is placed in quarantine for 'temporal decontamination'. He sits alone. He holds the Four of Disks energy: holding on tight. He reviews the mission logs. He deletes the data about the 'Ace of Disks' seed he found. Some things are too dangerous for the Generals. He decides to keep the core of his power secret. He looks in the mirror. The student is gone. The Magus remains. He steps out of the airlock, ready to lie to everyone he serves."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Guarded reflection"
    stg_found["scene_tone"] = "Sterile and internal"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Quarantine",
            "setup": "White light. Hum of engines. Francisco wakes up in a bio-bed. A droid is scanning him. He is safe. But he is locked in. The silence is deafening after the screaming sky of EA-079. He checks his pockets. The 'Seed' (Ace of Disks fragment) is still there.",
            "symbolism": "The Womb/Tomb. The White Room. The transition.",
            "beat_goal": "The Decompression. Processing the shift in reality.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Numbness",
            "scene_tone": "Clinical",
            "timeline_date": "Post-Rescue + 2 hours",
            "timeline_variant": "Rescue Ship Med-Bay",
            "location": "Med-Bay",
            "narrative_function": "The Pause.",
            "learning_objective_integration": "Reflects 'Solitude'—the value of being alone."
        },
        {
            "scene_number": 2,
            "scene_title": "The Debrief",
            "setup": "A General appearing on a screen. Asking for the report. 'What did you find in the Raw Timeline?' Francisco lies smoothly. 'Just rocks and monsters.' He hoards the truth (Four of Disks). He realizes the Institution cannot be trusted with the power of Creation (Ace).",
            "symbolism": "The Mask. The miser holding the coin.",
            "beat_goal": "The Choice. Deciding to withhold information.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Cunning",
            "scene_tone": "Interrogative",
            "timeline_date": "Post-Rescue + 6 hours",
            "timeline_variant": "Rescue Ship Med-Bay",
            "location": "Med-Bay",
            "narrative_function": "The Secret.",
            "sudowrite_visual_details": [
                "The flicker of the hologram.",
                "Francisco's pulse remaining steady on the monitor despite the lie.",
                "The cold sweat on his back."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Mirror",
            "setup": "He is allowed to shower. He sees himself in the steel mirror. Scars, dirt, grey in his hair that wasn't there a week ago. He tries to smile like the 'Student' he was. It looks wrong. He practices the 'Hero' face. That works. He accepts the role.",
            "symbolism": "The Reflection. The Persona. The loss of innocence.",
            "beat_goal": "The Transformation. Accepting the new self.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Resignation",
            "scene_tone": "Intimate",
            "timeline_date": "Post-Rescue + 10 hours",
            "timeline_variant": "Rescue Ship Bathroom",
            "location": "Med-Bay",
            "narrative_function": "The Character Beat.",
            "learning_objective_integration": "Reflects 'Deep Work'—internal focus."
        },
        {
            "scene_number": 4,
            "scene_title": "The Return",
            "setup": " The airlock cycles. The 'Clean' light turns green. The door opens. Crowds, cheers, cameras. Novella is there, waiting. He steps out. He waves. He hugs her. But he feels like an actor on a stage. He is the Master of Two Worlds, but he belongs to neither.",
            "symbolism": "The Stage. The Crossing of the Return Threshold.",
            "beat_goal": "Resolution. End of Book 2.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Melancholy triumph",
            "scene_tone": "Public vs Private",
            "timeline_date": "Post-Rescue + 12 hours",
            "timeline_variant": "The Hangar Bay",
            "location": "Main Base",
            "narrative_function": "The Finale.",
            "sudowrite_character_moments": [
                "The roar of the crowd sounding muffled.",
                "Novella's hug feeling warm but distant.",
                "Francisco's hand closing over the Seed in his pocket."
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
    update_ea080()
