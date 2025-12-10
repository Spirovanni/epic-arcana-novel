
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea076():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-076
    target_id = "EA-076"
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
    stg_found["save_the_cat_beat_goal"] = "Initiate 'Rescue from Without' by forming an 'Ambitious Circle' (Knight of Disks) to amplify their signal across timelines."
    stg_found["plot"] = "Rescue from Without (Part 1): They are surviving (EA-075), but they are stuck. Francisco needs to contact the Resistance. The problem is interference. He organizes the team into a 'Team of Teams' to build a complex beacon, assigning roles based on talent, not rank (Knight of Disks efficiency)."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Acts as the 'Connector'. He builds the human network that builds the machine.",
        "The_Specialists": "Characters like the Engineer and the Mystic have to work together without ego.",
        "The_Skeptics": "Those who think the signal will just attract more enemies."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "communication_method": "Explains how cross-timeline comms work.",
        "team_dynamics": "Shows the group functioning as a unit, not just followers."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_beacon_site": "A high point in the raw landscape where reception is best.",
        "the_war_room": "A circle of crates where they plan."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_first_contact": "The voice they hear is a major cameo from Book 1.",
        "network_protocols": "The codes established here are used in the Book 3 climax."
    }
    
    # Update Summary
    stg_found["summary"] = "Survival is stable. Now, Escape. Francisco gathers his 'Ambitious Circle'. He puts the Knight of Disks card on the table: hard work, reliability, detail. He breaks the problem (No Signal) into sub-problems (Power, Frequency, Encryption). He assigns micro-teams. 'Eyes on, hands off.' He trusts them to execute. They build a Beacon from scrap. Tensions rise as the work is grindingly hard. But the structure holds. They fire the signal. It punches through the static. A voice answers: 'We hear you. We are coming.'"
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Collaborative focus"
    stg_found["scene_tone"] = "Industrious"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Silos",
            "setup": "Work on the Beacon is stalled. The Engineers aren't talking to the Mystics. Both think the other is useless. Francisco sees the 'Silo Effect'. He interrupts the argument. 'You are trying to solve the whole problem alone. Stop.' He forces them to swap roles for an hour. Empathy facilitates flow.",
            "symbolism": "The Babel Tower (confusion) vs. The Hive (coordination).",
            "beat_goal": "The Friction. Identifying the team failure.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Frustrated patience",
            "scene_tone": "Argumentative",
            "timeline_date": "Post-Crash + 3 days",
            "timeline_variant": "The Work Site",
            "location": "Beacon Site",
            "narrative_function": "The Obstacle.",
            "learning_objective_integration": "Demonstrates 'Team of Teams'—breaking silos."
        },
        {
            "scene_number": 2,
            "scene_title": "The Network",
            "setup": "Francisco restructures the team. He creates a 'Shared Consciousness' daily briefing. Everyone knows what everyone else is doing. The Knight of Disks approach: methodical, unglamorous, effective. The work speed triples. The Beacon rises—a mix of twisted metal and glowing runes. It is ugly but perfect.",
            "symbolism": "The Geodesic Dome (many parts, one structure). The Knight of Disks plodding forward.",
            "beat_goal": "The Solution. The team gels.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Flow",
            "scene_tone": "Harmonious",
            "timeline_date": "Post-Crash + 5 days",
            "timeline_variant": "The Work Site",
            "location": "Beacon Site",
            "narrative_function": "The Build.",
            "sudowrite_visual_details": [
                "Sparks flying in rhythm.",
                "The hum of the magic aligning with the hum of the generator.",
                "Handshakes between rivals."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Signal",
            "setup": "The moment of truth. They activate the Beacon. It draws massive power (The Energy Audit comes later). The beam shoots into the purple sky. They wait. Minutes pass. The Skeptics sneer. 'It failed.' Then, the static clears. A pattern emerges. A voice. It is faint, but clear. 'Identify. Identify.'",
            "symbolism": "The Lighthouse. The Thread in the dark.",
            "beat_goal": "The Climax (of the chapter). Success.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Awe",
            "scene_tone": "Tense silence",
            "timeline_date": "Post-Crash + 1 week",
            "timeline_variant": "The Comms Desk",
            "location": "Base Zero",
            "narrative_function": "The Breakthrough.",
            "learning_objective_integration": "Reflects 'Collaboration'—synergy creates results."
        },
        {
            "scene_number": 4,
            "scene_title": "The Contact",
            "setup": "Francisco takes the mic. He gives the code. The voice confirms. It is General [Name Redacted - Book 1 Cameo]. 'Hold fast. We have your coordinates. Rescue is inbound. ETA 12 hours.' The camp erupts in cheers. But Francisco sees the sensors spike. The signal didn't just attract friends; it attracted *everything*.",
            "symbolism": "The Handshake across time. The Warning Light.",
            "beat_goal": "Resolution. Hope mixed with new danger.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Relief and dread",
            "scene_tone": "Celebratory but ominous",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Comms Desk",
            "location": "Base Zero",
            "narrative_function": "The Setup for next chapter.",
            "sudowrite_character_moments": [
                "Francisco gripping the table until his knuckles are white.",
                "The tears on Novella's face.",
                "The red light blinking on the threat radar."
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
    update_ea076()
