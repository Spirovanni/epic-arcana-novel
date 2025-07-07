// This script is now ESM-compatible. Run with Bun or Node (with --loader or "type": "module" in package.json)
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { timelineEvents, trionfiCards, characters, symbolicObjects, militaryOrders, zanettiTrainComponents, temporalStations, temporalTechnology, temporalEconomy, temporalLaw, temporalEducation, locations, novelSeries, books, chapters, scenes, taskGroups, characterArcs, characterTriumphMapping, storyGaps, characterThematicElements, sceneTimelineMapping, historicalCharacterMapping, timelineDivergencePoints } from '../src/lib/schema.js';
import { eq } from 'drizzle-orm';
// TODO: import other tables as you add them

const LORE_DIR = path.join(process.cwd(), 'lore/json');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function seedTimelineEvents(db) {
  const timelinePath = path.join(LORE_DIR, 'timelines', 'main_story_timeline.json');
  const timelineData = await loadJSON(timelinePath);
  if (!timelineData.timeline) {
    console.warn('No timeline data found in', timelinePath);
    return;
  }
  for (const event of timelineData.timeline) {
    try {
      await db.insert(timelineEvents).values({
        eventKey: event.id,
        label: event.label,
        year: event.year ?? null,
        era: event.era || 'Late Middle Ages', // Default era for events missing this field
        historical: event.historical ? 1 : 0,
        summary: event.summary,
        month: event.month ?? null,
        day: event.day ?? null,
      }).onConflictDoNothing();
    } catch (err) {
      console.error('Failed to insert timeline event', event.id, err);
    }
  }
  console.log('Seeded timeline events.');
}

async function seedCharacters(db) {
  const charDir = path.join(LORE_DIR, 'characters');
  const files = await fs.readdir(charDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const charData = await loadJSON(path.join(charDir, file));
      
      // Handle array of characters
      if (Array.isArray(charData)) {
        for (const char of charData) {
          try {
            await db.insert(characters).values({
              name: char.name,
              characterType: char.name === 'Dagon Atumari' || char.name === 'Salasa Atumari' ? 'mythic' : 
                            char.birth_year && char.birth_year < 1000 ? 'historical' : 'fantasy',
              pronouns: char.pronouns || null,
              relation: char.relation || null,
              personality: char.personality || null,
              background: char.background || null,
              physicalDescription: char.physical_description || null,
              dialogueStyle: char.dialogue_style || null,
              role: char.role || null,
              goal: char.goal || null,
              birthYear: char.birth_year ? char.birth_year.toString() : null,
              died: char.died ? char.died.toString() : null,
              storyYear: char.story_year ? char.story_year.toString() : null,
              storyAge: char.story_age ? char.story_age.toString() : null,
              groups: char.groups ? JSON.stringify(char.groups) : null,
              description: char.description || null,
              birthPlace: char.birth_place || null,
              birthPlaceDescription: char.birth_place_description || null,
              deathPlace: char.death_place || null,
              deathPlaceDescription: char.death_place_description || null,
              aka: char.aka || null,
              evolution: char.evolution ? JSON.stringify(char.evolution) : null,
            }).onConflictDoNothing();
          } catch (err) {
            console.error('Failed to insert character', char.name, err);
          }
        }
      }
    }
  }
  console.log('Seeded characters.');
}

async function seedTrionfiCards(db) {
  const majorArcanaPath = path.join(LORE_DIR, 'trionfi_cards', 'major_arcana.json');
  const majorArcanaData = await loadJSON(majorArcanaPath);
  
  for (const [cardName, cardData] of Object.entries(majorArcanaData)) {
    try {
      await db.insert(trionfiCards).values({
        name: cardName.replace(/_/g, ' '),
        arcanaType: 'major',
        suit: null, // Major arcana don't have suits
        powerLevel: null,
        description: cardData.essence || null,
        temporalImpact: cardData.temporal_power || null,
        essence: cardData.essence || null,
        divineAspect: cardData.divine_aspect || null,
        humanAspect: cardData.human_aspect || null,
        interpretations: JSON.stringify({
          francisco: cardData.francisco_interpretation,
          la_signora: cardData.la_signora_interpretation,
          dagon: cardData.dagon_interpretation
        }),
        specialAbility: cardData.special_ability || null,
        domain: null,
        element: null,
      }).onConflictDoNothing();
    } catch (err) {
      console.error('Failed to insert trionfi card', cardName, err);
    }
  }
  console.log('Seeded trionfi cards.');
}

async function seedSymbolicObjects(db) {
  const objectsPath = path.join(LORE_DIR, 'misc', 'symbolic_objects.json');
  const objectsData = await loadJSON(objectsPath);
  
  for (const [objName, objData] of Object.entries(objectsData)) {
    try {
      await db.insert(symbolicObjects).values({
        name: objName,
        role: objData.role || null,
        theme: objData.theme || null,
        description: objData.description || null,
        lore: objData.lore || null,
        origin: objData.origin || null,
      }).onConflictDoNothing();
    } catch (err) {
      console.error('Failed to insert symbolic object', objName, err);
    }
  }
  console.log('Seeded symbolic objects.');
}

async function seedMilitaryOrders(db) {
  const ordersPath = path.join(LORE_DIR, 'misc', 'military_orders.json');
  const ordersData = await loadJSON(ordersPath);
  
  for (const [orderName, orderData] of Object.entries(ordersData)) {
    try {
      await db.insert(militaryOrders).values({
        name: orderName,
        role: orderData.role || null,
        origin: orderData.origin || null,
        description: orderData.description || null,
        lore: orderData.lore || null,
      }).onConflictDoNothing();
    } catch (err) {
      console.error('Failed to insert military order', orderName, err);
    }
  }
  console.log('Seeded military orders.');
}

