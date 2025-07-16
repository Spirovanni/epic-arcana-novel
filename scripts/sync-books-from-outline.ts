import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from '../src/lib/db';
import { books, novelSeries } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

// Define the book data structure from l_outline.json
interface BookData {
  unique_identifier: string;
  type: string;
  color_name: string;
  hex_code: string;
  red: number;
  green: number;
  blue: number;
  title: string;
  subject: string;
  fiction_novel_title: string;
  epic_novel_plot?: string;
  focus: string;
  military_component: string;
  business_model_generation: string;
  personality_type: string;
  unique_theme: string;
  '9_habits_covey': string;
  sin: string;
  ennegram_name: string;
  ennegram_description: string;
  business_model_you: string;
  tagline: string;
  logline: string;
  description: string;
  themes?: string[];
}

// Book data extracted from l_outline.json
const BOOKS_DATA: Record<number, BookData> = {
  1: {
    unique_identifier: "MT 1",
    type: "Major Task",
    color_name: "Orange",
    hex_code: "#FFA500",
    red: 255,
    green: 165,
    blue: 0,
    title: "Foundation of Virtue: Building the Pillars of Purposeful Relationships",
    subject: "Interaction",
    fiction_novel_title: "Crown of the Ancient Ones",
    epic_novel_plot: "The Quest & Coming of age",
    focus: "Virtue and Ethical Living Interactively",
    military_component: "Command",
    business_model_generation: "Relationships",
    personality_type: "Architect",
    unique_theme: "Combined Directives",
    '9_habits_covey': "Synergize",
    sin: "Anger",
    ennegram_name: "The Reformer",
    ennegram_description: "The Reformer is rational, idealistic, and principled. They are motivated by a desire to live a life of integrity and purpose, striving to make a positive impact on the world.",
    business_model_you: "How I interact",
    tagline: "Building the Pillars of Purposeful Relationships",
    logline: "Foundation of Virtue is a transformative guide to building meaningful relationships through the power of virtue and ethical living.",
    description: "This book explores the foundational principles of virtue and ethical living, emphasizing the importance of honesty, integrity, and compassion in building meaningful relationships.",
    themes: ["Virtue as Foundation", "Honesty and Integrity", "Emotional Intelligence", "Accountability and Responsibility", "Resilience in Relationships", "Self-Discipline and Patience", "Purposeful Relationship Building"]
  },
  2: {
    unique_identifier: "MT 2",
    type: "Major Task",
    color_name: "Vermillion",
    hex_code: "#E34234",
    red: 227,
    green: 66,
    blue: 52,
    title: "Guardians of Trust: Navigating Protection with Purposeful Compassion",
    subject: "Protection",
    fiction_novel_title: "Rise of the Triassic Nine",
    focus: "Building trust and ensuring safety through proactive protection, transparency, and understanding, fostering secure and supportive relationships.",
    military_component: "Protect",
    business_model_generation: "Customers",
    personality_type: "Navigator",
    unique_theme: "Vigilant Unity",
    '9_habits_covey': "Seek First to Understand",
    sin: "Pride",
    ennegram_name: "THE HELPER",
    ennegram_description: "The Caring, Interpersonal Type: Demonstrative, Generous, People-Pleasing, and Possessive.",
    business_model_you: "Who I help",
    tagline: "Become the protector of trust and integrity, shaping relationships through compassion and vigilance",
    logline: "Guardians of Trust empowers readers to build secure relationships through proactive protection and purposeful compassion.",
    description: "This book focuses on building trust and ensuring safety through proactive protection, transparency, and understanding."
  },
  3: {
    unique_identifier: "MT 3",
    type: "Major Task",
    color_name: "Magenta",
    hex_code: "#ff00ff",
    red: 255,
    green: 0,
    blue: 255,
    title: "Mastering Motivation: Maneuvering Success with Purposeful Drive",
    subject: "Motivation",
    fiction_novel_title: "Awake Iron!",
    focus: "Harnessing motivation through strategic maneuvers, adaptive thinking, and pragmatic actions to achieve success and drive continuous improvement.",
    military_component: "Manuever",
    business_model_generation: "Channels",
    personality_type: "Motivator",
    unique_theme: "Radiant Manuevers",
    '9_habits_covey': "Put First Things First",
    sin: "Deceit",
    ennegram_name: "THE ACHIEVER",
    ennegram_description: "The Success-Oriented, Pragmatic Type: Adaptive, Excelling, Driven, and Image-Conscious",
    business_model_you: "How I deliver",
    tagline: "Unlock the keys to unstoppable motivation and turn strategic maneuvers into pathways to success",
    logline: "Mastering Motivation teaches readers to harness their inner drive through strategic thinking and purposeful action.",
    description: "This book explores how to harness motivation through strategic maneuvers, adaptive thinking, and pragmatic actions."
  },
  4: {
    unique_identifier: "MT 4",
    type: "Major Task",
    color_name: "Purple",
    hex_code: "#800080",
    red: 128,
    green: 0,
    blue: 128,
    title: "The Power of Anticipation: Navigating Logistics with Strategic Insight",
    subject: "Anticipation",
    fiction_novel_title: "Maiden of Mercy",
    focus: "Anticipating outcomes with strategic foresight, balancing emotional sensitivity and practical logistics to achieve long-term success.",
    military_component: "Logistics",
    business_model_generation: "Revenue",
    personality_type: "Operative",
    unique_theme: "Diserning Intervention",
    '9_habits_covey': "Begin with the End in Mind",
    sin: "Envy",
    ennegram_name: "THE INDIVIDUALIST",
    ennegram_description: "The Sensitive, Withdrawn Type: Expressive, Dramatic, Self-Absorbed, and Temperamental.",
    business_model_you: "What I get",
    tagline: "Learn the art of seeing ahead, turning foresight and planning into your most powerful assets",
    logline: "The Power of Anticipation develops strategic foresight and logistical excellence for long-term success.",
    description: "This book focuses on anticipating outcomes with strategic foresight, balancing emotional sensitivity and practical logistics."
  },
  5: {
    unique_identifier: "MT 5",
    type: "Major Task",
    color_name: "Violet",
    hex_code: "#7F00FF",
    red: 127,
    green: 0,
    blue: 255,
    title: "Mastering Observation: Harnessing Intelligence with Perceptive Precision",
    subject: "Observation",
    fiction_novel_title: "Holder of the Life Force",
    focus: "Mastering observation by leveraging keen perception and intelligence gathering to make informed, balanced decisions for effective outcomes.",
    military_component: "Intel",
    business_model_generation: "Cost",
    personality_type: "Forward Observer",
    unique_theme: "Balanced Force",
    '9_habits_covey': "Emotional And Total Bank",
    sin: "Avarice",
    ennegram_name: "THE INVESTIGATOR",
    ennegram_description: "The Intense, Cerebral Type: Perceptive, Innovative, Secretive, and Isolated.",
    business_model_you: "What I give",
    tagline: "Transform your power of observation into a tool for decisive action and innovative solutions",
    logline: "Mastering Observation teaches readers to harness keen perception and intelligence gathering for strategic advantage.",
    description: "This book explores mastering observation by leveraging keen perception and intelligence gathering."
  },
  6: {
    unique_identifier: "MT 6",
    type: "Major Task",
    color_name: "Teal",
    hex_code: "#008080",
    red: 0,
    green: 128,
    blue: 128,
    title: "Intentional Strategy: Unlocking Resources with Passionate Purpose",
    subject: "Intention",
    fiction_novel_title: "The City of Shadows",
    focus: "Aligning intention with strategic action, harnessing proactive planning and resource management to achieve purposeful growth and security.",
    military_component: "Strategy",
    business_model_generation: "Key Resources",
    personality_type: "Alchemist",
    unique_theme: "Active Passion",
    '9_habits_covey': "Be Proactive",
    sin: "Fear",
    ennegram_name: "THE LOYALIST",
    ennegram_description: "The Committed, Security-Oriented Type: Engaging, Responsible, Anxious, and Suspicious.",
    business_model_you: "Who am I",
    tagline: "Design your future by aligning intentions with bold strategies and purposeful resource management",
    logline: "Intentional Strategy teaches readers to align intention with strategic action for purposeful growth.",
    description: "This book focuses on aligning intention with strategic action, harnessing proactive planning and resource management."
  },
  7: {
    unique_identifier: "MT 7",
    type: "Major Task",
    color_name: "Green",
    hex_code: "#008000",
    red: 0,
    green: 128,
    blue: 0,
    title: "Operational Tactics: Driving Success with Collaborative Strategy",
    subject: "Operation",
    fiction_novel_title: "Dark Path to Victory",
    focus: "Optimizing operations through tactical execution and collaborative strategies, driving success with a win-win mindset and dynamic teamwork.",
    military_component: "Operation",
    business_model_generation: "Key Partners",
    personality_type: "Hard-Charger",
    unique_theme: "Tactical Reset",
    '9_habits_covey': "Think Win-Win",
    sin: "Gluttony",
    ennegram_name: "THE ENTHUSIAST",
    ennegram_description: "The Busy, Fun-Loving Type: Spontaneous, Versatile, Distractible, and Scattered.",
    business_model_you: "Who helps me",
    tagline: "Harness the strength of collaborative tactics to optimize operations and achieve greater success",
    logline: "Operational Tactics teaches readers to optimize operations through tactical execution and collaborative strategies.",
    description: "This book focuses on optimizing operations through tactical execution and collaborative strategies."
  },
  8: {
    unique_identifier: "MT 8",
    type: "Major Task",
    color_name: "Chartreuse",
    hex_code: "#7fff00",
    red: 127,
    green: 255,
    blue: 0,
    title: "Igniting Inspiration: Unleashing Power through Focused Action",
    subject: "Inspiration",
    fiction_novel_title: "Inferno Garden",
    focus: "Igniting inspiration through decisive action and continuous self-improvement, channeling passion and power into purposeful achievement.",
    military_component: "Fire",
    business_model_generation: "Key Activities",
    personality_type: "Pathfinder",
    unique_theme: "Mind Blades",
    '9_habits_covey': "Sharpen the Saw",
    sin: "Lust",
    ennegram_name: "THE CHALLENGER",
    ennegram_description: "The Powerful, Dominating Type: Self-Confident, Decisive, Willful, and Confrontational.",
    business_model_you: "What I do",
    tagline: "Unleash your inner fire and turn inspiration into powerful, focused action that drives results",
    logline: "Igniting Inspiration teaches readers to channel passion and power into purposeful achievement.",
    description: "This book focuses on igniting inspiration through decisive action and continuous self-improvement."
  },
  9: {
    unique_identifier: "MT 9",
    type: "Major Task",
    color_name: "Amber",
    hex_code: "#FFBF00",
    red: 255,
    green: 191,
    blue: 0,
    title: "Revitalizing Balance: Igniting Growth through Harmonized Operations",
    subject: "Revitalization",
    fiction_novel_title: "The Blades of Triumph",
    focus: "Revitalizing balance through harmonized operations, fostering growth and innovation with strategic alignment and dynamic adaptability.",
    military_component: "Operations",
    business_model_generation: "Value Provided",
    personality_type: "Rainmaker",
    unique_theme: "Source Igniter",
    '9_habits_covey': "Life Balance",
    sin: "Sloth",
    ennegram_name: "THE PEACEMAKER",
    ennegram_description: "The Easygoing, Self-Effacing Type: Receptive, Reassuring, Agreeable, and Complacent",
    business_model_you: "Value Provided",
    tagline: "Reinvigorate your life and work by finding harmony between revitalization and operational excellence",
    logline: "Revitalizing Balance teaches readers to foster growth and innovation through strategic alignment.",
    description: "This book focuses on revitalizing balance through harmonized operations, fostering growth and innovation."
  }
};

