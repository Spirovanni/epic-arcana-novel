import pandas as pd
import json

df = pd.read_excel('HFP-X1.xlsx', sheet_name='Story-Line')
book1_rows = df[df['Book Unique Identifier'] == 'MT 1']

def safe_get(row, col):
    val = row.get(col, "")
    return "" if pd.isna(val) else val

book1_json = {
    "book_unique_identifier": "MT 1",
    "fantasy_book_name": safe_get(book1_rows.iloc[0], 'Fantasy Book Name'),
    "non_fiction_book": safe_get(book1_rows.iloc[0], 'Non-Fiction Book'),
    "book_subject": safe_get(book1_rows.iloc[0], 'Book Subject'),
    "focus_of_book": safe_get(book1_rows.iloc[0], 'Focus of Book'),
    "book_description": safe_get(book1_rows.iloc[0], 'Book Description'),
    "unique_theme": safe_get(book1_rows.iloc[0], 'Unique Theme'),
    "enneagram": safe_get(book1_rows.iloc[0], 'Ennegram'),
    "military": safe_get(book1_rows.iloc[0], 'Military'),
    "business_model_generation": safe_get(book1_rows.iloc[0], 'Business Model Generation'),
    "personality_type": safe_get(book1_rows.iloc[0], 'Personality Type'),
    "9_habits_covey": safe_get(book1_rows.iloc[0], '9 Habits Covey'),
    "sin": safe_get(book1_rows.iloc[0], 'Sin'),
    "business_model_you": safe_get(book1_rows.iloc[0], 'Business Model You'),
    "sections": []
}

for _, row in book1_rows.iterrows():
    section = {
        "section_name": safe_get(row, 'Novel Section Name'),
        "major_task": safe_get(row, 'Major Task'),
        "major_task_group_number": safe_get(row, 'Major Task Group Number'),
        "mt_color": safe_get(row, 'Color Name'),
        "mt_hex": safe_get(row, 'Hex #2'),
        "mt_red": safe_get(row, 'Red4'),
        "mt_green": safe_get(row, 'Green5'),
        "mt_blue": safe_get(row, 'Blue6'),
        "mt_tagline": safe_get(row, 'Tagline2'),
        "major_task_groups": [
            {
                "major_task_group_number": safe_get(row, 'Major Task Group Number'),
                "major_task_group_description": safe_get(row, 'Major Task Group Description'),
                "major_task_group_tagline": safe_get(row, 'Major Task Group Tagline'),
                "specific_task_groups": [
                    {
                        "unique_identifier": safe_get(row, 'Specific Task Group2'),
                        "chapter": safe_get(row, 'Chapter'),
                        "type": safe_get(row, 'Type'),
                        "tarot_card_link": "",
                        "tarot_family": safe_get(row, 'Tarot Card Family'),
                        "new_tarot_family": safe_get(row, 'New_Tarot_Family'),
                        "tarot_card_item": safe_get(row, 'Tarot Card Number'),
                        "color_name": safe_get(row, 'Color Name'),
                        "hex_code": safe_get(row, 'Hex #2'),
                        "red": safe_get(row, 'Red4'),
                        "green": safe_get(row, 'Green5'),
                        "blue": safe_get(row, 'Blue6'),
                        "epic_novel_pages": safe_get(row, 'Novel Pages'),
                        "epic_chapter_focus": safe_get(row, 'Chapter Focus'),
                        "epic_preliminary_scene_focus": safe_get(row, 'Preliminary Scene Focus'),
                        "epic_preliminary_scene_description": safe_get(row, 'Section Description'),
                        "epic_novel_chapter_focus": safe_get(row, 'Chapter Focus2'),
                        "epic_novel_section_name": safe_get(row, 'Novel Section Name'),
                        "specific_task_group_title": safe_get(row, 'Specific Task Group Title'),
                        "focus_area": safe_get(row, 'focus_area'),
                        "connection_to_the_major_task_group": safe_get(row, 'Explanation'),
                        "specific_task_group_description": safe_get(row, 'Specific Task Group'),
                        "specific_task_group_tagline": safe_get(row, 'Tagline2'),
                        "specific_task_group_books_influenced_by": {}
                    }
                ]
            }
        ]
    }
    book1_json["sections"].append(section)

with open("book1_expanded_codex.json", "w", encoding="utf-8") as f:
    json.dump(book1_json, f, indent=2, ensure_ascii=False)

print("Book 1 JSON file created: book1_expanded_codex.json")

