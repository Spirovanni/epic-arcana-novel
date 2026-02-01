import fs from 'fs';

function findChapter(data: any, id: string): any {
    if (!data || typeof data !== 'object') {
        return null;
    }

    if (data.id === id) {
        return data;
    }

    if (Array.isArray(data)) {
        for (const item of data) {
            const result = findChapter(item, id);
            if (result) return result;
        }
    } else {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const result = findChapter(data[key], id);
                if (result) return result;
            }
        }
    }

    return null;
}

const data = JSON.parse(fs.readFileSync('data/l_outline.json', 'utf8'));
const chapter = findChapter(data, 'EA-347');

if (chapter) {
    console.log('Chapter Found:', chapter.title || 'Untitled');
    console.log('ID:', chapter.id);
    console.log('Focus:', chapter.focus || chapter.epic_chapter_focus || 'None');
    console.log('Preliminary Focus:', chapter.preliminary_scene_focus || chapter.epic_preliminary_scene_focus || 'None');
    console.log('Preliminary Description:', chapter.preliminary_scene_description || chapter.epic_preliminary_scene_description || 'None');
    console.log('Scenes:', chapter.scenes ? chapter.scenes.length : 0);
    if (chapter.scenes && chapter.scenes.length > 0) {
        chapter.scenes.forEach((s: any) => {
            console.log(`- Scene ${s.scene_number || '?'}: ${s.title || 'Untitled'}`);
            console.log(`  Focus: ${s.focus || 'None'}`);
        });
    }
} else {
    console.log('Chapter EA-347 not found');
}
