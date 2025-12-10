
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea094():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-094
    target_id = "EA-094"
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
    stg_found["save_the_cat_beat_goal"] = "Transition to 'Goal Setting' (Page of Disks) by mapping the long-term strategy for the new Order."
    stg_found["plot"] = "Push: The Order exists (EA-093). Now what? 'Goal Setting'. The Page of Disks represents the diligent student/planner. Francisco convenes the first Strategy Council. They map the threats (Vatican, Dagon). They identify the 'Keystone'—a mythical artifact that stabilizes time loops—as their primary objective. They set OKRs (Objectives and Key Sorcery). It's the 'Push' into the new world of the second half of the book."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Strategist. Moving from reactive to active.",
        "The_Scribe": "A Page of Disks figure. Meticulous, careful.",
        "The_Scout": "Ready to execute the plan."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "the_mcrguffin": "Introducing the Keystone explicitly.",
        "pacing": "Slowing down to show the intellectual work of war."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_map_room": "Filled with charts and timelines.",
        "the_archive_annex": "Where the stolen scroll is analyzed."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_keystone": "The object they chase for the rest of Book 3."
    }
    
    # Update Summary
    stg_found["summary"] = "The morning after the oath. Francisco unrolls the stolen scroll (from EA-091) and the old maps. He embodies 'Goal Setting.' He teaches the Page of Disks lesson: Vision requires concrete steps. They breakdown the mission. 1. Decrypt the Scroll. 2. Locate the Keystone. 3. Retrieve it before Dagon. They assign teams. The mood is industrious, focused, grounded. The outcome is a clear path forward."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Purpose",
    stg_found["scene_tone"] = "Industrious/Focused"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Map Room",
            "setup": "Dawn. Francisco clears the feast table (EA-092 remnants). He spreads out the maps. The 'Page of Disks' energy—grounding the vision in reality. He calls for the Scribe.",
            "symbolism": "The Blank Slate. The Map.",
            "beat_goal": "The Start. creating the workspace.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Clarity",
            "scene_tone": "Quiet/Work",
            "timeline_date": "Morning",
            "timeline_variant": "Sanctuary",
            "location": "Map Room",
            "narrative_function": "The Pivot.",
            "learning_objective_integration": "Reflects 'Atomic Habits'—environment design."
        },
        {
            "scene_number": 2,
            "scene_title": "The Objective",
            "setup": "The Council gathers. Francisco circles a location on the map. 'The Keystone.' He explains its value. It's not just a treasure; it's a stabilizer. 'If we have this, we control the loops.'",
            "symbolism": "The Bullseye.",
            "beat_goal": "The Target. Defining success.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Ambition",
            "scene_tone": "Strategic",
            "timeline_date": "Noon",
            "timeline_variant": "Sanctuary",
            "location": "Map Room",
            "narrative_function": "The quest definition.",
            "sudowrite_visual_details": [
                "The charcoal circle on the parchment.",
                "The intent eyes of the council.",
                "The finger tracing the route."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Plan",
            "setup": "Breaking it down. Logistics. Who goes? Who stays? Consumables needed. It's boring, unglamorous work, but it's 'Goal Setting.' The Page of Disks thrives here. Francisco delegates (trusting the Order).",
            "symbolism": "The List. The Coin (Disks).",
            "beat_goal": "The Logistics. Making it real.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Trust",
            "scene_tone": "Practical",
            "timeline_date": "Afternoon",
            "timeline_variant": "Sanctuary",
            "location": "Map Room",
            "narrative_function": "The Process.",
            "learning_objective_integration": "Reflects 'Measure What Matters'—OKRs."
        },
        {
            "scene_number": 4,
            "scene_title": "The Commitment",
            "setup": "The plan is set. The sun is setting. Francisco hands the Scribe the quill. 'Write it down. It is law.' They have a path. The uncertainty of the 'Removal' period is gone. They are moving.",
            "symbolism": "The Sealed Scroll.",
            "beat_goal": "The Launch. Committing to action.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Determination",
            "scene_tone": "Resolute",
            "timeline_date": "Sunset",
            "timeline_variant": "Sanctuary",
            "location": "Map Room",
            "narrative_function": "The End of Part 1 (of the book structure).",
            "sudowrite_character_moments": [
                "The ink drying.",
                "The nod exchange.",
                "The deep breath before the plunge."
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
    update_ea094()
