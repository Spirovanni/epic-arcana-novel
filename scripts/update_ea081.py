
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea081():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-081
    target_id = "EA-081"
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
    stg_found["save_the_cat_beat_goal"] = "Establish the 'Ordinary World' of Book 3 with Francisco's new 'Radiance' (Ace of Wands) attracting both awe and danger."
    stg_found["plot"] = "Book 3 Opener: The Magus returns. Francisco is back in Bologna. He has integrated the lessons of Books 1 & 2. He radiates power (Ace of Wands). He is teaching at the University, but his lectures are... different. He is starting a new fire. Novella watches him, seeing the 'Shining One' overlaying the man."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Teacher. He is confident, charismatic, but slightly detached. He risks becoming 'The Guru'.",
        "Novella": "The Grounding Wire. She keeps him connected to reality.",
        "Cardinal_Colonna": "The Observer. He sees the potential weapon in Francisco."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "magical_progression": "Shows how much stronger he is since Book 1.",
        "social_status": "He is no longer a student; he is a force of nature."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_lecture_hall": "Dusty, wood-paneled, filled with mesmerized students.",
        "the_piazza_at_dusk": "Where the shadows lengthen and the Cardinal watches."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_radiance": "This 'Ace of Wands' energy eventually attracts the antagonist of Book 3.",
        "the_cult_of_personality": "The followers he gains here become a problem later."
    }
    
    # Update Summary
    stg_found["summary"] = "It has been six months since the Rescue. Francisco is back at the University. He is teaching 'Temporal Theory'. But it's not theory anymore; it's practice. He speaks with 'Radiance'. The Ace of Wands energy fills the room. Students hang on his every word. He touches a chalkboard, and the chalk writes itself (a small slip of control). He is high on his own supply. Novella warns him: 'You are glowing too bright.' He laughs. But in the shadows, Colonna sees the glow and smiles. The weapon is ready."
    
    stg_found["pov"] = "3rd Person Limited (Francisco/Novella)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Charisma"
    stg_found["scene_tone"] = "Electric"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Lecture",
            "setup": "Francisco stands at the podium. He isn't reading notes. He is channeling. He speaks of 'Time as a River'. He gestures, and the dust motes in the air freeze. The students gasp. He smiles. It feels good to be the Master.",
            "symbolism": "The Ace of Wands (The Torch). The Stage. The mesmerizing fire.",
            "beat_goal": "The Introduction. Establishing the new status quo.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Confidence",
            "scene_tone": "Inspiring",
            "timeline_date": "Book 3 Start",
            "timeline_variant": "Bologna University",
            "location": "Lecture Hall",
            "narrative_function": "The Hook.",
            "learning_objective_integration": "Reflects 'Presence'—commanding the room."
        },
        {
            "scene_number": 2,
            "scene_title": "The Aura",
            "setup": "Novella waits for him after class. She sees the students touching the hem of his robe (metaphorically). She pulls him into an alcove. 'You're doing it again.' 'Doing what?' 'Shining.' She holds up a mirror. His eyes are literally glowing gold for a second before fading. 'You are a beacon, Francisco. Beizons attract storms.'",
            "symbolism": "The Halo. The Mirror (again). The Warning.",
            "beat_goal": "The Complication. Power has side effects.",
            "pov": "3rd Person Limited (Novella)",
            "tense": "Past Tense",
            "core_emotion": "Concern",
            "scene_tone": "Intimate tension",
            "timeline_date": "Post-Lecture",
            "timeline_variant": "University Hallway",
            "location": "The Alcove",
            "narrative_function": "The check on power.",
            "sudowrite_visual_details": [
                "The golden flecks in his iris.",
                "The static electricity making Novella's hair rise.",
                "The dark stone of the alcove contrasting with his light."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Spark",
            "setup": "Walking home. A beggar asks for alms. Francisco doesn't give a coin; he touches the beggar's cup. The cheap tin turns to silver. Pure transmutation. The beggar screams in fear/joy. Francisco walks on, feeling benevolent. He doesn't see the crowd gathering behind him. He just performed a miracle on a public street.",
            "symbolism": "The Midas Touch. Unchecked benevolence. The Ace manifesting.",
            "beat_goal": "The Escalation. A public display of power.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Hubris",
            "scene_tone": "Wonder/Danger",
            "timeline_date": "Dusk",
            "timeline_variant": "Bologna Streets",
            "location": "The Piazza",
            "narrative_function": "The Inciting Incident setup.",
            "learning_objective_integration": "Reflects 'The Gifts of Imperfection' (inverted)—seeking perfection/godhood."
        },
        {
            "scene_number": 4,
            "scene_title": "The Shadow",
            "setup": "Cardinal Colonna is watching from a carriage. He saw the silver cup. He fingers his rosary. 'It is time,' he tells his driver. 'Bring him to the Palace. Tonight.' The Ace of Wands has lit a signal fire, and the wolves are coming.",
            "symbolism": "The Spider in the Web. The Extinguisher.",
            "beat_goal": "The Threat. The antagonist moves.",
            "pov": "3rd Person Limited (Colonna)",
            "tense": "Past Tense",
            "core_emotion": "Predatory anticipation",
            "scene_tone": "Ominous",
            "timeline_date": "Night",
            "timeline_variant": "Bologna Streets",
            "location": "The Carriage",
            "narrative_function": "The Cliffhanger to Ch 2.",
            "sudowrite_character_moments": [
                "The velvet of the carriage interior.",
                "The Cardinal's ring tapping on the window.",
                "The silver cup glinting in the street below."
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
    update_ea081()
