
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea056():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-056
    target_id = "EA-056"
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
    stg_found["save_the_cat_beat_goal"] = "Survive the immediate consequences of defying Dagon: a total resource blockade that forces the Council to find strength in scarcity."
    stg_found["plot"] = "Guardians and Gatekeepers: The Empire strikes back not with soldiers, but with siege. The Sanctuary is isolated, and the 'Five of Disks' reality of hardship sets in."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Must pivot from 'Creator' (King of Cups) to 'Sustainer' (Five of Disks), realizing that a leader must feed his people not just with hope, but with gritty solutions.",
        "Timeline_Factions": "The high of creation fades; they must face the low of deprivation without turning on each other.",
        "Dagon_Agents": "Shift tactics to 'starvation'—passive containment intended to break the Council's resolve."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "resource_mechanics": "Explains how 'temporal energy' is actually harvested and used (and what happens when it's gone).",
        "interpersonal_friction": "Shows the breakdown of unity under stress, a necessary realistic counterpoint to the previous idealism.",
        "antifragile_concept": "Demonstrates how the system gets stronger by being stressed."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_sanctuary_besieged": "The newly built reality, but dimming, cold, and fraying at the edges.",
        "the_severed_conduits": "Visual representation of the supply lines to the main timelines being cut."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "resource_management": "Introduces the resource economy that will drive the war effort in later books.",
        "loyalty_test": "This is the crucible that determines which minor factions stick with Francisco."
    }
    
    # Update Summary
    stg_found["summary"] = "The euphoria of creating the Sanctuary is short-lived as Dagon cuts the temporal supply lines, effectively placing the Council under siege. Plunged into the harsh reality of the Five of Disks—cold, poverty, and isolation—old factional fault lines reopen. Francisco must apply the philosophy that 'The Obstacle Is the Way,' showing them that their reliance on external energy was a weakness. By cannibalizing their own redundant tech and magical artifacts ('Stone Soup'), they create a self-sustaining loop, proving they are antifragile and cannot be starved out."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Desperation turning to gritty resolve"
    stg_found["scene_tone"] = "Gritty, claustrophobic, and raw"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Lights Go Out",
            "setup": "Hours after the Sanctuary is stabilized, the ambient light begins to fail. The warmth sucks out of the air. Francisco rushes to the monitors: Dagon hasn't attacked; he has simply turned off the tap. All connections to the resource-rich timelines are severed. The Sanctuary is a closed system with dwindling entropy. Panic sets in instantly—the Medicis complain of the cold, the Alexandrians hoard data pads before the batteries die. The external enemy has become an internal crisis.",
            "symbolism": "The Five of Disks imagery: two beggared figures in the snow outside a lit church. The Sanctuary is the church, but the lights are going out. The cold represents the physical reality of 'Adversity' stripping away the conceptual victory of 'Creativity'.",
            "beat_goal": "Establish the siege. Move the conflict from 'Magical/Abstract' to 'Physical/Visceral'. Show the fragility of their new creation.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Cold fear",
            "scene_tone": "Dark and chilling",
            "timeline_date": "Post-Book 1 + 10 weeks (Night)",
            "timeline_variant": "The Sanctuary (Besieged)",
            "location": "Sanctuary Control Room",
            "narrative_function": "The Complication. The victory of Chap 15 is threatened.",
            "sudowrite_visual_details": [
                "Breath misting in the air.",
                "The golden walls of the Sanctuary turning dull grey.",
                "Arguments echoing sharply in the silence."
            ],
            "learning_objective_integration": "Illustrates 'Grit'—passion is easy when things are going well; this tests perseverance."
        },
        {
            "scene_number": 2,
            "scene_title": "The Feast of Crumbs",
            "setup": "Days pass. Rations (both food and energy) are critical. The factions are segregating, protecting their own. Francisco sees the end: not death by Dagon, but death by civil war. He calls a general assembly in the freezing piazza. He puts his last energy crystal on the table—a personal heirloom. He asks, 'Who next?' It's a gamble. He is asking them to sacrifice their personal reserves for the collective. A standoff ensues. Then, the Knight of Pentacles (patient, grounded) aspect kicks in: he waits. He doesn't preach; he just waits in the cold with his offering.",
            "symbolism": "The 'Stone Soup' fable reimagined. The single crystal is the 'stone'. The Five of Disks reversed—finding spiritual wealth in material poverty. The 'Wait' is the core of the 'Patient Leads' (STG 2.2.1.4 foreshadowing) but here it's an act of 'Grit'.",
            "beat_goal": "Break the selfishness born of scarcity. Francisco leads by example (sacrifice). A shift from 'hoarding' to 'pooling'.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Grim hope",
            "scene_tone": "Quiet tension",
            "timeline_date": "Post-Book 1 + 11 weeks",
            "timeline_variant": "The Sanctuary (Freezing)",
            "location": "The Central Piazza",
            "narrative_function": "The Midpoint / The Choice.",
            "sudowrite_character_moments": [
                "Francisco shivering but refusing to cross his arms.",
                "La Signora (Medici) looking at her jewels, then at the freezing children.",
                "The clatter of the first donated mechanism hitting the table."
            ],
            "learning_objective_integration": "Demonstrates 'The Obstacle Is the Way'—using the scarcity to force unity."
        },
        {
            "scene_number": 3,
            "scene_title": "Cannibalizing the Past",
            "setup": "With the pooled resources, they don't have enough to repower the status quo. Francisco realizes: 'We have too much legacy junk.' They begin stripping down their ships, their robes, their ceremonial staffs. They tear apart the 'sacred' technologies of their individual factions to build a crude, hybrid generator. It's blasphemy to the scholars, but survival to the soldiers. As they break down their past glories to fuel their present survival, they realize those things were weighing them down anyway. The act of destruction becomes an act of liberation.",
            "symbolism": "Breaking the 'Disks' (Pentacles/Material possessions). Antifragility: the system improves because it is forced to shed inefficiency. The hybrid generator is a physical symbol of their Unity—ugly, cobbled together, but working.",
            "beat_goal": "The Solution. Implementing the 'remix' strategy under pressure. Validating that they can survive without the Empire's supply lines.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Manic productivity",
            "scene_tone": "Industrial and sweaty (warming up)",
            "timeline_date": "Post-Book 1 + 11 weeks",
            "timeline_variant": "The Sanctuary (Industrializing)",
            "location": "The Foundry (converted library)",
            "narrative_function": "The Action. Overcoming the obstacle.",
            "sudowrite_visual_details": [
                "Sparks flying as golden idols are melted down.",
                "Alexandrian circuitry wired into Byzantine steam engines.",
                "The hum of the new generator—a discordant but steady rhythm."
            ],
            "learning_objective_integration": "Showcases 'Antifragile'—disorder (the shortage) led to a better, more independent system."
        },
        {
            "scene_number": 4,
            "scene_title": "The Warmth of Independence",
            "setup": "The Sanctuary hums with a new, self-sustained frequency. It's not as bright as before, but it's theirs. Dagon's siege has failed; he can't starve what feeds itself. Francisco stands on the ramparts looking out at the Void. He realizes they are no longer just refugees; they are a colony. They have passed the test of Adversity. The hardship didn't break them; it calcified their bond. They are harder, leaner, and more dangerous now.",
            "symbolism": "The Five of Disks resolved: moving from 'destitution' to 'endurance'. The 'calcification' represents the 'Disks' element (Earth/Stone)—solidifying the liquid emotions of the previous chapter. The 'Colony' implies permanence.",
            "beat_goal": "Resolution. Affirm the new strength. Set up the next phase (Diplomacy/Expansion).",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Pride and weariness",
            "scene_tone": "Solid and enduring",
            "timeline_date": "Post-Book 1 + 11 weeks",
            "timeline_variant": "The Sanctuary (Independent)",
            "location": "Sanctuary Ramparts",
            "narrative_function": "The Outcome. The hero is changed (hardened).",
            "sudowrite_character_moments": [
                "Francisco eating a simple meal with the soldiers, refusing the head table.",
                "The realization that he prefers this rougher, truer version of leadership.",
                "The generator pulsing like a steady heartbeat."
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
    update_ea056()
