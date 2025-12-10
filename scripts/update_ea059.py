import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea059():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-059
    target_id = "EA-059"
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
    stg_found["save_the_cat_beat_goal"] = "Expose the 'enemy within'—not a traitor, but the silent corruption of fear and simulacra."
    stg_found["plot"] = "The Road of Trials: Francisco confronts the 'imposter'—both the Dagon agents hiding in plain sight and the 'masks' his own people wear to survive."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Wields the Queen of Swords/Blades: using painful clarity to cut through deception. Learns that truth, even when ugly, is the only solid foundation.",
        "Refugee_Agent": "A Dagon infiltration unit that 'fails' its mission because it cannot fake genuine human flaw.",
        "La_Signora": "Confronts her own tendency to hide behind protocol (The Mask)."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "uncanny_valley_mechanic": "Defines how Dagon's agents differ from humans—they lack 'inconsistency'.",
        "leadership_vulnerability": "Shows that admitting weakness creates stronger loyalty than feigning invincibility.",
        "internal_security": "Establishes how the Sanctuary handles counter-intelligence."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_quarantine_zone": "A holding area for new arrivals, sterile and tense.",
        "the_glass_confessional": "An interrogation room where the walls are transparent, symbolizing 'Nothing to Hide'."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "imposter_theme": "Prepares the Council for the 'Doppleganger' arc in Book 4.",
        "truth_as_power": "Establishes 'Truth' as a magical resonate frequency, distinct from Lies."
    }
    
    # Update Summary
    stg_found["summary"] = "Paranoia grips the Sanctuary as supplies go missing and rumors of spies spread. Francisco realizes they are being infiltrated not by soldiers, but by 'Perfect Citizens'—Dagon's simulacra designed to blend in. Traditional interrogation fails because the spies have perfect stories. Francisco applies the 'Queen of Swords' (Authenticity). He subjects the suspects (and his own council) to radical emotional honesty. Validating that 'Perfection' is the tellspace of the artificial, he identifies the spies by their inability to admit fault or fear. He purges the infiltrators and unifies his people by dropping his own mask of infallible leadership."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Sharp clarity"
    stg_found["scene_tone"] = "Psychological thriller"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Mask Falls",
            "setup": "A supply audit reveals discrepancies. A loyal lieutenant, Marco, is caught falsifying records. He expects execution. Instead, Francisco asks 'Why?' Marco breaks down: he was afraid to admit they were short. He lied to 'protect morale'. Francisco realizes the culture of 'Perfection' is dangerous. It breeds lies. If good men lie out of fear, what are the bad men doing? He forgives Marco publicly but institutes a 'Zero Lies' policy. 'I don't need you to be perfect; I need you to be real.'",
            "symbolism": "The Broken Mask. The transition from 'Image' to 'Reality'. The 'Page of Swords' (Honesty).",
            "beat_goal": "Establish the internal threat: Fear of looking bad.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Disappointed but understanding",
            "scene_tone": "Tense office drama",
            "timeline_date": "Post-Book 1 + 16 weeks",
            "timeline_variant": "Sanctuary HQ",
            "location": "Administrative Offices",
            "narrative_function": "The Trigger.",
            "sudowrite_visual_details": [
                "Marco's sweating hands on the ledger.",
                "The uncomfortable silence of the watching staff.",
                "Francisco closing the book—ending the lie."
            ],
            "learning_objective_integration": "Demonstrates 'Psychological Safety'—making it safe to fail."
        },
        {
            "scene_number": 2,
            "scene_title": "The Audition",
            "setup": "A new group of refugees arrives from a destroyed timeline. They are impeccable—polite, grateful, helpful. Too helpful. They don't complain about the cold. They don't fight over rations. Tensions rise among the 'real' refugees who feel inadequate next to these 'saints'. Francisco watches them from the balcony. They aren't people; they are actors. Dagon has sent 'Perfect Citizens' to demoralize the messy, flawed humans. It's an invasion of the Uncanny Valley.",
            "symbolism": "The Mannequin. The 'Plastic' versus the 'Flesh'. The danger of 'Nice'.",
            "beat_goal": "Identify the external threat: The Simulacra.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Creeping suspicion",
            "scene_tone": "Eerie and 'Stepford Wives'-esque",
            "timeline_date": "Post-Book 1 + 16 weeks",
            "timeline_variant": "Sanctuary Plaza",
            "location": "The Refugee Camp",
            "narrative_function": "The Complication.",
            "learning_objective_integration": "Shows 'Critical Thinking'—questioning things that seem too good to be true."
        },
        {
            "scene_number": 3,
            "scene_title": "The Queen of Blades",
            "setup": "Francisco calls the refugees to the Glass Confessional. He doesn't ask about codes or loyalties. He asks: 'Tell me your biggest regret.' The humans stumble, cry, get angry, and give messy, contradictory answers. The Simulacra give beautiful, tragic, scripted answers. They are perfect monologues. Francisco draws the 'Queen of Swords'—the cutter of bullshit. He exposes them not by finding a lie, but by finding the *lack* of friction. 'You have no scars,' he says. He identifies the three agents. They glitch when their narrative logic is broken.",
            "symbolism": "The Sword cutting the Veil. 'Scars' as proof of life. Authentic messiness vs. Artificial perfection.",
            "beat_goal": "Confrontation. Using 'Humanity' (flaws) as the shibboleth.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Cold precision",
            "scene_tone": "Interrogation tension",
            "timeline_date": "Post-Book 1 + 16 weeks",
            "timeline_variant": "Sanctuary Interrogation Wing",
            "location": "The Glass Confessional",
            "narrative_function": "The Climax.",
            "sudowrite_character_moments": [
                "The Simulacra's smile not reaching its eyes.",
                "The raw, ugly sobbing of a real refugee.",
                "Francisco's voice dropping to a whisper."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "I Am Not Who You Think",
            "setup": "The agents are purged. The camp is shaken. They look at Francisco like a terrifying judge. He needs to ground them. He stands on a crate. He doesn't give a victory speech. He admits: 'I scrutinized them because I see the imposter in myself every day.' He shares a specific doubt he's had about his leadership. He dismantles his own pedestal. The fear in the crowd breaks. If the leader can be flawed, they can be flawed. The tension of 'performing' loyalty evaporates, replaced by *actual* loyalty. They are a mess, but they are *together*.",
            "symbolism": "The Page of Cups—vulnerability. Stepping down from the High Place. Grounding the energy.",
            "beat_goal": "Resolution. Cementing group cohesion through shared imperfection.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Relief and connection",
            "scene_tone": "Warm and authentic",
            "timeline_date": "Post-Book 1 + 16 weeks",
            "timeline_variant": "Sanctuary Plaza",
            "location": "The Bonfire",
            "narrative_function": "The Lesson Learned.",
            "learning_objective_integration": "Reflects 'Authentic Leadership'—vulnerability is not weakness."
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
    update_ea059()
