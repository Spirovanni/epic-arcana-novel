import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea060():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-060
    target_id = "EA-060"
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
    stg_found["save_the_cat_beat_goal"] = "Survive the Midpoint Disaster. The protagonist confronts the antagonist and realizes the true scale of the threat."
    stg_found["plot"] = "The Supreme Ordeal: Dagon manifests in the Sanctuary to test Francisco's 'Backbone'. It is a siege of willpower, not just magic."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Demonstrates the Nine of Wands/Rings: batterd but standing. He learns that he cannot defeat Dagon yet, but he can *endure* him.",
        "Dagon": "Reveals his motivation: not destruction, but 'optimization'. He sees the Sanctuary as a flaw to be corrected.",
        "Novella": "Refuses to flee, grounding Francisco when his resolve wavers."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "villain_power_scale": "Establishes Dagon as a cosmic force, vastly outclassing Francisco in raw power.",
        "sanctuary_durability": "Tests the limits of the pocket reality's defenses.",
        "midpoint_shift": "Shifts the narrative from 'Building' (Reactive) to 'Surviving' (Active Defense)."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_eye_of_dagon": "A localized reality distortion field that overtakes the Sanctuary Plaza.",
        "the_cracked_foundations": "Physical manifestations of the stress being placed on the timeline."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "dagon_nature": "Hints at Dagon's true origin (Book 7 reveal).",
        "scars_of_leadership": "Francisco receives a physical or metaphysical scar that he carries for the rest of the series."
    }
    
    # Update Summary
    stg_found["summary"] = "The Midpoint Climax. Dagon breaches the Sanctuary, not with an army, but personally. He freezes time for everyone except Francisco. He engages Francisco in a duel of structure—trying to unmake the reality Francisco built. Francisco realizes he cannot win a contest of power. Instead, he channels the 'Nine of Rings' (Fortitude). He turns himself into a living anchor, absorbing the stress of the timeline. The pain is immense. Dagon is intrigued by this 'illogical' endurance and withdraws, leaving the Sanctuary damaged but standing. Francisco collapses, alive only because he refused to break."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Agony and stubbornness"
    stg_found["scene_tone"] = "Epic and overwhelming"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Eye of the Storm",
            "setup": "The alarms don't ring. They just stop existing. The sky turns the color of a bruise. Dagon steps out of the air in the center of the Plaza. He looks like a man, but the geometry around him is wrong. Francisco confronts him. Dagon speaks calmly: 'Your construction is inefficient. I have come to delete it.' He offers Francisco a choice: Step aside and be spared, or hold the line and be erased. The temptation is real—Francisco knows he is outmatched.",
            "symbolism": "The Devil (Temptation) vs. The Nine of Wands (Refusal). Dagon as the 'Architect of Entropy'.",
            "beat_goal": "The Arrival. Establish the impossible odds.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Terrified awe",
            "scene_tone": "Quiet dread",
            "timeline_date": "Post-Book 1 + 17 weeks",
            "timeline_variant": "Sanctuary Plaza (Distorted)",
            "location": "The Epicenter",
            "narrative_function": "The Ordeal Begins.",
            "sudowrite_visual_details": [
                "Birds frozen in mid-flight above the plaza.",
                "Dagon's shadow falling in the wrong direction.",
                "The sound of grinding stone (reality straining)."
            ]
        },
        {
            "scene_number": 2,
            "scene_title": "The Stress Test",
            "setup": "The duel begins. It is not fireballs; it is physics. Dagon increases the gravitational constant of the pocket dimension. Buildings start to buckle. Bones creak. Francisco counters by reinforcing the 'Concept' of the Sanctuary (using King of Cups creativity hardened into Nine of Rings solidity). He pours his own life force into the walls. 'You say it is weak; I say it is Home.' It is a battle of definitions. Dagon defines them as 'Error'. Francisco defines them as 'Necessary'.",
            "symbolism": "The Weight of the World. Atlas holding the sky. fortitude as a structural force.",
            "beat_goal": "The Struggle. Show the cost of resistance. Physical torment.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Physical agony",
            "scene_tone": "Visceral and heavy",
            "timeline_date": "The Long Minute",
            "timeline_variant": "Sanctuary (Cracking)",
            "location": "The Plaza",
            "narrative_function": "The Conflict.",
            "learning_objective_integration": "Demonstrates 'Grit'—perseverance over long periods (even if seconds feel like hours)."
        },
        {
            "scene_number": 3,
            "scene_title": "The Breaking Point",
            "setup": "Francisco is failing. The pain is too much. He sees the cracks in the library, the fountain, the faces of his frozen friends. He wants to let go. Dagon whispers: 'It is simple entropy, Francisco. Let it fall.' Then, Novella (who has some resistance due to her origin) moves. She doesn't attack Dagon; she touches Francisco's hand. That single connection breaks Dagon's logic. 'Why reinforce a failing structure?' Francisco smiles through blood teeth. 'Because I love it.' He anchors the reality not in logic, but in love.",
            "symbolism": "Love as the 'Fifth Element' or the 'glitch' in Dagon's system. The 'Touch' grounding the hero.",
            "beat_goal": "The Turn. Finding the strength that Dagon cannot calculate.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Defiant love",
            "scene_tone": "Transcendent",
            "timeline_date": "The Breaking Point",
            "timeline_variant": "Sanctuary (Stable)",
            "location": "The Anchor Point",
            "narrative_function": "The Climax.",
            "sudowrite_character_moments": [
                "Novella's hand fighting gravity to reach him.",
                "Dagon's brow furrowing for the first time.",
                "The golden light of the Sanctuary pushing back the bruise-colored sky."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "Still Standing",
            "setup": "Dagon stops. He calculates. To destroy them now would require energy expenditure that exceeds his 'Efficiency' parameters. He assesses Francisco: 'You are... anomalously durable.' He fades away, leaving a warning that this was only a test. Time crashes back into motion. The birds fly. The buildings settle. Francisco falls to his knees. He didn't win. He didn't hurt Dagon. But the Sanctuary is still there. The 'Nine of Rings' is the card of the survivor.",
            "symbolism": "The Survivor standing amidst the wreckage. Victory redefined as 'Not Losing'.",
            "beat_goal": "Resolution. Survival. Counting the cost.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Exhausted relief",
            "scene_tone": "Quiet aftermath",
            "timeline_date": "Post-Book 1 + 17 weeks (Evening)",
            "timeline_variant": "Sanctuary (Scarred)",
            "location": "The Plaza Ruins",
            "narrative_function": "The Reward (Survival).",
            "learning_objective_integration": "Reflects 'Resilience'—bouncing back (or just standing up)."
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
    update_ea060()
