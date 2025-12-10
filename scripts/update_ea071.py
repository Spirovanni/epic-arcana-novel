
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea071():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-071
    target_id = "EA-071"
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
    stg_found["save_the_cat_beat_goal"] = "Secure the 'Ultimate Boon' by establishing a 'Legacy' system that ensures the survival of the timeline beyond the current battle."
    stg_found["plot"] = "The Ultimate Boon (Part 2): With the physical base rebuilt (EA-070), Francisco turns to the political and structural. He realizes 'Valor' isn't enough; they need 'Sustainability' (Ten of Disks)."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Shifts from 'Commander' to 'Founder'. He stops micromanaging and starts building institutions.",
        "The_New_Council": "A representative body formed from the various factions (Venetians, Alexandrians, etc.).",
        "The_Next_Generation": "Younger recruits who look at Francisco as a mythic figure, which makes him uncomfortable."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "governance_structure": "Explains how the group makes decisions without Francisco dictating everything.",
        "long_term_viability": "Shows how they plan to eat/survive for the next year, not just the next day."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_archive": "A new room dedicated to storing the knowledge of the lost timelines.",
        "the_round_table": "The physical symbol of shared power."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_codex": "The rules written here are referenced in Book 5 during the civil war.",
        "franciscos_legacy": "Sets up the theme of his eventual absence/martyrdom."
    }
    
    # Update Summary
    stg_found["summary"] = "The walls are strong (EA-070), but the society is fragile. Factions are bickering over resources. Francisco realizes his 'Great Man' leadership style is a single point of failure. He needs 'Legacy'. He convenes the first Council. He proposes a constitution. It is boring work compared to fighting, but vital. He faces resistance from those who want him to be a King. He refuses. 'Kings die. Systems last.' He embodies the Ten of Disks—wealth, stability, and inheritance. He creates the 'Flywheel' of governance."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Paternal foresight"
    stg_found["scene_tone"] = "Constructive and political"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Friction",
            "setup": "A dispute breaks out in the mess hall between a Venetian and a Spartan over rations. Francisco breaks it up, but he sees the problem. They are a collection of refugees, not a society. Relying on his charisma to keep the peace is unsustainable. He reads 'Good to Great'. He needs to build a 'Clock', not just be a 'Time Teller'.",
            "symbolism": "The Brawl. The ticking clock. The exhaustion of the leader.",
            "beat_goal": "Identify the structural weakness. The realization that 'Heroism' doesn't scale.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Frustrated insight",
            "scene_tone": "Tense",
            "timeline_date": "Post-Siege + 1 week",
            "timeline_variant": "Mess Hall",
            "location": "The Mess Hall",
            "narrative_function": "The problem statement.",
            "learning_objective_integration": "Demonstrates 'Good to Great'—building a Level 5 Leadership system."
        },
        {
            "scene_number": 2,
            "scene_title": "The Proposal",
            "setup": "Francisco drafts the 'Charter of the Redoubt'. It distributes power. He calls a meeting. He puts the Ten of Disks (Legacy) on the table. He offers the 'Crown' to the law, not himself. The allies are confused. 'You saved us. You should rule.' Francisco explains: 'If I rule, when I die, you die. If the Law rules, we live forever.' He uses the 'Long Game' logic.",
            "symbolism": "Magna Carta. The abdication of absolute power for the sake of stability. The Ten of Disks (family/inheritance).",
            "beat_goal": "The Debate. Convincing the team to accept responsibility.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Persuasive",
            "scene_tone": "Parliamentary",
            "timeline_date": "Post-Siege + 8 days",
            "timeline_variant": "Council Room",
            "location": "Council Room",
            "narrative_function": "The Solution.",
            "sudowrite_visual_details": [
                "The parchment map of the timeline.",
                "Francisco sitting *at* the table, not at the head.",
                "The skeptical faces slowly nodding."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Flywheel",
            "setup": "The new system is implemented. It's clunky at first. Committees, votes, debates. Francisco hates it. He wants to just order things done. But he forces himself to respect the process (Sharpen the Saw). Slowly, it starts to work. A logistics issue is solved without him even knowing about it. The 'Flywheel' turns. Momentum builds. The base starts to hum with self-organized efficiency.",
            "symbolism": "The heavy wheel starting to turn. The shift from 'Manic Energy' to 'Stored Power'.",
            "beat_goal": "Validation. The system works.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Relief",
            "scene_tone": "Productive",
            "timeline_date": "Post-Siege + 2 weeks",
            "timeline_variant": "The Redoubt",
            "location": "Operations Center",
            "narrative_function": "The Growth.",
            "learning_objective_integration": "Reflects 'The Flywheel Effect'—cumulative effort."
        },
        {
            "scene_number": 4,
            "scene_title": "The Archive",
            "setup": "Francisco visits the new Archive. Scribes are recording the stories of the lost timelines. He sees a child reading about the 'Siege'. He realizes he is becoming a 'Legacy'. It frightens him, but also gives him peace. He has built something that can outlast Dagon. He touches the Ten of Disks. He has secured the 'Ultimate Boon'—not just survival, but history.",
            "symbolism": "The Book. The Child. The contrast between the ephemeral battle and the eternal story.",
            "beat_goal": "Resolution. The Legacy is secured.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Melancholy pride",
            "scene_tone": "Quiet and vast",
            "timeline_date": "Post-Siege + 3 weeks",
            "timeline_variant": "The Archive",
            "location": "The Archive",
            "narrative_function": "The Anchor.",
            "sudowrite_character_moments": [
                "The smell of old paper and new ink.",
                "Francisco reading his own name in a history book.",
                "The realization that he is no longer just a man, but a symbol."
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
    update_ea071()
