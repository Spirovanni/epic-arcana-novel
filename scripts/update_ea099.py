
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea099():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-099
    target_id = "EA-099"
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
    stg_found["save_the_cat_beat_goal"] = "Show 'Ambition' (Eight of Disks) through the relentless, detailed preparation for the final heist."
    stg_found["plot"] = "All is Lost (Setup): Before the big crash, there is the grind. The Eight of Disks is the card of apprenticeship and detail. The Order prepares for the Keystone extraction based on Francisco's spell (EA-098). It involves 'Ambition'—not just wanting the prize, but doing the hard work to get it. They forge gear. They memorize routes. They practice the extraction. Francisco drives them. His ambition lifts them up, but also wears them down. They are ready, but exhausted."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Taskmaster. Ensuring perfection.",
        "The_Order": "Finding purpose in the routine.",
        "La_Signora": "See's the danger of burnout."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "logistics": "Showing that magic requires physical components.",
        "pacing": "The calm before the storm."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_armory": "Sparks flying, metal ringing.",
        "the_training_ground": "Muddy, trampled."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_crafted_gear": "Items made here are used in Book 4."
    }
    
    # Update Summary
    stg_found["summary"] = "The Sanctuary becomes a factory. The Eight of Disks energy—hammering, crafting, repeating. Francisco inspects every detail. 'Ambition is not a dream,' he tells them. 'It is a discipline.' He checks the enchanting of the containment box. He corrects a novice's pronunciation. He is relentless. The mood is serious, professional. They are no longer refugees; they are an army. But they are tired. They are ready to launch the mission to the Crypt (EA-097 location) to finish the job."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Determination",
    stg_found["scene_tone"] = "Gritty/Industrial"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Workshop",
            "setup": "The Armory. Heat. Noise. The Twin Scholars are enchanting arrows. Francisco inspects them. He rejects one. 'Do it again.' The standard is perfection.",
            "symbolism": "The Hammer and Anvil.",
            "beat_goal": "The Standard. establishing stakes.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Excellence",
            "scene_tone": "Hard",
            "timeline_date": "Day",
            "timeline_variant": "Sanctuary",
            "location": "Armory",
            "narrative_function": "The Process.",
            "learning_objective_integration": "Reflects 'Drive'—mastery."
        },
        {
            "scene_number": 2,
            "scene_title": "The Drill",
            "setup": "Training ground. They practice the formation for the Crypt. Again. And again. 'Ambition demands sweat.' They are wet, muddy, angry. But they get it right.",
            "symbolism": "The Mud.",
            "beat_goal": "The Competence. Forging the team.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Exhaustion",
            "scene_tone": "Gritty",
            "timeline_date": "Afternoon",
            "timeline_variant": "Sanctuary",
            "location": "Courtyard",
            "narrative_function": "The Hardening.",
            "sudowrite_visual_details": [
                "The steam rising from bodies.",
                "The shout of the commander.",
                "The synchronized footsteps."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Speech",
            "setup": "Night before the mission. Francisco gathers them. He uses 'Ambition' to inspire. 'We are not just surviving anymore. We are taking back tomorrow.' He connects their hard work (8 of Disks) to the glorious potential.",
            "symbolism": "The Banner.",
            "beat_goal": "The Inspiration. Re-aligning purpose.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Hope",
            "scene_tone": "Rallying",
            "timeline_date": "Night",
            "timeline_variant": "Sanctuary",
            "location": "Mess Hall",
            "narrative_function": "The Launchpad.",
            "learning_objective_integration": "Reflects 'Start with Why'—vision."
        },
        {
            "scene_number": 4,
            "scene_title": "The Departure",
            "setup": "Dawn. They march out. They look like pros. Francisco watches them. He is tired but proud. His 'Ambition' has built this. Now they just have to survive the trap he doesn't know about yet.",
            "symbolism": "The Rising Sun.",
            "beat_goal": "Resolution. Moving to the Climax.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Pride/Anxiety",
            "scene_tone": "Epic",
            "timeline_date": "Dawn",
            "timeline_variant": "Gate",
            "location": "Sanctuary Exit",
            "narrative_function": "The End of Part 2 (Book 3).",
            "sudowrite_character_moments": [
                "The clanking of gear.",
                "The last look back at home.",
                "Francisco setting his jaw."
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
    update_ea099()
