
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea057():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-057
    target_id = "EA-057"
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
    stg_found["save_the_cat_beat_goal"] = "Secure a critical alliance not through conquest or coercion, but through the radical act of vulnerability—the Two of Cups."
    stg_found["plot"] = "The Road of Trials: Francisco attends the 'Banquet of Knives', a diplomatic trap set by the Venetian Doge. He must turn an assassination attempt into a wedding of interests."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Masters the art of 'Diplomatic Aikido'—using an opponent's aggression to create connection.",
        "Doge_Venier": "The antagonist of the chapter; a master manipulator who represents the cynical 'Old World' view of alliances.",
        "Timeline_Factions": "Watch from the sidelines, learning that their leader can fight with words as well as magic."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "political_landscape": "Fleshes out the political powers of the timeline (Venice) as a major player.",
        "non_violent_conflict": "Demonstrates conflict resolution that doesn't involve battle magic.",
        "two_of_cups_integration": "Shows the card's meaning of 'truce' and 'union' in a high-stakes political context."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "palazzo_ducale_temporal": "A version of the Doge's Palace existing in a time-loop of the year 1450.",
        "the_bridge_of_sighs": "The physical meeting point where the deal is struck."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "venetian_fleet": "Securing Venice's help provides the naval support needed for Book 3's sea battles.",
        "francisco_statesman": "Establishes Francisco as a legitimate political figure, not just a rebel leader."
    }
    
    # Update Summary
    stg_found["summary"] = "To secure the resources needed for the Sanctuary (EA-056 fallout), Francisco enters the lion's den: a diplomatic summit with Doge Venier of the Venetian Temporal Fleet. The Doge intends to humiliate and absorb Francisco's movement. Francisco applies the lesson of 'Optimism' and the Two of Cups (Union). He refuses to be provoked, instead finding the hidden emotional need of the Doge—legacy. By offering a partnership that honors Venice's history rather than threatening it, he turns a hostile negotiation into a powerful alliance, proving that shared interest is stronger than coercion."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Tense charm and empathetic focus"
    stg_found["scene_tone"] = "Machevillian but hopeful"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Banquet of Knives",
            "setup": "Francisco arrives at the Palazzo Ducale. He is stripped of weapons (and magic dampeners are active). The court jeers at him—the 'Beggar King' of the Sanctuary. Doge Venier toasts to his 'imminent failure'. Francisco smiles. He uses 'Learned Optimism' to reframe the insults as fears. 'They shout because they are afraid of what we represent.' He doesn't defend himself; he compliments the wine. He compliments the architecture. He disarms them with aggressive civility. He spots the Doge's hidden weakness: a portrait of a lost son.",
            "symbolism": "The Two of Cups reversed—false friendship, treachery. The 'Banquet' is a classic trap trope, subverted by the hero's refusal to be the victim. The 'Portrait' is the key hole for empathy.",
            "beat_goal": "Survive the initial social assault. Identify the emotional lever needed to turn the table.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Cool under pressure",
            "scene_tone": "Lavish and hostile",
            "timeline_date": "Post-Book 1 + 12 weeks",
            "timeline_variant": "Venice Prime (1450)",
            "location": "Banquet Hall of the Palazzo Ducale",
            "narrative_function": "The Setup. Establishing the antagonist's power and the hero's vulnerability.",
            "sudowrite_visual_details": [
                "Masked revelers whispering behind fans.",
                "The Doge's ring tapping rhythmically on the glass.",
                "Francisco's plain clothes amidst the velvet and gold."
            ],
            "learning_objective_integration": "Demonstrates 'Emotional Intelligence'—reading the room and emotional regulation."
        },
        {
            "scene_number": 2,
            "scene_title": "The Crucial Conversation",
            "setup": "Francisco maneuvers a private audience on the balcony. The Doge drops the pretense: 'Submit or be erased.' Francisco ignores the threat and asks about the son (the portrait). The Doge freezes. It's a risk. Francisco speaks of legacy—of building something that lasts beyond the loop. He connects his Sanctuary (from the previous chapter) to the Doge's desire for permanence. He offers not submission, but a 'Union' (Two of Cups). 'Venice rules the waves; we rule the winds of time. Together, we are the storm.'",
            "symbolism": "The Two of Cups upright—offering the cup. The balcony represents the 'Bridge'. The switch from 'War' language to 'Legacy' language is the 'Turn'.",
            "beat_goal": "Shift the conflict from power (who is stronger) to value (what can we build together). Create the emotional connection.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Sincere vulnerability",
            "scene_tone": "Intimate and high-stakes",
            "timeline_date": "Post-Book 1 + 12 weeks",
            "timeline_variant": "Venice Prime (1450)",
            "location": "The Doge's Balcony",
            "narrative_function": "The Pivot. The hero changes the game.",
            "sudowrite_character_moments": [
                "The Doge's mask slipping slightly (metaphorically).",
                "Francisco leaning regularly on the balustrade, showing trust.",
                "The silence of the canal below mirroring the pause in hostility."
            ],
            "learning_objective_integration": "Showcases 'Crucial Conversations'—creating safety to talk about high-stakes topics."
        },
        {
            "scene_number": 3,
            "scene_title": "The Attack",
            "setup": "The faction opposed to the alliance (The Council of Ten) attacks. They realize the Doge is wavering and try to assassinate both of them. Suddenly, Francisco and the Doge are fighting back-to-back. Francisco uses his time-slowing (limited in the dampening field) to save the Doge. The Doge uses his knowledge of the palace traps to save Francisco. The physical battle cements the emotional bond formed in the previous scene. They are no longer negotiator and hostage; they are partners.",
            "symbolism": "The forging of the alliance in fire. The 'Two' fighting as one. trust built through action.",
            "beat_goal": "Cement the alliance. Prove Francisco's worthiness as a partner, not just a talker.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Adrenaline and synchronicity",
            "scene_tone": "Action-packed",
            "timeline_date": "Post-Book 1 + 12 weeks",
            "timeline_variant": "Venice Prime (1450)",
            "location": "Palace Corridors / Bridge of Sighs",
            "narrative_function": "The Catalyst. The external threat forces the decision.",
            "sudowrite_visual_details": [
                "Daggers flashing in torchlight.",
                "Francisco shouting warnings before they happen.",
                "The Doge offering his hand to pull Francisco up."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "The Wedding of Interests",
            "setup": "The dust settles. The assassins are captured. The Doge publicly embraces Francisco as 'Brother of the Republic'. The alliance is signed. Venice will supply the Sanctuary; Francisco will protect Venice's timeline from Dagon. As Francisco leaves, he looks back. He didn't conquer Venice; he befriended it. He realizes that 'Optimism' isn't blindness—it's the strategic choice to see potential friends in enemies.",
            "symbolism": "The Two of Cups realized—the pledge. The 'Wedding' imagery (political, not romantic). The fleet of Venice turning their prows to support the Sanctuary.",
            "beat_goal": "Resolution. Verify the gain (resources + fleet). Validate the theme (Diplomacy > War).",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Satisfaction and fatigue",
            "scene_tone": "Grand and triumphant",
            "timeline_date": "Post-Book 1 + 12 weeks (Dawn)",
            "timeline_variant": "Venice Prime",
            "location": "The Grand Canal Docks",
            "narrative_function": "The Reward.",
            "learning_objective_integration": "Reflects 'The Empathy Edge'—empathy created a competitive advantage."
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
    update_ea057()
