
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea070():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-070
    target_id = "EA-070"
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
    stg_found["save_the_cat_beat_goal"] = "Transform the 'Victory' into lasting resilience through 'Regeneration', ensuring the team is stronger for the next phase."
    stg_found["plot"] = "The Ultimate Boon: The immediate threat is gone, but the cost was high. Francisco leads the physical and spiritual rebuilding, proving that 'Resilience' is not just enduring, but improving."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Integrates the 'Nine of Wands'. He is tired, bandaged, but vigilant. He learns to rest without losing readiness.",
        "The_Wounded": "Allies who paid the price for the defense; their recovery is the focus.",
        "The_Sanctuary": "Physically rebuilt, integrating the 'scars' of the battle into new fortifications."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "consequences_of_battle": "Shows the aftermath. War isn't just winning; it's cleaning up.",
        "antifragile_theme": "Demonstrates how the system gets stronger from the stress."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_infirmary": "The center of the chapter. A place of pain but also healing.",
        "the_ruined_gate": "Now being rebuilt with stronger materials."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "healing_practices": "The regenerative magic learned here becomes essential for the final book.",
        "bonding_through_trauma": "The shared scars create an unbreakable loyalty."
    }
    
    # Update Summary
    stg_found["summary"] = "The dust settles on the 'Last Man' stand (EA-065). Francisco wakes up in the Infirmary. The battle is won, but the Redoubt is a ruin. 30% casualties. The mood is brittle. Francisco refuses to let them wallow. He initiates 'Regeneration'. He leads the Triage not just of bodies, but of the base itself. He uses the debris of the enemy legion to reinforce the walls—literal 'Antifragile' building. He holds a ritual for the fallen, turning grief into purpose. They end the chapter scarred, but harder."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Aching but alive"
    stg_found["scene_tone"] = "Sore and hopeful"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Triage",
            "setup": "Francisco wakes up. Pain. Noise. He stumbles out of the medical tent. The base is half-destroyed. People are crying. A young medic is overwhelmed. Francisco steps in. He doesn't use magic; he uses order. He categorizes the damage. 'Green. Red. Black.' He forces the chaos into a system again. He sees the cost of his 'Valor'—the broken bodies of those he saved.",
            "symbolism": "The Wounded King. The Ashes. The stark reality of the 'Morning After'.",
            "beat_goal": "Assess the damage. Face the cost.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Grim responsibility",
            "scene_tone": "Somber",
            "timeline_date": "Post-Siege + 1 day",
            "timeline_variant": "The Ruined Redoubt",
            "location": "The Infirmary",
            "narrative_function": "The Aftermath.",
            "sudowrite_visual_details": [
                "Bloody bandages in the mud.",
                "The smell of antiseptic and smoke.",
                "Francisco's limp."
            ],
            "learning_objective_integration": "Reflects 'The Power of Full Engagement'—managing energy in crisis."
        },
        {
            "scene_number": 2,
            "scene_title": "Antifragile",
            "setup": "The Engineer (from EA-068) is looking at the breached wall. 'We can rebuild it as it was.' Francisco shakes his head. 'No. Build it stronger.' He points to the wreckage of Dagon's war mashines. 'Use their armor.' They start welding the enemy's strength into their own defense. It is the core concept of Antifragility—the shock makes the system better. The work is therapeutic. The sound of construction replaces the sound of weeping.",
            "symbolism": "Kintsugi (repairing with gold). Turning the poison into the cure. The Nine of Wands (the bandaged defender).",
            "beat_goal": "The Pivot from Grief to Action. Regeneration begins.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Constructive anger",
            "scene_tone": "Building momentum",
            "timeline_date": "Post-Siege + 2 days",
            "timeline_variant": "The Perimeter",
            "location": "The Breach",
            "narrative_function": "The Rebuilding.",
            "learning_objective_integration": "Demonstrates 'Antifragile'—gaining from disorder."
        },
        {
            "scene_number": 3,
            "scene_title": "The Ritual",
            "setup": "The physical work is done, but the morale is still low. They need to bury the dead. Francisco organizes a ceremony. It's not religious; it's temporal. They 'lock' the memories of the fallen into the timeline foundation. They become part of the base's history. It honors the grief without letting it paralysis them. Francisco speaks: 'They are the mortar. We are the stone.'",
            "symbolism": "The Funeral Pyre / The Cornerstone. Transforming ghosts into ancestors.",
            "beat_goal": "Emotional Closure. Binding the team together.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Solemnity",
            "scene_tone": "Sacred",
            "timeline_date": "Post-Siege + 3 days",
            "timeline_variant": "The Memorial Garden",
            "location": "The Central Courtyard",
            "narrative_function": "The Healing.",
            "sudowrite_character_moments": [
                "Francisco placing his own Seven of Wands staff on the pyre.",
                "Novella taking his hand.",
                "The silence that is peaceful, not empty."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "The Strengthened Bone",
            "setup": "A week later. The Redoubt is different. Ugly, perhaps, with its patchwork armor, but impenetrable. The team is different too. They move with a 'survivor's swagger'. They know they can take the hit. Francisco stands on the new wall (Nine of Wands imagery). He is vigilant. He knows Dagon will come again. But he smiles. 'Let them come.' They have regenerated.",
            "symbolism": "The Scar. The Fortified Hill. The shift from 'Pre-War Innocence' to 'Post-War Strength'.",
            "beat_goal": "Resolution. The Boon is integrated. They are ready for the next phase.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Quiet confidence",
            "scene_tone": "Strong",
            "timeline_date": "Post-Siege + 1 week",
            "timeline_variant": "The Iron Redoubt",
            "location": "The Wall",
            "narrative_function": "The Reward.",
            "learning_objective_integration": "Reflects 'Rest'—active recovery builds capacity."
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
    update_ea070()