async function syncBooksFromOutline() {
  console.log('Starting sync of books from l_outline.json...');
  
  try {
    // First, get the series ID (assuming there's a main series)
    const series = await db.select().from(novelSeries).limit(1);
    
    if (series.length === 0) {
      console.error('No series found in database. Please create a series first.');
      return;
    }
    
    const seriesId = series[0].id;
    console.log('Using series ID:', seriesId);
    
    // Update each book
    for (const [bookNumber, bookData] of Object.entries(BOOKS_DATA)) {
      const bookNum = parseInt(bookNumber);
      
      console.log(`Processing Book ${bookNum}: ${bookData.fiction_novel_title}`);
      
      // Check if book exists
      const existingBook = await db.select().from(books).where(eq(books.bookNumber, bookNum));
      
      const bookRecord = {
        seriesId: seriesId,
        bookNumber: bookNum,
        uniqueIdentifier: bookData.unique_identifier,
        title: bookData.title,
        fictionNovelTitle: bookData.fiction_novel_title,
        subject: bookData.subject,
        focus: bookData.focus,
        tagline: bookData.tagline,
        logline: bookData.logline,
        description: bookData.description,
        themes: bookData.themes ? JSON.stringify(bookData.themes) : null,
        militaryComponent: bookData.military_component,
        businessModelGeneration: bookData.business_model_generation,
        personalityType: bookData.personality_type,
        enneagramType: bookData.ennegram_name,
        enneagramDescription: bookData.ennegram_description,
        coveryCoveyHabit: bookData['9_habits_covey'],
        associatedSin: bookData.sin,
        epicNovelPlot: bookData.epic_novel_plot,
        uniqueTheme: bookData.unique_theme,
        businessModelYou: bookData.business_model_you,
        type: bookData.type,
        updatedAt: new Date()
      };
      
      if (existingBook.length > 0) {
        // Update existing book
        await db.update(books)
          .set(bookRecord)
          .where(eq(books.bookNumber, bookNum));
        
        console.log(`✓ Updated Book ${bookNum}: ${bookData.fiction_novel_title}`);
      } else {
        // Insert new book
        await db.insert(books).values(bookRecord);
        
        console.log(`✓ Inserted Book ${bookNum}: ${bookData.fiction_novel_title}`);
      }
    }
    
    console.log('✅ Books sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Error syncing books:', error);
    throw error;
  }
}

// Run the sync
syncBooksFromOutline().catch(console.error);