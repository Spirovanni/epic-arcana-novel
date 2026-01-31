import json
import sys

def find_ea346_recursive(data, path=[]):
    if isinstance(data, dict):
        if data.get('id') == 'EA-346' or data.get('chapter_number') == 346:
            return path, data
        for key, value in data.items():
            result = find_ea346_recursive(value, path + [key])
            if result:
                return result
    elif isinstance(data, list):
        for idx, item in enumerate(data):
            result = find_ea346_recursive(item, path + [idx])
            if result:
                return result
    return None

def update_sequences():
    try:
        with open('data/l_outline.json', 'r') as f:
            data = json.load(f)
        
        path, chapter = find_ea346_recursive(data)
        
        if not chapter:
            print("EA-346 not found in l_outline.json")
            sys.exit(1)
            
        print(f"Found EA-346 at path: {' -> '.join(str(p) for p in path)}")
        
        scenes = chapter.get('scenes', [])
        
        # Values from DB update
        updates = {
            1: {'seq': 1038, 'beat': "All Is Lost - goal-proliferation forcing WIG-discipline"},
            2: {'seq': 1039, 'beat': "Bad Guys Close In - reactive-chaos forcing GTD-discipline"},
            3: {'seq': 1040, 'beat': "Break Into Three - shallow-pressure forcing deep-work-discipline"},
            4: {'seq': 1041, 'beat': "Finale - system-integration completing Atonement-with-Father"}
        }
        
        for scene in scenes:
            num = scene.get('scene_number')
            if num in updates:
                scene['chronological_sequence'] = updates[num]['seq']
                scene['save_the_cat_beat'] = updates[num]['beat']
                print(f"Updated Scene {num}: seq={updates[num]['seq']}, beat={updates[num]['beat'][:30]}...")
                
        with open('data/l_outline.json', 'w') as f:
            json.dump(data, f, indent=2)
            
        print("Successfully updated l_outline.json")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    update_sequences()
