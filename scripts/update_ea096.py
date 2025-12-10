
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea096():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-096
    target_id = "EA-096"
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
    stg_found["save_the_cat_beat_goal"] = "Show 'Mental Agility' (Page of Swords) by adapting to a new, smarter enemy tactic through wit and flexibility."
    stg_found["plot"] = "Fun and Games: The Vatican sends 'Inquisitor M.', a strategist who doesn't use brute force but traps. He lays a magical snare in the forest. Francisco almost falls for it but uses 'Mental Agility.' He sees the pattern change. He pivots. He directs the team to use the environment (the river, the wind) against the magic. It's a battle of wits. The Page of Swords—energetic, cutting, quick."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Tactician. Moving pieces on the board.",
        "Inquisitor_M": "A worthy opponent. Cold, calculating.",
        "The_Scout": "Executes the feint."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "magic_limitations": "Showing that magic isn't infinite; smarts matter more.",
        "enemy_competence": "The villain is not stupid."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_broken_bridge": "The site of the trap.",
        "the_riverbank": "The escape route."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "inquisitor_m": "Recurring villain who hunts them intellectually."
    }
    
    # Update Summary
    stg_found["summary"] = "The Scouts report suspicious activity at the bridge. Francisco goes to investigate. It feels wrong. The birds are too quiet. He realizes it's an ambush designed for a 'frontal' thinker. He shifts to 'Page of Swords' mode. He climbs a tree. He sees the glint of a rune trap. Instead of retreating, he throws a rock to trigger it early. The trap explodes. The enemy is revealed, confused. Francisco mocks them (Page of Swords wit) and leads his team away through the river, covering their tracks. 'Be like water,' he teaches them."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Alertness",
    stg_found["scene_tone"] = "Clever/Fast-Paced"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Trap",
            "setup": "The Broken Bridge. It looks enticingly easy to cross. Francisco stops the team. He senses the 'Stiffness' of the air. The enemy expects him to be desperate. He needs to be 'Agile.'",
            "symbolism": "The Baited Hook.",
            "beat_goal": "The Recognition. Seeing the game.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Suspicion",
            "scene_tone": "Quiet Tension",
            "timeline_date": "Afternoon",
            "timeline_variant": "Forest",
            "location": "Bridge",
            "narrative_function": "The Challenge.",
            "learning_objective_integration": "Reflects 'Thinking, Fast and Slow'—engaging System 2."
        },
        {
            "scene_number": 2,
            "scene_title": "The Pivot",
            "setup": "Francisco explains the plan. No magic. Just physics. They will trigger the trap with a counter-weight. He is grinning. This is the 'Fun and Games' beat. He enjoys outsmarting them. The Page of Swords loves a puzzle.",
            "symbolism": "The Fulcrum.",
            "beat_goal": "The Plan. Creative problem solving.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Mischief",
            "scene_tone": "Active",
            "timeline_date": "Afternoon",
            "timeline_variant": "Forest",
            "location": "Underbrush",
            "narrative_function": "The Process.",
            "sudowrite_visual_details": [
                "The intricate knots of the rope.",
                "The heavy stone.",
                "Francisco's quick hand gestures."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Trigger",
            "setup": "They drop the stone. The bridge explodes in purple fire. The hidden Inquisitors jump out, shouting 'Attack!' But there is no one there. Francisco watches from the ridge. He has wasted their resources and revealed their position.",
            "symbolism": "The Smoke and Mirrors.",
            "beat_goal": "The Execution. The feint.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Satisfaction",
            "scene_tone": "Exciting",
            "timeline_date": "Sunset",
            "timeline_variant": "Forest",
            "location": "Ridge",
            "narrative_function": "The Climax (Intellectual).",
            "learning_objective_integration": "Reflects 'The Obstacle Is the Way'—turning the attack against them."
        },
        {
            "scene_number": 4,
            "scene_title": "The Lesson",
            "setup": "Back at camp. Francisco teaches the 'Page of Swords' lesson. 'The mind is sharper than the blade.' They debrief. He encourages them to think of three ways they could have died, and three ways they could have won.",
            "symbolism": "The Whetstone.",
            "beat_goal": "Resolution. Mental toughness.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Pride",
            "scene_tone": "Didactic",
            "timeline_date": "Night",
            "timeline_variant": "Sanctuary",
            "location": "Campfire",
            "narrative_function": "The Integration.",
            "sudowrite_character_moments": [
                "The laughter of the team.",
                "The firelight dancing.",
                "Francisco sharpening his dagger."
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
    update_ea096()
