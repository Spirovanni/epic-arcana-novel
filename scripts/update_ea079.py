
import json
import os

OUTLINE_PATH = "data/l_outline.json"

def update_ea079():
    print(f"Loading {OUTLINE_PATH}...")
    try:
        with open(OUTLINE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Find EA-079
    target_id = "EA-079"
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
    stg_found["save_the_cat_beat_goal"] = "Execute the 'Magic Flight' escape using 'Quicken' (Eight of Wands) speed to outrun the final collapse."
    stg_found["plot"] = "Resolution: The Rescue ships arrive. The siege is broken. But the timeline is collapsing. They must run the gauntlet to the extraction point. Francisco wakes up (from EA-078) and leads the sprint. It is pure momentum (Eight of Wands)."
    
    # Update Character Arcs
    stg_found["character_arcs"] = {
        "Francisco": "The Sprinter. He uses 'Atomic Habits'—automatic responses developed during the book—to survive without thinking.",
        "Novella": "Keeps the group moving, refusing to let anyone fall behind.",
        "The_Rescuers": "Provide covering fire but cannot land; the team must come to them."
    }
    
    # Update Story Gaps
    stg_found["story_gaps_addressed"] = {
        "book2_climax": "The final action set piece of the book.",
        "transition_to_book3": "Sets up the larger conflict waiting 'outside'."
    }
    
    # Update Location Details
    stg_found["location_details"] = {
        "the_sky_bridge": "A collapsing rock formation they must cross to reach the ships.",
        "the_extraction_zone": "Moving target in the air."
    }
    
    # Update Series Connections
    stg_found["series_connections"] = {
        "narrative_momentum": "The speed of this ending propels the reader directly into Book 3.",
        "the_missing_piece": "They leave something behind that becomes plot relevant later."
    }
    
    # Update Summary
    stg_found["summary"] = "The sky screams. Rescue ships descend. The Drones panic. The timeline begins to delaminate (reality breaking apart). Francisco yells 'Move!' They sprint. It is the Eight of Wands: speed, arrows in flight, direct action. There is no time for plans. They rely on muscle memory (Habits). They dodge falling rocks. They jump gaps. They reach the Sky Bridge. It is crumbling. They have to jump. Francisco throws Novella across. Then he jumps. He is caught in mid-air by a tractor beam. They are pulled up. The timelineimplodes below them. They are out."
    
    stg_found["pov"] = "3rd Person Limited (Francisco)"
    stg_found["tense"] = "Past Tense"
    stg_found["core_emotion"] = "Urgency",
    stg_found["scene_tone"] = "Breakneck speed"
    
    # Update Scenes
    stg_found["scenes"] = [
        {
            "scene_number": 1,
            "scene_title": "The Skyfall",
            "setup": "The clouds break. Allied Cruisers drop into the atmosphere. The sonic boom flattens the drones. It is the cavalry. But the ground is shaking. The 'Raw' timeline (EA-075) is rejecting them. Fissures open. The extraction point is 2 clicks North. 'Run!'",
            "symbolism": "The Trumpet Blast. The Earthquake. The finish line.",
            "beat_goal": "The Start Gun. Immediate transition to movement.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Panic/Hope",
            "scene_tone": "Epic",
            "timeline_date": "Dawn + 10 minutes",
            "timeline_variant": "Base Zero",
            "location": "Base Zero",
            "narrative_function": "The Trigger.",
            "learning_objective_integration": "Reflects 'The Power of Habit'—cue and response."
        },
        {
            "scene_number": 2,
            "scene_title": "The Sprint",
            "setup": "They are running. Drones are chasing. Rocks are falling. Francisco doesn't think. He shoots a drone, jumps a log, pulls a comrade up. It is fluid. He is in Flow (from Book 1). The Eight of Wands energy propels them. They are faster than fear.",
            "symbolism": "The Arrow. The blurred background. The tunnel vision of speed.",
            "beat_goal": "The Action. overcoming obstacles through speed.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Flow",
            "scene_tone": "Fast",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Gauntlet",
            "location": "The Wilderness",
            "narrative_function": "The Chase.",
            "sudowrite_visual_details": [
                "The blur of the landscape.",
                "The sound of heartbeats matching footfalls.",
                "The extraction point growing larger."
            ]
        },
        {
            "scene_number": 3,
            "scene_title": "The Link-Up",
            "setup": "They reach the Sky Bridge. It's a natural arch. The ship hovers above it. The ramp is down. But the bridge is cracking. The arch breaks. A chasm opens. Novella slides. Francisco grabs her. He swings her over. 'Go!' He is the last one on the crumbling side.",
            "symbolism": "The chasm. The helping hand. The leap of faith.",
            "beat_goal": "The Climax (of the book). The final jump.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Selfless",
            "scene_tone": "Vertical",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Edge",
            "location": "The Sky Bridge",
            "narrative_function": "The Leap.",
            "learning_objective_integration": "Demonstrates 'Momentum'—speed conquers gravity."
        },
        {
            "scene_number": 4,
            "scene_title": "The Ascension",
            "setup": "Francisco jumps. He falls. The ground rushes up. Then—light. The tractor beam catches him. He is yanked upward. He sees the ground explode below him. Base Zero, the Wall, the Generator—all gone. He is pulled into the ship bay. The airlock hisses shut. Silence. He is safe. The 'Flight' is over.",
            "symbolism": "The Ascension. The womb of the ship. The silence after the storm.",
            "beat_goal": "Resolution. Book 2 ends.",
            "pov": "3rd Person Limited (Francisco)",
            "tense": "Past Tense",
            "core_emotion": "Safety",
            "scene_tone": "Quiet finale",
            "timeline_date": "Minutes later",
            "timeline_variant": "The Rescue Ship",
            "location": "Airlock",
            "narrative_function": "The End.",
            "sudowrite_character_moments": [
                "The hiss of pressurization.",
                "Francisco checking his limbs—all there.",
                "The view of the timeline shrinking in the viewport."
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
    update_ea079()
