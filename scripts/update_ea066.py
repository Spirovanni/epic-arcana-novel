
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea066():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-066
    target_id = "EA-066"
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
    stg_found["save_the_cat_beat_goal"] = "Process the trauma of the near-defeat in EA-065 and internalize the lessons of leadership through 'Reflective Energy'."
    stg_found["plot"] = "The Descent: The physical battle pauses, but the internal battle begins. Francisco must face his own doubts in the quiet of the aftermath (Queen of Cups)."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Shifts from 'Man of Action' to 'Man of Wisdom'. Learns that silence is as powerful as speech.",
        "La_Signora": "Provides the 'Mirror' function, helping Francisco see himself clearly.",
        "The_Sanctuary": "The mood shifts from panic (EA-065) to a somber, sacred quiet."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "psychological_toll": "Acknowledges that being a hero hurts. Avoids the 'unfeeling action hero' trope.",
        "queen_of_cups_meaning": "Focuses on the internal/emotional mastery aspect of the Queen."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_quiet_room": "Before, a war room; now, a space of meditation.",
        "the_still_black_water": "A visual manifestation of the Queen of Cups element in the timeline environment."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "philosophical_foundation": "The insights gained here form the moral compass for the rest of the war.",
        "marcus_aurelius": "Direct echoes of 'Meditations' in Francisco's internal monologue."
    }
    
    # Update Summary
    stg_found["summary"] = "The siege of the Redoubt holds, but the cost was high. In the eerie silence following the attack, Francisco withdraws. He cannot lead effectively until he understands what just happened. He enters a state of deep reflection (Queen of Cups). Guided by La Signora, he looks into the 'Mirror' of his actions. He realizes his fear in the previous chapter wasn't a weakness—it was the data he needed to understand his enemy. He transforms the trauma into 'Reflective Energy', emerging not just as a brave fighter, but as a wise king in waiting."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Melancholy turning to clarity"
    stg_found["scene_tone"] = "Quiet, water-like, introspective"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Silence After",
            "setup": "The guns are cold. The wounded are being treated. The adrenaline crash hits Francisco hard. He walks away from the celebration of survival. He feels hollow, not triumphant. He finds a quiet, dark room at the back of the Redoubt—an old cistern with still, black water. He sits by it. He tries to write a report, but he can only write 'Why?'. The 'Deep Work' concept of isolation is forced upon him.",
            "symbolism": "The Cistern = The Subconscious (Cups/Water). The darkness represents the 'Unknown' parts of himself. The inability to write 'official' words shows the failure of bureaucracy to capture the human experience.",
            "beat_goal": "Transition from Action to Reflection. Isolate the hero.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Exhaustion",
            "scene_tone": "Still and echoing",
            "timeline_date": "Post-Siege + 2 hours",
            "timeline_variant": "The Broken Redoubt (Cistern)",
            "location": "The Cistern Room",
            "narrative_function": "The Decompression.",
            "sudowrite_visual_details": [
                "The drip-drip-drip of water echoing in the dark.",
                "Francisco's reflection distorted in the black water.",
                "The trembling of his hands finally stopping."
            ],
            "learning_objective_integration": "Reflects 'Meditations'—retreating into one's own mind sanctuary."
        },
        {
            "scene_number": 2,
            "scene_title": "The Mirror",
            "setup": "La Signora enters. She doesn't speak at first. She just sits. She brings a 'Cup' (tea/water). She asks the Socratic question: 'What did you lose today?' Francisco answers 'My certainty.' She smiles. 'Good. Kings with certainty are dangerous. Kings with questions are wise.' She forces him to look at his fear not as a failure, but as a signal. This is the 'Reflective Practitioner' model—learning from the event.",
            "symbolism": "The Queen of Cups (La Signora) offering the Cup of Wisdom. The 'Mirror' conversation. Dealing with the Shadow Self.",
            "beat_goal": "Reframe the negative (Fear/Doubt) into a positive (Wisdom/Caution).",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Vulnerable openness",
            "scene_tone": "Intimate and soft",
            "timeline_date": "Post-Siege + 3 hours",
            "timeline_variant": "The Broken Redoubt",
            "location": "The Cistern Room",
            "narrative_function": "The Lesson.",
            "sudowrite_character_moments": [
                "La Signora pouring the tea with ritual precision.",
                "Francisco finally exhaling the breath he held for 10 pages.",
                "The ripple in the water smoothing out."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Integration",
            "setup": "Francisco remains alone. He meditates on the lesson. He visualizes the battle again, not with panic, but with detachment (Marcus Aurelius style). He sees the patterns of Dagon's attack he missed before because he was too busy being 'brave'. He realizes Dagon wasn't trying to kill them; he was trying to corral them. The fear *was* the weapon. By seeing this, he neutralizes it. He writes a new entry in his journal: 'The obstacle was the Fear. I have removed the obstacle.'",
            "symbolism": "The 'Third Eye' opening. Integrating the Shadow. The pen moving smoothly on the paper now (flow state).",
            "beat_goal": "The Epiphany. Gaining a tactical advantage through emotional insight.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Cold clarity",
            "scene_tone": "Lucid and sharp",
            "timeline_date": "Post-Siege + 5 hours",
            "timeline_variant": "The Broken Redoubt",
            "location": "The Cistern Room",
            "narrative_function": "The Growth.",
            "learning_objective_integration": "Demonstrates 'Deep Work'—distraction-free insight generation."
        },
        {
            "scene_number": 4,
            "scene_title": "The Return",
            "setup": "Francisco leaves the cistern. He walks back into the main camp. He looks different—calmer, heavier, but more grounded. The allies look to him. He doesn't shout. He speaks quietly, but everyone hears him. He gives orders that are nuanced, factoring in the fear he felt. He is no longer just the 'General' (Wands); he is the 'Philosopher King' (Cups + Swords). He has digested the experience and turned it into fuel.",
            "symbolism": "Emerging from the Cave/Womb. The literal 'Return' of the Hero. The quiet authority vs. the loud bravery of the previous chapter.",
            "beat_goal": "Resolution. Show the change in state. Prepare for the strategic shift in the next chapter.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Quiet power",
            "scene_tone": "Resonant",
            "timeline_date": "Post-Siege + 6 hours",
            "timeline_variant": "The Broken Redoubt (Main Hall)",
            "location": "Main Hall",
            "narrative_function": "The Return with the Elixir (Wisdom).",
            "sudowrite_visual_details": [
                "The water drying on his boots.",
                "The way the soldiers part to let him through without being asked.",
                "The clear, un-trembling hand pointing at the map."
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
    update_ea066()