async function seedTemporalArchitecture(db) {
  const architecturePath = path.join(LORE_DIR, 'time_travel', 'temporal_architecture.json');
  const architectureData = await loadJSON(architecturePath);
  
  // Seed train components
  if (architectureData.Train_Structure) {
    const trainStructure = architectureData.Train_Structure;
    
    // Locomotive
    if (trainStructure.locomotive) {
      for (const [component, details] of Object.entries(trainStructure.locomotive)) {
        try {
          await db.insert(zanettiTrainComponents).values({
            name: component.replace(/_/g, ' '),
            type: 'locomotive',
            details: JSON.stringify({ description: details }),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert locomotive component', component, err);
        }
      }
    }
    
    // Passenger cars
    if (trainStructure.passenger_cars) {
      for (const [component, details] of Object.entries(trainStructure.passenger_cars)) {
        try {
          await db.insert(zanettiTrainComponents).values({
            name: component.replace(/_/g, ' '),
            type: 'passenger_car',
            details: JSON.stringify({ description: details }),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert passenger car component', component, err);
        }
      }
    }
    
    // Observation car
    if (trainStructure.observation_car) {
      for (const [component, details] of Object.entries(trainStructure.observation_car)) {
        try {
          await db.insert(zanettiTrainComponents).values({
            name: component.replace(/_/g, ' '),
            type: 'observation_car',
            details: JSON.stringify({ description: details }),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert observation car component', component, err);
        }
      }
    }
  }
  
  // Seed temporal stations
  if (architectureData.Temporal_Stations) {
    const stations = architectureData.Temporal_Stations;
    
    // Major hubs
    if (stations.major_hubs) {
      for (const station of stations.major_hubs) {
        try {
          await db.insert(temporalStations).values({
            name: station,
            type: 'major_hub',
            features: JSON.stringify(stations.station_features || {}),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert major hub', station, err);
        }
      }
    }
    
    // Minor stops
    if (stations.minor_stops) {
      for (const station of stations.minor_stops) {
        try {
          await db.insert(temporalStations).values({
            name: station,
            type: 'minor_stop',
            features: JSON.stringify(stations.station_features || {}),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert minor stop', station, err);
        }
      }
    }
  }
  
  console.log('Seeded temporal architecture.');
}

async function seedTemporalTechnology(db) {
  const technologyPath = path.join(LORE_DIR, 'time_travel', 'temporal_technology.json');
  const technologyData = await loadJSON(technologyPath);
  
  // Seed chronological devices
  if (technologyData.Chronological_Devices) {
    for (const [deviceName, deviceData] of Object.entries(technologyData.Chronological_Devices)) {
      try {
        await db.insert(temporalTechnology).values({
          name: deviceName.replace(/_/g, ' '),
          type: 'Chronological Device',
          description: deviceData.function || null,
          details: JSON.stringify(deviceData),
        }).onConflictDoNothing();
      } catch (err) {
        console.error('Failed to insert chronological device', deviceName, err);
      }
    }
  }
  
  // Seed protective equipment
  if (technologyData.Protective_Equipment) {
    for (const [equipmentName, equipmentData] of Object.entries(technologyData.Protective_Equipment)) {
      try {
        await db.insert(temporalTechnology).values({
          name: equipmentName.replace(/_/g, ' '),
          type: 'Protective Equipment',
          description: equipmentData.function || null,
          details: JSON.stringify(equipmentData),
        }).onConflictDoNothing();
      } catch (err) {
        console.error('Failed to insert protective equipment', equipmentName, err);
      }
    }
  }
  
  console.log('Seeded temporal technology.');
}

async function seedTemporalEconomy(db) {
  const economyPath = path.join(LORE_DIR, 'time_travel', 'temporal_economy.json');
  const economyData = await loadJSON(economyPath);
  
  // Seed chronological resources
  if (economyData.Chronological_Resources) {
    for (const [resourceName, resourceData] of Object.entries(economyData.Chronological_Resources)) {
      try {
        await db.insert(temporalEconomy).values({
          name: resourceName.replace(/_/g, ' '),
          type: 'Resource',
          description: resourceData.value || null,
          details: JSON.stringify(resourceData),
        }).onConflictDoNothing();
      } catch (err) {
        console.error('Failed to insert chronological resource', resourceName, err);
      }
    }
  }
  
  // Seed temporal services
  if (economyData.Temporal_Services) {
    for (const [serviceName, serviceData] of Object.entries(economyData.Temporal_Services)) {
      try {
        await db.insert(temporalEconomy).values({
          name: serviceName.replace(/_/g, ' '),
          type: 'Service',
          description: serviceData.cost || null,
          details: JSON.stringify(serviceData),
        }).onConflictDoNothing();
      } catch (err) {
        console.error('Failed to insert temporal service', serviceName, err);
      }
    }
  }
  
  console.log('Seeded temporal economy.');
}

async function seedTemporalLaw(db) {
  const lawPath = path.join(LORE_DIR, 'time_travel', 'temporal_law.json');
  const lawData = await loadJSON(lawPath);
  
  for (const [category, items] of Object.entries(lawData)) {
    if (Array.isArray(items)) {
      for (const item of items) {
        try {
          await db.insert(temporalLaw).values({
            name: item,
            type: category.replace(/_/g, ' '),
            description: null,
            details: JSON.stringify({ category }),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert temporal law item', item, err);
        }
      }
    } else if (typeof items === 'object') {
      for (const [itemName, itemData] of Object.entries(items)) {
        try {
          await db.insert(temporalLaw).values({
            name: itemName.replace(/_/g, ' '),
            type: category.replace(/_/g, ' '),
            description: typeof itemData === 'string' ? itemData : null,
            details: JSON.stringify(itemData),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert temporal law item', itemName, err);
        }
      }
    }
  }
  
  console.log('Seeded temporal law.');
}

async function seedTemporalEducation(db) {
  const educationPath = path.join(LORE_DIR, 'time_travel', 'temporal_education.json');
  const educationData = await loadJSON(educationPath);
  
  for (const [category, items] of Object.entries(educationData)) {
    if (Array.isArray(items)) {
      for (const item of items) {
        try {
          await db.insert(temporalEducation).values({
            name: item,
            type: category.replace(/_/g, ' '),
            description: null,
            details: JSON.stringify({ category }),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert temporal education item', item, err);
        }
      }
    } else if (typeof items === 'object') {
      for (const [itemName, itemData] of Object.entries(items)) {
        try {
          await db.insert(temporalEducation).values({
            name: itemName.replace(/_/g, ' '),
            type: category.replace(/_/g, ' '),
            description: typeof itemData === 'string' ? itemData : null,
            details: JSON.stringify(itemData),
          }).onConflictDoNothing();
        } catch (err) {
          console.error('Failed to insert temporal education item', itemName, err);
        }
      }
    }
  }
  
  console.log('Seeded temporal education.');
}

async function seedLocations(db) {
  const locationsPath = path.join(LORE_DIR, 'locations', 'locations.json');
  const locationsData = await loadJSON(locationsPath);
  
  // Handle the "Places_of_Prominence_Laurasia" array
  if (locationsData.Places_of_Prominence_Laurasia && Array.isArray(locationsData.Places_of_Prominence_Laurasia)) {
    for (const location of locationsData.Places_of_Prominence_Laurasia) {
      try {
        await db.insert(locations).values({
          name: location.name,
          description: location.description || location.sensory_description || null,
          arcana: location.linked_arcana || null,
          coordinates: location.location ? JSON.stringify({ 
            region: "Laurasia",
            position: location.location,
            type: location.type 
          }) : null,
          faction: location.affiliation || null,
        }).onConflictDoNothing();
      } catch (err) {
        console.error('Failed to insert location', location.name, err);
      }
    }
  }
  
  console.log('Seeded locations.');
}

async function seedNovelStructure(db) {
  // Manually create the novel series data based on the structure analysis
  const seriesData = {
    title: "Codex of the Nine Realms",
    tagline: "The gods wrote destiny in the stars—he reshuffled it in cards.",
    logline: "When a 14th-century student crafts a mystical card game to explore the human soul, he ignites a war across mythic realms—where gods guard fate, and mortals fight to reclaim it.",
    synopsis: "In the tumultuous year of 1321 at the University of Bologna, Francisco Petrarch creates 'Trionfi,' a card game intricately woven with the threads of human experiences, drawing the attention of celestial and infernal forces in an odyssey that transcends time and reality.",
    secondarySynopsis: "In The Codex of the Nine Realms, beginning in the year 1321 with the creation of a mysterious card game by a young Petrarch, a band of exiles, scholars, and immortal outcasts are swept into a mythic war across time-twisted realms—where gods manipulate fate, the Tarot reveals hidden truths, and a runaway train called the Zanetti steams toward Pangea.",
    description: "An ambitious nine-part series exploring mythic fantasy, philosophical fiction, and historical intrigue through the lens of Tarot symbolism and divine rebellion.",
    summary: "Across the nine‑book Codex of the Nine Realms, a 14th‑century scholar's Tarot‑like card game fractures time and myth, thrusting Petrarch, Dante, and a cadre of mortal rebels onto a cosmic chessboard where warring gods script human fate—until the Trionfi are reshuffled, realms collide, and the very nature of free will must be reforged.",
    genres: ["Fiction", "Mythic Fantasy", "Philosophical Fiction", "Historical Fiction", "Epic Fantasy", "Adventure", "Literary Fiction", "Speculative Fiction"],
    themes: ["Fate vs. Free Will", "The Nature of Power", "Love and Sacrifice", "Identity and Legacy", "The Role of Memory", "Redemption and Identity"],
    positioning: ["At the intersection of mythic fantasy and historical intrigue, blending the depth of philosophical fiction with the wonder of metaphysical adventure."],
    settings: ["University of Bologna, 1321", "Pangea", "The Zanetti Train", "Inferno's Labyrinth", "Ruined Library of Alexandria echoes"]
  };
  
  // Seed the novel series
  const seriesResult = await db.insert(novelSeries).values({
    title: seriesData.title,
    tagline: seriesData.tagline,
    logline: seriesData.logline,
    synopsis: seriesData.synopsis,
    secondarySynopsis: seriesData.secondarySynopsis,
    description: seriesData.description,
    summary: seriesData.summary,
    genres: JSON.stringify(seriesData.genres),
    themes: JSON.stringify(seriesData.themes),
    keyThemes: JSON.stringify({}),
    positioning: JSON.stringify(seriesData.positioning),
    tone: JSON.stringify([]),
    style: JSON.stringify([]),
    targetAudience: JSON.stringify([]),
    keywords: JSON.stringify([]),
    tropes: JSON.stringify([]),
    coverThemeConcepts: JSON.stringify([]),
    settings: JSON.stringify(seriesData.settings),
  }).returning();
  
  const seriesId = seriesResult[0].id;
  console.log('Seeded novel series:', seriesData.title);
  
  // Seed the nine books from the series structure
  const booksStructure = [
    { title: "Anvil of the Ancient Ones", triumph: "Knowledge" },
    { title: "Cathedra of Echoes", triumph: "Memory" },
    { title: "The Hollow Throne", triumph: "Power" },
    { title: "Warden of the Labyrinth", triumph: "Will" },
    { title: "Crown of the Dead", triumph: "Love" },
    { title: "The Burning Archive", triumph: "Voice" },
    { title: "Tower of the Broken Star", triumph: "Truth" },
    { title: "The Atlas Rite", triumph: "Choice" },
    { title: "The Mirror and the Flame", triumph: "Legacy" }
  ];
  
  for (let i = 0; i < booksStructure.length; i++) {
    const book = booksStructure[i];
    try {
      await db.insert(books).values({
        seriesId: seriesId,
        bookNumber: i + 1,
        uniqueIdentifier: `Book${i + 1}`,
        title: book.title,
        fictionNovelTitle: book.title,
        subject: "Epic Fantasy",
        focus: `Triumph of ${book.triumph}`,
        tagline: `Book ${i + 1} - ${book.triumph}`,
        logline: `The ${book.triumph} arc of the Epic Arcana saga`,
        description: `Book ${i + 1} of the Codex of the Nine Realms, focusing on the Triumph of ${book.triumph}`,
        themes: JSON.stringify([`Triumph of ${book.triumph}`]),
        keyThemes: JSON.stringify({}),
        triumph: book.triumph,
        militaryComponent: null,
        businessModel: null,
        personalityType: null,
        enneagramType: null,
        enneagramDescription: null,
        coveryCoveyHabit: null,
        associatedSin: null,
      });
      
      console.log(`Seeded book ${i + 1}: ${book.title} (Triumph of ${book.triumph})`);
    } catch (err) {
      console.error('Failed to insert book', book.title, err);
    }
  }
  
  console.log('Seeded novel structure.');
}

async function seedBookIDetailed(db) {
  // Get Book I from the database
  const book1Query = await db.select().from(books).limit(1);
  
  if (book1Query.length === 0) {
    console.warn('Book I not found in database');
    return;
  }
  
  const book1Id = book1Query[0].id;
  console.log('Found Book I:', book1Query[0].title);
  
  // Define the detailed chapter/scene structure for Book I
  const heroJourneyScenes = [
    {
      sceneNumber: 1,
      title: "The Ordinary World",
      heroJourneyStage: "Ordinary World",
      chapters: [
        { 
          number: 1, 
          title: "Student Life at Bologna", 
          focus: "Despair", 
          tarotFamily: "Swords", 
          tarotCard: "Nine of Swords", 
          pages: "1-15",
          description: "Francisco Petrarch's life as a student at the University of Bologna, 1321. Academic pressures, social expectations, and internal struggles with his identity and purpose."
        },
        { 
          number: 2, 
          title: "The Weight of Legacy", 
          focus: "Guilelessness", 
          tarotFamily: "Cups", 
          tarotCard: "Page of Cups", 
          pages: "16-30",
          description: "Francisco grapples with his family's expectations and his own desires for knowledge and truth. Introduction of his relationship with his brother Gherardo."
        },
        { 
          number: 3, 
          title: "The First Card", 
          focus: "Vibration", 
          tarotFamily: "Wands", 
          tarotCard: "Ace of Wands", 
          pages: "31-45",
          description: "Francisco creates his first Trionfi card, unknowingly tapping into ancient powers. Strange visions and synchronicities begin."
        }
      ]
    },
    {
      sceneNumber: 2,
      title: "The Call to Adventure",
      heroJourneyStage: "Call to Adventure",
      chapters: [
        { 
          number: 4, 
          title: "The Zanetti Train Arrives", 
          focus: "Explosive Action", 
          tarotFamily: "Wands", 
          tarotCard: "Seven of Wands", 
          pages: "46-60",
          description: "The anachronistic locomotive materializes in Bologna. Dante Alighieri emerges as the Grand Catalan Company's Chronicler, seeking Francisco."
        },
        { 
          number: 5, 
          title: "Dante's Proposition", 
          focus: "Implementation", 
          tarotFamily: "Pentacles", 
          tarotCard: "Three of Pentacles", 
          pages: "61-75",
          description: "Dante reveals the true nature of the Trionfi cards and invites Francisco to join the quest for Cicero's lost work. Introduction to the cosmic stakes."
        },
        { 
          number: 6, 
          title: "The Cards Respond", 
          focus: "Ownership", 
          tarotFamily: "Major Arcana", 
          tarotCard: "The Fool", 
          pages: "76-90",
          description: "Francisco's Trionfi deck begins manifesting temporal effects. The first glimpse of his destiny as a reality-shaper."
        }
      ]
    },
    {
      sceneNumber: 3,
      title: "Refusal of the Call",
      heroJourneyStage: "Refusal of the Call",
      chapters: [
        { 
          number: 7, 
          title: "Academic Obligations", 
          focus: "Dominion", 
          tarotFamily: "Pentacles", 
          tarotCard: "King of Pentacles", 
          pages: "91-105",
          description: "Francisco's mentor Giovanni d'Andrea and his studies pull him back toward conventional scholarship. The safety of the known world."
        },
        { 
          number: 8, 
          title: "Family Pressure", 
          focus: "Transformation", 
          tarotFamily: "Major Arcana", 
          tarotCard: "Death", 
          pages: "106-120",
          description: "Gherardo's jealousy intensifies. Family expectations clash with Francisco's growing awareness of his true calling."
        },
        { 
          number: 9, 
          title: "The First Paradox", 
          focus: "Determination", 
          tarotFamily: "Swords", 
          tarotCard: "Knight of Swords", 
          pages: "121-135",
          description: "Francisco's attempt to ignore the cards results in a minor temporal paradox. Reality begins to crack around him."
        }
      ]
    },
    {
      sceneNumber: 4,
      title: "Meeting the Mentor",
      heroJourneyStage: "Meeting the Mentor",
      chapters: [
        { 
          number: 10, 
          title: "Dante's Wisdom", 
          focus: "Structure", 
          tarotFamily: "Major Arcana", 
          tarotCard: "The Hermit", 
          pages: "136-150",
          description: "Dante shares his experience with divine realms and cosmic forces. The true nature of the Inferno as a temporal pathway is revealed."
        },
        { 
          number: 11, 
          title: "La Signora del Gioco", 
          focus: "Acceptance", 
          tarotFamily: "Major Arcana", 
          tarotCard: "The High Priestess", 
          pages: "151-165",
          description: "Francisco meets Giovanna De Sade. Her mysterious connection to the cards and her own quest for redemption."
        },
        { 
          number: 12, 
          title: "The Grand Catalan Company", 
          focus: "Celebration", 
          tarotFamily: "Cups", 
          tarotCard: "Three of Cups", 
          pages: "166-180",
          description: "Introduction to Roger de Flor and the other members. The fellowship is formed, each bringing unique skills and perspectives."
        }
      ]
    },
    {
      sceneNumber: 5,
      title: "Crossing the First Threshold",
      heroJourneyStage: "Crossing the Threshold",
      chapters: [
        { 
          number: 13, 
          title: "Boarding the Zanetti Train", 
          focus: "Potentiality", 
          tarotFamily: "Major Arcana", 
          tarotCard: "The Fool", 
          pages: "181-195",
          description: "Francisco makes his choice and boards the temporal locomotive. Leaving the ordinary world behind forever. The first step into Pangea."
        }
      ]
    }
  ];
  
  // Additional scenes for the full 40-chapter structure
  const remainingScenes = [
    {
      sceneNumber: 6,
      title: "Tests, Allies, and Enemies",
      heroJourneyStage: "Tests, Allies, Enemies",
      chapters: [
        { number: 14, title: "The Temporal Storms", focus: "Navigation", tarotFamily: "Swords", tarotCard: "Two of Swords", pages: "196-210" },
        { number: 15, title: "Guardians of the Threshold", focus: "Defense", tarotFamily: "Wands", tarotCard: "Five of Wands", pages: "211-225" },
        { number: 16, title: "The Memory Thieves", focus: "Protection", tarotFamily: "Cups", tarotCard: "Seven of Cups", pages: "226-240" },
        { number: 17, title: "Trials of Knowledge", focus: "Wisdom", tarotFamily: "Pentacles", tarotCard: "Eight of Pentacles", pages: "241-255" },
        { number: 18, title: "The Labyrinth of Mirrors", focus: "Self-Reflection", tarotFamily: "Major Arcana", tarotCard: "The Moon", pages: "256-270" }
      ]
    },
    {
      sceneNumber: 7,
      title: "Approach to the Inmost Cave",
      heroJourneyStage: "Approach to the Inmost Cave",
      chapters: [
        { number: 19, title: "The Hyperborea Library", focus: "Preparation", tarotFamily: "Major Arcana", tarotCard: "The Star", pages: "271-285" },
        { number: 20, title: "Dagon's First Move", focus: "Opposition", tarotFamily: "Major Arcana", tarotCard: "The Devil", pages: "286-300" },
        { number: 21, title: "The Cicero Codex Trail", focus: "Investigation", tarotFamily: "Swords", tarotCard: "Page of Swords", pages: "301-315" }
      ]
    },
    {
      sceneNumber: 8,
      title: "The Ordeal",
      heroJourneyStage: "The Ordeal",
      chapters: [
        { number: 22, title: "The Battle for the Codex", focus: "Confrontation", tarotFamily: "Major Arcana", tarotCard: "The Tower", pages: "316-330" },
        { number: 23, title: "Salasa's Dilemma", focus: "Divine Love", tarotFamily: "Major Arcana", tarotCard: "The Lovers", pages: "331-345" },
        { number: 24, title: "Hannibal's Rising", focus: "Ancient Power", tarotFamily: "Major Arcana", tarotCard: "The Chariot", pages: "346-360" },
        { number: 25, title: "The Inferno Gate", focus: "Passage", tarotFamily: "Major Arcana", tarotCard: "Death", pages: "361-375" }
      ]
    },
    {
      sceneNumber: 9,
      title: "Revelation and Transformation",
      heroJourneyStage: "Revelation",
      chapters: [
        { number: 26, title: "The True Trionfi", focus: "Understanding", tarotFamily: "Major Arcana", tarotCard: "The Magician", pages: "376-390" },
        { number: 27, title: "Mastery of Knowledge", focus: "Power", tarotFamily: "Major Arcana", tarotCard: "The World", pages: "391-405" },
        { number: 28, title: "The Price of Wisdom", focus: "Sacrifice", tarotFamily: "Major Arcana", tarotCard: "The Hanged Man", pages: "406-420" }
      ]
    },
    {
      sceneNumber: 10,
      title: "The Road Back",
      heroJourneyStage: "The Road Back",
      chapters: [
        { number: 29, title: "Dagon's Final Gambit", focus: "Last Opposition", tarotFamily: "Major Arcana", tarotCard: "Justice", pages: "421-435" },
        { number: 30, title: "The Temporal Collapse", focus: "Crisis", tarotFamily: "Major Arcana", tarotCard: "The Tower", pages: "436-450" },
        { number: 31, title: "Choosing the Future", focus: "Decision", tarotFamily: "Major Arcana", tarotCard: "Judgement", pages: "451-465" }
      ]
    },
    {
      sceneNumber: 11,
      title: "The Return Transformed",
      heroJourneyStage: "Return with the Elixir",
      chapters: [
        { number: 32, title: "Master of the Trionfi", focus: "Mastery", tarotFamily: "Major Arcana", tarotCard: "The Magician", pages: "466-480" },
        { number: 33, title: "The New Timeline", focus: "Creation", tarotFamily: "Major Arcana", tarotCard: "The Empress", pages: "481-495" },
        { number: 34, title: "Seeds of Future Triumphs", focus: "Legacy", tarotFamily: "Major Arcana", tarotCard: "The World", pages: "496-510" },
        { number: 35, title: "The Academy of Mysteries", focus: "Teaching", tarotFamily: "Major Arcana", tarotCard: "The Hierophant", pages: "511-525" },
        { number: 36, title: "Brotherhood of the Cards", focus: "Unity", tarotFamily: "Cups", tarotCard: "Ten of Cups", pages: "526-540" },
        { number: 37, title: "The Next Calling", focus: "Preparation", tarotFamily: "Wands", tarotCard: "Ace of Wands", pages: "541-555" },
        { number: 38, title: "Guardians of Knowledge", focus: "Protection", tarotFamily: "Swords", tarotCard: "Ten of Swords", pages: "556-570" },
        { number: 39, title: "The Eternal Game", focus: "Continuation", tarotFamily: "Pentacles", tarotCard: "Ten of Pentacles", pages: "571-585" },
        { number: 40, title: "Triumph of Knowledge", focus: "Completion", tarotFamily: "Major Arcana", tarotCard: "The World", pages: "586-600" }
      ]
    }
  ];
  
  // Combine all scenes
  const allScenes = [...heroJourneyScenes, ...remainingScenes];
  
  // Seed chapters and scenes
  for (const scene of allScenes) {
    for (const chapter of scene.chapters) {
      try {
        const chapterResult = await db.insert(chapters).values({
          bookId: book1Id,
          chapterNumber: chapter.number,
          uniqueIdentifier: `B1-C${chapter.number.toString().padStart(2, '0')}`,
          title: chapter.title,
          focus: chapter.focus,
          epicNovelPages: chapter.pages,
          epicChapterFocus: scene.title,
          epicNovelChapterFocus: `Chapter ${chapter.number}: ${chapter.title}`,
          epicNovelSectionName: `Scene ${scene.sceneNumber}: ${scene.title}`,
          description: chapter.description || `Chapter ${chapter.number} of Book I: Anvil of the Ancient Ones`,
          tarotCardLink: chapter.tarotCard,
          tarotFamily: chapter.tarotFamily,
          tarotCardItem: chapter.tarotCard,
          colorTheme: JSON.stringify({
            name: chapter.tarotFamily === "Major Arcana" ? "Gold" : 
                  chapter.tarotFamily === "Swords" ? "Blue" :
                  chapter.tarotFamily === "Cups" ? "Silver" :
                  chapter.tarotFamily === "Wands" ? "Red" : "Green",
            hex: chapter.tarotFamily === "Major Arcana" ? "#FFD700" : 
                 chapter.tarotFamily === "Swords" ? "#4169E1" :
                 chapter.tarotFamily === "Cups" ? "#C0C0C0" :
                 chapter.tarotFamily === "Wands" ? "#DC143C" : "#228B22"
          }),
        }).returning();
        
        const chapterId = chapterResult[0].id;
        
        // Create a scene entry for this chapter
        await db.insert(scenes).values({
          chapterId: chapterId,
          sceneNumber: chapter.number,
          title: chapter.title,
          focus: chapter.focus,
          preliminarySceneFocus: scene.title,
          preliminarySceneDescription: scene.heroJourneyStage + ": " + (chapter.description || "A pivotal moment in Francisco's journey."),
          description: chapter.description || ("Chapter " + chapter.number + " focuses on " + chapter.focus.toLowerCase() + " as Francisco continues his hero's journey."),
          tarotSymbolism: "Connected to " + chapter.tarotCard + " of the " + chapter.tarotFamily + " suit, representing " + chapter.focus.toLowerCase() + " and character development.",
          heroJourneyStage: scene.heroJourneyStage,
          pages: chapter.pages,
        });
        
      } catch (err) {
        console.error("Failed to insert chapter " + chapter.number + ":", err);
      }
    }
  }
  
  console.log("Seeded detailed structure for Book I: " + allScenes.reduce((total, scene) => total + scene.chapters.length, 0) + " chapters across " + allScenes.length + " scenes");
}

async function seedCharacterArcs(db: any) {
  const characterArcsPath = path.join(LORE_DIR, 'storyline', 'character_arcs.json');
  const characterArcsData = await loadJSON(characterArcsPath);
  
  if (!characterArcsData.Character_Arcs) {
    console.warn('No character arcs data found in', characterArcsPath);
    return;
  }
  
  // Get character IDs for mapping
  const existingCharacters = await db.select().from(characters);
  const characterMap = new Map(existingCharacters.map((char: any) => [char.name, char.id]));
  
  // Get book IDs for mapping
  const existingBooks = await db.select().from(books);
  const bookMap = new Map(existingBooks.map((book: any) => [book.title, book.id]));
  
  for (const [charName, arcData] of Object.entries(characterArcsData.Character_Arcs)) {
    const normalizedName = charName.replace(/_/g, ' ');
    let characterId = characterMap.get(normalizedName);
    
    // Handle special case for La Signora del Gioco
    if (!characterId && normalizedName === 'La Signora del Gioco') {
      characterId = characterMap.get('Giovanna De Sade');
    }
    
    if (!characterId) {
      console.warn(`Character not found: ${normalizedName}`);
      continue;
    }
    
    const arc = arcData as any;
    const primaryBookId = bookMap.get("Anvil of the Ancient Ones");
    
    try {
      const arcResult = await db.insert(characterArcs).values({
        characterId: characterId,
        arcType: arc.arc_type,
        triumphTheme: arc.arc_type === "Hero's Journey" ? "Knowledge" : 
                     arc.arc_type === "Transformation" ? "Identity" : 
                     arc.arc_type === "Antagonist's Journey" ? "Control" : null,
        primaryBookId: primaryBookId,
        stages: JSON.stringify(arc.stages),
        thematicElements: JSON.stringify(arc.thematic_elements),
        keyMoments: JSON.stringify(Object.values(arc.stages).flatMap((stage: any) => stage.key_events || [])),
        characterDevelopment: JSON.stringify(Object.values(arc.stages).flatMap((stage: any) => stage.character_development || [])),
        conflicts: JSON.stringify(Object.values(arc.stages).flatMap((stage: any) => stage.conflicts || [])),
        resolution: JSON.stringify(arc.stages.resolution || {}),
      }).returning();
      
      const arcId = arcResult[0].id;
      
      // Create thematic elements entries
      for (const [theme, themeData] of Object.entries(arc.thematic_elements)) {
        await db.insert(characterThematicElements).values({
          characterId: characterId,
          theme: theme,
          development: (themeData as any).development,
          keyMoments: JSON.stringify((themeData as any).key_moments || []),
          progressionStages: JSON.stringify([
            "Initial understanding",
            "Growing awareness", 
            "Deepening connection",
            "Mastery and integration"
          ]),
          triumphConnection: theme === "knowledge" ? "Knowledge" : 
                           theme === "power" ? "Power" : 
                           theme === "love" ? "Love" : 
                           theme === "identity" ? "Identity" : theme,
        });
      }
      
      // Create character triumph mapping
      const triumphThemes = arc.arc_type === "Hero's Journey" ? ["Knowledge", "Power", "Love"] :
                           arc.arc_type === "Transformation" ? ["Identity", "Power", "Love"] :
                           arc.arc_type === "Antagonist's Journey" ? ["Control", "Order", "Power"] : ["Power"];
      
      for (const triumphTheme of triumphThemes) {
        await db.insert(characterTriumphMapping).values({
          characterId: characterId,
          triumphTheme: triumphTheme,
          relationship: triumphTheme === "Knowledge" && arc.arc_type === "Hero's Journey" ? "Primary" :
                       triumphTheme === "Identity" && arc.arc_type === "Transformation" ? "Primary" :
                       triumphTheme === "Control" && arc.arc_type === "Antagonist's Journey" ? "Primary" : "Secondary",
          developmentStage: "Throughout Journey",
          keyScenes: JSON.stringify([
            "Initial manifestation",
            "Challenge and growth",
            "Crisis and transformation",
            "Resolution and mastery"
          ]),
          thematicRole: `Character represents ${triumphTheme.toLowerCase()} through their ${arc.arc_type.toLowerCase()} arc`,
          arcProgression: JSON.stringify(Object.keys(arc.stages)),
        });
      }
      
      console.log(`Seeded character arc for ${normalizedName}`);
    } catch (err) {
      console.error(`Failed to seed character arc for ${normalizedName}:`, err);
    }
  }
  
  console.log('Character arcs seeding completed!');
}

async function seedStoryGaps(db: any) {
  const storyGapsPath = path.join(LORE_DIR, 'storyline', 'story_gaps_to_address.json');
  const storyGapsData = await loadJSON(storyGapsPath);
  
  if (!storyGapsData.Story_Gaps_to_Address) {
    console.warn('No story gaps data found in', storyGapsPath);
    return;
  }
  
  // Get book and character IDs for mapping
  const existingBooks = await db.select().from(books);
  const bookIds = existingBooks.map((book: any) => book.id);
  
  const existingCharacters = await db.select().from(characters);
  const characterIds = existingCharacters.map((char: any) => char.id);
  
  for (const [category, gapData] of Object.entries(storyGapsData.Story_Gaps_to_Address)) {
    const gap = gapData as any;
    
    try {
      await db.insert(storyGaps).values({
        category: category,
        title: category.replace(/_/g, ' '),
        coreIssues: JSON.stringify(gap.core_issues || []),
        developmentSuggestions: JSON.stringify(gap.development_suggestions || []),
        keyScenesToDevelop: JSON.stringify(gap.key_scenes_to_develop || []),
        characterQuestions: JSON.stringify(gap.character_questions || gap.relationship_questions || gap.world_questions || gap.stakes_questions || gap.integration_questions || gap.timeline_questions || []),
        priority: category.includes("System") || category.includes("Stakes") ? "High" : "Medium",
        status: "Identified",
        relatedBookIds: JSON.stringify(bookIds.slice(0, 3)), // First 3 books
        relatedCharacterIds: JSON.stringify(characterIds.slice(0, 5)), // First 5 characters
      });
      
      console.log(`Seeded story gap: ${category}`);
    } catch (err) {
      console.error(`Failed to seed story gap ${category}:`, err);
    }
  }
  
  console.log('Story gaps seeding completed!');
}

async function seedTarotIntegration(db: any) {
  console.log('Starting comprehensive Tarot integration...');

  // Get existing cards and scenes for mapping
  const existingCards = await db.select().from(trionfiCards);
  const cardMap = new Map(existingCards.map((card: any) => [card.name, card.id]));
  
  const existingScenes = await db.select().from(scenes);
  
  // Define the comprehensive 40-scene Tarot progression following Hero's Journey
  const tarotProgression = [
    // ACT I: ORDINARY WORLD TO CALL TO ADVENTURE (Scenes 1-5)
    {
      sceneNumbers: [1, 2, 3], // Student Life at Bologna (repeated for multiple chapters)
      primaryCard: "0 The Fool",
      secondaryCards: ["Nine of Swords", "Page of Cups"],
      heroStage: "Ordinary World",
      franciscoConnection: "Francisco begins as the innocent student, full of potential but unaware of his destiny. The Fool represents his pure creative spirit before the world shapes him.",
      laSignoraConnection: "She watches from afar, recognizing the Fool's potential to either create or destroy timelines.",
      dagonConnection: "Sees Francisco as a dangerous wild card that must be controlled before his power manifests.",
      temporalPower: "Timeline Innocence - Francisco is naturally immune to minor paradoxes due to his poetic sensibility",
      narrativeRole: "Establishes Francisco's innocent beginning and unlimited potential",
      characterGrowth: "Francisco's initial naivety and openness to experience",
      cardProgression: 1
    },
    {
      sceneNumbers: [4, 5, 6], // The Zanetti Train Arrives to The First Card
      primaryCard: "I The Magician", 
      secondaryCards: ["Seven of Wands", "Ace of Wands"],
      heroStage: "Call to Adventure",
      franciscoConnection: "Francisco discovers his ability to manifest ideas into reality through the Trionfi cards. His words gain temporal power.",
      laSignoraConnection: "Recognizes Francisco as a potential rival Magician, both attracted and threatened by his raw power.",
      dagonConnection: "Realizes Francisco possesses innate reality-shaping abilities that could rival his own divine authority.",
      temporalPower: "Reality Shaping - Francisco's initial card creations begin altering probability around him",
      narrativeRole: "The moment Francisco's destiny activates - from student to temporal mage",
      characterGrowth: "Discovery of innate magical abilities and responsibility",
      cardProgression: 2
    },
    {
      sceneNumbers: [7, 8, 9], // Academic Obligations to The First Paradox
      primaryCard: "II The High Priestess",
      secondaryCards: ["King of Pentacles", "Death", "Knight of Swords"],
      heroStage: "Refusal of the Call",
      franciscoConnection: "Francisco struggles with intuitive knowledge versus academic learning. The High Priestess represents the wisdom he must embrace.",
      laSignoraConnection: "This is La Signora's primary archetype - hidden knowledge, feminine wisdom, and secret mysteries she embodies.",
      dagonConnection: "Represents secrets that threaten his control - knowledge that should remain hidden from mortals.",
      temporalPower: "Timeline Sight - Francisco begins seeing alternate versions of his choices and their consequences",
      narrativeRole: "Francisco's resistance to destiny and the wisdom that calls to him",
      characterGrowth: "Tension between conscious mind and unconscious wisdom",
      cardProgression: 3
    },
    {
      sceneNumbers: [10, 11, 12], // Dante's Wisdom to The Grand Catalan Company
      primaryCard: "V The Hierophant",
      secondaryCards: ["The Hermit", "The High Priestess", "Three of Cups"],
      heroStage: "Meeting the Mentor",
      franciscoConnection: "Dante serves as The Hierophant - the spiritual teacher who connects Francisco to divine wisdom and cosmic order.",
      laSignoraConnection: "She sees both the value and danger of traditional authority, having been oppressed by it.",
      dagonConnection: "Represents the proper divine hierarchy he believes he embodies - gods teaching mortals their place.",
      temporalPower: "Ancestral Echo - Dante's guidance connects Francisco to the wisdom of past timeline iterations",
      narrativeRole: "Spiritual guidance and connection to divine tradition",
      characterGrowth: "Learning to accept wisdom from those who have traveled the path before",
      cardProgression: 4
    },
    {
      sceneNumbers: [13], // Boarding the Zanetti Train
      primaryCard: "VII The Chariot",
      secondaryCards: ["The Fool"],
      heroStage: "Crossing the Threshold",
      franciscoConnection: "The train represents Francisco's will triumphing over fear. He takes control of his destiny and begins the hero's journey.",
      laSignoraConnection: "She joins the journey, her own chariot of transformation running parallel to Francisco's.",
      dagonConnection: "The chariot becomes a tool of divine conquest - exactly what he intended for his own purposes.",
      temporalPower: "Temporal Navigation - The train's ability to traverse timeline streams is awakened by Francisco's resolve",
      narrativeRole: "Commitment to the transformative journey",
      characterGrowth: "Taking control and accepting responsibility for one's path",
      cardProgression: 5
    },
    
    // ACT II: TESTS AND CHALLENGES (Scenes 6-10)
    {
      sceneNumbers: [14, 15, 16, 17, 18], // The Temporal Storms to The Labyrinth of Mirrors
      primaryCard: "XVIII The Moon",
      secondaryCards: ["Two of Swords", "Five of Wands", "Seven of Cups", "Eight of Pentacles"],
      heroStage: "Tests, Allies, Enemies",
      franciscoConnection: "Francisco navigates illusions and hidden truths. His imagination becomes both asset and liability in temporal storms.",
      laSignoraConnection: "The Moon represents her hidden feminine power and ability to navigate by intuition rather than logic.",
      dagonConnection: "Uses The Moon's deceptive power to create false paths and temporal mirages to confuse the heroes.",
      temporalPower: "Temporal Veil - The ability to hide timeline activities becomes crucial for survival",
      narrativeRole: "Navigating deception and discovering hidden truths",
      characterGrowth: "Learning to distinguish between imagination and reality, truth and illusion",
      cardProgression: 6
    },
    {
      sceneNumbers: [19, 20, 21], // The Hyperborea Library to The Cicero Codex Trail
      primaryCard: "XVII The Star",
      secondaryCards: ["The Devil", "Page of Swords"],
      heroStage: "Approach to the Inmost Cave",
      franciscoConnection: "The Star provides guidance and hope as Francisco prepares for the greatest challenge. Poetic inspiration illuminates the path.",
      laSignoraConnection: "Represents her role as beacon of hope and future possibilities for humanity's freedom.",
      dagonConnection: "Sees The Star as false hope that must be extinguished to maintain divine order.",
      temporalPower: "Stellar Navigation - Ability to see optimal timeline paths through the chaos ahead",
      narrativeRole: "Hope and guidance before the supreme test",
      characterGrowth: "Finding inspiration and direction in darkness",
      cardProgression: 7
    },
    {
      sceneNumbers: [22, 23, 24, 25], // The Battle for the Codex to The Inferno Gate
      primaryCard: "XVI The Tower",
      secondaryCards: ["The Lovers", "The Chariot", "Death"],
      heroStage: "The Ordeal",
      franciscoConnection: "Francisco's old certainties are shattered. The Tower represents the destruction of his academic worldview.",
      laSignoraConnection: "Liberation through destruction - she embraces The Tower's power to break free from all constraints.",
      dagonConnection: "Represents the chaos he seeks to prevent, yet which he may need to unleash to achieve victory.",
      temporalPower: "Timeline Shatter - The ability to destroy fundamental timeline structures when necessary",
      narrativeRole: "Destruction of false foundations to reveal truth",
      characterGrowth: "Letting go of limiting beliefs and false securities",
      cardProgression: 8
    },
    {
      sceneNumbers: [26, 27, 28], // The True Trionfi to The Price of Wisdom
      primaryCard: "XXI The World",
      secondaryCards: ["The Magician", "The Hanged Man"],
      heroStage: "Revelation",
      franciscoConnection: "Francisco achieves understanding of the complete cosmic order. The World represents mastery and completion of his first cycle.",
      laSignoraConnection: "She attains total mastery over her powers and identity, becoming a complete being.",
      dagonConnection: "Represents the divine order he seeks to restore, but realizes it must include mortal agency.",
      temporalPower: "Timeline Convergence - The ability to harmonize all timeline possibilities into optimal outcomes",
      narrativeRole: "Achievement of cosmic understanding and integration",
      characterGrowth: "Synthesis of all experiences into wisdom",
      cardProgression: 9
    },
    {
      sceneNumbers: [29, 30, 31], // Dagon's Final Gambit to Choosing the Future
      primaryCard: "XX Judgement",
      secondaryCards: ["Justice", "The Tower", "Judgement"],
      heroStage: "The Road Back",
      franciscoConnection: "Francisco faces final judgment and chooses his path forward. Awakening to ultimate responsibility for timeline stewardship.",
      laSignoraConnection: "Breaking all remaining chains and achieving complete freedom from predetermined fate.",
      dagonConnection: "Final divine judgment - either acceptance of new order or destruction of what cannot be controlled.",
      temporalPower: "Timeline Resurrection - Ability to restore erased possibilities and give second chances",
      narrativeRole: "Final judgment and choice of future direction",
      characterGrowth: "Taking ultimate responsibility for consequences of actions",
      cardProgression: 10
    },
    {
      sceneNumbers: [32, 33, 34, 35, 36, 37, 38, 39, 40], // Master of the Trionfi to Triumph of Knowledge
      primaryCard: "I The Magician",
      secondaryCards: ["The Empress", "The World", "The Hierophant", "Ten of Cups", "Ace of Wands", "Ten of Swords", "Ten of Pentacles"],
      heroStage: "Return with the Elixir",
      franciscoConnection: "Francisco returns as a master, now The Magician who can teach others. His will can manifest reality through wisdom.",
      laSignoraConnection: "She becomes a co-creator of the new reality, her transformation complete and mastery achieved.",
      dagonConnection: "Transformed from antagonist to guardian of the new order that balances divine will with mortal agency.",
      temporalPower: "Reality Shaping - Complete mastery over temporal forces, but tempered with wisdom and responsibility",
      narrativeRole: "Integration of all lessons and establishment of new order",
      characterGrowth: "Becoming the mentor for the next generation of seekers",
      cardProgression: 11
    }
  ];

  // Update scenes with comprehensive Tarot integration
  for (const progression of tarotProgression) {
    const primaryCardId = cardMap.get(progression.primaryCard.replace(/^\d+_?/, '').replace(/_/g, ' '));
    
    for (const sceneNum of progression.sceneNumbers) {
      const scenesToUpdate = existingScenes.filter((scene: any) => scene.sceneNumber === sceneNum);
      
      for (const scene of scenesToUpdate) {
        try {
          await db.update(scenes).set({
            primaryTarotCard: progression.primaryCard,
            secondaryTarotCards: JSON.stringify(progression.secondaryCards),
            tarotCardId: primaryCardId || null,
            tarotNarrativeRole: progression.narrativeRole,
            franciscoTarotConnection: progression.franciscoConnection,
            laSignoraTarotConnection: progression.laSignoraConnection,
            dagonTarotConnection: progression.dagonConnection,
            temporalPowerManifested: progression.temporalPower,
            characterGrowthElement: progression.characterGrowth,
            sceneCardProgression: progression.cardProgression,
            tarotSymbolism: `${progression.primaryCard}: ${progression.narrativeRole}. Secondary influences: ${progression.secondaryCards.join(', ')}. This scene represents ${progression.characterGrowth} within the ${progression.heroStage} stage of the Hero's Journey.`
          }).where(eq(scenes.id, scene.id));
          
          console.log(`Updated scene ${sceneNum} with ${progression.primaryCard}`);
        } catch (err) {
          console.error(`Failed to update scene ${sceneNum}:`, err);
        }
      }
    }
  }
  
  console.log('Comprehensive Tarot integration completed!');
}

async function seedTimelineCoordination(db: any) {
  console.log('Starting comprehensive timeline coordination...');

  // Get existing data for mapping
  const existingScenes = await db.select().from(scenes);
  const existingEvents = await db.select().from(timelineEvents);
  const existingCharacters = await db.select().from(characters);
  
  // Create event lookup map
  const eventMap = new Map(existingEvents.map((event: any) => [event.eventKey, event]));
  const characterMap = new Map(existingCharacters.map((char: any) => [char.name, char]));

  // Define the comprehensive timeline mapping for Book I
  // Francisco Petrarch's story is set in 1321, his 17th year (born 1304)
  const timelineMapping = [
    // ACT I: ORDINARY WORLD (1321, Bologna)
    {
      sceneNumbers: [1, 2, 3], // Student Life at Bologna
      historicalDate: "1321-03-15",
      storyDate: "1321-03-15", 
      eventKeys: ["1321-petrarch-student"],
      realWorldContext: "Francisco Petrarch, age 17, studying law at University of Bologna. Historical Petrarch was actually studying law at this time. The university was at its peak influence in legal studies.",
      alternateTimeline: "Prime Timeline",
      chronologicalSequence: 1,
      timelineSignificance: "Establishes Francisco as a law student before his destiny as a poet is revealed. Historically accurate.",
      divergencePoint: "None yet - follows real history"
    },
    {
      sceneNumbers: [4, 5, 6], // The Zanetti Train Arrives to The First Card  
      historicalDate: "1321-04-06",
      storyDate: "1321-04-06",
      eventKeys: ["1321-first-trionfi-manifestation"],
      realWorldContext: "Palm Sunday, 1321. In real history, this is near when Dante finished the Paradiso. In our story, Francisco's cards first manifest temporal power.",
      alternateTimeline: "Divergence Point Alpha",
      chronologicalSequence: 2,
      timelineSignificance: "First major divergence from real history - fantasy elements begin to manifest",
      divergencePoint: "Francisco's creation of Trionfi cards introduces temporal magic into the world"
    },
    {
      sceneNumbers: [7, 8, 9], // Academic Obligations to The First Paradox
      historicalDate: "1321-04-15",
      storyDate: "1321-04-15",
      eventKeys: ["1321-temporal-paradox-incident"],
      realWorldContext: "Mid-April 1321, during the Easter season. Universities are in session. Francisco struggles between conventional academic path and his supernatural calling.",
      alternateTimeline: "Timeline Fracture A1",
      chronologicalSequence: 3,
      timelineSignificance: "Francisco's first temporal paradox creates minor reality fractures around Bologna",
      divergencePoint: "Academic world begins to experience supernatural intrusions as Francisco's power manifests unconsciously"
    },
    {
      sceneNumbers: [10, 11, 12], // Dante's Wisdom to The Grand Catalan Company
      historicalDate: "1321-04-25",
      storyDate: "1321-04-25",
      eventKeys: ["1321-dante-revelation", "1305-roger-de-flor-encounter"],
      realWorldContext: "Late April 1321. Historically, Dante was completing his Divine Comedy around this time. Our story brings him to Bologna to guide Francisco.",
      alternateTimeline: "Timeline Convergence B",
      chronologicalSequence: 4,
      timelineSignificance: "Dante's arrival marks the intersection of multiple timeline streams - literary, political, and mystical",
      divergencePoint: "Dante abandons his final work on the Paradiso to become Francisco's mentor, altering literary history"
    },
    {
      sceneNumbers: [13], // Boarding the Zanetti Train
      historicalDate: "1321-05-01",
      storyDate: "1321-05-01",
      eventKeys: ["1321-zanetti-train-departure"],
      realWorldContext: "May Day 1321 - traditionally a day of renewal and celebration. Francisco leaves the ordinary world forever.",
      alternateTimeline: "Pangea Insertion Point",
      chronologicalSequence: 5,
      timelineSignificance: "Francisco crosses from historical reality into the temporal railway system, accessing Pangea",
      divergencePoint: "The Zanetti Train materializes in 1321 Bologna, creating a permanent portal between timelines"
    },

    // ACT II: TEMPORAL ADVENTURES (1321-1322, Pangea/Various Timelines)
    {
      sceneNumbers: [14, 15, 16, 17, 18], // The Temporal Storms to The Labyrinth of Mirrors
      historicalDate: "1321-05-15",
      storyDate: "1321-05-15 to 1321-06-30",
      eventKeys: ["128-hyperborea-library", "271-vesuvius-temporal-breach"],
      realWorldContext: "Late spring/early summer 1321. In real world, Francisco would be completing his law studies. Instead, he's navigating temporal storms in Pangea.",
      alternateTimeline: "Multi-Timeline Convergence",
      chronologicalSequence: 6,
      timelineSignificance: "Francisco experiences history from multiple perspectives, sees how events interconnect across centuries",
      divergencePoint: "Francisco's presence in Pangea begins affecting historical events across multiple eras simultaneously"
    },
    {
      sceneNumbers: [19, 20, 21], // The Hyperborea Library to The Cicero Codex Trail
      historicalDate: "1321-07-15",
      storyDate: "1321-07-15",
      eventKeys: ["128-hyperborea-library", "-42-cicero-codex-hidden"],
      realWorldContext: "Mid-summer 1321. Francisco discovers the Hyperborea Library, which contains Cicero's lost work. Connection to 128 CE when library was established.",
      alternateTimeline: "Ancient Knowledge Stream",
      chronologicalSequence: 7,
      timelineSignificance: "Francisco finds the nexus between ancient wisdom and future possibilities - the Cicero Codex becomes key to defeating Dagon",
      divergencePoint: "Discovery of the Codex creates a causal loop - Francisco's quest was always destined to find what he needs"
    },
    {
      sceneNumbers: [22, 23, 24, 25], // The Battle for the Codex to The Inferno Gate
      historicalDate: "1321-08-15",
      storyDate: "1321-08-15",
      eventKeys: ["-43-cicero-death", "312-constantine-vision"],
      realWorldContext: "Late summer 1321. The battle for Cicero's codex connects to his historical death in 43 BCE and Constantine's vision in 312 CE.",
      alternateTimeline: "Crisis Convergence Point",
      chronologicalSequence: 8,
      timelineSignificance: "The battle determines whether historical knowledge serves divine tyranny or human freedom across all timelines",
      divergencePoint: "Francisco's victory over Dagon's forces changes the outcome of every historical crisis where knowledge confronted power"
    },
    {
      sceneNumbers: [26, 27, 28], // The True Trionfi to The Price of Wisdom
      historicalDate: "1321-09-14",
      storyDate: "1321-09-14",
      eventKeys: ["1321-trionfi-mastery", "1321-dante-collaboration"],
      realWorldContext: "September 1321 - exact time when historical Dante died. In our timeline, Dante achieves transcendence through collaboration with Francisco.",
      alternateTimeline: "Transcendence Timeline",
      chronologicalSequence: 9,
      timelineSignificance: "Francisco achieves mastery of the Trionfi cards, fundamentally altering the relationship between mortal will and cosmic forces",
      divergencePoint: "Dante's survival beyond his historical death date creates a new timeline where divine wisdom is democratized rather than hierarchical"
    },
    {
      sceneNumbers: [29, 30, 31], // Dagon's Final Gambit to Choosing the Future
      historicalDate: "1321-10-31",
      storyDate: "1321-10-31",
      eventKeys: ["1321-temporal-convergence", "1321-final-judgment"],
      realWorldContext: "All Hallows' Eve 1321 - traditionally a time when the veil between worlds is thin. Perfect for final confrontation with Dagon.",
      alternateTimeline: "Judgment Timeline",
      chronologicalSequence: 10,
      timelineSignificance: "Francisco chooses the future of all timelines - divine control versus mortal agency in shaping reality",
      divergencePoint: "Francisco's choice determines whether future history will follow predetermined divine plan or allow genuine human free will"
    },
    {
      sceneNumbers: [32, 33, 34, 35, 36, 37, 38, 39, 40], // Master of the Trionfi to Triumph of Knowledge
      historicalDate: "1322-01-01",
      storyDate: "1322-01-01 to 1322-12-31",
      eventKeys: ["1322-new-timeline-establishment", "1322-knowledge-triumph"],
      realWorldContext: "Year 1322 - Francisco returns to establish a new world where knowledge and power are balanced. Historical year when many of Petrarch's early works began.",
      alternateTimeline: "New Golden Timeline",
      chronologicalSequence: 11,
      timelineSignificance: "Francisco becomes the founder of a new age where human creativity and divine wisdom work in harmony",
      divergencePoint: "The establishment of the Trionfi Academy creates an permanent institution for training future timeline guardians"
    }
  ];

  // Update scenes with timeline coordination
  for (const mapping of timelineMapping) {
    for (const sceneNum of mapping.sceneNumbers) {
      const scenesToUpdate = existingScenes.filter((scene: any) => scene.sceneNumber === sceneNum);
      
      for (const scene of scenesToUpdate) {
        try {
          // Get related event IDs
          const relatedEventIds = mapping.eventKeys
            .map(key => eventMap.get(key)?.id)
            .filter(id => id);

          await db.update(scenes).set({
            historicalDate: mapping.historicalDate,
            storyTimelineDate: mapping.storyDate,
            historicalEventIds: JSON.stringify(relatedEventIds),
            temporalDivergencePoint: mapping.divergencePoint,
            realWorldContext: mapping.realWorldContext,
            alternateTimelineVariant: mapping.alternateTimeline,
            chronologicalSequence: mapping.chronologicalSequence,
            storySequence: sceneNum,
            timelineSignificance: mapping.timelineSignificance,
          }).where(eq(scenes.id, scene.id));

          console.log(`Updated scene ${sceneNum} with timeline: ${mapping.historicalDate}`);
        } catch (err) {
          console.error(`Failed to update scene ${sceneNum} timeline:`, err);
        }
      }

      // Create scene-timeline mappings for each related event
      for (const eventKey of mapping.eventKeys) {
        const event = eventMap.get(eventKey);
        if (event) {
          const scenesToUpdate = existingScenes.filter((scene: any) => scene.sceneNumber === sceneNum);
          for (const scene of scenesToUpdate) {
            try {
              await db.insert(sceneTimelineMapping).values({
                sceneId: scene.id,
                timelineEventId: event.id,
                relationshipType: sceneNum <= 5 ? 'occurs_during' : 
                                sceneNum <= 13 ? 'references' :
                                sceneNum <= 25 ? 'causes' : 'results_from',
                temporalDistance: event.year === 1321 ? 'concurrent' :
                                event.year < 1321 ? 'years_before' : 'years_after',
                divergenceImpact: mapping.divergencePoint,
                narrativeSignificance: mapping.timelineSignificance,
              });
            } catch (err) {
              console.error(`Failed to create scene-timeline mapping for scene ${sceneNum}, event ${eventKey}:`, err);
            }
          }
        }
      }
    }
  }

  console.log('Timeline coordination mapping completed!');
}

async function seedHistoricalCharacterMapping(db: any) {
  console.log('Starting historical character mapping...');

  const existingCharacters = await db.select().from(characters);
  
  // Define historical character mappings
  const historicalMappings = [
    {
      name: "Francisco Petrarch",
      historicalBirthDate: "1304-07-20",
      historicalDeathDate: "1374-07-19", 
      storyAge: 17,
      historicalAccuracy: "adapted",
      keyLifeEvents: [
        "1304: Born in Arezzo",
        "1312: Family moves to Avignon", 
        "1316: Begins law studies at Montpellier",
        "1320: Transfers to Bologna",
        "1321: Story begins - creates Trionfi cards",
        "1327: (Historical) First sees Laura",
        "1341: (Historical) Crowned poet laureate"
      ],
      contemporaryFigures: ["Dante Alighieri", "Giovanni d'Andrea", "Gherardo Petrarch"],
      anachronisms: [
        "Created Tarot cards (historically developed later)",
        "Encounters Dante in 1321 (Dante died September 1321)",
        "Temporal magic abilities (fantasy element)"
      ],
      historicalRole: "Founder of Renaissance humanism, pioneering poet",
      fantasyRole: "Creator of Trionfi cards, temporal mage, timeline guardian"
    },
    {
      name: "Dante Alighieri", 
      historicalBirthDate: "1265-05-01",
      historicalDeathDate: "1321-09-14",
      storyAge: 56,
      historicalAccuracy: "adapted",
      keyLifeEvents: [
        "1265: Born in Florence",
        "1285: Marries Gemma Donati",
        "1300: Political exile begins",
        "1308-1321: Writes Divine Comedy",
        "1321: In our story, survives historical death date",
        "1321: Becomes Francisco's mentor"
      ],
      contemporaryFigures: ["Francisco Petrarch", "Beatrice Portinari", "Virgil"],
      anachronisms: [
        "Survives beyond historical death date",
        "Joins temporal railway system",
        "Gains cosmic awareness beyond poetic metaphor"
      ],
      historicalRole: "Greatest poet of Middle Ages, author of Divine Comedy",
      fantasyRole: "Temporal navigator, spiritual guide, cosmic wisdom keeper"
    },
    {
      name: "Giovanna De Sade",
      historicalBirthDate: "1295-11-02",
      historicalDeathDate: "1365-03-21",
      storyAge: 26,
      historicalAccuracy: "fictional",
      keyLifeEvents: [
        "1295: Born into Sade family",
        "1310: Begins studying forbidden texts",
        "1318: Discovers temporal sensitivity",
        "1321: Manifests as La Signora del Gioco",
        "1322: Co-founds Trionfi Academy"
      ],
      contemporaryFigures: ["Francisco Petrarch", "Novella d'Andrea"],
      anachronisms: [
        "Sade family connection (anachronistic)",
        "Temporal magic abilities",
        "Advanced understanding of free will vs determinism"
      ],
      historicalRole: "Fictional character with historical connections",
      fantasyRole: "Master of transformation magic, champion of human agency"
    },
    {
      name: "Dagon Atumari",
      historicalBirthDate: "Unknown (Ancient)",
      historicalDeathDate: "Never died",
      storyAge: 4000,
      historicalAccuracy: "mythic",
      keyLifeEvents: [
        "Ancient times: Divine overseer of order",
        "Various eras: Manipulates historical events",
        "1321: Final attempt to control timeline",
        "1322: Transformation and acceptance"
      ],
      contemporaryFigures: ["All historical figures across time"],
      anachronisms: [
        "Entire existence is anachronistic",
        "Divine intervention in mortal affairs",
        "Time travel and timeline manipulation"
      ],
      historicalRole: "None - purely mythic figure",
      fantasyRole: "Divine antagonist turned ally, guardian of cosmic balance"
    }
  ];

  // Insert historical character mappings
  for (const mapping of historicalMappings) {
    const character = existingCharacters.find((char: any) => char.name === mapping.name);
    if (character) {
      try {
        await db.insert(historicalCharacterMapping).values({
          characterId: character.id,
          historicalBirthDate: mapping.historicalBirthDate,
          historicalDeathDate: mapping.historicalDeathDate,
          storyAge: mapping.storyAge,
          historicalAccuracy: mapping.historicalAccuracy,
          keyLifeEvents: JSON.stringify(mapping.keyLifeEvents),
          contemporaryFigures: JSON.stringify(mapping.contemporaryFigures),
          anachronisms: JSON.stringify(mapping.anachronisms),
          historicalRole: mapping.historicalRole,
          fantasyRole: mapping.fantasyRole,
        });
        
        console.log(`Created historical mapping for ${mapping.name}`);
      } catch (err) {
        console.error(`Failed to create historical mapping for ${mapping.name}:`, err);
      }
    }
  }

  console.log('Historical character mapping completed!');
}

async function seedTimelineDivergencePoints(db: any) {
  console.log('Starting timeline divergence points...');

  const divergencePoints = [
    {
      name: "Francisco's Trionfi Creation",
      historicalDate: "1321-04-06",
      divergenceType: "major_alteration",
      realTimelineOutcome: "Francisco continues law studies, becomes a lawyer, never develops as major poet until later",
      storyTimelineOutcome: "Francisco creates temporal magic cards, awakens to cosmic destiny, begins hero's journey",
      causedByScenes: [4, 5, 6],
      affectsScenes: [7, 8, 9, 10, 11, 12],
      historicalConsequences: [
        "Renaissance humanism begins 50 years early",
        "Magic becomes integrated with scholarship",
        "Timeline awareness spreads among intellectuals"
      ],
      fantasyJustification: "Francisco's poetic sensitivity makes him naturally attuned to temporal currents, allowing spontaneous manifestation of Trionfi power",
      cascadeEffects: [
        "Universities begin teaching temporal studies",
        "Artistic expression gains literal reality-shaping power",
        "Conflict between divine will and human agency intensifies"
      ]
    },
    {
      name: "Dante's Survival",
      historicalDate: "1321-09-14",
      divergenceType: "major_alteration", 
      realTimelineOutcome: "Dante dies of fever in Ravenna, Divine Comedy remains unfinished",
      storyTimelineOutcome: "Dante transcends mortality through Francisco's intervention, becomes eternal guide",
      causedByScenes: [26, 27, 28],
      affectsScenes: [29, 30, 31, 32, 33, 34],
      historicalConsequences: [
        "Divine Comedy completed with additional cantos on temporal mechanics",
        "Literary tradition develops metaphysical practical applications",
        "Italian language evolves to include temporal terminology"
      ],
      fantasyJustification: "Dante's profound spiritual development through writing the Comedy makes him capable of transcending normal mortality when aided by Trionfi power",
      cascadeEffects: [
        "Literary works become instruction manuals for reality manipulation",
        "Poetry schools evolve into magical academies", 
        "Written word gains enhanced power to affect reality"
      ]
    },
    {
      name: "Dagon's Defeat",
      historicalDate: "1321-10-31",
      divergenceType: "major_alteration",
      realTimelineOutcome: "Divine oversight of history continues unchanged, mortals remain unconscious of cosmic forces",
      storyTimelineOutcome: "Divine tyranny ends, mortals gain conscious participation in shaping reality, cosmic democracy begins",
      causedByScenes: [29, 30, 31],
      affectsScenes: [32, 33, 34, 35, 36, 37, 38, 39, 40],
      historicalConsequences: [
        "Human agency becomes primary force in historical development",
        "Religious institutions evolve toward partnership rather than domination models",
        "Scientific revolution begins 200 years early with magical-empirical synthesis"
      ],
      fantasyJustification: "Dagon's defeat represents the cosmic shift from predetermined fate to collaborative creation between divine and mortal will",
      cascadeEffects: [
        "All future history becomes more creative and unpredictable",
        "Human potential for both creation and destruction dramatically increases",
        "New cosmic order requires constant vigilance and wisdom"
      ]
    },
    {
      name: "Trionfi Academy Foundation",
      historicalDate: "1322-01-01",
      divergenceType: "major_alteration",
      realTimelineOutcome: "No formal training exists for reality-shapers, power remains chaotic and dangerous",
      storyTimelineOutcome: "Systematic education in temporal magic begins, creating trained guardians of timeline stability",
      causedByScenes: [35, 36, 37, 38, 39, 40],
      affectsScenes: "Future books in the series",
      historicalConsequences: [
        "Magic becomes systematized and teachable",
        "New profession of timeline guardian emerges",
        "Global network of reality-shapers develops"
      ],
      fantasyJustification: "Francisco's mastery of the Trionfi cards creates both the need and the capability for training future practitioners",
      cascadeEffects: [
        "Each generation becomes more adept at conscious reality creation",
        "Conflicts between different schools of magical thought emerge",
        "Need for international cooperation in timeline management"
      ]
    }
  ];

  for (const divergence of divergencePoints) {
    try {
      await db.insert(timelineDivergencePoints).values({
        name: divergence.name,
        historicalDate: divergence.historicalDate,
        divergenceType: divergence.divergenceType,
        realTimelineOutcome: divergence.realTimelineOutcome,
        storyTimelineOutcome: divergence.storyTimelineOutcome,
        causedBySceneIds: JSON.stringify(divergence.causedByScenes),
        affectsSceneIds: JSON.stringify(divergence.affectsScenes),
        historicalConsequences: JSON.stringify(divergence.historicalConsequences),
        fantasyJustification: divergence.fantasyJustification,
        cascadeEffects: JSON.stringify(divergence.cascadeEffects),
      });
      
      console.log(`Created divergence point: ${divergence.name}`);
    } catch (err) {
      console.error(`Failed to create divergence point ${divergence.name}:`, err);
    }
  }

  console.log('Timeline divergence points completed!');
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const db = drizzle(client);

  console.log('Starting lore seeding...');
  await seedTimelineEvents(db);
  await seedCharacters(db);
  await seedTrionfiCards(db);
  await seedSymbolicObjects(db);
  await seedMilitaryOrders(db);
  await seedTemporalArchitecture(db);
  await seedTemporalTechnology(db);
  await seedTemporalEconomy(db);
  await seedTemporalLaw(db);
  await seedTemporalEducation(db);
  await seedLocations(db);
  // await seedNovelStructure(db); // Skip - already seeded
  await seedBookIDetailed(db);
  await seedCharacterArcs(db);
  await seedStoryGaps(db);
  await seedTarotIntegration(db);
  await seedTimelineCoordination(db);
  await seedHistoricalCharacterMapping(db);
  await seedTimelineDivergencePoints(db);
  console.log('Lore seeding completed!');

  await client.end();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
}); 