
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea085():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-085
    target_id = "EA-085"
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
    stg_found["save_the_cat_beat_goal"] = "Finalize the sacrifice of 'Severing Ties' (Ten of Swords) by ritually destroying his past identity to protect his family."
    stg_found["plot"] = "Reaction: The fight with Gherardo (EA-084) proved Francisco can't go back. He must commit to the Ten of Swords: the death of the ego/identity. He resigns from the University, burns his papers, and writes a final (unsent) letter to his parents. He pins his butterfly life to the board to preserve them, accepting his own pinned fate."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Ghost. He erases Xavi Petrarch so the Magus can live.",
        "Dean_Rossi": "The connection to the academic world, bewildered by the resignation.",
        "La_Signora": "Waiting in the shadows, the only one who knows the truth."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "disappearance_logistics": "How he vanishes without triggering a manhunt.",
        "emotional_closure": "The ritual act needed to switch psychological gears."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "dean_office": "Smell of old paper and wax. The place of his former ambition.",
        "river_reno_bank": "Where he burns his journals. The water flowing away."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_secret_keeps": "These burned secrets return in Book 6.",
        "the_missing_years": "This marks the start of his official 'absence' from history."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco moves like a ghost. He enters the University at night to leave his resignation. He clears his desk. The Ten of Swords is about hitting bottom so you can rise. He goes to the riverbank at dawn. He burns his journals, his research, and the letter to his parents. As the smoke rises, he feels the heavy swords of responsibility pinning him down, but also a strange relief. The worst has happened. He is free."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Finality"
    stg_found["scene_tone"] = "Somber"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Resignation",
            "setup": "University of Bologna. Night. Francisco slips into the Dean's office. He places the letter on the desk. He looks at his nameplate: 'Professor Petrarch'. He takes it and drops it in the trash.",
            "symbolism": "The Nameplate. The shedding of the Title.",
            "beat_goal": "The Professional Death. Cutting the career tie.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Regret",
            "scene_tone": "Quiet",
            "timeline_date": "Night (Post-fight)",
            "timeline_variant": "University",
            "location": "Dean's Office",
            "narrative_function": "The Official End.",
            "learning_objective_integration": "Reflects 'Essentialism'—eliminating the non-essential."
        },
        {
            "scene_number": 2,
            "scene_title": "The Unsent Letter",
            "setup": "Francisco sits in a tavern, writing by candlelight. He describes why he has to leave. He tells his parents he loves them. He tries to explain the magic without sounding mad. Then he stops. sending it would endanger them. He folds it up.",
            "symbolism": "The Sealed Letter. Communication cut.",
            "beat_goal": "The Emotional Death. Formatting the closure.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Grief",
            "scene_tone": "Intimate",
            "timeline_date": "Early AM",
            "timeline_variant": "Tavern",
            "location": "Corner Table",
            "narrative_function": "The Internal Monologue.",
            "sudowrite_visual_details": [
                "The scratch of the quill.",
                "The wax dripping on the table.",
                "The tear blotting the ink."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Ritual",
            "setup": "River Reno. Dawn is just a gray line. Francisco builds a small fire. He throws the letter in. Then his journals. The knowledge burns. He watches the ashes float on the water.",
            "symbolism": "The Ten of Swords (Dawn after darkness). Transformation by Fire.",
            "beat_goal": "The Release. The physical act of letting go.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Empty",
            "scene_tone": "Ritualistic",
            "timeline_date": "Dawn",
            "timeline_variant": "Riverbank",
            "location": "River Reno",
            "narrative_function": "The Climax (of the release).",
            "learning_objective_integration": "Reflects 'Letting Go'—surrender."
        },
        {
            "scene_number": 4,
            "scene_title": "The Departure",
            "setup": "Sun up. Francisco stands on the hill overlooking Bologna. No luggage, just his cloak and his tools. He turns away. La Signora is waiting for him with a carriage. 'Ready?' she asks. 'No,' he says. 'But let's go.'",
            "symbolism": "The Turning Back. The New Horizon.",
            "beat_goal": "Resolution. Acceptance of the new path.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Resignation",
            "scene_tone": "Cinematic",
            "timeline_date": "Morning",
            "timeline_variant": "Hilltop",
            "location": "Road out of Bologna",
            "narrative_function": "The Bridge to Ch 6.",
            "sudowrite_character_moments": [
                "The red tile roofs glowing in the sun.",
                "Francisco's hand tightening on his staff.",
                "La Signora's nod of understanding."
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
    update_ea085()
