
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea088():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-088
    target_id = "EA-088"
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
    stg_found["save_the_cat_beat_goal"] = "Face the 'Judgement' of the factions while trapped in the 'Eight of Swords' (restriction), using discernment to escape the mental prison."
    stg_found["plot"] = "Consequence: The temporal flare from EA-087 alerted everyone. Vatican agents (The Swords) and Dagon's spies encircle Francisco. He is captured/cornered. Not in a jail, but in a 'diplomatic' bind. They judge his actions. The Eight of Swords imagery—bound and blindfolded. He realizes the trap is legalistic/mental. He must judge *them* to break free."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The defendant. He learns to argue for his existence.",
        "Inquisitor_Gallego": "New antagonist. A legalist of the timelines.",
        "Dagon_Agent": "The chaos option. Offers freedom for servitude."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "legal_system_of_time": "The Church has a 'Canon Law' for temporal magic.",
        "neutral_ground": "Where these factions meet."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_crossroads_inn": "A neutral ground existing between seconds.",
        "the_circle_of_swords": "The interrogation formation."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_trial": "Foreshadows the Great Trial in Book 9."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco is ambushed at an inn. The Inquisitor declares him 'Anathema' but offers a trial. He is placed in the Circle of Swords (suppression field). He is blindfolded. They read his 'crimes'. But Francisco listens (Discernment). He hears the Dagon agent whispering. He realizes the Inquisitor is bluffing—they need him. The 'prison' is their need for him. He uses this. He mentally outmaneuvers them, pitting the factions against each other, and walks out of the circle."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Clarify (under pressure)",
    stg_found["scene_tone"] = "Tense/Courtroom"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Ambush",
            "setup": "The Inn at the Crossroads. Francisco enters, looking for rest. The door locks. The patrons vanish. Eight figures in grey robes stand up. Swords drawn (some literal, some magical). 'Francisco Petrarch, you are detained.'",
            "symbolism": "The Eight of Swords (Surrounded). The Trap.",
            "beat_goal": "The Capture. Establish the threat level.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Alarm",
            "scene_tone": "Suspense",
            "timeline_date": "Night",
            "timeline_variant": "The Inn",
            "location": "Common Room",
            "narrative_function": "The Pinch Point.",
            "learning_objective_integration": "Reflects 'Thinking, Fast and Slow'—assessing threats."
        },
        {
            "scene_number": 2,
            "scene_title": "The Indictment",
            "setup": "He is seated in the center. Blindfolded. Inquisitor Gallego lists the timeline deviations he caused. 'You are a chaos agent.' They want him to sign a confession/contract. He feels the weight of their judgment.",
            "symbolism": "The Blindfold. Justice vs Law.",
            "beat_goal": "The Accusation. The stakes are set (servitude).",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Doubt",
            "scene_tone": "Oppressive",
            "timeline_date": "Night (Cont.)",
            "timeline_variant": "The Inn",
            "location": "The Circle",
            "narrative_function": "The Low Point (Psychological).",
            "sudowrite_visual_details": [
                "The smell of beeswax candles.",
                "The scratching of the scribe's pen.",
                "The pressure on his temples."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Whisper",
            "setup": "A Dagon agent (disguised as a guard) whispers to him. 'We can break the circle. Just say the word.' It's a temptation. But Francisco discerns the trap within the trap. He refuses. He realizes the Swords aren't touching him; they are waiting for him to move.",
            "symbolism": "The Devil on the Shoulder. Discernment.",
            "beat_goal": "The Realization. The prison is voluntary.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Insight",
            "scene_tone": "Internal",
            "timeline_date": "Night (Cont.)",
            "timeline_variant": "The Inn",
            "location": "The Circle",
            "narrative_function": "The Twist.",
            "learning_objective_integration": "Reflects 'Decisive'—widening options."
        },
        {
            "scene_number": 4,
            "scene_title": "The Verdict",
            "setup": "Francisco stands up. 'I am not your prisoner. I am the only one holding the timeline together.' He removes the blindfold. The Inquisitor hesitates. Francisco cites an obscure Canon Law (bluffing slightly). He walks through the gap between the swords. They let him pass.",
            "symbolism": "The Walkout. Intellectual Dominance.",
            "beat_goal": "The Escape. Leaving on his own terms.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Confidence",
            "scene_tone": "Vindicated",
            "timeline_date": "Dawn",
            "timeline_variant": "The Road",
            "location": "Outside the Inn",
            "narrative_function": "The Victory.",
            "sudowrite_character_moments": [
                "The Inquisitor sheathing his sword in frustration.",
                "Francisco breathing the cold air.",
                "The realization that he is now a player, not a pawn."
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
    update_ea088()
