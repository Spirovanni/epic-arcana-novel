
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea091():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-091
    target_id = "EA-091"
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
    stg_found["save_the_cat_beat_goal"] = "Show 'Courage' (Seven of Swords style) by infiltrating a Vatican stronghold to steal vital intelligence."
    stg_found["plot"] = "Pinch: The 'Pinch' comes from the Vatican closing the net. Francisco needs to know their next move. He adopts the 'Seven of Swords' tactic—stealth and cunning over brute force. It takes immense 'Courage' to walk unarmed into the lion's den. He infiltrates the Cathedral Archives in Bologna (nearby). He acts alone (or with one other), relying on his wits."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Spy. Proving he can outsmart the Church, not just out-magic them.",
        "Captain_Reyes": "Vatican Guard Captain. The obstacle.",
        "Vittoria": "A contact inside the city who helps him in."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "intelligence_network": "How Francisco gets his info.",
        "vatican_presence": "Establishing the scale of the enemy."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "bologna_cathedral_archives": "Dusty, guarded, labyrinthine.",
        "the_confessional": "A hiding spot."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_stolen_scroll": "Contains info on the Keystone (Book 4 plot)."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco needs the Vatican's troop movements. He enters Bologna in disguise (Priest). He slips into the Cathedral. The Seven of Swords vibe—looking over his shoulder, holding the stolen goods. He encounters Captain Reyes but bluffs his way past. He reaches the archives. He steals the scroll. The tension is high. He escapes by the skin of his teeth, realizing that 'Courage' is not just fighting, but daring to act when terrified."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Adrenaline",
    stg_found["scene_tone"] = "Heist/Suspense"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Disguise",
            "setup": "Just outside Bologna. Vittoria helps Francisco with his cassock. He looks different—shaved, severe. 'If they catch you, I don't know you.' He swallows his fear. 'Courage isn't the absence of fear,' he quotes.",
            "symbolism": "The Mask. The False Face.",
            "beat_goal": "The Preparation. Raising the stakes.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Anxiety",
            "scene_tone": "Tense",
            "timeline_date": "Dusk",
            "timeline_variant": "Outskirts",
            "location": "Safehouse",
            "narrative_function": "The Threshold.",
            "learning_objective_integration": "Reflects 'Feel the Fear and Do It Anyway'."
        },
        {
            "scene_number": 2,
            "scene_title": "The Lion's Den",
            "setup": "Inside the Cathedral. High mass is ending. Incense. Soldiers at the doors. Francisco walks with purpose (Seven of Swords—swift movement). He nods to a guard. The guard nods back. He is inside.",
            "symbolism": "Walking on Thin Ice. The Wolf in Sheep's Clothing.",
            "beat_goal": "The Infiltration. Crossing lines.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Focus",
            "scene_tone": "Suspense",
            "timeline_date": "Night",
            "timeline_variant": "Bologna",
            "location": "Cathedral Nave",
            "narrative_function": "The Action.",
            "sudowrite_visual_details": [
                "The echo of chanting.",
                "The glint of armor.",
                "The shadow of the confessional."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Theft",
            "setup": "The Archives. He picks the lock (magically quiet). He finds the scroll case marked 'Temporal Containment'. He takes it. He leaves a decoy. He hears footsteps. Captain Reyes is doing rounds.",
            "symbolism": "The 7 of Swords (Taking the Swords).",
            "beat_goal": "The Objective. Securing the prize.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Fear",
            "scene_tone": "High Stakes",
            "timeline_date": "Night",
            "timeline_variant": "Bologna",
            "location": "Archives",
            "narrative_function": "The Climax (Action).",
            "learning_objective_integration": "Reflects 'Daring Greatly'—vulnerability in action."
        },
        {
            "scene_number": 4,
            "scene_title": "The Bluff",
            "setup": "Reyes stops him in the hallway. 'Father, I don't know your face.' Francisco uses 'Courage'. He doesn't run. He scolds Reyes for interrupting a 'holy mission from the Bishop.' His voice doesn't shake. Reyes apologizes and lets him pass. Francisco walks out into the cool night air, adrenaline crashing.",
            "symbolism": "The Tongue as Sword.",
            "beat_goal": " The Escape. Emotional payoff.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Relief",
            "scene_tone": "Triumphant",
            "timeline_date": "Midnight",
            "timeline_variant": "Bologna",
            "location": "Cathedral Steps",
            "narrative_function": "The Resolution.",
            "sudowrite_character_moments": [
                "The sweat on his back.",
                "The cool stone pillar he leans against.",
                "The scroll tucked in his sleeve."
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
    update_ea091()
