
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea073():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-073
    target_id = "EA-073"
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
    stg_found["save_the_cat_beat_goal"] = "Secure the 'Magic Flight' route by using 'Benevolence' to win over a neutral faction essential for the exit."
    stg_found["plot"] = "The Flight (Part 1): The Redoubt is besieged by Dagon's new offensive. Francisco needs to move the Council to safety. The only path is through the territory of the 'Grey Traders', who hate them. He must use Generosity (Six of Disks) to buy passage, not with bribes, but with genuine aid."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Practices 'The Go-Giver'. Learns that giving away power can generate more power.",
        "The_Grey_Traders": "Cynical survivors who are won over by an act of unexpected kindness.",
        "The_Council": "Skeptical of Francisco's 'soft' approach; they want to fight through."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "escape_route": "Explains how a large group moves through hostile territory undetected.",
        "ethical_leadership": "Contrasts Francisco's generosity with Dagon's tyranny."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_boundary_lands": "A grey, misty zone between timelines where the Traders hide.",
        "the_orphanage": "A hidden enclave of timeline-displaced children the Traders are protecting."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_network": "The Traders become the courier network for the Resistance.",
        "karma_mechanic": "The good deed here comes back to save Francisco in Book 3."
    }
    
    # Update Summary
    stg_found["summary"] = "The 'Golden Hour' (EA-072) ends. Dagon attacks with overwhelming force. They cannot hold the Redoubt forever. They need to relocate. The only exit is through the Boundary Lands, controlled by the hostile Grey Traders. The Council wants to fight them. Francisco refuses. He meets the Trader Captain. He sees their camp is starving. Instead of demanding passage, he offers the Redoubt's food surplus (from EA-072). He gives it freely, asking nothing. This 'Six of Disks' act—giving to the scales—shocks the Traders. They not only grant passage; they offer to guide them. Generosity opened the door that force would have sealed."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Generous risk"
    stg_found["scene_tone"] = "Diplomatic and humane"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Call for Help",
            "setup": "The Redoubt is under fire. Dagon's siege engines are pounding the walls. The 'Legacy' (EA-071) is threatened. They need to leave. A distress signal comes from the Boundary Lands. It's the Grey Traders. They are pinned down by a Dagon patrol. The Council says 'Let them die; it's a distraction.' Francisco says 'No. We help.'",
            "symbolism": "The Distress Flare. The ignored plea. The choice between Self-Preservation and Benevolence.",
            "beat_goal": "The Moral Choice. Choosing to act against tactical logic.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Empathic resolve",
            "scene_tone": "Urgent",
            "timeline_date": "Post-Siege + 3 months",
            "timeline_variant": "War Room",
            "location": "War Room",
            "narrative_function": "The Test.",
            "learning_objective_integration": "Demonstrates 'The Go-Giver'—placing others' interests first."
        },
        {
            "scene_number": 2,
            "scene_title": "The Gift",
            "setup": "Francisco leads a sortie to save the Traders. They drive off the patrol. He meets the Captain, a suspicious, scarred woman. She expects a demand for payment. Francisco sees their starving children (The Orphanage). He calls for the supply wagons. He starts unloading the food. 'This is for you.' The Captain is stunned. 'What do you want?' 'Nothing. We are neighbors.'",
            "symbolism": "The Bread breaking. The Six of Disks image (merchant giving alms). The scales balancing.",
            "beat_goal": "The Action. The unexpected act of grace.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Pure generosity",
            "scene_tone": "Moving",
            "timeline_date": "Hours later",
            "timeline_variant": "The Grey Camp",
            "location": "The Boundary Lands",
            "narrative_function": "The Turn.",
            "sudowrite_visual_details": [
                "The Captain's hand hovering over her weapon, then dropping.",
                "The children's eyes widening at the fresh fruit.",
                "Francisco's soldiers looking proud, not angry."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Exchange",
            "setup": "That night, in the Trader camp. The Captain sits with Francisco. She explains why they hide. Dagon hunts them. Because Francisco helped them, she trusts him. She reveals a secret path through the 'Slipstream' that Dagon doesn't know. It's the 'Magic Flight' route. 'You gave us life,' she says. 'We give you the road.' The Reciprocity Loop (Give and Take) completes.",
            "symbolism": "The Map appearing on the table. The shaking of hands. The circle closing.",
            "beat_goal": "The Reward. The solution appears because of the character's virtue.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Validated",
            "scene_tone": "Secretive",
            "timeline_date": "Night",
            "timeline_variant": "Captain's Tent",
            "location": "Trade Camp",
            "narrative_function": "The Boon.",
            "learning_objective_integration": "Reflects 'Give and Take'—successful givers create value."
        },
        {
            "scene_number": 4,
            "scene_title": "The Open Road",
            "setup": "The withdrawal begins. The Redoubt is evacuated. The Grey Traders guide the convoy into the mists. Dagon's forces breach the empty base moments later. They find nothing. Francisco looks back at the empty shell of his 'Legacy'. It hurts to leave, but he knows the *people* are safe because he chose Benevolence over Defense. They vanish into the Slipstream.",
            "symbolism": "The Empty Fortress. The Fog swallowing the army. The transition from Earth (Redoubt) to Air (Flight).",
            "beat_goal": "Resolution. The Escape begins.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Bittersweet relief",
            "scene_tone": "Misty",
            "timeline_date": "Next Morning",
            "timeline_variant": "The Slipstream",
            "location": "The Boundary",
            "narrative_function": "The Departure.",
            "sudowrite_character_moments": [
                "Novella nodding to the Trader Captain.",
                "Francisco checking the rear guard one last time.",
                "The silence of the fog."
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
    update_ea073()
