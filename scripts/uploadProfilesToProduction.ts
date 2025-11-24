import fs from 'fs';
import path from 'path';

interface Profile {
  id: string;
  canonical_id: string;
  unique_identifier: string;
  display_name: string | null;
  theme: string | null;
  family: string | null;
  book_association: Record<string, any> | null;
  enneagram_link: Record<string, any> | null;
  color_alignment: Record<string, any> | null;
  scoring_model: Record<string, any> | null;
  specific_task_group_books_influenced_by: Record<string, any> | null;
}

async function uploadProfilesToProduction() {
  const prodUrl = process.env.PROD_URL || 'https://www.epicarcana.com';
  const jsonPath = path.join(process.cwd(), 'data/dist/new_personality_profile.json');
  const mapPath = path.join(process.cwd(), 'personality_profile_id_map.json');

  console.log(`Loading profiles from ${jsonPath}...`);

  // Load the JSON file
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(jsonContent);

  // Load the ID map
  const idMapContent = fs.readFileSync(mapPath, 'utf-8');
  const idMap: Record<string, any> = JSON.parse(idMapContent);

  // Prepare profiles array
  const profiles: Profile[] = [];

  for (const [canonicalId, profileData] of Object.entries(idMap)) {
    profiles.push({
      id: profileData.id,
      canonical_id: canonicalId,
      unique_identifier: profileData.unique_identifier,
      display_name: profileData.display_name,
      theme: profileData.theme || null,
      family: profileData.family,
      book_association: null,
      enneagram_link: null,
      color_alignment: profileData.color_alignment || null,
      scoring_model: null,
      specific_task_group_books_influenced_by: null,
    });
  }

  console.log(`Prepared ${profiles.length} profiles for upload`);

  // Upload via API
  const endpoint = `${prodUrl}/api/setup/seed-personalities`;
  console.log(`Uploading to ${endpoint}...`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profiles }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✓ Success! Uploaded ${result.uploadedCount} profiles`);
      if (result.errors?.length > 0) {
        console.log(`⚠ ${result.errors.length} errors encountered:`);
        result.errors.slice(0, 5).forEach((err: string) => console.log(`  - ${err}`));
      }
    } else {
      console.error(`✗ Upload failed: ${result.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`✗ Request failed:`, error);
    process.exit(1);
  }
}

uploadProfilesToProduction().catch((error) => {
  console.error('Failed:', error);
  process.exit(1);
});
