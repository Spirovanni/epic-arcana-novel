import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea061():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-061
    target_id = "EA-061"
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
    stg_found["save_the_cat_beat_goal"] = "Pick up the pieces. The adrenaline of the battle is gone; now comes the Ten of Wands burden of recovery and repair."
    stg_found["plot"] = "The Road Back: The Alliance is alive but broken. They must choose to rebuild the Sanctuary (Diligence) rather than abandon it, facing the reality of their limitations."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Carries the Ten of Wands/Rings: the physical and magical exhaustion of leadership. Learns to share the burden before he breaks.",
        "La_Signora": "Becomes the 'Taskmaster' in the best sense—organizing the chaos when Francisco is too weak to lead.",
        "The_Alliance": "Moves from 'Crisis Mode' to 'Grief Mode' and then to 'Work Mode'."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "consequences_of_magic": "Shows the physical toll of channeling high-level reality distortions.",
        "resource_depletion": "The battle cost them 80% of their energy reserves; they are now critically low.",
        "morale_management": "How to keep people working when they just want to sleep or quit."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_ruined_plaza": "The once-beautiful epicenter now filled with rubble and magical residue.",
        "the_medici_makeshift_hospital": "A triaged area where magical injuries are treated with crude supplies."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "long_war_theme": "Establishes that winning a battle doesn't mean winning the war.",
        "infrastructure_vulnerability": "Highlights the weakness of their centralized base, foreshadowing the need for decentralization later."
    }
    
    # Update Summary
    stg_found["summary"] = "The morning after the duel with Dagon. The Sanctuary is still standing, but barely. Francisco wakes up unable to move (Ten of Wands exhaustion). The Council is debating evacuation. It would be easier to run. But running means admitting Dagon was right—that their creation was flawed. Francisco, supported by La Signora, orders the repair. It is a chapter of heavy lifting, clearing rubble, and stabilizing field generators. There is no glory here, only dust and fatigue. But as they work, they realize that they are healing themselves by healing the place. They earn their home a second time."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Exhaustion and grit"
    stg_found["scene_tone"] = "Somber but industrious"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "Waking Up in Ruins",
            "setup": "Francisco wakes up. His body feels like lead (Ten of Wands). He crawls out of the makeshift cot. He steps onto the balcony. The Plaza is a wreck. People are sitting in the dust, shell-shocked. There is no cheering. Just the sound of someone coughing. He feels the crushing weight of responsibility—he led them into this. He almost goes back inside. But he sees a child trying to stack two bricks together. He forces himself to walk down the stairs.",
            "symbolism": "The Ten of Wands reversed—being crushed by the burden. The 'Wreckage' as a mirror of his internal state.",
            "beat_goal": "Establish the cost. Move the hero from 'Victim' to 'Laborer'.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Despair fighting with duty",
            "scene_tone": "Grey and quiet",
            "timeline_date": "Post-Book 1 + 17 weeks (Morning)",
            "timeline_variant": "Sanctuary (Ruined)",
            "location": "The Plaza Balcony",
            "narrative_function": "The Reaction.",
            "sudowrite_visual_details": [
                "Grey dust coating the golden railings.",
                "Francisco's trembling hands.",
                "The silence where there used to be the hum of the machine."
            ]
        },
        {
            "scene_number": 2,
            "scene_title": "Triage",
            "setup": "The Council meeting is grim. The Alexandrians have the math: 'Structural integrity is at 12%. Evacuation is the logical outcome.' The Medicis agree; they want to retreat to a timeline they own. Francisco enters, looking like death. He doesn't argue the math. He argues the narrative. 'If we leave, we are refugees again. If we stay, we are owners.' La Signora backs him, not with words, but by burning the evacuation plans on the table. 'Diligence,' she says. 'We fix it.'",
            "symbolism": "Burning the Ships. The choice between 'Easy' (Quitting) and 'Hard' (Diligence).",
            "beat_goal": "The Decision. Committing to the hard path.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Stubborn resolve",
            "scene_tone": "Contentious",
            "timeline_date": "Post-Book 1 + 17 weeks (Noon)",
            "timeline_variant": "Sanctuary HQ",
            "location": "The Map Room",
            "narrative_function": "The Dilemma.",
            "learning_objective_integration": "Demonstrates 'The Dip'—pushing through the low point."
        },
        {
            "scene_number": 3,
            "scene_title": "The Heavy Lift",
            "setup": "The work begins. It is physical and magical. To re-align the anchors, they need to carry raw reality-shards. They are heavy—conceptually heavy (carrying the weight of what *could* have been). Francisco tries to carry too much. He collapses. His friends (Marco, Novella, even the defector Alexandrians) pick up the slack. They form a human chain, passing the burden. Francisco realizes the Ten of Wands isn't about carrying it all; it's about realizing you have ten wands and ten friends.",
            "symbolism": "The Ten of Wands upright—burden sharing. The 'Human Chain' as the structure of the Alliance.",
            "beat_goal": "The Action. Show the collective effort.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Humility",
            "scene_tone": "Sweaty and communal",
            "timeline_date": "Post-Book 1 + 17 weeks (Afternoon)",
            "timeline_variant": "The Anchor Chamber",
            "location": "The Reality Core",
            "narrative_function": "The Re-dedication.",
            "learning_objective_integration": "Reflects 'Shared Purpose' driving motivation."
        },
        {
            "scene_number": 4,
            "scene_title": "The New Normal",
            "setup": "Night falls. The hum returns, but it's different—lower, grittier. A patch job, but a solid one. They sit around fires in the plaza. They are too tired to celebrate. They just eat and sleep. Francisco looks at the scars on the buildings. They aren't perfect anymore. They look like they've been through a war. And that makes them more real. He sleeps without nightmares for the first time in weeks.",
            "symbolism": "Kintsugi (Golden Repair)—beauty in the brokenness. The 'Scar' as a medal.",
            "beat_goal": "Resolution. Acceptance of the new state.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Peaceful exhaustion",
            "scene_tone": "Quiet and secure",
            "timeline_date": "Post-Book 1 + 17 weeks (Night)",
            "timeline_variant": "Sanctuary (Repaired)",
            "location": "The Plaza",
            "narrative_function": "The Breath.",
            "sudowrite_character_moments": [
                "The low hum of the repaired generator.",
                "Francisco leaning his head back against a cracked pillar.",
                "The stars looking clear again."
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
    update_ea061()
