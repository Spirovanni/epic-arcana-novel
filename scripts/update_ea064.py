import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea064():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-064
    target_id = "EA-064"
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
    stg_found["save_the_cat_beat_goal"] = "All is Lost/Dark Night of the Soul. The tension breaks not through force, but through levity."
    stg_found["plot"] = "Atonement with the Father: Francisco matches Dagon's complexity with 'Play', earning a nod of respect from the antagonist."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "Demonstrates the Six of Cups: creative joy. He learns that 'Serious' is brittle, but 'Playful' offers flexibility.",
        "The_Team": "Recovers from burnout through shared absurdity.",
        "Dagon": "Acknowledges Francisco not as a bug to be squashed, but as a player to be watched."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "magical_stress": "Explains what happens when reality-anchors fail (surreal side effects).",
        "human_advantage": "Establishes that 'Creativity/Humor' is something the Simulacra cannot replicate effectively.",
        "pacing_breather": "Provides a tonal shift before the Act III climb."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_warped_zone": "A section of the Sanctuary where the laws of physics are temporarily 'cartoonish' due to the glitch.",
        "the_scoreboard": "A holographic display tracking the 'Games' (Seeding success rates)."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "trickster_archetype": "Prepares Francisco for the Trickster roles he will play in Book 5.",
        "dagon_respect": "The moment Dagon stops seeing them as vermin is the moment he becomes more dangerous."
    }
    
    # Update Summary
    stg_found["summary"] = "The 'Seeding' operation is grueling. The team is cracking under the pressure. A critical failure occurs: a reality-anchor drops, causing a localized perception glitch where everyone speaks in rhyme. Panic threatens to set in. But Francisco laughs. It is the Six of Cups—innocence and play. He reframes the disaster as a game. The tension breaks. They gamify the operation. Competence skyrockets when fear is removed. Dagon, watching from the void, stays his hand. He recognizes the move. It is the first moment of mutual respect between the God and the Man."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Giddy relief"
    stg_found["scene_tone"] = "Surreal and humorous"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "Burnout",
            "setup": "Day 4 of Seeding. No sleep. Mistakes are compounding. A junior technician drops a stabilizer. It shatters. The alarms don't blare; they whimper. The air turns purple. Everyone freezes, waiting for death. This is the 'All is Lost' moment—not because of an enemy, but because of their own frailty.",
            "symbolism": "The Dropped Cup. The spilled wine. The limit of human endurance.",
            "beat_goal": "Establish the tension point.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Dread",
            "scene_tone": "High anxiety",
            "timeline_date": "Post-Book 1 + 19 weeks",
            "timeline_variant": "Sanctuary Ops",
            "location": "The Anchor Deck",
            "narrative_function": "The Crisis.",
            "sudowrite_visual_details": [
                "Purple fog collecting on the floor.",
                "The technician's face white with terror.",
                "The smell of ozone and burnt sugar."
            ]
        },
        {
            "scene_number": 2,
            "scene_title": "The Glitch",
            "setup": "The purple fog doesn't kill them. It rewrites their linguistic centers. The Quartermaster tries to report damage, but it comes out as a limerick. 'The shield is down, the power is low / We have nowhere else to go.' Silence. Then Francisco snorts. Then he laughs. It's hysterical, bordering on manic. But it shatters the fear. They aren't dying; they're ridiculous.",
            "symbolism": "The Jester. The upside-down world. Laughter as banishing ritual.",
            "beat_goal": "The Release. Breaking the grip of fear.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Hysteria/Joy",
            "scene_tone": "Absurdist",
            "timeline_date": "Post-Book 1 + 19 weeks",
            "timeline_variant": "Sanctuary Ops (Warped)",
            "location": "The Anchor Deck",
            "narrative_function": "The Turn.",
            "learning_objective_integration": "Demonstrates 'Reframing'—changing the context of a problem."
        },
        {
            "scene_number": 3,
            "scene_title": "Gamification",
            "setup": "Francisco seizes the mood. 'New rule. If you rhyme, you pay a fine. If you fix a unit, you get a point.' He throws up a scoreboard. The work transforms from a death march into a sport. Novella creates a 'Trick Shot' bonus for seeding timelines with flair. The energy shifts from heavy (Ten of Wands) to light (Six of Cups). Efficiency doubles.",
            "symbolism": "The Game Board. The Playground. Flow state.",
            "beat_goal": "The Action. Joy as fuel.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Competitive fun",
            "scene_tone": "High energy",
            "timeline_date": "Post-Book 1 + 19 weeks",
            "timeline_variant": "Sanctuary Ops",
            "location": "The Ops Room",
            "narrative_function": "The Solution.",
            "learning_objective_integration": "Reflects 'Play' as a productivity multiplier."
        },
        {
            "scene_number": 4,
            "scene_title": "The Father's Nod",
            "setup": "The sensors pick up a Dagon-signal. He is watching. The team freezes. But there is no attack. Just a single pulse on the monitor—a waveform that looks like a slow nod. 'He enjoyed that,' La Signora whispers. Francisco realizes he has done something deeper than fighting: he has entertained the God. He has proven that Humanity is interesting. That is their safety.",
            "symbolism": "The King of Cups acknowledging the Page. Atonement (At-one-ment).",
            "beat_goal": "Resolution. Survival through style.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Chilled respect",
            "scene_tone": "Ominous but calm",
            "timeline_date": "Post-Book 1 + 19 weeks",
            "timeline_variant": "The Void Window",
            "location": "The Observation Deck",
            "narrative_function": "The Reward.",
            "sudowrite_character_moments": [
                "The waveform fading from the screen.",
                "Francisco wiping tears of laughter (and fear) from his eyes.",
                "The team getting back to work, still smiling."
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
    update_ea064()
