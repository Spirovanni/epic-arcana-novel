
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea069():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-069
    target_id = "EA-069"
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
    stg_found["save_the_cat_beat_goal"] = "Transform the 'Methodical' plan from a defensive survival action into a winning gambit through 'Excitable Curiosity'."
    stg_found["plot"] = "The Abyss: The weapon is ready, but a simulation reveals a fatal flaw. Logic fails. Francisco uses 'Curiosity' (Page of Wands) to ask a 'stupid question' that unlocks the true weakness of the enemy."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Integrates the 'Page of Wands'. Reclaims his sense of wonder and play even in the darkest moment.",
        "The_Experts": "Stumped by the paradox; they need the 'Beginner's Mind' to solve it.",
        "The_Enemy": "Revealed to have a structural weakness based on their lack of imagination."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "the_winning_move": "Explains why the weapon works so well—it exploits a fundamental flaw in Dagon's logic.",
        "tone_shift": "Moves the story from 'Grim Survival' back to 'Adventure'."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_observation_deck": "A place of looking out, seeing the big picture.",
        "the_signal_room": "Where the patterns of the enemy are monitored."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "curiosity_as_weapon": "Establishes that understanding the enemy is more lethal than just hitting them.",
        "finding_the_glitch": "The discovery here (the 'hum') is a clue to the nature of the simulation in Book 5."
    }
    
    # Update Summary
    stg_found["summary"] = "The device is built (EA-068), but the final simulation shows a 1% variance that will kill them all. The experts are tearing their hair out. Francisco wanders away. He goes to the signal room. He listens to the enemy's jamming frequency. He asks a simple, 'childish' question: 'Why is it in B-flat?' The experts dismiss him. But he persists. He is 'Curious' (Page of Wands). He traces the signal. He finds that the jamming isn't random; it's a carrier wave. Dagon is *broadcasting* his position. The 'flaw' is actually a map. They don't need to overpower the jamming; they just need to surf it. The plan shifts from 'Checkmate' to 'High Dive'."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Playful discovery"
    stg_found["scene_tone"] = "Bright and eureka-filled"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Glitch",
            "setup": "The simulation runs red. The device works, but the backlash will destroy the Redoubt. The room falls into silence. It's the 'Dark Night' again. They did everything right, and it failed. Francisco refuses to accept the binary 'Pass/Fail'. He enters 'Curiosity Mode'. He walks around the problem. 'What exactly is the backlash?' 'Harmonic resonance.' 'Resonance with what?'",
            "symbolism": "The Red Light. The unanswerable question. The refusal to accept the 'Expert' verdict.",
            "beat_goal": "Re-open the problem. Shift from 'Execution' back to 'Exploration'.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Restless inquiry",
            "scene_tone": "Frustrated but active",
            "timeline_date": "Post-Siege + 14 hours",
            "timeline_variant": "War Room",
            "location": "War Room",
            "narrative_function": "The Twist.",
            "learning_objective_integration": "Illustrates 'A Curious Mind'—asking the question no one else asks."
        },
        {
            "scene_number": 2,
            "scene_title": "The Signal",
            "setup": "Francisco leaves the War Room. He follows the sound of the resonance. It leads him to the Signal Room. The operators are exhausted. The noise is a drone. Francisco listens. He taps his foot. 'It has a rhythm.' He asks to isolate the track. It's not noise; it's data. He realizes Dagon isn't just attacking; he's *talking* to his fleet. The jamming is a two-way street.",
            "symbolism": "The Noise becoming Music. The 'Ear' vs. the 'Eye'. Finding the signal in the noise.",
            "beat_goal": "The Discovery. The 'Page of Wands' finds the secret path.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Wonder",
            "scene_tone": "Mysterious",
            "timeline_date": "Post-Siege + 14.5 hours",
            "timeline_variant": "Signal Room",
            "location": "Signal Room",
            "narrative_function": "The Clue.",
            "sudowrite_visual_details": [
                "The oscilloscope wave dancing.",
                "Francisco closing his eyes to listen.",
                "The operator looking confused but intrigued."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Pivot",
            "setup": "Francisco bursts back into the War Room. 'It's not a wall; it's a door.' He explains. If they tune their device to the enemy's frequency (B-flat), the backlash disappears. In fact, it amplifies their output. They can ride Dagon's own energy network. The experts are skeptical. 'That's insane.' 'It's original.' He forces them to run the sim with the new variable. The red light turns green. The room explodes in disbelief.",
            "symbolism": "Turning the Key. The 'Green Light' returning. The triumph of the 'Crazy Idea'.",
            "beat_goal": "Validate the discovery. Lock in the victory condition.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Ecstatic",
            "scene_tone": "High energy",
            "timeline_date": "Post-Siege + 15 hours",
            "timeline_variant": "War Room",
            "location": "War Room",
            "narrative_function": "The Breakthrough.",
            "learning_objective_integration": "Demonstrates 'Originals'—championing a novel concept."
        },
        {
            "scene_number": 4,
            "scene_title": "The Spark",
            "setup": "They adjust the device. The frequency matches. The hum changes from a drone to a harmony. Francisco stands at the observation deck. He sees the enemy fleet not as a threat, but as a fuel source. He smiles. He has moved through Valor, Reflection, Openness, Method, and finally Curiosity. He is ready. 'Light it up.'",
            "symbolism": "The Harmony. The conductor raising the baton. The spark igniting the engine.",
            "beat_goal": "Resolution. The preparations are complete. The climax begins.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Joyful anticipation",
            "scene_tone": "Electric",
            "timeline_date": "Post-Siege + 16 hours",
            "timeline_variant": "Observation Deck",
            "location": "Observation Deck",
            "narrative_function": "The Launch.",
            "sudowrite_visual_details": [
                "The lights of the panel syncing with the heartbeat.",
                "Francisco's smile—genuine and boyish.",
                "The world holding its breath."
            ],
            "learning_objective_integration": "Reflects 'The Innovator's DNA'—associational thinking winning the day."
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
    update_ea069()
