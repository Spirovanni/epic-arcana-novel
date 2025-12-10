import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea062():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-062
    target_id = "EA-062"
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
    stg_found["save_the_cat_beat_goal"] = "Assess the damage and the remaining resources. Seven of Disks: A pause to evaluate the harvest before continuing."
    stg_found["plot"] = "The Reward: Not gold, but clarity. They realize they cannot do everything. They must choose what to save and what to let go."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Demonstrates the Seven of Disks/Stones: calm assessment. He stops trying to be the hero who saves everyone and becomes the strategist who saves the mission.",
        "Novella": "Struggles with the 'pruning' of sentimental projects, representing the emotional cost of efficiency.",
        "La_Signora": "Validates Francisco's ruthlessness, seeing it as the necessary maturity of a leader."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "strategic_pivot": "Explains why the Alliance shifts tactics from broad recruitment to focused strikes.",
        "resource_management": "Shows the logistical limits of the Sanctuary.",
        "leadership_growth": "Moving from 'addition' (doing more) to 'subtraction' (doing less, better)."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_war_room": "Filled with maps and resource charts. The atmosphere is tense but focused.",
        "the_archives": "Where the 'Heritage Project' is stored, now dark to save power."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "focus_theme": "The decision to focus on the 'Unity Project' directly enables the endgame of Book 2.",
        "sacrificial_leadership": " foreshadows heavier sacrifices in Book 3."
    }
    
    # Update Summary
    stg_found["summary"] = "The dust has settled. Now comes the accounting. Francisco reviews the resource manifests. The battle with Dagon consumed 60% of their raw timeline-matter. They cannot sustain their current operations. He calls a meeting not to rally the troops, but to cut them. The Seven of Disks governs this moment: unstoppably honest assessment. He shuts down the 'Heritage Project' (preserving lost art) to prioritize the 'Shield Generator'. Novella hates it. Francisco hates it. But he does it. The Reward is not happiness; it is the ability to survive the next winter."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Grim clarity"
    stg_found["scene_tone"] = "Quiet and clinical"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Inventory",
            "setup": "Francisco stands in the warehouse. It's half empty. The Quartermaster reads the list: food for 3 weeks, power for 2. The victory feels hollow when looked at through a spreadsheet. This is the Seven of Disks moment—looking at the tree and seeing not enough fruit. He realizes they can't go back to normal. 'Normal' is too expensive.",
            "symbolism": "The Empty Granary. The Ledger. The truth of numbers.",
            "beat_goal": "Establish the constraint. Victory didn't fix the logistics.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Sober realization",
            "scene_tone": "Cold and echoey",
            "timeline_date": "Post-Book 1 + 18 weeks",
            "timeline_variant": "Sanctuary Supply Depot",
            "location": "The Warehouse",
            "narrative_function": "The Reality Check.",
            "sudowrite_visual_details": [
                "Dust motes dancing in the empty space.",
                "The Quartermaster's red pen scratching the paper.",
                "Francisco's breath fogging in the cold air."
            ]
        },
        {
            "scene_number": 2,
            "scene_title": "Opportunity Cost",
            "setup": "The Council table. Three projects on the board: 1. Rescue the lost scouts (Novella's choice). 2. Repair the Library (The Scholars' choice). 3. Upgrade the Shield (Francisco's instinct). They only have power for one. The debate is heated. This isn't good vs. evil; it's good vs. playing the long game. Francisco realizes that saying 'Yes' to the Shield means saying 'No' to the scouts. It's a trolley problem.",
            "symbolism": "The Crossroads. The Scales. The weight of the crown.",
            "beat_goal": "The Conflict. Values vs. Survival.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Frustrated responsibility",
            "scene_tone": "Tense debate",
            "timeline_date": "Post-Book 1 + 18 weeks",
            "timeline_variant": "Sanctuary HQ",
            "location": "The War Room",
            "narrative_function": "The Choice.",
            "learning_objective_integration": "Demonstrates 'Opportunity Cost'—every choice has a price."
        },
        {
            "scene_number": 3,
            "scene_title": "Pruning",
            "setup": "Francisco goes to the Archives to tell the Scholars they are being shut down. It breaks his heart—he loves the history. But the Shield is vital. An old actuary, 'The Gardener', stops him. 'Do not apologize, Francisco. A tree that isn't pruned dies.' He gives Francisco the keys. It's permission to be the bad guy for the greater good. Francisco turns off the lights. The history goes dark so the future can have light.",
            "symbolism": "The Pruning Shears. Darkness for the sake of Light. 'Killing the darling'.",
            "beat_goal": "The Action. Making the hard call.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Melancholy resolve",
            "scene_tone": "Bittersweet",
            "timeline_date": "Post-Book 1 + 18 weeks",
            "timeline_variant": "Sanctuary Archives",
            "location": "The Archives",
            "narrative_function": "The Sacrifice.",
            "learning_objective_integration": "Reflects 'Essentialism'—less but better."
        },
        {
            "scene_number": 4,
            "scene_title": "The Pivot",
            "setup": "The announcement is made. Some people are angry. Some are relieved someone finally made a decision. The energy grid re-routes. The Shield hums to life, stronger than before. Francisco watches the monitor. He feels older. Novella stands next to him. 'I hate it,' she says. 'I know,' he replies. 'But we're safe.' They stand in the blue glow, separated by the choice but united by the survival.",
            "symbolism": "The Blue Light. The 'New Course' locked in. The distance between 'Right' and 'Necessary'.",
            "beat_goal": "Resolution. The path is set.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Grim satisfaction",
            "scene_tone": "Technological and cold",
            "timeline_date": "Post-Book 1 + 18 weeks",
            "timeline_variant": "Operations Deck",
            "location": "The Shield Control",
            "narrative_function": "The Commitment.",
            "sudowrite_character_moments": [
                " The blue reflection in Novella's angry eyes.",
                "Francisco's hand hovering over the console.",
                "The steady rhythm of the new pulse."
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
    update_ea062()
