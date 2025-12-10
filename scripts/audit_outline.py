import json
import re
import sys
from typing import Dict, Any, List

def audit_outline(file_path: str):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"CRITICAL: Could not read or parse {file_path}: {e}")
        return

    stgs = []
    
    # Helper to recursively find STGs
    def find_stgs(obj, path):
        if isinstance(obj, dict):
            # Check if this node is an STG
            if obj.get('type') == 'Specific Task Group' or (isinstance(obj.get('id'), str) and obj.get('id').startswith('EA-')):
                stgs.append({'data': obj, 'path': path})
                # STGs shouldn't contain other STGs, but we recurse anyway just in case of weird nesting, 
                # though strictly we stop here for the STG itself.
                # However, looking at the file structure, STGs are leaves of the task structure.
                return 

            for k, v in obj.items():
                find_stgs(v, path + f" -> {k}")
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                find_stgs(item, path + f"[{i}]")

    find_stgs(data, "root")

    print(f"Found {len(stgs)} Specific Task Groups (STGs).")

    # Audit
    issues = []
    ids_found = set()
    id_map = {} # Maps EA-ID to object for sequence check

    # Sort STGs by ID if possible for consistent reporting
    # We try to parse the number from EA-XXX
    def get_id_num(stg_entry):
        ea_id = stg_entry['data'].get('id', '')
        match = re.search(r'EA-(\d+)', ea_id)
        if match:
            return int(match.group(1))
        return 999999

    stgs.sort(key=get_id_num)

    for entry in stgs:
        stg = entry['data']
        path = entry['path']
        ea_id = stg.get('id', 'MISSING_ID')
        
        # Check ID format
        if ea_id == 'MISSING_ID':
            issues.append(f"[CRITICAL] STG at {path} has no 'id' field.")
            continue
        
        if ea_id in ids_found:
            issues.append(f"[CRITICAL] Duplicate ID {ea_id} found at {path}.")
        ids_found.add(ea_id)
        
        # Parse ID number for sequence check
        match = re.search(r'EA-(\d+)', ea_id)
        if match:
            id_num = int(match.group(1))
            id_map[id_num] = ea_id
        else:
            issues.append(f"[WARNING] ID {ea_id} does not match EA-XXX format.")

        # Check 'all_chapter' consistency with ID if applicable (User mentioned EA-001 -> all_chapter 1)
        # Assuming EA-XXX corresponds to X for all_chapter
        all_chapter = stg.get('all_chapter')
        if match and all_chapter:
            try:
                if int(all_chapter) != id_num:
                    issues.append(f"[CONSISTENCY] {ea_id}: 'all_chapter' is {all_chapter}, expected {id_num}.")
            except ValueError:
                pass # all_chapter might not be an int

        # Check required fields
        if 'scenes' not in stg:
             issues.append(f"[STRUCTURE] {ea_id}: Missing 'scenes' array.")
        else:
            scenes = stg['scenes']
            if not isinstance(scenes, list):
                issues.append(f"[STRUCTURE] {ea_id}: 'scenes' is not a list.")
            elif len(scenes) == 0:
                issues.append(f"[CONTENT] {ea_id}: 'scenes' array is empty.")
            else:
                # Check scenes content
                for i, scene in enumerate(scenes):
                    scene_ref = f"{ea_id} Scene {i+1}"
                    required_scene_fields = ['scene_title', 'setup', 'symbolism', 'beat_goal']
                    for field in required_scene_fields:
                        val = scene.get(field)
                        if not val or (isinstance(val, str) and (val.strip() == "" or val.strip().lower() == "xxx")):
                            issues.append(f"[CONTENT] {scene_ref}: Field '{field}' is missing or empty.")

    # Check for Gaps
    if id_map:
        min_id = min(id_map.keys())
        max_id = max(id_map.keys())
        expected_range = set(range(min_id, max_id + 1))
        found_range = set(id_map.keys())
        missing_nums = sorted(list(expected_range - found_range))
        if missing_nums:
            issues.append(f"[SEQUENCE] Missing sequence numbers: {missing_nums}")

    # Output Report
    if not issues:
        print("Audit Complete: No issues found.")
    else:
        print(f"Audit Complete: {len(issues)} issues found.")
        # Print top 20 issues to avoid spamming log if there are thousands
        for i, issue in enumerate(issues):
            if i < 50:
                print(issue)
            else:
                print(f"... and {len(issues) - 50} more issues.")
                break

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 audit_outline.py <path_to_json>")
    else:
        audit_outline(sys.argv[1])
