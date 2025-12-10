
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea077():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-077
    target_id = "EA-077"
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
    stg_found["save_the_cat_beat_goal"] = "Defeat the Dagon Interceptor using 'Intellectual Dynamo' (Knight of Swords) rapid innovation to triumph where brute force fails."
    stg_found["plot"] = "Rescue from Without (Part 2): Dagon's Hunter arrives. It shields against their conventional weapons. They are trapped. Francisco realizes he can't outgun it; he has to out-think it. He uses 'Rapid Ideation' techniques (Originals) to repurpose the Beacon into a weapon."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Channels the 'Knight of Swords'. Fast, aggressive intellect. He encourages 'Wild Ideas'.",
        "The_Hunter": "A machine intelligence that learns and adapts to standard tactics.",
        "The_Team": "Forced to improvise under extreme pressure."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "technological_improvisation": "Shows how they use the junk on the planet to fight.",
        "enemy_capabilities": "Demonstrates why Dagon is so feared (adaptive AI)."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_firing_line": "The edge of their camp where the battle takes place.",
        "the_scrap_heap": "The source of their ammunition."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_pulse_weapon": "The device invented here becomes a standard sidearm in later books.",
        "adaptive_tactics": "The strategy of 'Changing the Game' becomes Francisco's signature."
    }
    
    # Update Summary
    stg_found["summary"] = "The Hunter lands. It is a sleek, black killing machine. It absorbs their laser fire and fires back. The shield is failing (EA-075's wall). Francisco calls a 'huddle'. 'Stop shooting. It learns from shots. We need something it hasn't seen.' He manages an 'Intellectual Dynamo' session in the middle of a firefight. Someone suggests using the Beacon's power core to overload the local gravity. It's insane. It might kill them all. Francisco says 'Do it.' They rig the device. They fire. It crushes the Hunter into foil. Innovation wins."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Manic creativity"
    stg_found["scene_tone"] = "High-octane"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Hunter",
            "setup": "The sensors scream. The sky tears open. The Interceptor lands. It ignores the Beacon and targets the life signs. Francisco orders a volley. The Interceptor's shields flare and adapt. It fires a return shot that vaporizes the windmill (EA-075). It is invincible to 'Old Ways'.",
            "symbolism": "The Terminator. The Futility of Tradition.",
            "beat_goal": "The Threat. Establishing the enemy's superiority.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Fear",
            "scene_tone": "Action-horror",
            "timeline_date": "Post-Crash + 1 week, 1 hour",
            "timeline_variant": "The Perimeter",
            "location": "Base Zero",
            "narrative_function": "The Crisis.",
            "learning_objective_integration": "Demonstrates 'Originals'—status quo failure."
        },
        {
            "scene_number": 2,
            "scene_title": "The Brainstorm",
            "setup": "Francisco drags the leaders into the bunker. 'Standard tactics are dead. Give me bad ideas. fast.' He forces them into 'Divergent Thinking'. The Engineer suggests a gravity bomb. 'We don't have the mass.' The Mystic suggests a temporal loop. 'We don't have the power.' Then, Novella looks at the Beacon. 'It's broadcasting a signal. What if we broadcast... gravity?'",
            "symbolism": "The Spark in the heavy air. The Knight of Swords charging.",
            "beat_goal": "The Idea. The pivot from fear to creativity.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Frantic hope",
            "scene_tone": "Fast-paced",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Bunker",
            "location": "Base Zero",
            "narrative_function": "The Plan.",
            "sudowrite_visual_details": [
                "Dust falling from the ceiling with every impact outside.",
                "Francisco writing formulas on the dirt floor.",
                "The lightbulb moment in Novella's eyes."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Prototype",
            "setup": "They have 5 minutes before the shield fails. They tear the Beacon apart. They rewire the core. It is the ugliest weapon ever made. Wires duct-taped, crystals exposed. The Knight of Swords doesn't care about safety; he cares about speed. They aim it at the Hunter. The Hunter charges.",
            "symbolism": "Frankenstein's Monster. The desperate gamble.",
            "beat_goal": "The Action. Execution of the insane plan.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Adrenaline",
            "scene_tone": "Chaotic",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Breach",
            "location": "Base Zero",
            "narrative_function": "The Climax.",
            "learning_objective_integration": "Reflects 'Rapid Prototyping'—building to think."
        },
        {
            "scene_number": 4,
            "scene_title": "The Surprise",
            "setup": "They activate the device. No laser beam. Just a sound—a 'thrum' that shakes the teeth. The gravity around the Hunter multiplies by 100. The machine crumples like a soda can. Its AI cannot adapt to physics breaking. It implodes. Silence returns. The team stares at their junk-weapon. They are alive.",
            "symbolism": "David and Goliath. The victory of Mind over Matter.",
            "beat_goal": "Resolution. The immediate threat is gone.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Disbelief",
            "scene_tone": "Stunned",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Wreckage",
            "location": "Base Zero",
            "narrative_function": "The Victory.",
            "sudowrite_character_moments": [
                "The smoke rising from the crushed machine.",
                "Francisco laughing, a sharp, manic sound.",
                "The realization that the Beacon is destroyed."
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
    update_ea077()
