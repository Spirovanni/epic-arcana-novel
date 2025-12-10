
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea086():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-086
    target_id = "EA-086"
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
    stg_found["save_the_cat_beat_goal"] = "Experience the 'Apathy' (Four of Cups) of the emotional crash after the sacrifice, requiring a new spark to reengage."
    stg_found["plot"] = "Reaction (Part 2): Weeks later. Francisco is hiding in a safe house. The adrenaline is gone. He is depressed, staring at a wall. The Four of Cups: three cups offered (past accomplishments), one cup offered by a hand in the cloud (the new mission), but he refuses to look up. La Signora tries to engage him, but he is numb."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Sleeper. He has shut down to process the trauma.",
        "La_Signora": "The Caretaker/Prod. She is patient but worried.",
        "The_Child": "A new minor character whose danger wakes him up."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "hero_burnout": "Realistically showing the cost of constant crisis.",
        "call_to_adventure_refusal": "The classic refusal beat before the new arc."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_safe_house": "Dusty, dim, safe but suffocating.",
        "the_village_square": "Where the spark happens."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_dark_night": "A precursor to deeper depressions in Book 7."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco sits in the dark. La Signora enters with food and news. He ignores both. He feels nothing. 'You saved the city,' she says. 'I lost my brother,' he replies. This is the Four of Cups stagnation. He goes for a walk in the disguise of a beggar. He sees a child playing near a temporal rift (a foreshadowing of the paradox). The child is in danger. Francisco feels a flicker of fear. That fear leads to action. He saves the child. The numbness cracks."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Numbness"
    stg_found["scene_tone"] = "Gray/Muted"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Safe House",
            "setup": "Interior. Day (but shutters closed). Dust motes. Francisco lies on a cot, staring at a crack in the ceiling. He hasn't shaved. The magic feels distant, like a limb that's been slept on.",
            "symbolism": " The Four of Cups (Closed posture). The Stagnant Water.",
            "beat_goal": "Establishing the State. The depth of the depression.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Apathy",
            "scene_tone": "Oppressive",
            "timeline_date": "Weeks later",
            "timeline_variant": "Safe House",
            "location": "Bedroom",
            "narrative_function": "The Low Point.",
            "learning_objective_integration": "Reflects 'Drive'—lack of autonomy/purpose."
        },
        {
            "scene_number": 2,
            "scene_title": "The Offer Rejected",
            "setup": "La Signora brings a map. 'There is a disturbance in the hills. We should check it.' Francisco pushes it away. 'Let someone else be the hero.' He sees the cup being offered (symbolically) and rejects it.",
            "symbolism": "The Fourth Cup. Refusal of the Call.",
            "beat_goal": "The Conflict. Resistance to re-engaging.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Irritation",
            "scene_tone": "Tense",
            "timeline_date": "Afternoon",
            "timeline_variant": "Safe House",
            "location": "Kitchen",
            "narrative_function": "The Friction.",
            "sudowrite_visual_details": [
                "The steam rising from the soup.",
                "La Signora's tight lips.",
                "The map curling on the table."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Walk",
            "setup": "Francisco goes out. The air is fresh but it smells flat to him. He wanders the village. People are living normal lives. He feels alien. He sees a child chasing a ball near an old ruin. The air shimmers.",
            "symbolism": "The World Continuing. The Glitch.",
            "beat_goal": "Please (The Spark). Seeing the anomaly.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Detachment",
            "scene_tone": "Observational",
            "timeline_date": "Late Afternoon",
            "timeline_variant": "Village",
            "location": "The Ruins",
            "narrative_function": "The Inciting Incident (Micro).",
            "learning_objective_integration": "Reflects 'Atomic Habits'—a small cue."
        },
        {
            "scene_number": 4,
            "scene_title": "The Catch",
            "setup": "The ball rolls into the shimmer. The child runs after it. The ruin wall collapses (timeline decay). Francisco moves before he thinks. A blast of kinetic energy holds the wall up. The child grabs the ball and runs out. Francisco drops the wall. He is panting. He feels *something*.",
            "symbolism": "The Spark of Action. The Awakening.",
            "beat_goal": "The Action. Breaking the apathy.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Adrenaline",
            "scene_tone": "Active",
            "timeline_date": "Sunset",
            "timeline_variant": "Village",
            "location": "The Ruins",
            "narrative_function": "The Turn.",
            "sudowrite_character_moments": [
                "The dust coating his throat.",
                "The child looking back with wide eyes.",
                "His own hand trembling, not from fear, but from use."
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
    update_ea086()
