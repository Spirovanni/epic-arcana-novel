#!/usr/bin/env python3
"""
Sync display names from canonical file to enhanced file
"""

import json

def load_json_file(filepath):
    """Load JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def save_json_file(data, filepath):
    """Save JSON file"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def main():
    """Main function to sync display names"""
    base_dir = "/Users/xaviermartinez/dev/cursor/epic-arcana-novel"
    
    # Load both files
    canonical_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json"
    enhanced_path = f"{base_dir}/lsa-assessment/data/epic_arcana_personality_profiles_1-360_enhanced.json"
    
    print("Loading canonical profiles...")
    canonical_data = load_json_file(canonical_path)
    if not canonical_data:
        print("Failed to load canonical profiles")
        return
    
    print("Loading enhanced profiles...")
    enhanced_data = load_json_file(enhanced_path)
    if not enhanced_data:
        print("Failed to load enhanced profiles")
        return
    
    print(f"Syncing display names for {len(enhanced_data)} profiles...")
    
    # Create a mapping of profile IDs to display names from canonical
    canonical_names = {}
    for profile in canonical_data:
        profile_id = profile.get('id')
        display_name = profile.get('display_name', '')
        if profile_id:
            canonical_names[profile_id] = display_name
    
    # Update enhanced profiles with canonical display names
    updated_count = 0
    for i, profile in enumerate(enhanced_data):
        profile_id = profile.get('id')
        if profile_id in canonical_names:
            old_name = profile.get('display_name', '')
            new_name = canonical_names[profile_id]
            if old_name != new_name:
                profile['display_name'] = new_name
                updated_count += 1
                if updated_count <= 10:  # Show first 10 updates
                    print(f"Updated {profile_id}: '{old_name}' → '{new_name}'")
    
    # Save updated enhanced profiles
    if save_json_file(enhanced_data, enhanced_path):
        print(f"\n✅ Successfully synced {updated_count} display names")
        print(f"Enhanced file updated: {enhanced_path}")
    else:
        print("❌ Failed to save updated enhanced profiles")

if __name__ == "__main__":
    main()