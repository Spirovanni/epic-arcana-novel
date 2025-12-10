
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea075():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-075
    target_id = "EA-075"
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
    stg_found["save_the_cat_beat_goal"] = "Establish a foothold in the new timeline ('Ace of Disks') using 'Lean Startup' principles to survive the initial crash."
    stg_found["plot"] = "The Flight (Part 3): They escape the minefield but damage forces a crash-landing in a 'Raw' timeline. It is unformed and chaotic. Francisco must switch from 'Warrior' to 'Founder'. He prototypes a survival camp using the Ace of Disks energy (new beginnings/material seeds)."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Embraces the 'Ace of Disks'. Becomes the Maker/Founder. Learns to build from zero.",
        "Novella": "Struggles with the lack of existing data; learns to iterate without clear specs.",
        "The_Survivors": "Shift from 'Passengers' to 'Crew'. They have to help build the colony."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "survival_mechanics": "Explains how they eat/drink/sleep in a hostile dimension.",
        "innovation_under_pressure": "Demonstrates the 'Build-Measure-Learn' loop in a life-or-death context."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_primordial_beach": "A shifting landscape of raw matter where they crashed.",
        "base_zero": "The first makeshift shelter they construct."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "rapid_prototyping": "The skills learned here allow them to build the 'Ark' in Book 3.",
        "the_ace_energy": "This pure creative force is tapped again in the finale."
    }
    
    # Update Summary
    stg_found["summary"] = "The convoy crashes. The ships are wrecked. The environment is 'Raw'—matter that hasn't decided what to be yet. It is the Ace of Disks: pure potential but zero structure. Panic sets in. Francisco takes charge. He doesn't have a plan; he has a process. 'Build-Measure-Learn'. They build a shelter. It collapses. They learn. They build another. It holds. He treats survival as a startup. They iterate their way to safety. By the end, they have a 'Minimum Viable Base' (MVB)."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Creative desperation"
    stg_found["scene_tone"] = "Raw and experimental"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Landing",
            "setup": "The ships impact the 'Raw' timeline. No explosion, just a heavy *thud* as physics assert themselves. They step out. The sky is purple static. The ground is shifting sand-glass. It is alien. Supplies are ruined. They have nothing. Francisco holds the Ace of Disks (metaphorical seed). 'We don't need supplies. We need to Make.'",
            "symbolism": "The Shipwreck. Robinson Crusoe. The blank canvas.",
            "beat_goal": "The Crash. Assess the lack of resources.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Shock",
            "scene_tone": "Surreal",
            "timeline_date": "Post-Crash + 0 hours",
            "timeline_variant": "The Raw Zone",
            "location": "Crash Site",
            "narrative_function": "The Reset.",
            "sudowrite_visual_details": [
                "The sand that tries to climb their boots.",
                "The silence of a world without birds or wind.",
                "Francisco's breath fogging in the strange air."
            ],
            "learning_objective_integration": "Reflects 'Zero to One'—creating something new in a void."
        },
        {
            "scene_number": 2,
            "scene_title": "The MVP",
            "setup": "Night is falling. The temperature drops to freezing. They need shelter *now*. Francisco outlines the MVP (Minimum Viable Product): A wall that stops wind. Not a fortress, just a wall. They use ship debris. It's ugly. It's barely standing. But it blocks the wind. It proves they can change this world. 'It's a start.'",
            "symbolism": "The First Brick. The crude tool. The shift from Thinking to Doing.",
            "beat_goal": "The First Success. Proving viability.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Determined",
            "scene_tone": "Gritty",
            "timeline_date": "Post-Crash + 4 hours",
            "timeline_variant": "The Windbreak",
            "location": "Base Zero",
            "narrative_function": "The Build.",
            "learning_objective_integration": "Demonstrates 'The Lean Startup'—MVP thinking."
        },
        {
            "scene_number": 3,
            "scene_title": "The Pivot",
            "setup": "The wall attracts 'void predators' (energy leeches). The initial plan (Defense) made them a target. Francisco realizes they need to Pivot. 'Don't block the wind; use it.' They reconfigure the debris into windmills/generators. The predators lose interest when the energy flows instead of stagnates. They turn the threat into a resource.",
            "symbolism": "Turning the sail. The Pivot. The Ace of Disks spinning.",
            "beat_goal": "The Iteration. Adapting to feedback.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Ingenuity",
            "scene_tone": "Active",
            "timeline_date": "Post-Crash + 12 hours",
            "timeline_variant": "The Generator",
            "location": "Base Zero",
            "narrative_function": "The Learn.",
            "learning_objective_integration": "Reflects 'Business Model Generation'—pivoting the model."
        },
        {
            "scene_number": 4,
            "scene_title": "The Seed",
            "setup": "Morning. The camp is ugly but functional. Power is humming. People are eating synthesized rations. Francisco plants a flag—not of conquest, but of foundation. He feels the Ace of Disks solidify. They have 'product-market fit' with this reality. They can survive here. But can they leave?",
            "symbolism": "The Flag. The Hearth. The realization that they are no longer victims.",
            "beat_goal": "Resolution. Survival is secured.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Pride",
            "scene_tone": "Hopeful",
            "timeline_date": "Post-Crash + 24 hours",
            "timeline_variant": "The Camp",
            "location": "Base Zero",
            "narrative_function": "The Anchor.",
            "sudowrite_character_moments": [
                "Novella drinking hot coffee from a recycled cup.",
                "Francisco sketching plans for expansion.",
                "The sunrise that looks less alien now."
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
    update_ea075()
