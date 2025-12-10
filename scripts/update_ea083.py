
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea083():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-083
    target_id = "EA-083"
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
    stg_found["save_the_cat_beat_goal"] = "Undergo 'Introspection' (Eight of Cups): Francisco walks away from his safe life to prepare for his dangerous double-agent role."
    stg_found["plot"] = "The Setup: Before he goes to Colonna, Francisco must 'clean house'. He realizes his current life—the cups stacked neatly—is emotional baggage he can't carry. The Eight of Cups moment: turning his back on fulfillment to seek a higher/harder truth. He visits his favorite spots in Bologna one last time."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Ascetic. He sheds his attachments.",
        "Dante": "The Spirit Guide. He appears in the shadows to validate the choice.",
        "Novella": "The Anchor being cut loose (temporarily)."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "internal_motivation": "Why he risks everything (Sense of Destiny).",
        "emotional_preparation": "Steeling himself for the betrayal he must enact."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_two_towers": "Looking out over the city he is leaving.",
        "the_university_gates": "The symbol of his old life."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_hermits_journey": "This walk foreshadows his eventual exile.",
        "emotional_detachment": "A necessary skill for the Magus."
    }
    
    # Update Summary
    stg_found["summary"] = "Night falls again. Francisco walks the city. He visits the tavern where he laughed with friends. He visits the lecture hall. He stacks these memories (Cups) and then turns away. It is an act of 'Introspection'. He realizes he was seeking validation in these things. Now he seeks Truth. He meets 'Dante' (his subconscious projection) by the Towers. Dante nods. 'The way up is the way down.' Francisco is ready to descend into the Vatican's underworld."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Melancholy resolve"
    stg_found["scene_tone"] = "Quiet/Nocturnal"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Walk",
            "setup": "Francisco walks through the student quarter. He sees the life he could have had. Marriage, tenure, comfort. It is beautiful. But it feels 'flat'. The Eight of Cups isn't about leaving bad things; it's about leaving *good* things because they aren't *enough*.",
            "symbolism": "The stacked cups left behind. The moon overhead.",
            "beat_goal": "The Farewell. Letting go of the 'Normal'.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Bittersweet",
            "scene_tone": "Nostalgic",
            "timeline_date": "Night (Pre-Departure)",
            "timeline_variant": "Bologna Streets",
            "location": "Student Quarter",
            "narrative_function": "The Emotional Beat.",
            "learning_objective_integration": "Reflects 'The Untethered Soul'—letting go."
        },
        {
            "scene_number": 2,
            "scene_title": "The Voice",
            "setup": "He stops at the Two Towers. The shadows lengthen. A figure steps out. It's Dante (or a homeless man who looks like him). 'You are looking for the path,' the figure says. 'It is not on the map.' Francisco realizes his guide is his own intuition.",
            "symbolism": "The Hermit (Book 9 foreshadowing). The Inner Voice.",
            "beat_goal": "The Confirmation. Spiritual alignment.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Clarity",
            "scene_tone": "Mystical",
            "timeline_date": "Midnight",
            "timeline_variant": "Two Towers",
            "location": "Piazza di Porta Ravegnana",
            "narrative_function": "The Insight.",
            "sudowrite_visual_details": [
                "The leaning tower against the starfield.",
                "The ragged cloak of the stranger.",
                "The sound of distant bells."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Insight",
            "setup": "He sits on a bench. He reviews his motives. Why infiltrate? Revenge? No. Curiosity? Partly. Duty? Yes. He realizes he cannot let the timeline be a cage. He fights for Free Will. This purpose gives him the strength to walk away from safety.",
            "symbolism": "The Staff. The Cloak. Taking up the burden.",
            "beat_goal": "The Motivation. Solidifying the 'Why'.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Determination",
            "scene_tone": "Internal",
            "timeline_date": "0100 Hours",
            "timeline_variant": "The Bench",
            "location": "City Park",
            "narrative_function": "The Steel.",
            "learning_objective_integration": "Reflects 'Emotional Intelligence'—self-awareness."
        },
        {
            "scene_number": 4,
            "scene_title": "The Decision",
            "setup": "He stands up. He turns his back on the University. He faces the direction of the Colonna Palace. He doesn't look back. The Eight of Cups is complete. He has left the emotional shore and is heading into the dark water.",
            "symbolism": "Crossing the Line. The Point of No Return.",
            "beat_goal": "The Action. Moving toward the danger.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Focus",
            "scene_tone": "Final",
            "timeline_date": "0200 Hours",
            "timeline_variant": "The Road",
            "location": "Via Zamboni",
            "narrative_function": "The Bridge to Ch 4.",
            "sudowrite_character_moments": [
                "The crunch of his boots on the cobblestones.",
                "The cold night air filling his lungs.",
                "The silence of the sleeping city."
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
    update_ea083()
