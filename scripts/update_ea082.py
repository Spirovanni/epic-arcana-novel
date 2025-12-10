
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea082():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-082
    target_id = "EA-082"
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
    stg_found["save_the_cat_beat_goal"] = "Face the 'Disruption' (Two of Wands) of the Vatican's ultimatum: serve the Church or be destroyed."
    stg_found["plot"] = "Inciting Incident: The carriage arrives. Francisco is taken to the Colonna Palace. The Cardinal plays the 'Two of Wands'—holding the world in one hand and a wand in the other. He offers Francisco dominion over history, but under Church rule. It is a disruption of Francisco's independent path. He must choose his future."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Negotiator. He realizes his academic bubble is popped. He is in the big leagues now.",
        "Cardinal_Colonna": "The Gatekeeper. He holds the keys to legal temporal manipulation.",
        "Novella": "The Voice of Caution. She urges him not to sign."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "political_landscape": "Introduces the Vatican's Temporal Authority.",
        "stakes_clarification": "It's not just about adventure anymore; it's about control."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "colonna_palace_study": "Opulent, filled with stolen artifacts from time.",
        "the_map_room": "A giant map, not of space, but of history."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_faustian_bargain": "This offer echoes throughout the series.",
        "the_temporal_compact": "The laws mentioned here become plot points in Book 5."
    }
    
    # Update Summary
    stg_found["summary"] = "Francisco is brought to Colonna. The Cardinal is polite but lethal. He shows Francisco a map of history with 'sanctioned' and 'heretical' timelines marked. He places the Two of Wands on the table. 'You have a choice, Magus. Stand on the parapet and look out at the world you could rule with us... or stay in your little room and burn.' It is the classic Disruption. Francisco's status quo is gone. He claims he needs time to think. Colonna gives him 24 hours."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Dread/Ambition",
    stg_found["scene_tone"] = "High Stakes"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Invitation",
            "setup": "The carriage ride. Silence. The Swiss Guard is armed with plasma pikes (anachronism). Francisco realizes this isn't a social call. He tries to use magic; dampeners in the carriage block him. He is powerless.",
            "symbolism": "The Cage. The blocking of the Ace (power).",
            "beat_goal": "The Reality Check. Establishing vulnerability.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Anxiety",
            "scene_tone": "Claustrophobic",
            "timeline_date": "Night + 1 hour",
            "timeline_variant": "The Carriage",
            "location": "Streets of Bologna",
            "narrative_function": "The Transport.",
            "learning_objective_integration": "Reflects 'The Innovator's DNA'—questioning constraints."
        },
        {
            "scene_number": 2,
            "scene_title": "The Offer",
            "setup": "Colonna's study. He pours wine. He talks about 'Order'. He reveals the Church's secret: they prune timelines to keep the 'Sacred Timeline' pure. He wants Francisco to be the Pruner. 'You have the talent. We have the mandate.' It is seductive. Order vs Chaos.",
            "symbolism": "The Apple. The High Mountain.",
            "beat_goal": "The Proposal. The villain makes sense.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Temptation",
            "scene_tone": "Seductive",
            "timeline_date": "Night + 2 hours",
            "timeline_variant": "Colonna Palace",
            "location": "The Cardinal's Study",
            "narrative_function": "The Temptation.",
            "sudowrite_character_moments": [
                "Colonna swirling the red wine.",
                "Francisco looking at the map of erased histories.",
                "The heat of the fireplace."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Planning",
            "setup": "Francisco is released. He returns to Novella. They pace the floor (Two of Wands pacing). 'If I say no, they kill me. If I say yes, they own me.' He looks at the wand in his hand. He needs a third option. He needs to Disrupt the game.",
            "symbolism": "The Crossroads. The Two Wands planted in the ground.",
            "beat_goal": "The Debate. Weighing options.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Desperation",
            "scene_tone": "Frenetic",
            "timeline_date": "Night + 4 hours",
            "timeline_variant": "Francisco's Apartment",
            "location": "Home",
            "narrative_function": "The Deliberation.",
            "learning_objective_integration": "Reflects 'Originals'—challenging the status quo."
        },
        {
            "scene_number": 4,
            "scene_title": "The Choice",
            "setup": "Dawn. The 24 hours are ticking. Francisco decides. He won't join, and he won't run. He will *infiltrate*. He will accept the offer to destroy it from within. It is a dangerous path. He tells Novella: 'I'll take their wand. And I'll use it to burn their map.'",
            "symbolism": "The Trojan Horse. The decision made.",
            "beat_goal": "Resolution (of the scene). The plan is set.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Resolve",
            "scene_tone": "Grim",
            "timeline_date": "Dawn",
            "timeline_variant": "Francisco's Apartment",
            "location": "Home",
            "narrative_function": "The Decision.",
            "sudowrite_visual_details": [
                "The sun rising over the red rooftops.",
                "Francisco packing a bag.",
                "The grim set of his jaw."
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
    update_ea082()
