import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea065():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-065
    target_id = "EA-065"
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
    stg_found["save_the_cat_beat_goal"] = "The Ordeal (Atonement). The Hero faces death directly to save others."
    stg_found["plot"] = "The Rearguard: Francisco embodies the Seven of Wands—one standing against many—to buy time for the alliance to escape."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Fully embraces the 'Guardian' archetype. He is no longer fighting for victory, but for time.",
        "Dagon": "Deploys the 'Legion'—a faceless swarm designed to overwhelm individual heroism.",
        "Novella": "Forced to leave Francisco behind, a reversal of her usual protective role."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "combat_mechanics": "Demonstrates how a single powerful reality-bender can hold a choke point against a superior force.",
        "cost_of_war": "Casualties are unavoidable; the goal is to minimize them, not eliminate them.",
        "emotional_stakes": "The separation of the protagonist from his support network."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_evacuation_gate": "A narrow, unstable portal requiring constant focus to keep open.",
        "the_bottleneck": "A physical corridor leading to the gate, rigged with the 'Playful' traps from the previous chapter."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "stand_alone_theme": "Foreshadows Francisco's ultimate solitary confrontation in the series finale.",
        "reputation_mechanic": "Tales of 'The Man at the Gate' will spread, rallying future allies."
    }
    
    # Update Summary
    stg_found["summary"] = "The 'Play' is over. Dagon sends the Legion—thousands of synchronized combat-simulacra. The Sanctuary cannot hold. They must evacuate through the unstable Gate. Panic threatens to turn the retreat into a rout. Francisco steps into the Bottleneck. He activates the traps set during the 'Games', turning the environment into a weapon. But it's not enough. He must hold the line personally. Wielding the Seven of Wands (Valor), he becomes a living wall of force. He holds for 40 minutes. 4,000 lives saved. He collapses the tunnel on the Legion and barely escapes, broken but victorious in his defiance."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Desperate courage"
    stg_found["scene_tone"] = "Frantic and heroic"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Breach",
            "setup": "The alarms scream. Not a drill. The Legion arrives—faceless, grey, endless. They don't use tactics; they use mass. They swarm the outer shields. The 'Gamification' scoreboards shatter. This is the reality of war. The Quartermaster looks to Francisco: 'We have 20 minutes before they breach the core.'",
            "symbolism": "The Flood. The Ant Hill. The loss of individuality in the face of the swarm.",
            "beat_goal": "The Inciting Incident of the Chapter. Shift from 'Game' to 'Survival'.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Adrenaline",
            "scene_tone": "Chaos",
            "timeline_date": "Post-Book 1 + 20 weeks",
            "timeline_variant": "Sanctuary Perimeter",
            "location": "The Outer Wall",
            "narrative_function": "The Threat.",
            "sudowrite_visual_details": [
                "The unified stomping of ten thousand boots.",
                "The shield buckling like wet glass.",
                "Francisco's hands shaking, then steadying."
            ]
        },
        {
            "scene_number": 2,
            "scene_title": "The Bottleneck",
            "setup": "The order is given: Evacuate. The crowd surges toward the Gate. It's too slow. If they panic, they trample each other. Francisco sees the Legion pouring into the main hall. He looks at Novella. 'Get them through. I'll buy you time.' She tries to argue. He pushes her toward the gate. 'Go!' It is the first time he has physically pushed her away.",
            "symbolism": "The Shepherd protecting the flock. The Separation.",
            "beat_goal": "The Choice. Accepting the suicide mission.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Selfless love",
            "scene_tone": "Heartbreaking urgency",
            "timeline_date": "Post-Book 1 + 20 weeks",
            "timeline_variant": "Sanctuary Hall",
            "location": "The Corridor",
            "narrative_function": "The Sacrifice.",
            "learning_objective_integration": "Demonstrates 'Critical Decision Making' under extreme pressure."
        },
        {
            "scene_number": 3,
            "scene_title": "Seven of Wands",
            "setup": "Francisco stands alone in the corridor. The Legion charges. He triggers the traps—gravity inversions, slip-planes (the 'Pranks' from yesterday now lethal). It buys seconds. Then they reach him. He fights. Not with finesse, but with raw refusal. He uses the Seven of Wands: 'I am still here.' Every blow he takes is a life saved behind him. He counts them. 3,000. 3,500. He is bleeding, burning out, but he doesn't move.",
            "symbolism": "The Seven of Wands card art—one man on a hill fighting six below. The 'Unmovable Object'.",
            "beat_goal": "The Climax. pure action and endurance.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Pain and defiance",
            "scene_tone": "Visceral combat",
            "timeline_date": "Post-Book 1 + 20 weeks",
            "timeline_variant": "The Choke Point",
            "location": "The Bottleneck",
            "narrative_function": "The Action.",
            "learning_objective_integration": "Reflects 'Valor'—acting in spite of fear and pain."
        },
        {
            "scene_number": 4,
            "scene_title": "The Last Man",
            "setup": "The last child is through. The Gate flickers. Francisco is done. He can't hold them. He slams his hand on the structural support. 'Collapse.' The ceiling comes down. Tons of rock crush the front rank of the Legion. In the dust and chaos, Francisco creates a micro-portal—a 'mouse hole'—and falls through it, uncontrolled. He lands in the dirt of the new base, unconscious, alive by a margin of milliseconds.",
            "symbolism": "Samson bringing down the temple (but surviving). The dust settling. The Silence.",
            "beat_goal": "Resolution. Escape.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Blackout",
            "scene_tone": "Final and heavy",
            "timeline_date": "Post-Book 1 + 20 weeks",
            "timeline_variant": "New Base (Landing Zone)",
            "location": "The Dirt",
            "narrative_function": "The Survival.",
            "sudowrite_character_moments": [
                "The roar of the falling ceiling.",
                "The sudden silence of the new timeline.",
                "Novella finding his body in the grass."
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
    update_ea065()
