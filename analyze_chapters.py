import json

# Load the JSON file
with open('data/l_outline.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

chapters = []

def find_chapters(obj, path=''):
    """Recursively find all chapters with unique_identifier starting with STG"""
    if isinstance(obj, dict):
        if 'unique_identifier' in obj and isinstance(obj.get('unique_identifier'), str) and obj['unique_identifier'].startswith('STG'):
            chapters.append({
                'unique_identifier': obj.get('unique_identifier'),
                'id': obj.get('id', 'MISSING'),
                'all_chapter': obj.get('all_chapter', 'MISSING'),
                'book': obj.get('book', 'MISSING'),
                'chapter': obj.get('chapter', 'MISSING')
            })
        for k, v in obj.items():
            find_chapters(v, path + '.' + k)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            find_chapters(item, path + f'[{i}]')

find_chapters(data)

print(f"Total chapters found: {len(chapters)}")
print("\nChapters from index 60 onwards (showing first 60):")
print("-" * 100)

for i, ch in enumerate(chapters[60:120], start=61):
    print(f"{i}. {ch['unique_identifier']:20s} | id: {str(ch['id']):10s} | all_chapter: {str(ch['all_chapter']):10s} | book: {str(ch['book']):10s} | {ch['chapter']}")

