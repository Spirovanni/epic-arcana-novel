import json
import re
import os

# Paths
sql_file_path = 'data/career data/db_30_0_mysql/03_occupation_data.sql'
json_file_path = 'data/career data/occupation_data.json'
output_file_path = 'data/career data/occupation_data_updated.json'

def parse_sql_file(file_path):
    print(f"Parsing SQL file: {file_path}")
    data = {}
    # Regex to match INSERT INTO occupation_data (onetsoc_code, title, description) VALUES ('Code', 'Title', 'Description');
    # SQL values might contain escaped single quotes like 'firm''s', so we need to be careful.
    # We'll use a regex that matches the structure and groups the content.
    regex = re.compile(r"INSERT INTO occupation_data \(onetsoc_code, title, description\) VALUES \('([^']*)', '((?:[^']|'')*)', '((?:[^']|'')*)'\);")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                match = regex.search(line)
                if match:
                    code = match.group(1)
                    title = match.group(2).replace("''", "'") # Unescape single quotes
                    description = match.group(3).replace("''", "'") # Unescape single quotes
                    data[code] = {'title': title, 'description': description}
    except FileNotFoundError:
        print(f"Error: SQL file not found at {file_path}")
        return None

    print(f"Loaded {len(data)} occupation definitions from SQL.")
    return data

def update_json_hierarchy(node, sql_data, stats):
    # Check if this node has a code and if that code exists in SQL data
    if 'code' in node:
        code = node['code']
        if code in sql_data:
            sql_record = sql_data[code]
            
            # Check for changes just for reporting
            if node.get('name') != sql_record['title']:
                stats['title_updates'] += 1
            if node.get('description') != sql_record['description']:
                stats['desc_updates'] += 1
            
            # Update fields
            node['name'] = sql_record['title']
            node['description'] = sql_record['description']
            stats['matched'] += 1
        else:
            stats['missing_in_sql'] += 1
            # print(f"Warning: Code {code} not found in SQL data.")

    # Recursively update children
    if 'children' in node and isinstance(node['children'], list):
        for child in node['children']:
            update_json_hierarchy(child, sql_data, stats)

def main():
    # 1. Parse SQL
    sql_data = parse_sql_file(sql_file_path)
    if not sql_data:
        return

    # 2. Load JSON
    print(f"Loading JSON file: {json_file_path}")
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: JSON file not found at {json_file_path}")
        return

    # 3. Update JSON
    print("Updating JSON hierarchy...")
    stats = {'matched': 0, 'missing_in_sql': 0, 'title_updates': 0, 'desc_updates': 0}
    
    # The JSON structure is a list of root nodes
    for root_node in json_data:
        update_json_hierarchy(root_node, sql_data, stats)

    print(f"Update Complete.")
    print(f"Matched Nodes: {stats['matched']}")
    print(f"Nodes missing is SQL: {stats['missing_in_sql']} (Likely grouping nodes)")
    print(f"Titles Updated: {stats['title_updates']}")
    print(f"Descriptions Updated: {stats['desc_updates']}")

    # 4. Save Output
    print(f"Saving updated JSON to: {output_file_path}")
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2)
    print("Done.")

if __name__ == "__main__":
    main()
