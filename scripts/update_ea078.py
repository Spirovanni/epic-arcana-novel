
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea078():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-078
    target_id = "EA-078"
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
    stg_found["save_the_cat_beat_goal"] = "Sustain the defense against the siege using 'Energy' (The Emperor) to buy time for the rescue."
    stg_found["plot"] = "Rescue from Without (Part 3): The Hunter is destroyed, but it was just a scout. The enemy main force arrives. They lay siege. The team is exhausted. Francisco channels The Emperor—pure endurance. He teaches them 'The Power of Full Engagement'—managing energy, not time."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Embodies 'The Emperor'. The unshakeable pillar. He cannot break, so he doesn't.",
        "Novella": "Reaches her limit and learns to rest strategically.",
        "The_Defenders": "Draw strength from Francisco's presence."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "limits_of_heroism": "Shows the physical toll of the previous chapters.",
        "leadership_by_example": "Francisco does the hardest watch himself."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_forward_post": "A lonely spot where Francisco stands guard.",
        "the_sleep_bunker": "Where the team recharges."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_emperor_state": "This state of hyper-focus is dangerous and addictive; explored in Book 4.",
        "the_siege_mentality": "Preparing them for the long war ahead."
    }
    
    # Update Summary
    stg_found["summary"] = "The Hunter's destruction attracts the swarm. Thousands of drones. They don't attack all at once; they harass. They deny sleep. It is a siege of exhaustion. The team is breaking. Francisco takes the 'Emperor' stance. He organizes shift sleeping. He takes the double watch. He stands on the wall, a statue of will. He manages his internal energy to stay awake for 48 hours. He becomes the battery for the entire group. When he finally sleeps, the others fight harder to protect *him*."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Grim endurance"
    stg_found["scene_tone"] = "Exhausting"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Siege",
            "setup": "The Drones arrive. A cloud of metal insects. They dive-bomb at random intervals. No one can sleep. Nerves are fraying. A soldier shoots at a shadow. Francisco sees the strategy: 'They are trying to break our minds before they take our bodies.'",
            "symbolism": "The Mosquitoes. The dripping tap. The erosion of will.",
            "beat_goal": "The Pressure. Establishing the new threat level.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Weariness",
            "scene_tone": "Oppressive",
            "timeline_date": "Post-Crash + 8 days",
            "timeline_variant": "The Wall",
            "location": "Base Zero",
            "narrative_function": "The Test of Endurance.",
            "learning_objective_integration": "Reflects 'The Power of Full Engagement'—energy management."
        },
        {
            "scene_number": 2,
            "scene_title": "The Energy Audit",
            "setup": "Francisco pulls the team off the line. 'You are useless like this.' He force-feeds them rations. He orders mandatory sleep. 'But they will attack!' 'Let them. I have the wall.' He teaches them to pulse their energy—intense focus followed by deep recovery. He takes the burden.",
            "symbolism": "The Emperor on the Throne. The Father protecting the children.",
            "beat_goal": "The Strategy. Prioritizing recovery.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Protective",
            "scene_tone": "Quiet",
            "timeline_date": "Night",
            "timeline_variant": "The Bunker",
            "location": "Base Zero",
            "narrative_function": "The Sacrifice.",
            "sudowrite_visual_details": [
                "The dark circles under Novella's eyes.",
                "Francisco checking his weapon, his hands steady.",
                "The sound of breathing in the bunker."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Emperor's Stand",
            "setup": "Francisco is alone on the wall. The drones come. He shoots them down. One by one. Hour after hour. He enters a trance state. No fear, no fatigue, just action. He is The Emperor—order imposed on chaos. He holds the line through the darkest part of the night. He is the lighthouse.",
            "symbolism": "The Stone Statue. The Unblinking Eye. The Force of Will.",
            "beat_goal": "The Climax (of endurance). Surviving the night.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Transcendence",
            "scene_tone": "Hypnotic",
            "timeline_date": "0300 Hours",
            "timeline_variant": "The Wall",
            "location": "Base Zero",
            "narrative_function": "The Feat.",
            "learning_objective_integration": "Demonstrates 'Willpower'—depletion and renewal."
        },
        {
            "scene_number": 4,
            "scene_title": "The Renewal",
            "setup": "Dawn. The team wakes up. They are rested. They rush to the wall. Francisco is still there, surrounded by smoking drone shells. He turns. He smiles. And then he collapses. Not dead, just empty. Novella catches him. 'We have it now,' she says. The team takes the wall, energized by his sacrifice. They are ready for the finale.",
            "symbolism": "The Changing of the Guard. The Resurrection.",
            "beat_goal": "Resolution. The team is restored.",
            "pov": "3rd Person Limited (Novella)",
            "tense": "Past Tense",
            "core_emotion": "Gratitude",
            "scene_tone": "Inspiring",
            "timeline_date": "Dawn",
            "timeline_variant": "The Wall",
            "location": "Base Zero",
            "narrative_function": "The Handoff.",
            "sudowrite_character_moments": [
                "Novella catching Francisco's weight.",
                "The light returning to the soldiers' eyes.",
                "The sun breaking through the purple clouds."
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
    update_ea078()
