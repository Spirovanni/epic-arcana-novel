
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea054():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-054
    target_id = "EA-054"
    stg_found = None
    
    # Traverse to find the STG
    # Note: Structure is deeply nested. A recursive search is best or we can assume the specific path if known, 
    # but the outline structure seems to be: SelfImprovementSeries -> Books -> trilogies -> ... -> Specific_task_groups
    
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
    
    # New content for EA-054
    stg_found["save_the_cat_beat_goal"] = "Test Francisco's new leadership and the Unity Council's cohesion by presenting a threat that cannot be met with force, but only with adaptability—the core lesson of the Seven of Swords."
    stg_found["plot"] = "Guardians and Gatekeepers: The newly formed Unity Council faces its first asymmetrical threat—agents of Dagon who use the factions' own rigidity against them."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Must transition from pure idealist (Unity) to pragmatist (Adaptability), learning that a fixed plan is a brittle plan.",
        "Timeline_Factions": "Must learn that their traditional strengths (Byzantine force, Alexandrian logic) are liabilities against a shapeshifting enemy unless they can adapt.",
        "Dagon_Agents": "Introduce the 'Faceless'—agents who mimic timeline natives to sow discord, serving as the perfect test for the theme of Adaptability."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "tactical_evolution": "Shows how the Unity Council actually fights—not just politically (Chapter 13) but tactically (Chapter 14).",
        "enemy_definition": "Clarifies Dagon's methods—infiltration and subversion rather than frontal assault.",
        "seven_of_swords_integration": "Demonstrates the necessity of 'guile' and flexible thinking in a way that reframes the card from 'thief' to 'strategist'."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "unity_council": "The Hall of Junctions—now established as HQ, but shown to have vulnerabilities.",
        "the_shifting_labyrinth": "A localized temporal anomaly used as a training ground or trap.",
        "venetian_nexus": "A specific timeline junction where the infiltration takes place."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "future_betrayal": "The ease of infiltration here sets up the paranoia that will eventually lead to the major betrayal in Book 3.",
        "francisco_strategist": "Marks the beginning of Francisco's reputation as a 'trickster hero' similar to Odysseus, crucial for his later victories."
    }
    
    # Update Summary
    stg_found["summary"] = "The Unity Council's first operation is sabotaged by Dagon's 'Faceless' agents, who exploit the factions' rigid protocols. Francisco realizes that standard responses play into the enemy's hands. Drawing on the Seven of Swords, he devises an unorthodox plan that requires the stiff Byzantines and logical Alexandrians to swap roles and embrace unpredictability, turning the tide by becoming unreadable to their enemies."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Frustration turning to cunning resolve"
    stg_found["scene_tone"] = "Tense, cerebral, and dynamic"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Rigid Response Fails",
            "setup": "A critical timeline junction in 15th-century Venice is destabilizing. Francisco deploys a 'textbook' Unity response: Byzantine enforcers to hold the perimeter, Alexandrians to calculate the fix. But the destabilization accelerates—it feeds on their energy. The enemy is not a random breach but a Faceless agent mirroring their tactics. The harder the Byzantines push, the stronger the anomaly gets. Francisco watches from the Command Center as his perfect system begins to crumble, realizing that Dagon knows their playbook better than they do.",
            "symbolism": "The Seven of Swords reversed—failed plans, clumsiness, getting caught in one's own trap. The 'feeding' anomaly represents the danger of rigidity—force applied without adaptation only strengthens the problem. The failure of the 'perfect system' symbolizes the limitation of pure Unity without Adaptability.",
            "beat_goal": "Demonstrate that the Unity Council's current methods are predictable and therefore vulnerable. Establish the 'Faceless' enemy who turns strength into weakness. Drive Francisco to a moment of tactical crisis where he must abandon the 'proper' way.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Alarm and frustration",
            "scene_tone": "Urgent and chaotic",
            "timeline_date": "Post-Book 1 + 9 weeks",
            "timeline_variant": "Primary Timeline / Venetian Nexus",
            "location": "Temporal Command Center & Venetian Nexus (via monitor)",
            "narrative_function": "The 'Test' that fails. Shows the hero that the old way (or even the new way of Chapter 13) is insufficient.",
            "sudowrite_tone_guidance": "High stakes, frenetic energy. Contrast the calmness of the plan with the chaos of the result.",
            "learning_objective_integration": "Illustrates 'Who Moved My Cheese?' principle: The old cheese (standard tactics) is gone. They must smell the new cheese (adaptation)."
        },
        {
            "scene_number": 2,
            "scene_title": "Drawing the Seven of Swords",
            "setup": "Francisco retreats to his study, staring at the Seven of Swords card. He realizes they are being outplayed because they are being 'honorable' and predictable. He calls a hasty war room meeting. He proposes a radical switch: The Byzantines won't fight; they'll cast the illusion. The Alexandrians won't calculate; they'll charge. The goal is to create 'noise' that the Faceless cannot predict. The faction leaders resist—it goes against their nature. Francisco must convince them that facing a shapeshifter requires becoming formless.",
            "symbolism": "The Seven of Swords upright—strategy, cunning, mental agility. 'Becoming formless' connects to 'Antifragile' concepts—gaining from disorder. The card represents the pivot point: abandoning force for wit.",
            "beat_goal": "Francisco reframes the situation and rallies his allies to a risky, non-intuitive plan. Overcoming their internal rigidity (the internal Gatekeeper) to face the external Guardian.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Intellectual clarity and persuasive urgency",
            "scene_tone": "Argumentative but intellectual",
            "timeline_date": "Post-Book 1 + 9 weeks (Hours later)",
            "timeline_variant": "Primary Timeline",
            "location": "Temporal Command Center - War Room",
            "narrative_function": "The Planning/Pivot scene. The hero accepts the need for change.",
            "sudowrite_character_moments": [
                "The Byzantine General's insult at being asked to use 'magic tricks'.",
                "The Alexandrian Scholar's terror at being asked to be the vanguard.",
                "Francisco's quiet confidence as he holds the Sword card."
            ],
            "learning_objective_integration": "Demonstrates 'Antifragile' thinking—designing a response that thrives on chaos."
        },
        {
            "scene_number": 3,
            "scene_title": "The Feint and the Strike",
            "setup": "The plan goes into motion. The Faceless agent in Venice expects another energy containment field. Instead, they get chaos—Byzantine illusions creating fake breaches, while Alexandrian 'berserkers' (using tech, not muscle) disrupt the local physics. The Faceless agent tries to adapt but pauses—confused by the lack of pattern. In that split second of hesitation, Francisco (projecting his consciousness) and a small strike team steal the stolen timeline energy back, collapsing the anomaly from the inside. They don't defeat the agent with power; they trick it into overextending.",
            "symbolism": "The Seven of Swords in action—stealing victory rather than winning it. The 'split second of hesitation' represents the triumph of OODA loop speed (Observe-Orient-Decide-Act) over raw power. The 'theft' of energy mirrors the card's traditional imagery of the thief sneaking away.",
            "beat_goal": "Execute the adaptive plan. Show the Faceless enemy defeated by unpredictability. Validate Francisco's growth as a strategist who can use his allies' weaknesses as strengths.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Exhilaration and vindication",
            "scene_tone": "Fast-paced, clever, and triumphant",
            "timeline_date": "Post-Book 1 + 9 weeks (The Strike)",
            "timeline_variant": "Venetian Nexus",
            "location": "Venice 1450 (Timeline Junction)",
            "narrative_function": "The Victory. Proof of concept for the new theme (Adaptability).",
            "sudowrite_visual_details": [
                "Canals boiling with temporal energy.",
                "The Faceless agent—a void in the shape of a man, rippling with confusion.",
                "The Seven of Swords symbol flashing in Francisco's mind as the trap springs."
            ],
            "learning_objective_integration": "Validates 'Adapt' (Tim Harford)—success came from a trial-and-error approach that broke the rules."
        },
        {
            "scene_number": 4,
            "scene_title": "The New Protocol",
            "setup": "Back at headquarters, the mood is different. The victory was messy and unorthodox, but it worked. Francisco debriefs the team. They establish a new 'Protocol 7' (named for the card): when standard logic fails, switch to chaos. The factions are unsettled—they prefer order—but they respect the result. Francisco realizes this is just the beginning; Dagon has many faces, and they will need to be endlessly adaptable to survive. He looks at the timeline monitor; it's stable, but he sees how fragile that stability is.",
            "symbolism": "Protocol 7 represents the institutionalization of adaptability—making 'change' a standard operating procedure. The 'unsettled' feeling acknowledges that adaptability is uncomfortable, but necessary. The looking at the monitor reflects the heavy crown of leadership—vigilance.",
            "beat_goal": " Consolidate the lesson. Establish 'Adaptability' not just as a one-time trick, but as a new doctrine for the Unity Council. Close the chapter with the team stronger but warier.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Sober satisfaction",
            "scene_tone": "Reflective and forward-looking",
            "timeline_date": "Post-Book 1 + 9 weeks (Debrief)",
            "timeline_variant": "Primary Timeline",
            "location": "Temporal Command Center",
            "narrative_function": "The Resolution. Lock in the character growth and prepare for the next challenge.",
            "sudowrite_character_moments": [
                "Francisco filing the Seven of Swords back into his deck, but keeping it near the top.",
                "A nod of respect from the Byzantine General—'It was... effective.'",
                "Francisco's internal thought: 'We survived today. Tomorrow, they will change again.'"
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
    update_ea054()
