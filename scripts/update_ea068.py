
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea068():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-068
    target_id = "EA-068"
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
    stg_found["save_the_cat_beat_goal"] = "Operationalize the 'Wild Idea' from EA-067 using 'Methodical' precision to survive the 'Dark Night of the Soul'."
    stg_found["plot"] = "The Abyss: The idea is approved, but the execution is impossible. Francisco must become the King of Swords—ruthlessly logical—to break the plan into 1000 executable steps. The 'Checklist' saves them."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Integrates the 'King of Swords'. Becomes a master of logistics and detail, balancing his 'Wands' passion.",
        "The_Engineer": "Works side-by-side with Francisco, their relationship evolving from subordinate to partner.",
        "The_Chaos": "Replaced by Order."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "execution_gap": "Shows *how* they do the magic, not just that they do it.",
        "team_coordination": "Illustrates how a ragtag group acts as a disciplined unit."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_assembly_floor": "The physical space where the device is being built.",
        "the_whiteboard": "The focal point of the chapter; a wall of tasks."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "standard_operating_procedures": "The protocols invented here become the bible for the resistance.",
        "future_tech": "The device built here is a prototype for the final weapon."
    }
    
    # Update Summary
    stg_found["summary"] = "The 'Wild Idea' is go. Now comes the hard part. The device needs to be built in 4 hours using scrap parts. Francisco creates a 'Checklist Manifesto' environment. He breaks the impossible task into micro-tasks. He assigns teams. He removes bottlenecks. He is 'Methodical' (King of Swords). There is no drama, no speeches—just the grinding, beautiful noise of competence. They hit a snag; a missing component. Instead of panicking, they 'slow down to speed up' (Thinking, Fast and Slow). They find a logical workaround. The device is finished with seconds to spare."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Cold focus"
    stg_found["scene_tone"] = "Industrial and rhythmic"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Breakdown",
            "setup": "The Engineer is overwhelmed. 'It's too much.' Francisco steps in. He wipes the whiteboard. He draws a line. 'Step 1: Coolant. Step 2: Coupling.' He forces the panic into a structure. He creates the 'Checklist'. He gives the team permission to focus only on their one bolt, their one wire. The room calms down. The 'King of Swords' cuts through the noise.",
            "symbolism": "The Grid. The Scalpel. The shifting of the mental load from 'All' to 'One Thing'.",
            "beat_goal": "Establish the System. Turn chaos into a project plan.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Calculating",
            "scene_tone": "Clinical",
            "timeline_date": "Post-Siege + 10.5 hours",
            "timeline_variant": "Assembly Floor",
            "location": "Assembly Floor",
            "narrative_function": "The Strategy.",
            "sudowrite_visual_details": [
                "The squeak of the marker on the board.",
                "The synchronized movement of the mechanics.",
                "The countdown clock ticking silently."
            ],
            "learning_objective_integration": "Demonstrates 'The Checklist Manifesto'—cognitive offloading."
        },
        {
            "scene_number": 2,
            "scene_title": "The Grind",
            "setup": "Montage of the work. Sweat, sparks, but no shouting. Francisco walks the floor. He is not building; he is removing obstacles. A team runs out of flux. He teleports some from the armory. A dispute arises over torque settings. He adjudicates instantly. He is the 'System 2' thinking brain for the 'System 1' muscle of the team. It is efficient. It is 'Deep Work' in a war zone.",
            "symbolism": "The Machine. The cogs turning. The conductor of an orchestra of welders.",
            "beat_goal": "Show the progress. Validate the method.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Flow state",
            "scene_tone": "Rhythmic",
            "timeline_date": "Post-Siege + 12 hours",
            "timeline_variant": "Assembly Floor",
            "location": "Assembly Floor",
            "narrative_function": "The Rising Action.",
            "learning_objective_integration": "Reflects 'Deep Work'—intense concentration."
        },
        {
            "scene_number": 3,
            "scene_title": "The Snag",
            "setup": "90% complete. The primary coupler cracks. A groan goes through the room. The Engineer looks defeated. 'We don't have a spare.' Panic threatens to return. Francisco holds up a hand. 'Stop. Think.' He uses 'Thinking, Fast and Slow'. He forces them to slow down. 'What does the coupler *do*?' 'It bridges the charge.' 'What else bridges a charge?' Silence. Then: 'The stasis field coils on the transport.' 'Strip them.' The logic saves them, not luck.",
            "symbolism": "The Crack. The Pause. The 'King of Swords' weighing the options.",
            "beat_goal": "The Crisis. The Test of the Method.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Steel calm",
            "scene_tone": "Tense silence",
            "timeline_date": "Post-Siege + 13 hours",
            "timeline_variant": "Assembly Floor",
            "location": "Assembly Floor",
            "narrative_function": "The Complication.",
            "sudowrite_character_moments": [
                "Francisco's unblinking stare at the cracked part.",
                "The Engineer's hands shaking vs. Francisco's stillness."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "The Lock",
            "setup": "The new part is fitted. It holds. The device hums to life. The checklist is complete. Every box is ticked. Francisco puts the cap on the marker. He looks at the team. They are exhausted, filthy, but proud. They didn't just build a bomb; they built a process. The 'King of Swords' sheathes his blade. ' deploy it.'",
            "symbolism": "The Last Box Ticked. The hum of power. The shift from potential to kinetic.",
            "beat_goal": "Resolution. The weapon is ready. The Method worked.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Satisfied fatigue",
            "scene_tone": "Heavy and finalized",
            "timeline_date": "Post-Siege + 13.5 hours",
            "timeline_variant": "Assembly Floor",
            "location": "Assembly Floor",
            "narrative_function": "The Readying.",
            "learning_objective_integration": "Demonstrates 'The Art of Possibility'—finding the way."
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
    update_ea068()
