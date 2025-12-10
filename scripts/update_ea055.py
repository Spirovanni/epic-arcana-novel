
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea055():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-055
    target_id = "EA-055"
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
    stg_found["save_the_cat_beat_goal"] = "Confront the destruction of reality by Dagon's agents and counter it with the only force they cannot replicate: creation born of human emotion."
    stg_found["plot"] = "Guardians and Gatekeepers: The 'Faceless' shift from infiltration to erasure, forcing Francisco to master the King of Cups—emotional creativity—to build a sanctuary."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Moves from 'strategist' (Seven of Swords) to 'architect' (King of Cups), learning that true leadership involves creating new possibilities, not just managing existing ones.",
        "Timeline_Factions": "Must overcome their despair at seeing reality erased and learn to trust in the 'impossible' act of creation.",
        "Dagon_Agents": "Reveal their limitation: they can mimic and destroy, but they cannot create. This is their Achilles' heel."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "temporal_mechanics": "Defines 'erasure' vs. 'instability'—erasure is a void where physics fails.",
        "emotional_magic": "Establishes that timeline stability is intrinsically linked to the observer's emotional state/belief.",
        "king_of_cups_integration": "Demonstrates the card's meaning of 'emotional mastery' as a tool for governance and creation."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_void": "A terrifying expanse of non-existence where a timeline used to be; cold, silent, and maddening.",
        "the_first_sanctuary": "A pocket reality constructed from memory and will, initially unstable but solidified by shared emotion."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "creation_power": "This first act of creation foreshadows the climax of the series where the protagonist must remake the universe.",
        "emotional_anchor": "Establishes the mechanic that 'love binds reality', a key theme for the resolution of the romance arc."
    }
    
    # Update Summary (Already similar, but tightening)
    stg_found["summary"] = "Facing a 'dead zone' where Dagon's agents have erased a timeline, Francisco realizes that tactical adaptation is insufficient against non-existence. He must channel the King of Cups—mastery of the unconscious and creative force—to build a stable pocket reality. By anchoring this new space in the collective positive emotions of the Council, he creates a fortress that the loveless Faceless agents cannot breach, proving that creation is the ultimate counter to destruction."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Despair turning to inspired awe"
    stg_found["scene_tone"] = "Surreal, ethereal, and profound"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Edge of Nothing",
            "setup": "Following the victory in Venice, the Council tracks the retreating Faceless agent to a Sector 4 timeline. They arrive to find... nothing. Not a chaotic timeline, but a white void. The agent didn't just destabilize the timeline; they deleted it. The Alexandrians act irrationally, terrified by the absence of data. The Byzantines try to 'secure' the perimeter, but there is no perimeter. Francisco feels the crushing weight of the Void—it's not just empty space, it's an aggressive negation of life. He realizes the enemy's goal isn't conquest, but unmaking.",
            "symbolism": "The Void represents the absence of the Cup—emotional emptiness, the desert of the soul. The panic of the scholars represents the failure of the intellect (Swords) when faced with the irrational/sublime. The 'aggressive negation' is the shadow side of the King of Cups—manipulative nihilism.",
            "beat_goal": "Establish the stakes: Dagon creates Void. Strip away the Council's confidence from the previous chapter. Introduce the need for a power that can fill the emptiness.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Existential dread",
            "scene_tone": "Quiet, cold, and terrifying",
            "timeline_date": "Post-Book 1 + 10 weeks",
            "timeline_variant": "The Void (formerly Sector 4)",
            "location": "The Edge of the Void",
            "narrative_function": "The 'All is Lost' echo / The new problem that requires a new tool.",
            "sudowrite_visual_details": [
                "The edge of the timeline looking like a torn drawing.",
                "Sound being swallowed instantly by the white mist.",
                "Alexandrian instruments spinning wildly before dying."
            ],
            "learning_objective_integration": "Reflects 'Creative Confidence'—the fear of the blank page (or blank reality) paralyzing action."
        },
        {
            "scene_number": 2,
            "scene_title": "The Emotional Blueprint",
            "setup": "Francisco gathers the terrified Council. He pulls the King of Cups. He realizes that to exist here, they must *impose* existence. They cannot repair; they must create. He asks them not for calculations or battle plans, but for memories. 'What is the most stable thing you know?' He guides them into a shared trance (King of Cups mastery). He weaves the Medici desire for beauty, the Alexandrian desire for order, and the Byzantine desire for safety into a single lattice. It's an act of pure emotional engineering.",
            "symbolism": "The King of Cups is the 'Architect of Emotions'. Using memories as bricks symbolizes 'Steal Like an Artist'—remixing the past to create the future. The shared trance represents the 'collective unconscious' becoming conscious.",
            "beat_goal": "Francisco shifts from strategist to creator. He unifies the Council on an emotional level, not just a tactical one. The first sparks of the new reality appear.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Intense concentration and vulnerability",
            "scene_tone": "Intimate and mystical",
            "timeline_date": "Post-Book 1 + 10 weeks (Hours later)",
            "timeline_variant": "The Void",
            "location": "The Formless Drift",
            "narrative_function": "The Discovery. Using the new theme (Creative Force) to solve the problem.",
            "sudowrite_character_moments": [
                "The Medici diplomat recalling a sunset in Florence (Beauty).",
                "The Byzantine General recalling the walls of Constantinople (Safety).",
                "Francisco weaving these images together with golden thread."
            ],
            "learning_objective_integration": "Demonstrates 'The Artist's Way'—using ritual/routine (the trance) to access creativity."
        },
        {
            "scene_number": 3,
            "scene_title": "Construction of the Sanctuary",
            "setup": "The pocket reality begins to manifest—a surreal amalgamation of a Renaissance piazza, a library, and a fortress. It's unstable; 'glitches' appear where fear creeps in. Francisco must manage the emotional tone of the group like a conductor. When the Alexandrians doubt, the walls crumble. Francisco steps in with the King of Cups energy: calm, assured dominance of the emotional field. He suppresses his own doubt to anchor them. The Sanctuary solidifies. It is real because they believe it is.",
            "symbolism": "The Sanctuary is the 'World' built from 'Cups' (Water/Emotion). The glitches representing fear show the direct link between mind and reality. Francisco as conductor embodies the King—control without force.",
            "beat_goal": "The successful creation of the 'Sanctuary'. Validating that emotional creativity can manipulate the physical world (or temporal world).",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Exhaustion and wonder",
            "scene_tone": "Dreamlike but becoming solid",
            "timeline_date": "Post-Book 1 + 10 weeks",
            "timeline_variant": "The First Sanctuary",
            "location": "The Newly Created Piazza",
            "narrative_function": "The Proof. The tool works.",
            "sudowrite_tone_guidance": "Magical realism. The wonder of seeing thought become matter.",
            "learning_objective_integration": "Showcases 'rapid prototyping'—they built a version, saw it glitch, and refined it in real-time."
        },
        {
            "scene_number": 4,
            "scene_title": "The Soulless Invader",
            "setup": "A Faceless agent returns to finish the job. It steps onto the edge of the new Sanctuary. But the ground burns it. The reality is made of 'remembered beauty' and 'shared hope'—frequencies the Faceless cannot hold. The agent tries to mimic the environment but produces a grotesque parody (uncanny valley) and is rejected by the very physics of the place. It dissolves, unable to exist in a high-emotion environment. Francisco realizes: Creativity is their shield. Dagon cannot enter where there is true creation.",
            "symbolism": "The rejection of the Faceless agent symbolizes that 'Artificial Intelligence' (or soulless mimicry) cannot replace the 'Human Soul' (King of Cups). The burning ground represents the protective power of positive emotion. Adaptation strategy (previous chapter) + Creative Force (this chapter) = Unbeatable defense.",
            "beat_goal": "Demonstrate the defensive utility of the new power. Establish the enemy's weakness (lack of soul/creativity). Secure the Sanctuary as a permanent base.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Triumph and relief",
            "scene_tone": "Victorious and philosophical",
            "timeline_date": "Post-Book 1 + 10 weeks",
            "timeline_variant": "The First Sanctuary",
            "location": "The Sanctuary Gates",
            "narrative_function": "The Resolution. A new capability (creating safe harbors) is unlocked.",
            "sudowrite_visual_details": [
                "The Faceless agent's foot smoking as it touches the cobblestones.",
                "The grotesque distortion of the agent trying to look like a 'friend'.",
                "The Sanctuary humming with a warm, golden light."
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
    update_ea055()
