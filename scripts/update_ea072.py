
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea072():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-072
    target_id = "EA-072"
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
    stg_found["save_the_cat_beat_goal"] = "Manage the influx of new resources and allies ('Prosperity') without losing the 'Lean' mindset that ensured survival."
    stg_found["plot"] = "The Ultimate Boon (Part 3): The victory at the Redoubt draws attention. New allies arrive with supplies, magic, and tech. It is a 'Harvest'. Francisco must ensure this abundance doesn't breed complacency (Nine of Disks)."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Integrates the 'Nine of Disks'. Experience the satisfaction of self-sufficiency and wealth, but learns to invest it wisely.",
        "The_Newcomers": "Merchants and stragglers who bring goods but also potential corruption/laziness.",
        "The_Quartermaster": "Novella takes a larger role managing the logistics of plenty."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "resource_management": "Shows where the food/ammo comes from for the rest of the book.",
        "temptation_of_peace": "Explores the danger of getting comfortable in a war zone."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_market": "A new, bustling area in the Redoubt where trade happens.",
        "the_secret_garden": "A private space Francisco creates for himself—symbolizing the Nine of Disks' solitary enjoyment."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "wealth_as_power": "Establishes economic power as a valid form of resistance.",
        "the_trade_routes": "The paths opened here are used for spy networks in Book 4."
    }
    
    # Update Summary
    stg_found["summary"] = "The Redoubt is secure (EA-070) and organized (EA-071). Now, it becomes rich. Word spreads that it is a safe haven. Caravans from other timeline pockets arrive. They bring 'The Ultimate Boon' in the form of exotic tech and supplies. Francisco stands in the new Market. He feels the pull of the Nine of Disks—luxury, rest, the enjoyment of his labor. He realizes that 'Prosperity' is a test too. He must use 'The Abundance Code' to multiply these resources, not just consume them. He invests in the community. He turns the base into a thriving city-state."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Satisfaction wary of greed"
    stg_found["scene_tone"] = "Rich and busy"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Harvest",
            "setup": "A convoy of 'Timeline Nomads' creates a trade route to the Redoubt. They bring rare crystals, food, and energy cells. The base goes from 'Starvation Mode' to feast. People are celebrating. Francisco watches. He sees the relief, but also the slackening of discipline. A guard leaves his post to trade for wine. The 'Boon' is dangerous.",
            "symbolism": "The Horn of Plenty. The unexpected feast. The loosening of the belt.",
            "beat_goal": "Introduce the new resource. Establish the conflict: Comfort vs. Vigilance.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Wary gratitude",
            "scene_tone": "Festive",
            "timeline_date": "Post-Siege + 1 month",
            "timeline_variant": "The New Market",
            "location": "The Courtyard",
            "narrative_function": "The Reward.",
            "sudowrite_visual_details": [
                "Bright silks draped over grey blast walls.",
                "The smell of roasting meat masking the ozone.",
                "Gold coins changing hands."
            ],
            "learning_objective_integration": "Reflects 'Think and Grow Rich'—transmuting desire into gold."
        },
        {
            "scene_number": 2,
            "scene_title": "The Investment",
            "setup": "Novella suggests stockpiling the new resources. 'Hoard it for the next siege.' Francisco disagrees. 'Money is energy. It has to move.' He uses 'Rich Dad Poor Dad' thinking (Assets vs Liabilities). He decides to invest the resources in upgrading the Nomads' wagons and weapons, making them better traders/fighters. He turns a one-time gift into a recurring revenue stream.",
            "symbolism": "Planting the seed instead of eating it. The flow of water/gold.",
            "beat_goal": "The Strategy. Turning wealth into growth.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Strategic ambition",
            "scene_tone": "Business-like",
            "timeline_date": "Post-Siege + 5 weeks",
            "timeline_variant": "Command Tent",
            "location": "Command Tent",
            "narrative_function": "The Decision.",
            "learning_objective_integration": "Demonstrates 'The Abundance Code'—mindset shift."
        },
        {
            "scene_number": 3,
            "scene_title": "The Garden",
            "setup": "Francisco takes a moment for himself. He finds a quiet spot on the roof. He uses a bit of the new magic to grow a single, perfect rose (or timeline equivalent). He sits with it. He wears a fine cloak he was gifted. He embodies the Nine of Disks—solitary enjoyment of success. He realizes he doesn't need to be miserable to be a hero. It is okay to enjoy the fruit of his labor. This recharges him.",
            "symbolism": "The Nine of Disks card art (woman in a vineyard). The Rose. The moment of beauty in a war zone.",
            "beat_goal": "Character Beat. Self-care as a strategic asset.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Peaceful",
            "scene_tone": "Luxurious and quiet",
            "timeline_date": "Post-Siege + 6 weeks",
            "timeline_variant": "The Roof Garden",
            "location": "The Roof",
            "narrative_function": "The Rest.",
            "sudowrite_visual_details": [
                "The impossible color of the flower.",
                "The texture of the velvet cloak.",
                "The stars above, clear for the first time."
            ]
        },
        {
            "scene_number": 4,
            "scene_title": "The Golden Hour",
            "setup": "The Redoubt is booming. It is now a 'City on a Hill'. Francisco looks out over it. He has not just saved them; he has made them prosperous. But the feeling of peace is interrupted. The Nomads bring news: Dagon is moving again. The 'Golden Hour' is over. But this time, they are not a ragtag band; they are a wealthy, well-fed power. Francisco turns from the view. 'Time to spend our capital.'",
            "symbolism": "The Sunset. The turning of the season. The Gold transforming back into Steel.",
            "beat_goal": "Resolution. Transition to the next conflict.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Ready",
            "scene_tone": "Epic",
            "timeline_date": "Post-Siege + 2 months",
            "timeline_variant": "The Balcony",
            "location": "The Balcony",
            "narrative_function": "The Warning.",
            "learning_objective_integration": "Reflects 'Assets vs Liabilities'—using the asset for defense."
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
    update_ea072()
