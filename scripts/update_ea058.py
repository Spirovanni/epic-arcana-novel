
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea058():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-058
    target_id = "EA-058"
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
    stg_found["save_the_cat_beat_goal"] = "Transition from the high drama of diplomacy to the grueling reality of logistics. The test is not bravery, but consistency."
    stg_found["plot"] = "The Road of Trials: The 'Glamour' fades. Francisco must operationalize the alliance, dealing with boredom, supply chains, and the slow grind of preparation. A crisis occurs that cannot be solved with a speech or a battle, but only by 'Holding the Line'."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Integrates the Knight of Pentacles: reliability, routine, and attention to detail. Learning that 'boring' work saves lives.",
        "La_Signora": "Becomes the 'Quartermaster', channeling her tactical mind into logistics.",
        "Timeline_Factions": "Chafe under the new discipline but learn to respect the stability it brings."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "logistics_of_war": "Answers 'How do they eat? Where do they sleep?' in a timeline war.",
        "pacing_bridge": "Provides a necessary lull/grounding before the next major conflict.",
        "knight_of_pentacles_meaning": "Reclaims the card from 'dull' to 'essential'."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_supply_lines": "The literal timeline threads connecting Venice to the Sanctuary, now heavily guarded.",
        "the_watchtower": "A lonely outpost where Francisco takes a shift."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "infrastructure": "The supply lines built here are used throughout the rest of the series.",
        "character_maturity": "Marks the end of Francisco's 'Impulsive Hero' phase."
    }
    
    # Update Summary
    stg_found["summary"] = "With the Venetian alliance secured, the real work begins. The romance of rebellion is replaced by the grind of logistics. Supply lines must be fortified, protocols established, and egos managed. Francisco struggles with the monotony (Knight of Pentacles) until a subtle sabotage threatens the supply chain. It's not a dramatic attack, but a slow corrosion. Francisco catches it not through brilliance, but through checking the logs. He realizes that 'Patient Leads'—the willingness to do the unglamorous work—is the only way to sustain a movement. He ends the chapter standing guard, content in the quiet duty."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Steady endurance"
    stg_found["scene_tone"] = "Methodical and grounded"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Hangover of Victory",
            "setup": "The day after the Venetian treaty. Everyone is partying or posturing. Francisco enters the command center. It's a mess. The 'Big Picture' is solved, but the details are crumbling. Food shipments are late. The portal stabilizers are misaligned. He realizes that 'Diplomacy' (last chapter) was the easy part. 'Execution' is the hard part. He cancels the victory parade and orders a inventory audit. The troops grumble. He feels like a killjoy, but the Knight of Pentacles knows that a parades don't win wars.",
            "symbolism": "The Knight of Pentacles reversed—stuck in the mud, drudgery. The contrast between the 'Goblet' (Cups) and the 'Coin' (Pentacles). The 'Inventory' as a symbol of reality checking.",
            "beat_goal": "Establish the new conflict: Logistical entropy. Challenge Francisco's patience.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Frustrated responsibility",
            "scene_tone": "Dry and administrative",
            "timeline_date": "Post-Book 1 + 13 weeks",
            "timeline_variant": "Sanctuary HQ",
            "location": "The Command Center",
            "narrative_function": "The Reality Check.",
            "sudowrite_visual_details": [
                "Stacks of paper manifestos cluttering the map table.",
                "Francisco rubbing his temples.",
                "The distant sound of uncorked celebrations contrasting with the silence of the work."
            ],
            "learning_objective_integration": "Demonstrates 'Atomic Habits'—systems over goals."
        },
        {
            "scene_number": 2,
            "scene_title": "The Routine",
            "setup": "Montage of the 'Grind'. Francisco establishing the 'Empathy' protocols (from STG title, subtly woven in). He listens to the complaints of the supply runners. He checks the perimeter fences personally. He creates a schedule and sticks to it. It is repetitive. It is unglamorous. But slowly, the chaos recedes. Predictability emerges. The faction leaders, initially annoyed, start to relax. They know that when they wake up, the coffee will be there and the shields will hold. Trust is built through consistency.",
            "symbolism": "The Knight of Pentacles upright—methodical progress. The 'Schedule' as a holy text. The 'Fence' as a boundary of safety.",
            "beat_goal": "Show the value of the 'Boring' work. Francisco earns a different kind of respect—not awe, but reliance.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Quiet satisfaction",
            "scene_tone": "Rhythmic and calm",
            "timeline_date": "Post-Book 1 + 14 weeks",
            "timeline_variant": "Sanctuary HQ",
            "location": "Various (Perimeter, Mess Hall, Office)",
            "narrative_function": "The Process. Showing the work.",
            "learning_objective_integration": "Reflects 'Good to Great'—the Flywheel effect."
        },
        {
            "scene_number": 3,
            "scene_title": "The Rot in the Lines",
            "setup": "During a routine inspection of the Logs (Logistics), Francisco notices a 0.5% variance in energy output. A 'Hero' would ignore it. A 'General' would delegate it. A 'Knight of Pentacles' investigates it. He traces the line to a junction point. He finds a 'Rust Moth'—a bio-temporal sabotage agent planted by Dagon. It eats supply lines silently. If he hadn't checked the logs, the entire Sanctuary would have collapsed in a week. He neutralizes it not with a sword, but with a exclusion seal (maintenance magic).",
            "symbolism": "The 'Rust Moth' represents entropy/neglect. The '0.5% variance' represents the detail that matters. The victory is silent; no one even knows he saved them.",
            "beat_goal": "Validate the method. The 'boring' work saved the day. The threat was invisible to anyone not paying attention to the details.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Vindication",
            "scene_tone": "Investigative and tense",
            "timeline_date": "Post-Book 1 + 15 weeks",
            "timeline_variant": "Supply Junction Alpha",
            "location": "The Conduit Tunnel",
            "narrative_function": "The Crisis/Climax (of the chapter).",
            "sudowrite_visual_details": [
                "The moth pulsating with a sick, grey light.",
                "Francisco's breath held in the tight tunnel.",
                "The seal snapping shut with a dull thud."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "The Watchtower",
            "setup": "Francisco returns to the Watchtower. La Signora joins him. She asks why he did it himself. He says, 'Because I am the only one patient enough to look.' She nods. She offers him a cup of coffee (black, practical). They look out over the Sanctuary. It is humming perfectly. It is boring. And it is safe. Francisco realizes he has grown. He doesn't need the applause anymore. He just needs the machine to work.",
            "symbolism": "The Watchtower—eternal vigilance. The 'Black Coffee'—sobriety/grounding. The 'Hum' of the machine—the music of the Pentacles.",
            "beat_goal": "Resolution. Character growth affirmed. He is ready for the next phase because his foundation is solid.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Serenity",
            "scene_tone": "Quiet and ending",
            "timeline_date": "Post-Book 1 + 15 weeks (Night)",
            "timeline_variant": "Sanctuary Ramparts",
            "location": "The Watchtower",
            "narrative_function": "The calm before the next storm.",
            "sudowrite_character_moments": [
                "Francisco leaning on his spear (symbolically, the staff of the Knight).",
                "The stars of the Void looking less threatening now.",
                "A shared silence that is comfortable, not awkward."
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
    update_ea058()
