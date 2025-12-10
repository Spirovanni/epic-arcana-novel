
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea074():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-074
    target_id = "EA-074"
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
    stg_found["save_the_cat_beat_goal"] = "Overcome the final obstacle to the 'Flight' using 'Problem Solving' (Queen of Swords) logic to dismantle Dagon's trap."
    stg_found["plot"] = "The Flight (Part 2): The Slipstream (from EA-073) is blocked by a temporal minefield. Panic rises. Francisco must suppress his fear and use 'Critical Thinking' to solve the puzzle of the mines before Dagon catches them."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Channels the 'Queen of Swords'. Cold, precise, cutting through emotion to see the truth.",
        "Novella": "Provides the data but is overwhelmed by the complexity; Francisco provides the synthesis.",
        "The_Pursuers": "Dagon's forces are closing in, adding a 'ticking clock' to the puzzle."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "intellectual_climax": "Provides a mental challenge to balance the physical action of previous chapters.",
        "queen_of_swords_integration": "Shows the necessity of ruthlessness/clarity in leadership."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_minefield": "A distortion in the slipstream where time loops aggressively.",
        "the_bridge": "The command deck of the lead transport ship."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "pattern_recognition": "The code Francisco cracks here is reused in the Book 6 heist.",
        "trust_in_intellect": "The team learns to trust his brain as much as his 'Wand'."
    }
    
    # Update Summary
    stg_found["summary"] = "The convoy is in the Slipstream, guided by the Traders. Suddenly, they stop. A 'Temporal Minefield' blocks the path. It's Dagon's last card. If they touch a mine, they are erased. Panic erupts on the bridge. The Council shouts contradictory orders. Francisco silences them. He enters 'Queen of Swords' mode. He uses the 'Four-Step Method'. He analyzes the mine pattern. He realizes it's not random; it's a logic gate based on fear. If you move fast, it explodes. If you move slow (Methodical), it opens. He orders the fleet to 'crawl'. It is counter-intuitive with an enemy behind them, but it is the only way."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Ice-cold focus"
    stg_found["scene_tone"] = "Tense and cerebral"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Blockade",
            "setup": "The Slipstream turns red. The lead scout ship vanishes—erased by a mine. The fleet halts. The radar shows thousands of distortion points ahead. Dagon's fleet is 30 minutes behind. The Captain says 'We have to turn back.' Francisco says 'No. We solve it.' The stakes are total. If he is wrong, everyone dies.",
            "symbolism": "The Gordian Knot. The Red Wall. The ticking clock.",
            "beat_goal": "The Crisis. Define the problem constraints.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Suppressed panic",
            "scene_tone": "High pressure",
            "timeline_date": "Post-Siege + 3 months, 2 hours",
            "timeline_variant": "Command Deck",
            "location": "The Bridge",
            "narrative_function": "The Obstacle.",
            "learning_objective_integration": "Reflects 'Problem Solving 101'—defining the root cause."
        },
        {
            "scene_number": 2,
            "scene_title": "The Dissection",
            "setup": "Francisco isolates himself. He pulls up the sensor data. He ignores the screams of the Council. He looks at the pattern. He uses 'The McKinsey Mind' hypothesis approach. Hypothesis A: It's a sensor net. Hypothesis B: It's a velocity trap. He tests B by throwing a probe at high speed. It explodes. He throws one at low speed. It passes. 'It's a fear trap. It punishes running.'",
            "symbolism": "The Queen of Swords holding the scales. The Microscope. The silence in the center of the storm.",
            "beat_goal": "The Hypothesis. Finding the key.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Clinical detachment",
            "scene_tone": "Quietly intense",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Bridge",
            "location": "The Bridge",
            "narrative_function": "The Analysis.",
            "sudowrite_visual_details": [
                "The holographic mines pulsing like heartbeats.",
                "Francisco's unmoving eyes.",
                "The sweat on the helmsman's neck."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Crawl",
            "setup": "Francisco gives the order: 'Ahead slow. 5% impulse.' The Council goes crazy. 'They will catch us!' Francisco draws his sword (metaphorically/literally). 'Anyone who increases speed gets stunned.' He imposes his will. The fleet creeps forward. The mines drift past, inches from the hulls. They do not detonate. The tension is unbearable. It is a test of nerve.",
            "symbolism": "Walking through fire. The discipline of the slow step. The Queen of Swords cutting through the panic.",
            "beat_goal": "The Action. Testing the solution under fire.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Steel will",
            "scene_tone": "Suspenseful",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Minefield",
            "location": "The Bridge",
            "narrative_function": "The Climax.",
            "learning_objective_integration": "Demonstrates 'Critical Thinking'—trusting logic over instinct."
        },
        {
            "scene_number": 4,
            "scene_title": "The Clear Air",
            "setup": "The last ship clears the field. The mines dissolve behind them, effectively blocking Dagon (who is moving too fast to stop). The logic trap works both ways. Dagon's vanguard hits the field and is erased. Francisco allows himself to exhale. He sheathes the 'Sword'. He has solved the puzzle. The Slipstream opens up ahead—clear, blue, and free. They have escaped.",
            "symbolism": "The breaking of the clouds. The Sword returning to the scabbard. The open sky.",
            "beat_goal": "Resolution. The Flight is successful.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Exhausted triumph",
            "scene_tone": "Relieved",
            "timeline_date": "Hour later",
            "timeline_variant": "Open Slipstream",
            "location": "The Bridge",
            "narrative_function": "The Crossing.",
            "sudowrite_character_moments": [
                "The helmsman slumping over the console.",
                "Francisco's hand trembling slightly as the adrenaline fades.",
                "The blue light of the open timeline filling the room."
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
    update_ea074()
