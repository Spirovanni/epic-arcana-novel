import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const eaId = 'EA-267';
  console.log(`📝 Injecting enhanced scenes for ${eaId}...\n`);

  const enhancedScenesPath = path.join(process.cwd(), 'scripts', 'ea-267-enhanced-scenes.json');
  const enhancedScenes = JSON.parse(fs.readFileSync(enhancedScenesPath, 'utf-8'));
  console.log(`✅ Loaded ${enhancedScenes.length} enhanced scenes\n`);

  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  function findAndUpdate(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.id === eaId) {
      console.log(`✅ Found ${eaId}: ${obj.chapter} - ${obj.specific_task_group_title}`);
      console.log(`   Existing scenes: ${obj.scenes ? obj.scenes.length : 0}\n`);
      obj.scenes = enhancedScenes;
      console.log(`✅ Replaced with ${enhancedScenes.length} enhanced scenes\n`);
      return true;
    }
    for (const key of Object.keys(obj)) {
      if (findAndUpdate(obj[key])) return true;
    }
    return false;
  }

  if (!findAndUpdate(outline)) throw new Error(`${eaId} not found`);

  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-ea-267.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`💾 Backup: data/l_outline.backup-ea-267.json\n`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n✨ Complete!`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e); process.exit(1); });
