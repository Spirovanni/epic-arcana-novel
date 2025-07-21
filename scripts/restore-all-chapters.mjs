import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq, and } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const LORE_PATH = path.join(process.cwd(), 'lore');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

async function generateMissingBooks() {
  console.log('🔧 Generating missing books and chapters...');
  
  const books = [];
  
  // Generate all 9 books
  for (let bookNum = 1; bookNum <= 9; bookNum++) {
    const trilogyNum = Math.ceil(bookNum / 3);
    const bookInTrilogy = ((bookNum - 1) % 3) + 1;
    
    const book = {
      bookNumber: bookNum,
      title: `Book ${bookNum}: The ${getBookTitle(bookNum)}`,
      description: `This is Book ${bookNum} of the Epic Arcana series, part of the ${getTrilogyName(trilogyNum)} trilogy.`,
      type: 'Epic Fantasy',
      colorName: getBookColor(bookNum),
      hexCode: getBookHexCode(bookNum),
      red: 128,
      green: 128,
      blue: 128,
      focusArea: `Book ${bookNum} Focus`,
      summary: `Summary for Book ${bookNum}`
    };
    
    // Generate 40 chapters for each book
    const chapters = [];
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const chapter = {
        chapterNumber: chapterNum,
        uniqueIdentifier: `book${bookNum}_chapter${chapterNum}`,
        title: `Chapter ${chapterNum}: ${getChapterTitle(bookNum, chapterNum)}`,
        focus: `Chapter ${chapterNum} Focus`,
        description: `This is Chapter ${chapterNum} of Book ${bookNum}`,
        tarotCardLink: getTarotCard(chapterNum),
        tarotFamily: getTarotFamily(chapterNum),
        colorTheme: {
          colorName: getChapterColor(chapterNum),
          hexCode: getChapterHexCode(chapterNum),
          red: (chapterNum * 6) % 256,
          green: (chapterNum * 7) % 256,
          blue: (chapterNum * 8) % 256
        },
        type: 'narrative',
        colorName: getChapterColor(chapterNum),
        hexCode: getChapterHexCode(chapterNum),
        red: (chapterNum * 6) % 256,
        green: (chapterNum * 7) % 256,
        blue: (chapterNum * 8) % 256,
        focusArea: `Chapter ${chapterNum} Focus Area`,
        summary: `Chapter ${chapterNum} summary for Book ${bookNum}`,
        heroJourneyBeat: getHeroJourneyBeat(chapterNum),
        saveTheCatBeat: getSaveTheCatBeat(chapterNum)
      };
      
      chapters.push(chapter);
    }
    
    books.push({ book, chapters });
  }
  
  return books;
}

function getBookTitle(bookNum) {
  const titles = [
    "Foundation of Virtue",
    "Awakening of Self",
    "Bonds of Trust", 
    "Strategic Mind",
    "Creative Force",
    "Adaptive Spirit",
    "Purposeful Vision",
    "Lasting Legacy",
    "Eternal Wisdom"
  ];
  return titles[bookNum - 1] || `Book ${bookNum}`;
}

function getTrilogyName(trilogyNum) {
  const names = ["Genesis", "Transformation", "Ascension"];
  return names[trilogyNum - 1] || `Trilogy ${trilogyNum}`;
}

function getBookColor(bookNum) {
  const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Indigo", "Violet", "Gold"];
  return colors[bookNum - 1] || "Silver";
}

function getBookHexCode(bookNum) {
  const hexCodes = ["#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#800080", "#FFA500", "#4B0082", "#8A2BE2", "#FFD700"];
  return hexCodes[bookNum - 1] || "#C0C0C0";
}

function getChapterTitle(bookNum, chapterNum) {
  return `The ${chapterNum}th Step`;
}

function getChapterColor(chapterNum) {
  const colors = ["Crimson", "Azure", "Emerald", "Amber", "Violet", "Orange", "Teal", "Rose", "Silver", "Gold"];
  return colors[chapterNum % colors.length];
}

function getChapterHexCode(chapterNum) {
  return `#${((chapterNum * 123456) % 16777215).toString(16).padStart(6, '0')}`;
}

function getTarotCard(chapterNum) {
  const cards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];
  return cards[chapterNum % cards.length];
}

function getTarotFamily(chapterNum) {
  return chapterNum <= 22 ? "Major Arcana" : "Minor Arcana";
}

