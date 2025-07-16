import { db } from '../src/lib/db';
import { books, taskMasters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

// Task Master color data from l_outline.json
const TASK_MASTERS_DATA = [
  {
    bookNumber: 1,
    colorName: "Orange",
    hexCode: "#FFA500",
    red: 255,
    green: 165,
    blue: 0,
    title: "Foundation of Virtue: Building the Pillars of Purposeful Relationships"
  },
  {
    bookNumber: 2,
    colorName: "Vermillion",
    hexCode: "#E34234",
    red: 227,
    green: 66,
    blue: 52,
    title: "Guardians of Trust: Navigating Protection with Purposeful Compassion"
  },
  {
    bookNumber: 3,
    colorName: "Magenta",
    hexCode: "#ff00ff",
    red: 255,
    green: 0,
    blue: 255,
    title: "Mastering Motivation: Maneuvering Success with Purposeful Drive"
  },
  {
    bookNumber: 4,
    colorName: "Purple",
    hexCode: "#800080",
    red: 128,
    green: 0,
    blue: 128,
    title: "The Power of Anticipation: Navigating Logistics with Strategic Insight"
  },
  {
    bookNumber: 5,
    colorName: "Violet",
    hexCode: "#7F00FF",
    red: 127,
    green: 0,
    blue: 255,
    title: "Mastering Observation: Harnessing Intelligence with Perceptive Precision"
  },
  {
    bookNumber: 6,
    colorName: "Teal",
    hexCode: "#008080",
    red: 0,
    green: 128,
    blue: 128,
    title: "Intentional Strategy: Unlocking Resources with Passionate Purpose"
  },
  {
    bookNumber: 7,
    colorName: "Green",
    hexCode: "#008000",
    red: 0,
    green: 128,
    blue: 0,
    title: "Operational Tactics: Driving Success with Collaborative Strategy"
  },
  {
    bookNumber: 8,
    colorName: "Chartreuse",
    hexCode: "#7fff00",
    red: 127,
    green: 255,
    blue: 0,
    title: "Igniting Inspiration: Unleashing Power through Focused Action"
  },
  {
    bookNumber: 9,
    colorName: "Amber",
    hexCode: "#FFBF00",
    red: 255,
    green: 191,
    blue: 0,
    title: "Revitalizing Balance: Igniting Growth through Harmonized Operations"
  }
];

async function syncTaskMastersFromOutline() {
  console.log('Starting sync of task masters from l_outline.json...');
  
  try {
    // Get all books from the database
    const allBooks = await db.select().from(books);
    
    for (const taskMasterData of TASK_MASTERS_DATA) {
      const book = allBooks.find(b => b.bookNumber === taskMasterData.bookNumber);
      
      if (!book) {
        console.log(`⚠️  Book ${taskMasterData.bookNumber} not found in database, skipping...`);
        continue;
      }
      
      console.log(`Processing Task Master for Book ${taskMasterData.bookNumber}`);
      
      // Check if task master exists for this book
      const existingTaskMaster = await db.select()
        .from(taskMasters)
        .where(eq(taskMasters.bookId, book.id))
        .limit(1);
      
      const taskMasterRecord = {
        bookId: book.id,
        uniqueIdentifier: `MT ${taskMasterData.bookNumber}`,
        type: "Major Task",
        colorName: taskMasterData.colorName,
        hexCode: taskMasterData.hexCode,
        red: taskMasterData.red,
        green: taskMasterData.green,
        blue: taskMasterData.blue,
        title: taskMasterData.title,
        updatedAt: new Date()
      };
      
      if (existingTaskMaster.length > 0) {
        // Update existing task master
        await db.update(taskMasters)
          .set(taskMasterRecord)
          .where(eq(taskMasters.id, existingTaskMaster[0].id));
        
        console.log(`✓ Updated Task Master for Book ${taskMasterData.bookNumber}`);
      } else {
        // Insert new task master
        await db.insert(taskMasters).values(taskMasterRecord);
        
        console.log(`✓ Inserted Task Master for Book ${taskMasterData.bookNumber}`);
      }
    }
    
    console.log('✅ Task Masters sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Error syncing task masters:', error);
    throw error;
  }
}

// Run the sync
syncTaskMastersFromOutline().catch(console.error);