import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea063():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-063
    target_id = "EA-063"
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
    stg_found["save_the_cat_beat_goal"] = "Meeting with the Goddess/The Reward. The Hero gains a new understanding or power (Vision) that helps them prepare for the road back."
    stg_found["plot"] = "The Third Way: Francisco rises above the binary choice of Fight or Flight, finding a synthesis that only a true leader can see."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Demonstrates the Three of Wands/Rings: Vision. He stops reacting to Dagon and starts acting on his own terms.",
        "La_Signora": "Fulfills the 'Goddess' archetype, not by giving him a weapon, but by giving him perspective.",
        "The_Factions": "Move from 'Competing Interests' to 'Unified Command' under Francisco's new authority."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "strategic_impasse": "Resolves the deadlock between the aggressive and defensive factions.",
        "expansion_mechanic": "Introduces the concept of 'Seeding' new timelines, critical for the series climax.",
        "authority_crisis": "Solidifies Francisco's role as the unquestioned leader."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_spire": "The highest observation deck in the Sanctuary, symbolizing 'The Big Picture'.",
        "the_council_chamber": "The political arena where the battle of ideas takes place."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "expansion_theme": "The 'Seeding' strategy mimics Dagon's own viral nature, setting up the 'Fight Fire with Fire' theme.",
        "goddess_boon": "La Signora's guidance here is the turning point for Francisco's maturity."
    }
    
    # Update Summary
    stg_found["summary"] = "The Alliance is splintering. Without a clear enemy to fight right now, they are fighting each other. The Hawks want to attack; the Doves want to hide. Francisco is paralyzed by the validity of both arguments. La Signora takes him to the Spire. She shows him the Void outside the Sanctuary. 'You are looking at the walls,' she says. 'Look at the space.' She unlocks the Three of Wands archetype: Vision. Francisco realizes they don't have to defend or attack. They can *expand*. He returns to the Council with a new plan: 'Seeding'. They will create decoy timelines to split Dagon's focus. It is a plan so audacious it unites the room."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Inspired confidence"
    stg_found["scene_tone"] = "Elevated and political"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The War of Words",
            "setup": "The Council Chamber is a shouting match. Marco (Hawks) slams a map on the table: 'We hit his supply depots!' The Head Medici (Doves) counters: 'We reinforce the shields!' Francisco sits at the head of the table, silent. He tries to mediate, but mediation is failing. He realizes that 'compromise' will kill them. A half-attack, half-defense strategy is a losing strategy.",
            "symbolism": "The Two of Wands reversed—dominion disputes. The Cacophony.",
            "beat_goal": "Establish the impasse. The old way of leading (consensus) is broken.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Overwhelmed",
            "scene_tone": "Chaotic",
            "timeline_date": "Post-Book 1 + 18 weeks (Day 2)",
            "timeline_variant": "Sanctuary Council Room",
            "location": "The Council Chamber",
            "narrative_function": "The Conflict.",
            "sudowrite_visual_details": [
                "Spittle flying in the angry light.",
                "Francisco rubbing his temples.",
                "The map tearing down the middle."
            ]
        },
        {
            "scene_number": 2,
            "scene_title": "The View from the Top",
            "setup": "Francisco leaves the meeting. He finds La Signora waiting. She leads him up the endless stairs to the Spire. It is quiet up there. They look out at the swirling raw mana of the Void. 'Dagon plays Go,' she says. 'You are playing Chess. You are trying to capture pieces. He is trying to claim territory.' She hands him a telescope—not for seeing far, but for seeing *structure*. He sees the pattern. He stops thinking about the enemy and starts thinking about the board.",
            "symbolism": "The Mountain Top. The Eagle's View. The Three of Wands (Looking out to sea).",
            "beat_goal": "The Epiphany. Meeting the Goddess (Wisdom).",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Awe",
            "scene_tone": "Philosophical and grand",
            "timeline_date": "Post-Book 1 + 18 weeks (Sunset)",
            "timeline_variant": "The High Spire",
            "location": "The Spire",
            "narrative_function": "The Turning Point.",
            "learning_objective_integration": "Demonstrates 'Systems Thinking'—seeing the whole, not the parts."
        },
        {
            "scene_number": 3,
            "scene_title": "The Third Way",
            "setup": "Francisco returns to the Chamber. The argument hasn't stopped. He interrupts it—quietly. 'We are not attacking. We are not hiding.' He draws a new circle on the map: The Empty Zone. 'We are planting.' He explains the Seeding Strategy. Create false signals. Dilute Dagon's bandwidth. It appeals to the Hawks (it's offensive) and the Doves (it's evasive). It is synthesis.",
            "symbolism": "The Triangle merging two points. The 'Third Option'.",
            "beat_goal": "The Solution. Presenting the Vision.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Focus",
            "scene_tone": "Compelling",
            "timeline_date": "Post-Book 1 + 18 weeks (Night)",
            "timeline_variant": "Sanctuary Council Room",
            "location": "The Council Chamber",
            "narrative_function": "The Synthesis.",
            "learning_objective_integration": "Reflects 'Creative Problem Solving'—reframing the problem."
        },
        {
            "scene_number": 4,
            "scene_title": "The Order",
            "setup": "The room is silent. Then, Marco nods. Then the Medici. They aren't voting; they are agreeing. Francisco gives the orders. 'Marco, prep the seed units. Medici, calibrate the cloaking.' His voice has changed. It isn't a question anymore. He has become the Three of Wands: The Commander. The chapter ends with the teams moving out, unified by a single purpose.",
            "symbolism": "The Baton of Command. The Unification. The Ship setting sail.",
            "beat_goal": "Resolution. Authority established.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Commanding",
            "scene_tone": "Decisive",
            "timeline_date": "Post-Book 1 + 18 weeks (Late Night)",
            "timeline_variant": "Sanctuary HQ",
            "location": "The Map Room",
            "narrative_function": "The New Direction.",
            "sudowrite_character_moments": [
                "The tension leaving Marco's shoulders.",
                "La Signora watching from the shadows, smiling.",
                "Francisco marking the first 'X' on the new map."
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
    update_ea063()
