import pandas as pd
import json
import os

def convert_excel_to_json(input_path, output_path):
    print(f"Reading {input_path}...")
    try:
        df = pd.read_excel(input_path, sheet_name='Career Pathing Roadmap csv')
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return

    # Data structure to hold nodes
    # Structure: { level_name: { code: { data } } }
    hierarchy = {
        'Total': {},
        'Major': {},
        'Main': {},   # Minor Group
        'Titled': {}, # Broad Group
        'Role': {}    # Detailed Occupation
    }

    # Helper to clean strings
    def clean_str(s):
        if pd.isna(s): return None
        return str(s).strip()

    # Iterate rows and populate hierarchy
    for index, row in df.iterrows():
        group_type = clean_str(row['Group'])
        
        if group_type not in hierarchy:
            continue

        # Extract common data
        description = clean_str(row.get('Description'))
        sample_titles_raw = clean_str(row.get('Sample of reported job titles'))
        sample_titles = [t.strip() for t in sample_titles_raw.split(',')] if sample_titles_raw else []
        
        major_code = clean_str(row.get('Major Group'))
        minor_code = clean_str(row.get('Minor Group'))
        broad_code = clean_str(row.get('Broad Group'))
        detailed_code = clean_str(row.get('Detailed Occupation'))

        node_data = {
            "name": clean_str(row['Occupation Name']),
            "description": description,
            "sample_titles": sample_titles,
            "children": [],
            # Store codes for linking ghosts later
            "major_code": major_code,
            "minor_code": minor_code,
            "broad_code": broad_code,
            "code": ""
        }

        # ID and Parent Logic
        if group_type == 'Total':
            code = major_code
            node_data['code'] = code
            hierarchy['Total'][code] = node_data

        elif group_type == 'Major':
            code = major_code
            node_data['code'] = code
            hierarchy['Major'][code] = node_data

        elif group_type == 'Main': # Minor Group
            code = minor_code
            parent_code = major_code
            node_data['code'] = code
            node_data['parent_code'] = parent_code
            hierarchy['Main'][code] = node_data

        elif group_type == 'Titled': # Broad Group
            code = broad_code
            parent_code = minor_code
            node_data['code'] = code
            node_data['parent_code'] = parent_code
            hierarchy['Titled'][code] = node_data

        elif group_type == 'Role': # Detailed Occupation
            code = detailed_code
            parent_code = broad_code
            node_data['code'] = code
            node_data['parent_code'] = parent_code
            hierarchy['Role'][code] = node_data

    print("Handling orphans and building tree...")

    # Function to ensure parent exists
    def ensure_parent(child_node, parent_level, parent_code, grandparent_code=None):
        if not parent_code:
            return
        
        if parent_code not in hierarchy[parent_level]:
            print(f"Creating ghost node for missing {parent_level}: {parent_code} (Child: {child_node['code']})")
            ghost_node = {
                "name": f"Unknown {parent_level} ({parent_code})",
                "description": "Auto-generated container for orphaned items.",
                "sample_titles": [],
                "children": [],
                "code": parent_code,
                "is_ghost": True
            }
            if grandparent_code:
                ghost_node['parent_code'] = grandparent_code
            
            hierarchy[parent_level][parent_code] = ghost_node

    # Link Role -> Titled
    for code, node in hierarchy['Role'].items():
        parent_code = node.pop('parent_code', None)
        # We can try to infer grandparent (Minor) from minor_code if available
        grandparent = node.get('minor_code')
        ensure_parent(node, 'Titled', parent_code, grandparent)
        
        if parent_code and parent_code in hierarchy['Titled']:
            hierarchy['Titled'][parent_code]['children'].append(node)

    # Link Titled -> Main
    for code, node in hierarchy['Titled'].items():
        parent_code = node.pop('parent_code', None)
        grandparent = node.get('major_code')
        ensure_parent(node, 'Main', parent_code, grandparent)

        if parent_code and parent_code in hierarchy['Main']:
            hierarchy['Main'][parent_code]['children'].append(node)

    # Link Main -> Major
    for code, node in hierarchy['Main'].items():
        parent_code = node.pop('parent_code', None)
        # Major parent is usually implicitly Total or just root, but we link to Major group
        ensure_parent(node, 'Major', parent_code)

        if parent_code and parent_code in hierarchy['Major']:
            hierarchy['Major'][parent_code]['children'].append(node)
            
    # Clean up internal keys from output
    def clean_node(n):
        keys_to_remove = ['major_code', 'minor_code', 'broad_code', 'parent_code']
        for k in keys_to_remove:
            n.pop(k, None)
        for child in n['children']:
            clean_node(child)

    root_nodes = list(hierarchy['Major'].values())
    for n in root_nodes:
        clean_node(n)

    print(f"Writing to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(root_nodes, f, indent=2)
    
    print("Done.")

if __name__ == "__main__":
    convert_excel_to_json('data/career_pathways.xlsx', 'data/career_pathways.json')
