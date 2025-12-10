
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea093():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-093
    target_id = "EA-093"
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
    stg_found["save_the_cat_beat_goal"] = "Establish the 'Illumination' (Hierophant) of the group by formalizing their teachings and creating the 'Order of the Eternal'."
    stg_found["plot"] = "Crossing the Threshold: Francisco realizes the abundance and courage of the group are wasted without structure. He channels the 'Hierophant'—the Teacher/Pope. He codifies their knowledge. He writes the 'Codex Aeternum' (or a draft). He initiates his 12 followers into the secrets of time, 'Illuminating' their minds. They cross the threshold from a band of rebels to an Order."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Hierophant. He becomes the spiritual/intellectual leader.",
        "The_Apprentices": "The 12 transition from refugees to Students.",
        "La_Signora": "Becomes the High Priestess (counterpart)."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "magic_systems": "Explaining the rules of their temporal magic.",
        "organization": "How the rebellion is structured."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_library_sanctum": "The room where he teaches.",
        "the_altar_of_time": "A symbolic focal point."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_order": "This order persists for centuries (in the timeline)."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco spends days in the library, writing. He calls the group. He explains that they are not just fighting a war; they are protecting the timeline. He performs a rite of 'Illumination,' sharing a deep vision of the time stream with them. It is overwhelming but beautiful. They swear an oath. The Hierophant imagery—keys, instruction, tradition. He is no longer just Francisco; he is the Magus."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)",
    stg_found["tense"] = "Past Tense",
    stg_found["core_emotion"] = "Awe",
    stg_found["scene_tone"] = "Sacred/Academic"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Writer",
            "setup": "Francisco alone. Candlelight. He is trying to put the indescribable into words. 'Illumination' requires clarity. He drafts the First Principle: 'Time is not a river; it is a sea.' He feels the weight of history.",
            "symbolism": "The Quill. The Book.",
            "beat_goal": "The Synthesis. Creating the lore.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Inspiration",
            "scene_tone": "Quiet",
            "timeline_date": "Dawn",
            "timeline_variant": "Sanctuary",
            "location": "Library",
            "narrative_function": "The Preparation.",
            "learning_objective_integration": "Reflects 'Mastery'—codifying knowledge."
        },
        {
            "scene_number": 2,
            "scene_title": "The Assembly",
            "setup": "The 12 gather. They expect battle plans. Francisco gives them philosophy. He explains the 'Hierophant's' role: to bridge the gap between the chaotic divine (Time) and the human mind. He challenges them to learn.",
            "symbolism": "The Teacher. The Classroom.",
            "beat_goal": "The Call. Demanding intellectual growth.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Authority",
            "scene_tone": "Formal",
            "timeline_date": "Morning",
            "timeline_variant": "Sanctuary",
            "location": "Main Hall",
            "narrative_function": "The Shift.",
            "sudowrite_visual_details": [
                "The dust motes in the light.",
                "The attentive faces.",
                "The diagram drawn on the floor."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Vision",
            "setup": "The Rite of Illumination. Francisco links their minds (briefly). They *see* the timeline as he sees it. The vastness. The beauty. The terror. Some weep. Some laugh. They are 'Illuminated.'",
            "symbolism": "The Light. The Key.",
            "beat_goal": "The Transformation. Sharing the burden.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Transcendence",
            "scene_tone": "Mystical",
            "timeline_date": "Noon",
            "timeline_variant": "Sanctuary",
            "location": "Main Hall",
            "narrative_function": "The Climax (Spiritual).",
            "learning_objective_integration": "Reflects 'The Hero with a Thousand Faces'—crossing the threshold."
        },
        {
            "scene_number": 4,
            "scene_title": "The Oath",
            "setup": "The Aftermath. They are shaken but resolute. They swear to protect the timeline, not just for themselves, but for existence. They are now the Order of the Eternal. Francisco accepts their vow.",
            "symbolism": "The Circle. The Vow.",
            "beat_goal": "Resolution. The birth of the Order.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Solemnity",
            "scene_tone": "Ritualistic",
            "timeline_date": "Sunset",
            "timeline_variant": "Sanctuary",
            "location": "Courtyard",
            "narrative_function": "The New Era.",
            "sudowrite_character_moments": [
                "The kneeling figures.",
                "The setting sun on the stone.",
                "The weight of the responsibility settling."
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
    update_ea093()
