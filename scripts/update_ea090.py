
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea090():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-090
    target_id = "EA-090"
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
    stg_found["save_the_cat_beat_goal"] = "Execute the 'Removal' (Three of Swords) of non-essential elements, forcing a painful separation to ensure the survival of the mission."
    stg_found["plot"] = "Pressure: The Sanctuary is overrun. Supplies are critical. Francisco faces the 'Three of Swords'—heartbreak born of necessity. To continue the fight, he must send the non-combatant refugees away to a distant (safer but poorer) convent. He strips the mission down to its essential core. It feels like abandonment, but it is survival."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Pruner. He learns that leadership means making unpopular, painful choices.",
        "Refugee_Mother": "Represents the people he is 'abandoning.' Her disappointment cuts him.",
        "La_Signora": "Supports the logic, but mourns the loss of community."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "logistics_of_war": "Explaining how a small rebel group feeds itself.",
        "moral_cost": "Francisco isn't just a hero; he's a general making sacrifices."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_sanctuary_courtyard": "Crowded, noisy, desperate.",
        "the_river_docks": "The point of separation."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_exiles": "The group he sends away returns in Book 8 to help him."
    }
    
    # Update Summary
    stg_found["summary"] = "The Sanctuary is at breaking point. Arguments break out over food. Francisco consults with La Signora: 'We can't sustain this.' He decides to implement 'Removal' (Essentialism). He gathers the group. He speaks hard truths. The Three of Swords pierces the heart of the community. He separates the fighters/scholars from the families. He arranges transport for the families to a neutral convent. The goodbyes are tearful. He stands on the dock, watching them leave, feeling the weight of the sword in his own heart. He is left with a lean, mean, fighting force."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Guilt",
    stg_found["scene_tone"] = "Melancholy/Stern"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Overcrowding",
            "setup": "Sanctuary mess hall. Loud. A fight breaks out over a piece of bread. Francisco intervenes. The noise is overwhelming. He can't hear himself think (or the timeline). He realizes the clutter is dangerous.",
            "symbolism": "The Noise. The Choking Weeds.",
            "beat_goal": "The Problem. Identifying the unsustainable state.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Frustration",
            "scene_tone": "Chaotic",
            "timeline_date": "Noon",
            "timeline_variant": "Sanctuary",
            "location": "Mess Hall",
            "narrative_function": "The Pressure Cooker.",
            "learning_objective_integration": "Reflects 'Essentialism'—the cost of 'non-essential'."
        },
        {
            "scene_number": 2,
            "scene_title": "The Hard Choice",
            "setup": "Francisco's study. Quiet. La Signora shows the ledger. 'We have food for three days.' If they keep everyone, everyone starves. If they cut the group, the core survives. Francisco stares at the Three of Swords card on his desk.",
            "symbolism": "The Ledger. The Sword.",
            "beat_goal": "The Decision. Logic vs Emotion.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Resolve",
            "scene_tone": "Cold",
            "timeline_date": "Afternoon",
            "timeline_variant": "Sanctuary",
            "location": "Study",
            "narrative_function": "The Choice.",
            "sudowrite_visual_details": [
                "The red ink in the ledger.",
                "The dust dancing in the light beam.",
                "Francisco's clenched jaw."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Announcement",
            "setup": "Courtyard. Rain. Francisco stands on a crate. He announces the plan. The families will go to Santa Lucia. The fighters will stay. The reaction is shock, then anger, then sadness. The 'Heartbreak' of the Three of Swords.",
            "symbolism": "The Rain (Tears). The Separation.",
            "beat_goal": "The Action. Delivering the bad news.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Pain",
            "scene_tone": "Tragic",
            "timeline_date": "Evening",
            "timeline_variant": "Sanctuary",
            "location": "Courtyard",
            "narrative_function": "The Climax (Emotional).",
            "learning_objective_integration": "Reflects 'The Life-Changing Magic'—discarding with gratitude."
        },
        {
            "scene_number": 4,
            "scene_title": "The Silence",
            "setup": "The boats are gone. The Sanctuary is empty, quiet. Just the 12 core members left. It feels huge and echoing. Francisco sits alone. He has 'cleared the clutter,' but it hurts. La Signora puts a hand on his shoulder. 'Now we can work,' she says.",
            "symbolism": "The Empty Room. Clarity cost.",
            "beat_goal": "Resolution. The new status quo.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Hollow",
            "scene_tone": "Quiet",
            "timeline_date": "Night",
            "timeline_variant": "Sanctuary",
            "location": "Main Hall",
            "narrative_function": "The Bridge to Ch 11.",
            "sudowrite_character_moments": [
                "The echo of his own footsteps.",
                "The smell of rain.",
                "The realization of the space available."
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
    update_ea090()
