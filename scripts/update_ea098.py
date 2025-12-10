
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea098():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-098
    target_id = "EA-098"
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
    stg_found["save_the_cat_beat_goal"] = "Demonstrate extreme 'Focus' (Ace of Swords) as Francisco's obsession with the Keystone alienates his team."
    stg_found["plot"] = "Bad Guys Close In (Internal): The victory of EA-097 turns sour. Francisco locks himself in his study to design the 'Extraction Spell.' This is the Ace of Swords—pure, cutting intellect. He stops eating. He ignores the Refugee Mother's plea for help with food supplies. He snaps at La Signora. 'Focus' becomes 'Obsession.' He solves the magical problem, but the social cost is high. The Order feels abandoned by their leader."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Ace. Sharp, cold, singular. He is losing his humanity.",
        "La_Signora": "The Voice of Reason. Ignored.",
        "Refugee_Mother": "Collateral damage of his neglect."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "magical_cost": "Shows that high-level magic requires dangerous mental states.",
        "team_friction": "The honeymoon period (EA-092) is over."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "franciscos_study": "Locked. Dark. Covered in equations.",
        "the_mess_hall": "Where the others gather, worried."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_extraction_spell": "Used here, but has a flaw that bites them later."
    }
    
    # Update Summary
    stg_found["summary"] = "Days pass. Francisco is a ghost. The Ace of Swords demands total clarify. He achieves 'Deep Work,' but it is toxic. He figures out how to bypass the Keystone's ward. La Signora breaks down his door. 'We are starving,' she says (metaphorically and literally). He looks at her with cold eyes. 'I am saving the world. Eat less.' It is a shocking moment of cruelty born of 'Focus.' He has the spell, but he may have lost the people."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Obsession",
    stg_found["scene_tone"] = "Cold/Clinical"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Shut In",
            "setup": "Francisco slams the door. 'Disturb me and we fail.' He begins the calculations. The Ace of Swords—cutting away the noise. The noise is his friends.",
            "symbolism": "The Locked Door. The Knife.",
            "beat_goal": "The Withdrawal. Entering the deep state.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Detachment",
            "scene_tone": "Claustrophobic",
            "timeline_date": "Day 1",
            "timeline_variant": "Study",
            "location": "Quarters",
            "narrative_function": "The Shift (Negative).",
            "learning_objective_integration": "Reflects 'Deep Work'—but the dark side."
        },
        {
            "scene_number": 2,
            "scene_title": "The Interruption",
            "setup": "A novice knocks. 'Master, the scouts...' Francisco blasts the door with a silencing ward. He doesn't even answer. He is tracing a complex rune. A mistake means death.",
            "symbolism": "The Silence.",
            "beat_goal": "The Rejection. Choosing work over people.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Annoyance",
            "scene_tone": "Hostile",
            "timeline_date": "Day 2",
            "timeline_variant": "Study",
            "location": "Quarters",
            "narrative_function": "Escalation.",
            "sudowrite_visual_details": [
                "The dark circles under his eyes.",
                "The ink stains on his fingers.",
                "The uneaten tray of food."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Breakdown",
            "setup": "La Signora enters (she has a key). She sees his state. 'This is not Focus, Francisco. This is madness.' He holds up the parchment. 'It is done.' He expects praise. She gives him pity. 'At what cost?'",
            "symbolism": "The Completed Equation.",
            "beat_goal": "The Confrontation. Reality check.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Confusion",
            "scene_tone": "Dramatic",
            "timeline_date": "Day 3",
            "timeline_variant": "Study",
            "location": "Quarters",
            "narrative_function": "The Climax (Interpersonal).",
            "learning_objective_integration": "Reflects 'The One Thing'—ignoring everything else."
        },
        {
            "scene_number": 4,
            "scene_title": "The Cold Truth",
            "setup": "He emerges. He gives the spell to the Scribe. 'Prepare the ritual.' He walks past the others without a word. He is a weapon now (Ace of Swords). The team follows, but the warmth of EA-092 is gone.",
            "symbolism": "The Machine.",
            "beat_goal": "Resolution. The tool is ready.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Numbness",
            "scene_tone": "Chilling",
            "timeline_date": "Evening",
            "timeline_variant": "Sanctuary",
            "location": "Hallway",
            "narrative_function": "The Setup for Finale.",
            "sudowrite_character_moments": [
                "The stiff set of his shoulders.",
                "The averted eyes of the novices.",
                "The wind blowing cold."
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
    update_ea098()
