
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea084():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-084
    target_id = "EA-084"
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
    stg_found["save_the_cat_beat_goal"] = "Experience the 'Trauma' (Five of Cups) of Gherardo's jealousy, acting as the catalyst that severs Francisco's last tie to home."
    stg_found["plot"] = "The Catalyst: Francisco returns home to pack. Gherardo is there. He found the 'Seed' (Ace of Disks fragment) Francisco hid. He senses the power. He attacks Francisco, not with magic, but with words and then a knife. The betrayal. The Five of Cups: spilt wine/blood. Francisco disarms him but is wounded deep in his soul."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Exile. He realizes he has no family left. The 'Trauma' hardens him.",
        "Gherardo": "The Cain figure. Jealousy consumes him. He becomes the recurring antagonist.",
        "The_Petrarch_Family": "Shattered by this event."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "family_fallout": "Why Francisco never goes home again.",
        "origin_of_villainy": "Gherardo's descent starts here."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_petrarch_library": "Where the fight happens. Books (knowledge) overturned.",
        "the_rainy_street": "Where Francisco flees to."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_brother_war": "This fights echoes until the finale of the series.",
        "the_scar": "Francisco keeps the physical scar from this night."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco enters his family home. Gherardo is waiting in the dark. He holds the Ace fragment. 'You kept this for yourself.' The accusation. The Rage. Gherardo lashes out. A physical brawl. A vase is smashed (Five of Cups imagery). Gherardo tries to stab him. Francisco uses magic to stop him—forcefully. Gherardo looks at him with pure hate. 'Monster.' Francisco realizes the bridge is burned. He looks at the three spilt cups (relationship destroyed) but takes the two standing (his mission and Novella). He leaves the house forever."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Heartbreak",
    stg_found["scene_tone"] = "Violent/Tragic"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Confrontation",
            "setup": "The library. Gherardo is drunk on wine and jealousy. He has been watching Francisco 'shine' (EA-081) and feeling his own shadow. He confronts Francisco. 'You think you are better than us.'",
            "symbolism": "Cain and Abel. The Shadow Self.",
            "beat_goal": "The Conflict. The verbal attack.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Shock",
            "scene_tone": "Tense",
            "timeline_date": "0300 Hours",
            "timeline_variant": "Petrarch Home",
            "location": "Library",
            "narrative_function": "The Escalation.",
            "learning_objective_integration": "Reflects 'The Body Keeps the Score'—trauma enacted."
        },
        {
            "scene_number": 2,
            "scene_title": "The Spilled Cup",
            "setup": "Gherardo throws the wine glass. It shatters. Red wine stains the rug (blood). He lunges. The physical fight. It is messy, ugly. Brothers fighting. Francisco refuses to use magic until Gherardo pulls a knife.",
            "symbolism": "The Five of Cups (3 spilled). The breaking of the bond.",
            "beat_goal": "The Violence. The physical attack.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Horror",
            "scene_tone": "Visceral",
            "timeline_date": "0310 Hours",
            "timeline_variant": "Petrarch Home",
            "location": "Library",
            "narrative_function": "The Breaking Point.",
            "sudowrite_visual_details": [
                "The smell of spilled wine.",
                "The glint of the letter opener.",
                "Gherardo's dilated pupils."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Wound",
            "setup": "Francisco catches the blade with a kinetic shield, but it knicks his palm. He pushes Gherardo back with a blast of air. Gherardo hits the wall. Silence. Francisco looks at his bleeding hand. Gherardo looks at him with terror and hate. 'Demon.'",
            "symbolism": "The Mark. The Stigma. The separation.",
            "beat_goal": "The Climax (of the scene). The magic used against family.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Guilt",
            "scene_tone": "Tragic",
            "timeline_date": "0315 Hours",
            "timeline_variant": "Petrarch Home",
            "location": "Library",
            "narrative_function": "The Change.",
            "learning_objective_integration": "Reflects 'Rising Strong'—the reckoning."
        },
        {
            "scene_number": 4,
            "scene_title": "The Departure",
            "setup": "Francisco grabs his bag. He steps over the broken glass. He looks back once. Gherardo is sobbing on the floor. Francisco walks out into the rain. He has lost his past. He is officially the Magus now. Solemnly, he heads to the Colonna Palace to begin his double life.",
            "symbolism": "The Exile. The Rain washing away the past.",
            "beat_goal": "Resolution. Transition to Colonna.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Grim acceptance",
            "scene_tone": "Noir",
            "timeline_date": "0330 Hours",
            "timeline_variant": "The Street",
            "location": "Outside the Home",
            "narrative_function": "The End of the Beginning.",
            "sudowrite_character_moments": [
                "The rain mixing with the blood on his hand.",
                "The sound of the door closing forever.",
                "Francisco pulling his hood up."
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
    update_ea084()
