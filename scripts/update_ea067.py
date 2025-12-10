
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea067():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-067
    target_id = "EA-067"
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
    stg_found["save_the_cat_beat_goal"] = "Break the stalemate of the 'Dark Night of the Soul' by embracing a radical, 'Open Minded' strategy from an unlikely source."
    stg_found["plot"] = "The Abyss: They are trapped. Standard logic says they die. Francisco uses 'Range' (generalist thinking) to accept a crazy idea from a non-expert, bridging magic and technology."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Practices 'Cognitive Flexibility'. Overrules his experts to listen to an outsider.",
        "The_Experts": "Represent fixed mindset; they say 'It's impossible'.",
        "The_Outsider_Knight": "A minor character (Knight of Rings) who brings the breakthrough idea."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "innovation_source": "Shows that solutions don't always come from the top.",
        "magic_tech_bridge": "Explains how they combine timeline mechanics with old-world alchemy."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_dead_end": "The current tactical situation; a literal and metaphorical wall.",
        "the_workshop": "A messy, chaotic space where the new idea is tested."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "hybrid_magic": "The technique discovered here becomes a staple weapon in Book 3.",
        "culture_of_listening": "Francisco establishes a culture where the best idea wins, regardless of rank."
    }
    
    # Update Summary
    stg_found["summary"] = "The reflection in the previous chapter yielded clarity: they cannot win by conventional means. Dagon knows their playbook. They need a new game. Francisco gathers his war council. The experts offer defeatist stats. A low-ranking engineer (The Knight of Rings) sheepishly suggests a 'wild' idea: converting the Redoubt's shields into a focused offensive beam, burning out the generator in the process. It's suicide if it fails. The experts mock it. Francisco, applying the 'Open Minded' theme, shuts them down. He listens. He connects the engineer's tech with his own magic. He approves the plan. 'We don't need to be safe. We need to be right.'"
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Daring curiosity"
    stg_found["scene_tone"] = "Debative and experimental"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Dead End",
            "setup": "The Council meets. The map is red. Every escape route is blocked. The 'Experts' (Alexandrian Tacticians) are listing the ways they will die. It is a 'Fixed Mindset' trap. They are re-running old simulations. Francisco feels the trap closing—not just the enemy, but the trap of conventional thinking. He remembers his meditation (EA-066). He stops the briefing. 'Stop telling me what we can't do. Tell me what we haven't tried.'",
            "symbolism": "The Echo Chamber. The circle of people all nodding at bad news. The 'Wall' on the map.",
            "beat_goal": "Establish the intellectual blockage. The old way is dead.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Frustrated urgency",
            "scene_tone": "Stifling",
            "timeline_date": "Post-SIege + 8 hours",
            "timeline_variant": "The Broken Redoubt (War Room)",
            "location": "War Room",
            "narrative_function": "The problem statement.",
            "sudowrite_visual_details": [
                "The projection table flickering.",
                "The piles of 'Reject' stamps on plans.",
                "The oppressive heat of the room."
            ],
            "learning_objective_integration": "Illustrates 'Think Again'—identifying the need to unlearn."
        },
        {
            "scene_number": 2,
            "scene_title": "The Wild Idea",
            "setup": "A silence follows Francisco's demand. A young engineer (Knight of Rings equivalent) speaks up from the back. 'We could invert the polarity of the shield generator.' The experts laugh. 'That would blow us up.' Francisco silences the room settings. 'How?' The engineer explains: use the shield not to block, but to *pull* the enemy in, then collapse the timeline bubble. It's a 'Trojan Horse' strategy. It requires 'Range'—thinking across physics and chrono-mechanics.",
            "symbolism": "The Voice from the Back. The Knight offering the Ring (Idea). The inversion of 'Defense' to 'Offense'.",
            "beat_goal": "The Pivot. Discovering the potential solution. Overcoming the social pressure to conform.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Spark of hope",
            "scene_tone": "Tense but shifting",
            "timeline_date": "Minutes later",
            "timeline_variant": "War Room",
            "location": "War Room",
            "narrative_function": "The Option.",
            "learning_objective_integration": "Demonstrates 'Originals'—recognizing a non-obvious idea."
        },
        {
            "scene_number": 3,
            "scene_title": "The Friction",
            "setup": "The plan is debated. The risks are 90%. The experts try to kill it with logic. Francisco has to fight for the *possibility* of the idea. He uses 'Cognitive Flexibility'. He asks 'What if we modify it?' He starts drawing on the map. He combines the engineer's tech with his own time-slowing ability to stabilize the 'blow up' risk. They jam on the idea. It evolves from a 'suicide pact' to a 'gamble'. The energy in the room shifts from despair to manic creativity.",
            "symbolism": "The Jazz Session. Improvisation. The mixing of Blue (Logic) and Red (Passion) to make Purple (Magic).",
            "beat_goal": "Refine the idea. Secure buy-in. Transform the team from critics to co-conspirators.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Creative flow",
            "scene_tone": "Fast-paced and cerebral",
            "timeline_date": "Hour later",
            "timeline_variant": "War Room",
            "location": "War Room",
            "narrative_function": "The Synthesis.",
            "sudowrite_character_moments": [
                "Francisco rolling up his sleeves.",
                " The engineer gaining confidence, pointing, shouting.",
                "The experts reluctantly nodding."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "The Green Light",
            "setup": "The plan is theoretical. They need to commit. Francisco looks at the engineer. 'Can you build it?' 'In 4 hours.' 'Do it.' He dismisses the council. He walks out with the engineer. He has bet the entire resistance on a 'Knight's' gamble. He feels the thrill of the 'Open Mind'. He realizes that this is how they win—not by being stronger, but by being weirder.",
            "symbolism": "The Handshake. The passing of the baton. The opening of the door.",
            "beat_goal": "Resolution. The decision is made. The 'Abyss' has a path through it.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Electrified resolve",
            "scene_tone": "Decisive",
            "timeline_date": "Post-Siege + 10 hours",
            "timeline_variant": "Corridor",
            "location": "Corridor outside War Room",
            "narrative_function": "The Commitment.",
            "learning_objective_integration": "Reflects 'Mindset'—choosing growth over safety."
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
    update_ea067()
