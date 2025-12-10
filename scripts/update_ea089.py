
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea089():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-089
    target_id = "EA-089"
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
    stg_found["save_the_cat_beat_goal"] = "Provide 'Calming Guidance' (Six of Swords) to refugees, moving from the chaos of the trial to smoother waters."
    stg_found["plot"] = "Refusal of the Call (The Pivot): Francisco escapes the trial but realizes he isn't alone. The paradox from EA-087 displaced a family (Refugees). He can't leave them. He charters a boat to take them downriver to a sanctuary. The Six of Swords imagery: calm travel, carrying baggage (the refugees/past). He teaches them to breathe through the temporal sickness. He finds his own calm."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Guide. He stops being the victim of the plot and starts leading.",
        "The_Refugee_Family": "Mirrors of the family he lost.",
        "The_Boatman": "A Charon figure, silent but watchful."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "human_cost": "Showing what happens to ordinary people in magic wars.",
        "magus_responsibility": "Why he fights."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_river_po": "Misty, quiet, a transition space.",
        "the_barge": "Crowded but safe."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "the_sanctuary": "This location becomes a base in Book 4."
    }
    
    # Update Summary
    stg_found["summary"] = "Night on the river. The boat glides silently. Francisco sits with the refugee family. The mother is sick from temporal displacement. Francisco uses his magic not to fight, but to soothe. He teaches her a breathing exercise (Calming Guidance). The water is smooth (Six of Swords). He realizes that running away isn't cowardice if you are guiding others to safety. He accepts his role as a protector."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Peace",
    stg_found["scene_tone"] = "Quiet/Flowing"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Charter",
            "setup": "The docks. Fog. Francisco pays the boatman with the last of his university coin. He helps the family onboard. They are terrified. He speaks softly. 'You are safe with me.'",
            "symbolism": "The Ferry. Leaving the shore.",
            "beat_goal": "The Departure. Establishing the mission.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Protective",
            "scene_tone": "Secretive",
            "timeline_date": "Night",
            "timeline_variant": "River Docks",
            "location": "The Boat",
            "narrative_function": "The Transition.",
            "learning_objective_integration": "Reflects 'Emotional Intelligence'—empathy."
        },
        {
            "scene_number": 2,
            "scene_title": "The Sickness",
            "setup": "Mid-river. The mother starts shaking. Temporal radiation. Francisco kneels. He can't heal it, but he can stabilize it. He places his hands on her. He guides her breath. 'In... Out... The time is here. The time is now.'",
            "symbolism": "The Healer. The Breath.",
            "beat_goal": "The Crisis. Using magic for care.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Compassion",
            "scene_tone": "Intimate",
            "timeline_date": "Midnight",
            "timeline_variant": "The Boat",
            "location": "Deck",
            "narrative_function": "The Bonding.",
            "learning_objective_integration": "Reflects 'Wherever You Go, There You Are'—mindfulness."
        },
        {
            "scene_number": 3,
            "scene_title": "The Discussion",
            "setup": "The father asks Francisco why he is helping. 'I thought you were one of them.' Francisco looks at the water. 'I was. Now I am just... moving.' He explains the Six of Swords philosophy: You have to carry the swords (pain) with you, but you don't have to let them sink the boat.",
            "symbolism": "The Swords in the Boat. Baggage.",
            "beat_goal": "The Philosophy. Articulating the theme.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Melancholy",
            "scene_tone": "Philosophical",
            "timeline_date": "0200 Hours",
            "timeline_variant": "The Boat",
            "location": "Stern",
            "narrative_function": "The Theme Statement.",
            "sudowrite_character_moments": [
                "The ripple of water against the hull.",
                "The father offering Francisco a piece of bread.",
                "The mist clearing slightly."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "The Arrival",
            "setup": "Dawn. They reach the sanctuary (an old monastery). The water is calm. The journey is over for now. Francisco helps them off. He looks back at the river. He is ready for the next phase. He has found his center.",
            "symbolism": "The Far Shore. Safety.",
            "beat_goal": "Resolution. End of the immediate danger.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Calm",
            "scene_tone": "Hopeful",
            "timeline_date": "Dawn",
            "timeline_variant": "Sanctuary",
            "location": "The Dock",
            "narrative_function": "The Bridge to Ch 10.",
            "sudowrite_visual_details": [
                "The stone walls of the monastery.",
                "The birds singing.",
                "The stillness of the water."
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
    update_ea089()