function getHeroJourneyBeat(chapterNum) {
  const beats = [
    "Ordinary World", "Call to Adventure", "Refusal of the Call", "Meeting the Mentor",
    "Crossing the Threshold", "Tests, Allies & Enemies", "Approach to the Inmost Cave",
    "The Ordeal", "Reward", "The Road Back", "Resurrection", "Return with the Elixir"
  ];
  return beats[chapterNum % beats.length];
}

function getSaveTheCatBeat(chapterNum) {
  const beats = [
    "Opening Image", "Theme Stated", "Set-up", "Catalyst", "Debate", "Break into Two",
    "B Story", "Fun and Games", "Midpoint", "Bad Guys Close In", "All Is Lost",
    "Dark Night of the Soul", "Break into Three", "Finale", "Final Image"
  ];
  return beats[chapterNum % beats.length];
}

async function restoreAllBooksAndChapters(booksData) {
  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    console.log('Connecting to database...');
    
    // Get existing books
    const existingBooks = await db.select().from(schema.books);
    const existingBookNumbers = new Set(existingBooks.map(book => book.bookNumber));
    
    console.log(`Existing books: ${Array.from(existingBookNumbers).sort().join(', ')}`);

    for (const bookData of booksData) {
      const { book, chapters } = bookData;
      
      let bookId;
      
      // Insert book if it doesn't exist
      if (!existingBookNumbers.has(book.bookNumber)) {
        console.log(`\n📚 Creating Book ${book.bookNumber}: ${book.title}`);
        
        const newBook = await db
          .insert(schema.books)
          .values(book)
          .returning();
        
        bookId = newBook[0].id;
        console.log(`  ✅ Created book with ID: ${bookId}`);
      } else {
        // Get existing book ID
        const existingBook = existingBooks.find(b => b.bookNumber === book.bookNumber);
        bookId = existingBook.id;
        console.log(`\n📚 Found existing Book ${book.bookNumber}, ID: ${bookId}`);
      }

      // Check existing chapters for this book
      const existingChapters = await db
        .select({ chapterNumber: schema.chapters.chapterNumber })
        .from(schema.chapters)
        .where(eq(schema.chapters.bookId, bookId));
      
      const existingChapterNumbers = new Set(existingChapters.map(ch => ch.chapterNumber));
      const chaptersToAdd = chapters.filter(ch => !existingChapterNumbers.has(ch.chapterNumber));
      
      console.log(`  📖 Existing chapters: ${Array.from(existingChapterNumbers).sort().join(', ')}`);
      console.log(`  📝 Adding ${chaptersToAdd.length} missing chapters...`);

      // Insert missing chapters
      for (const chapter of chaptersToAdd) {
        await db
          .insert(schema.chapters)
          .values({
            ...chapter,
            bookId
          });
        
        if (chaptersToAdd.length <= 10) {
          console.log(`    ✅ Chapter ${chapter.chapterNumber}: ${chapter.title}`);
        }
      }
      
      if (chaptersToAdd.length > 10) {
        console.log(`    ✅ Added chapters ${chaptersToAdd[0].chapterNumber}-${chaptersToAdd[chaptersToAdd.length-1].chapterNumber}`);
      }
    }

    console.log('\n🎉 Successfully restored all books and chapters!');
    
    // Final summary
    const finalBooks = await db.select().from(schema.books);
    const finalChapters = await db.select().from(schema.chapters);
    
    console.log(`\n📊 Final Summary:`);
    console.log(`  📚 Total books: ${finalBooks.length}`);
    console.log(`  📖 Total chapters: ${finalChapters.length}`);
    
    for (const book of finalBooks.sort((a, b) => a.bookNumber - b.bookNumber)) {
      const bookChapters = finalChapters.filter(ch => ch.bookId === book.id);
      console.log(`  📘 Book ${book.bookNumber}: ${bookChapters.length} chapters`);
    }
    
  } catch (error) {
    console.error('❌ Error restoring books and chapters:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    console.log('🚀 Starting to restore all 9 books with 40 chapters each...\n');
    
    // Generate all missing books and chapters
    const booksData = await generateMissingBooks();
    
    console.log(`📋 Generated data for ${booksData.length} books with ${booksData[0].chapters.length} chapters each`);
    
    // Restore to database
    await restoreAllBooksAndChapters(booksData);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();