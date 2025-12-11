
import { db } from '../src/lib/db';
import { occupations } from '../src/lib/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handling __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
    const jsonPath = path.resolve(__dirname, '../data/career data/occupation_data.json');
    console.log(`Loading data from ${jsonPath}...`);

    if (!fs.existsSync(jsonPath)) {
        console.error(`File not found: ${jsonPath}`);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Loaded ${data.length} root nodes.`);

    console.log('Deleting existing occupations...');
    await db.delete(occupations); // Clear table to avoid duplicates on re-run

    // Recursive function to insert nodes
    async function insertNode(node: any, parentId: string | null = null) {
        // Prepare data
        const code = node.code || null;

        // Log progress for root/major groups
        if (!parentId) {
            console.log(`Inserting root group: ${node.name}`);
        }

        try {
            const [inserted] = await db.insert(occupations).values({
                name: node.name,
                code: code,
                description: node.description || '',
                parentId: parentId,
                sampleTitles: node.sample_titles || [],
                dailyWage: null, // Placeholder
            }).returning({ id: occupations.id });

            // Insert children
            if (node.children && Array.isArray(node.children)) {
                for (const child of node.children) {
                    await insertNode(child, inserted.id);
                }
            }
        } catch (error) {
            console.error(`Error inserting ${node.name} (${code}):`, error);
        }
    }

    console.log('Starting seed process...');
    // Transaction? For recursive large data, transactions might be big, but safer.
    // We'll just do it sequentially for now since it's not huge (~1000 items).
    for (const rootNode of data) {
        await insertNode(rootNode, null);
    }

    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
