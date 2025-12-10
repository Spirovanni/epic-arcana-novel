
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea092():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-092
    target_id = "EA-092"
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
    stg_found["save_the_cat_beat_goal"] = "Show 'Abundance' (Three of Cups) by capturing resources and celebrating with the community, cementing the bonds of the team."
    stg_found["plot"] = "Allies/Fun and Games: The scroll from EA-091 reveals a supply route. Francisco leads a raid (the 'Courage' pays off). They capture the wagons without killing (Win-Win). They bring the food back to the Sanctuary. The mood shifts from grim survival to 'Abundance.' They feast. The Three of Cups—toasts, friendship, shared joy. Francisco sees that his 'Removal' decision (EA-090) saved the core, and now 'Abundance' feeds them."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Provider. He sees his people happy for the first time.",
        "The_Twin_Scholars": "Provide comic relief and camaraderie.",
        "La_Signora": "Relaxes her guard, showing her warmer side."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "morale": "Refilling the 'emotional tank' of the group.",
        "team_dynamics": "Showing why these people follow Francisco."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_forest_road": "Site of the ambush.",
        "the_sanctuary_hall": "Site of the feast."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_toast": "A specific toast is recalled in the final book before the end."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco uses the intel to intercept a Vatican convoy. The raid is executed perfectly (showing team competence). They return with wagons of grain, wine, and cloth. The Sanctuary is filled with laughter. They hold a feast. Francisco sits at the head of the table. Three of Cups: Connection, Celebration, Community. He realizes that this—this joy—is what he is fighting for. Not just survival, but life."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Joy",
    stg_found["scene_tone"] = "Warm/Celebratory"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Ambush",
            "setup": "Forest Road. The team is in position. Francisco signals. It's not a battle; it's a surgical strike. They disable the wheels. They disarm the guards. 'Go home,' Francisco tells the guards. 'Tell your Bishop we thank him for the donation.'",
            "symbolism": "The Harvest. Reaping rewards.",
            "beat_goal": "The Victory. Securing abundance.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Competence",
            "scene_tone": "Action/Light",
            "timeline_date": "Day",
            "timeline_variant": "Forest",
            "location": "Road",
            "narrative_function": "The Win.",
            "learning_objective_integration": "Reflects '7 Habits'—Win/Win thinking."
        },
        {
            "scene_number": 2,
            "scene_title": "The Return",
            "setup": "Rolling the wagons into the Sanctuary. The cheers of the 12. Unloading the casks. The smell of bread baking. Francisco feels the tension of EA-090 melting away.",
            "symbolism": "The Full Cup.",
            "beat_goal": "The Relief. tangible rewards.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Validaton",
            "scene_tone": "Happy",
            "timeline_date": "Evening",
            "timeline_variant": "Sanctuary",
            "location": "Courtyard",
            "narrative_function": "The Setup for the Party.",
            "sudowrite_visual_details": [
                "The golden crust of the bread.",
                "The red wine pouring.",
                "The firelight on smiling faces."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Toast",
            "setup": "The Feast. Francisco stands up. He raises his cup (Three of Cups). He looks at his 'Essential' team. 'To those we lost, and those we found.' They drink. Bonds are forged here that will last until death.",
            "symbolism": "The Three of Cups (Community).",
            "beat_goal": "The Connection. Solidifying the team.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Love",
            "scene_tone": "Warm",
            "timeline_date": "Night",
            "timeline_variant": "Sanctuary",
            "location": "Mess Hall",
            "narrative_function": "The Midpoint High.",
            "learning_objective_integration": "Reflects 'The Abundance Book'—gratitude."
        },
        {
            "scene_number": 4,
            "scene_title": "The Aftermath",
            "setup": "Late night. The fire is dying. Francisco and the Twin Scholars look at the stars. They talk about the future, not with fear (as in EA-086) but with hope. 'We can actually do this,' Francisco whispers.",
            "symbolism": "The Stars. Limitless possibility.",
            "beat_goal": "The Hope. Forward momentum.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Peace",
            "scene_tone": "Quiet",
            "timeline_date": "Late Night",
            "timeline_variant": "Sanctuary",
            "location": "Roof",
            "narrative_function": "The Bridge to Ch 13.",
            "sudowrite_character_moments": [
                "The laughter fading into silence.",
                "The vastness of the sky.",
                "Francisco smiling without forcing it."
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
    update_ea092()
