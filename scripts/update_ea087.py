
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea087():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-087
    target_id = "EA-087"
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
    stg_found["save_the_cat_beat_goal"] = "Exercise 'Ingenuity' (Two of Disks) to solve a temporal paradox using pure intellect while emotionally detached."
    stg_found["plot"] = "Action (Fun and Games): The ruin collapse was a symptom. The whole village is stuck in a loop. Francisco investigates. He is still emotionally muted (from EA-086), so he treats it like a puzzle. The Two of Disks: Juggling infinite loops. He maps the village's timeline. He must introduce a 'chaos factor' to break the perfect circle without destroying the town."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Technician. He is working without passion, just skill. Reliable but cold.",
        "La_Signora": "The Assistant. She handles the people (empathy) while he handles the math.",
        "The_Mayor": "The frantic local leader, stuck repeating the same hour."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "mechanics_of_loops": "Defining how time loops work in this universe.",
        "magus_competence": "Showing he is a genius, not just a blaster."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_clock_tower": "The center of the loop. The hands spin backwards.",
        "the_baker_street": "Where the same cart crashes every hour."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "loop_theory": "This knowledge is used to defeat the final boss."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco and La Signora enter the village. The church bell rings 12. A cart crashes. A dog barks. Then... silence. The bell rings 12 again. The cart crashes again. Francisco watches, taking notes. 'It's a two-body problem,' he says. Two timelines crashing into each other. He must juggle them. He sets up a counter-frequency. He stands in the square, channeling the Two of Disks (balance). He nudges the cart. It misses the wall. The loop breaks. The villagers are confused but safe. Francisco feels a dry satisfaction."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Curiosity",
    stg_found["scene_tone"] = "Intellectual/Puzzle"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Stuck Village",
            "setup": "They arrive at the village gate. Everything seems normal, then—skip. Like a scratched record. The scene repeats. Francisco checks his pocket watch. It's stopped.",
            "symbolism": "The Broken Circle. The Ouroboros.",
            "beat_goal": "The Observation. Identifying the anomaly.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Intrigue",
            "scene_tone": "Surreal",
            "timeline_date": "Noon (Repeated)",
            "timeline_variant": "Village Gate",
            "location": "Outskirts",
            "narrative_function": "The Puzzle Setup.",
            "learning_objective_integration": "Reflects 'Lateral Thinking'—observing patterns."
        },
        {
            "scene_number": 2,
            "scene_title": "The Analysis",
            "setup": "Francisco sits on a wall, sketching diagrams in the dirt. La Signora calms the panicked Mayor (who remembers the loops). Francisco ignores them. 'It's an interference pattern.' He realizes he needs to create a standing wave to cancel it out.",
            "symbolism": "The Two of Disks (The Lemniscate). Balancing forces.",
            "beat_goal": "The Hypothesis. Formulating a plan.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Focus",
            "scene_tone": "Academic",
            "timeline_date": "Noon + 10 min",
            "timeline_variant": "Village Square",
            "location": "The Square",
            "narrative_function": "The Planning.",
            "sudowrite_visual_details": [
                "The geometric shapes in the dirt.",
                "The sweat on the Mayor's brow.",
                "The sun fixed at the zenith."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Experiment",
            "setup": "He needs a catalst. He positions La Signora at the north end and himself at the south. They must channel energy precisely when the bell strikes. It requires perfect timing. 'Do not improvise,' he orders her coldlly.",
            "symbolism": "The Fulcrum. The scale tipping.",
            "beat_goal": "The Execution. Testing the theory.",
            "pov": "3rd Person Limited (La Signora)",
            "tense": "Past Tense",
            "core_emotion": "Determination",
            "scene_tone": "Precise",
            "timeline_date": "Noon - 1 min",
            "timeline_variant": "Village Square",
            "location": "North/South Axis",
            "narrative_function": "The Action.",
            "learning_objective_integration": "Reflects 'Creative Confidence'—rapid prototyping."
        },
        {
            "scene_number": 4,
            "scene_title": "The Balance",
            "setup": "The bell tolls. The wave hits. The air screams. For a second, reality blurs. Francisco holds the two timelines apart (Atlas imagery). He shifts the cart's wheel by an inch. The cart passes. Time moves forward. The sun finally sets. He collapses, drained but successful.",
            "symbolism": "Entropy Restored. The Arrow of Time.",
            "beat_goal": "Success. The loop is broken.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Relief",
            "scene_tone": "Triumphant (Quietly)",
            "timeline_date": "Sunset (Finally)",
            "timeline_variant": "Village Square",
            "location": "The Square",
            "narrative_function": "The Resolution.",
            "sudowrite_character_moments": [
                "The long shadow finally stretching out.",
                "Francisco dusting off his hands.",
                "The sudden sound of birds (time flowing)."
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
    update_ea087()
