
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea065():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-065
    target_id = "EA-065"
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
    stg_found["save_the_cat_beat_goal"] = "The Ordeal (Atonement). Francisco faces the ultimate test of 'Valor' (Seven of Wands) by holding the line alone."
    stg_found["plot"] = "The Last Stand: The evacuation routes are compromised. Francisco must embody the Seven of Wands—taking the high ground against overwhelming odds—to buy time for the Order to escape. It is a moment of pure, isolated heroism where he discovers the difference between 'fighting to win' and 'fighting to save'."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Transcends the role of 'Commander' to become the 'Shield'. He accepts that he may not survive, and finds peace in the purpose.",
        "Novella": "Experiences the trauma of being forced to leave him behind, cementing her future resolve.",
        "The_Legion": "Revealed as a terrifying, unified consciousness that highlights the value of Francisco's individual defiance."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "heroic_limit": "Shows the upper limits of Francisco's combat ability and stamina.",
        "emotional_anchor": "Establishes the bond with Novella as the thing he fights for.",
        "tactical_sacrifice": "Demonstrates the necessity of rearguard actions in war."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_bottleneck_corridor": "A narrow, debris-filled passage that Francisco turns into a kill box.",
        "the_shimmering_gate": "The fragile exit point that must be protected at all costs."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "legend_building": "The survivors will tell the story of this stand, building the myth of the 'Eternal'.",
        "physical_scars": "Francisco will carry the wounds from this battle into Book 3."
    }
    
    # Update Summary
    stg_found["summary"] = "The 'Game' is over. The Legion breaches the perimeter—a tidal wave of grey, faceless soldiers. The evacuation is chaotic. Francisco realizes the choke point at Sector 7 is the only thing stopping a massacre. He sends Novella and the others through the Gate, despite her screams. He stays back. Standing atop a pile of rubble (symbolizing the Seven of Wands' high ground), he faces the horde. He fights with wand, fists, and sheer will. He holds for 43 minutes. He is cut, burned, and exhausted, but he refuses to yield. Finally, as the Gate closes, he detonates the ceiling supports, burying the Legion and himself in darkness, with only a sliver of hope for survival."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Defiant Valor",
    stg_found["scene_tone"] = "Desperate/Cinematic"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Wave Breaks",
            "setup": "The alarms dissolve into the roar of impact. The outer wards shatter. Francisco sees the Legion pouring in—not chaotic, but terrifyingly synchronized. He realizes the simulation drills were child's play. This is extermination. He grabs the Quartermaster. 'Abandon the supplies. Save the people.'",
            "symbolism": "The Broken Shield. The Tsunami.",
            "beat_goal": "The Realization. Shifting gears to survival mode.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Clarity",
            "scene_tone": "Catastrophic",
            "timeline_date": "D-Day",
            "timeline_variant": "Sanctuary",
            "location": "Central Hub",
            "narrative_function": "The Stakes.",
            "learning_objective_integration": "Reflects 'Daring Greatly'—vulnerability in the face of failure.",
            "sudowrite_visual_details": [
                "The lights flickering red and dying.",
                "The dust falling from the ceiling tremors.",
                "The eerie silence of the Legion's advance."
            ]
        },
        {
            "scene_number": 2,
            "scene_title": "The Hardest Push",
            "setup": "The corridor to the Gate is clogged. Novella is trying to organize a defense, but they are overrun. Francisco makes the call. He creates a kinetic barrier, shoving his own allies—including Novella—towards safety. He locks eyes with her. 'This is my post,' he says. It's a lie to make her leave, but a truth for his soul.",
            "symbolism": "The Severed Bond. The Door Closing.",
            "beat_goal": "The Sacrifice. Cutting the cord.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Love/Grief",
            "scene_tone": "Intimate/Tragic",
            "timeline_date": "D-Day + 10 mins",
            "timeline_variant": "Corridor",
            "location": "Blast Doors",
            "narrative_function": "The Emotional Climax.",
            "sudowrite_character_moments": [
                "The tear tracking through the dust on Novella's cheek.",
                "The finality of the locking mechanism clicking shut.",
                "Francisco turning his back on safety."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "Seven of Wands",
            "setup": "Alone. The blast doors are behind him. The Legion is in front. He climbs a mound of fallen masonry. He holds his wand like a spear. The imagery is exact—the Seven of Wands. He is the Vantage Point. They come at him from below. He fights with a 'Valorous' frenzy. Spells, rubble, gravity. He is not fighting to live; he is fighting for the clock ticking in his head.",
            "symbolism": "The High Ground. The Lone Wolf.",
            "beat_goal": "The Action Climax. Absolute defiance.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Feral Determination",
            "scene_tone": "Visceral/Mythic",
            "timeline_date": "D-Day + 30 mins",
            "timeline_variant": "The Choke Point",
            "location": "Ruined Corridor",
            "narrative_function": "The Test of Valor.",
            "learning_objective_integration": "Reflects 'Man's Search for Meaning'—suffering with purpose.",
            "sudowrite_visual_details": [
                "The blue-white arc of magical exhaustion.",
                "The pile of enemies growing into a ramp.",
                "Francisco's ragged breathing dominating the soundscape."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "Buried",
            "setup": "Time is up. The Gate signal fades (they are away). Francisco has nothing left. His wand is cracked. The Legion surges up the mound. He looks up at the unstable archway. 'Bring it down.' He blasts the keystone of the arch. The world ends in a roar of stone. Darkness. Silence. Then, a faint groan in the dust.",
            "symbolism": "The Tomb. The Womb (Rebirth).",
            "beat_goal": "The Resolution. The cost paid.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Acceptance",
            "scene_tone": "Heavy/Final",
            "timeline_date": "D-Day + 45 mins",
            "timeline_variant": "Rubble",
            "location": "Under the Mountain",
            "narrative_function": "The Cliffhanger.",
            "sudowrite_character_moments": [
                "The weight of the stone pressing on his chest.",
                "The absolute darkness.",
                "The fading memory of Novella's face."
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
    update_ea065()
