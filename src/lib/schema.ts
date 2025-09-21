import { pgTable, text, timestamp, uuid, varchar, jsonb, pgEnum, integer, boolean, real, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: 'users_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  role: varchar({ length: 255 }).default('user').notNull(),
  status: varchar({ length: 255 }).default('active').notNull(),
  isVerified: boolean().default(false).notNull(),
  isActive: boolean().default(true).notNull(),
  isDeleted: boolean().default(false).notNull(),
  isSuspended: boolean().default(false).notNull(),
  isLocked: boolean().default(false).notNull(),
  isEmailVerified: boolean().default(false).notNull(),
  isPhoneVerified: boolean().default(false).notNull(),
  isPremium: boolean().default(false).notNull(),
  isTrial: boolean().default(false).notNull(),
  isTrialExpired: boolean().default(false).notNull(),
  isTrialStarted: boolean().default(false).notNull(),
  isTrialEnded: boolean().default(false).notNull(),
  credits: integer().default(0).notNull(),
  creditsUsed: integer().default(0).notNull(),
  creditsRemaining: integer().default(0).notNull(),
  creditsExhausted: boolean().default(false).notNull(),
  creditsExhaustedAt: timestamp({ mode: 'string' }),
  creditsExhaustedReason: varchar({ length: 255 }).default('').notNull(),
  creditsExhaustedReasonDescription: varchar({ length: 255 }).default('').notNull(),
  clerkId: varchar({ length: 255 }).notNull(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
}, (table) => [
  unique('users_email_unique').on(table.email),
  unique('users_clerkId_unique').on(table.clerkId),
]);

export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  other_names: jsonb('other_names'),
  sensory_description: text('sensory_description'),
  location: text('location'),
  type: varchar('type', { length: 100 }),
  description: text('description'),
  notable_features: text('notable_features'),
  lore: text('lore'),
  affiliation: varchar('affiliation', { length: 200 }),
  linked_arcana: varchar('linked_arcana', { length: 100 }),
  ai_image_prompt: text('ai_image_prompt'),
  image_url: varchar('image_url', { length: 500 }),
  arcana: varchar('arcana', { length: 50 }),
  coordinates: jsonb('coordinates'),
  faction: varchar('faction', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const arcanaTypeEnum = pgEnum('arcana_type', ['major', 'minor']);
export const suitEnum = pgEnum('suit', ['Temporalis', 'Animae', 'Stellae', 'Materiae']);

export const trionfiCards = pgTable('trionfi_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  arcanaType: arcanaTypeEnum('arcana_type').notNull(),
  suit: suitEnum('suit'),
  powerLevel: varchar('power_level', { length: 100 }),
  description: text('description'),
  temporalImpact: text('temporal_impact'),
  essence: text('essence'),
  divineAspect: text('divine_aspect'),
  humanAspect: text('human_aspect'),
  interpretations: jsonb('interpretations'),
  specialAbility: text('special_ability'),
  domain: text('domain'),
  element: text('element'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const characterTypeEnum = pgEnum('character_type', ['historical', 'mythic', 'fantasy']);

export const characters = pgTable('characters', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    characterType: characterTypeEnum('character_type').notNull(),
    pronouns: varchar('pronouns', { length: 50 }),
    relation: varchar('relation', { length: 255 }),
    personality: text('personality'),
    background: text('background'),
    physicalDescription: text('physical_description'),
    dialogueStyle: text('dialogue_style'),
    role: varchar('role', { length: 255 }),
    goal: text('goal'),
    birthYear: varchar('birth_year', { length: 50 }),
    died: varchar('died', { length: 50 }),
    storyYear: varchar('story_year', { length: 50 }),
    storyAge: varchar('story_age', { length: 50 }),
    groups: jsonb('groups'),
    description: text('description'),
    birthPlace: varchar('birth_place', { length: 255 }),
    birthPlaceDescription: text('birth_place_description'),
    deathPlace: varchar('death_place', { length: 255 }),
    deathPlaceDescription: text('death_place_description'),
    aka: varchar('aka', { length: 255 }),
    slug: varchar('slug', { length: 255 }).unique(), // SEO-friendly URL
    primaryAffinityId: uuid('primary_affinity_id').references(() => trionfiCards.id),
    evolution: jsonb('evolution'),
    lastSeenChapter: integer('last_seen_chapter'), // NEW: Track where they are in the book
    // Image Details for AI Generation
    imagePrompt: text('image_prompt'),
    openArtLink: varchar('open_art_link', { length: 500 }),
    customSetting: text('custom_setting'),
    // Character Image
    imageUrl: varchar('image_url', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const affinityTypeEnum = pgEnum('affinity_type', ['secondary', 'forbidden']);

export const characterAffinities = pgTable('character_affinities', {
    characterId: uuid('character_id').references(() => characters.id).notNull(),
    cardId: uuid('card_id').references(() => trionfiCards.id).notNull(),
    affinityType: affinityTypeEnum('affinity_type').notNull(),
});

export const uniqueCombinations = pgTable('unique_combinations', {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id').references(() => characters.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    effect: text('effect'),
    cost: text('cost'),
});

export const uniqueCombinationCards = pgTable('unique_combination_cards', {
    combinationId: uuid('combination_id').references(() => uniqueCombinations.id).notNull(),
    cardId: uuid('card_id').references(() => trionfiCards.id).notNull(),
});

export const symbolicObjects = pgTable('symbolic_objects', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    role: varchar('role', { length: 255 }),
    theme: varchar('theme', { length: 255 }),
    description: text('description'),
    lore: text('lore'),
    origin: text('origin'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const militaryOrders = pgTable('military_orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    role: varchar('role', { length: 255 }),
    origin: varchar('origin', { length: 255 }),
    description: text('description'),
    lore: text('lore'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const trainComponentTypeEnum = pgEnum('train_component_type', ['locomotive', 'passenger_car', 'observation_car']);
export const zanettiTrainComponents = pgTable('zanetti_train_components', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    type: trainComponentTypeEnum('type').notNull(),
    details: jsonb('details'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const stationTypeEnum = pgEnum('station_type', ['major_hub', 'minor_stop']);
export const temporalStations = pgTable('temporal_stations', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    type: stationTypeEnum('type').notNull(),
    features: jsonb('features'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const temporalTechnology = pgTable('temporal_technology', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 100 }), // e.g., 'Chronological Device', 'Protective Equipment'
    description: text('description'),
    details: jsonb('details'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const temporalEconomy = pgTable('temporal_economy', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 100 }), // e.g., 'Resource', 'Service'
    description: text('description'),
    details: jsonb('details'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const temporalLaw = pgTable('temporal_law', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 100 }), // e.g., 'Principle', 'Enforcement', 'Legal Document'
    description: text('description'),
    details: jsonb('details'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const temporalEducation = pgTable('temporal_education', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 100 }), // e.g., 'Training Program', 'Research Institution'
    description: text('description'),
    details: jsonb('details'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Timeline events table (single timeline approach)
export const timelineEvents = pgTable('timeline_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventKey: varchar('event_key', { length: 50 }).notNull().unique(), // e.g., "hist-48bce-001"
  label: varchar('label', { length: 255 }).notNull(),
  year: integer('year'), // nullable for mythic events
  era: varchar('era', { length: 100 }).notNull(),
  historical: integer('historical').notNull(), // 0 = false, 1 = true
  summary: text('summary').notNull(),
  month: varchar('month', { length: 20 }), // or integer('month')
  day: varchar('day', { length: 20 }),     // or integer('day')
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Novel Series Structure Tables
export const novelSeries = pgTable('novel_series', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull().unique(),
  tagline: varchar('tagline', { length: 255 }),
  logline: text('logline'),
  synopsis: text('synopsis'),
  secondarySynopsis: text('secondary_synopsis'),
  description: text('description'),
  summary: text('summary'),
  genres: jsonb('genres'),
  themes: jsonb('themes'),
  keyThemes: jsonb('key_themes'),
  positioning: jsonb('positioning'),
  tone: jsonb('tone'),
  style: jsonb('style'),
  targetAudience: jsonb('target_audience'),
  keywords: jsonb('keywords'),
  tropes: jsonb('tropes'),
  coverThemeConcepts: jsonb('cover_theme_concepts'),
  settings: jsonb('settings'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const books = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  seriesId: uuid('series_id').references(() => novelSeries.id).notNull(),
  bookNumber: integer('book_number').notNull(),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }),
  title: varchar('title', { length: 255 }).notNull(),
  fictionNovelTitle: varchar('fiction_novel_title', { length: 255 }),
  subject: varchar('subject', { length: 100 }),
  focus: varchar('focus', { length: 255 }),
  tagline: text('tagline'),
  logline: text('logline'),
  description: text('description'),
  themes: jsonb('themes'),
  keyThemes: jsonb('key_themes'),
  triumph: varchar('triumph', { length: 100 }), // e.g., "Knowledge", "Memory", etc.
  militaryComponent: varchar('military_component', { length: 100 }),
  businessModel: varchar('business_model', { length: 100 }),
  personalityType: varchar('personality_type', { length: 100 }),
  enneagramType: varchar('enneagram_type', { length: 100 }),
  enneagramDescription: text('enneagram_description'),
  coveryCoveyHabit: varchar('covey_habit', { length: 100 }),
  associatedSin: varchar('associated_sin', { length: 50 }),
  // New fields from Book 1 JSON
  epicNovelPlot: varchar('epic_novel_plot', { length: 255 }),
  uniqueTheme: varchar('unique_theme', { length: 255 }),
  businessModelGeneration: varchar('business_model_generation', { length: 100 }),
  businessModelYou: varchar('business_model_you', { length: 255 }),
  type: varchar('type', { length: 50 }), // "Major Task"
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Task Masters - New hierarchical structure from Book JSON
export const taskMasters = pgTable('task_masters', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }),
  type: varchar('type', { length: 50 }),
  colorName: varchar('color_name', { length: 100 }),
  hexCode: varchar('hex_code', { length: 7 }),
  red: integer('red'),
  green: integer('green'),
  blue: integer('blue'),
  title: varchar('title', { length: 255 }).notNull(),
  tagline: text('tagline'),
  description: text('description'),
  fictionNovelSectionTitle: varchar('fiction_novel_section_title', { length: 255 }),
  fictionNovelSectionDescription: text('fiction_novel_section_description'),
  fictionNovelSectionTagline: text('fiction_novel_section_tagline'),
  fictionNovelSectionBooksInfluencedBy: jsonb('fiction_novel_section_books_influenced_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Major Task Groups - Intermediate organizational layer
export const majorTaskGroups = pgTable('major_task_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskMasterId: uuid('task_master_id').references(() => taskMasters.id).notNull(),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }),
  type: varchar('type', { length: 50 }),
  colorName: varchar('color_name', { length: 100 }),
  hexCode: varchar('hex_code', { length: 7 }),
  red: integer('red'),
  green: integer('green'),
  blue: integer('blue'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  tagline: text('tagline'),
  booksInfluencedBy: jsonb('books_influenced_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  majorTaskGroupId: uuid('major_task_group_id').references(() => majorTaskGroups.id),
  chapterNumber: integer('chapter_number').notNull(),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }),
  title: varchar('title', { length: 255 }),
  focus: varchar('focus', { length: 255 }),
  epicNovelPages: varchar('epic_novel_pages', { length: 50 }),
  epicChapterFocus: varchar('epic_chapter_focus', { length: 255 }),
  epicNovelChapterFocus: varchar('epic_novel_chapter_focus', { length: 255 }),
  epicNovelSectionName: varchar('epic_novel_section_name', { length: 255 }),
  description: text('description'),
  tarotCardLink: varchar('tarot_card_link', { length: 100 }),
  tarotFamily: varchar('tarot_family', { length: 50 }),
  tarotCardItem: varchar('tarot_card_item', { length: 50 }),
  colorTheme: jsonb('color_theme'), // name, hex, rgb values
  iconPath: varchar('icon_path', { length: 255 }), // e.g., "chapters/book1/chapter1.png"
  // New fields from specific task groups
  type: varchar('type', { length: 50 }), // "Specific Task Group"
  colorName: varchar('color_name', { length: 100 }),
  hexCode: varchar('hex_code', { length: 7 }),
  red: integer('red'),
  green: integer('green'),
  blue: integer('blue'),
  focusArea: varchar('focus_area', { length: 100 }),
  connectionToMajorTaskGroup: text('connection_to_major_task_group'),
  specificTaskGroupDescription: text('specific_task_group_description'),
  specificTaskGroupTagline: text('specific_task_group_tagline'),
  specificTaskGroupBooksInfluencedBy: jsonb('specific_task_group_books_influenced_by'),
  terminalLearningObjectives: jsonb('terminal_learning_objectives'),
  summary: text('summary'),
  // Chapter-level scene metadata
  pov: varchar('pov', { length: 100 }),
  tense: varchar('tense', { length: 50 }),
  coreEmotion: varchar('core_emotion', { length: 255 }),
  sceneTone: varchar('scene_tone', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chapterPages = pgTable('chapter_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id').references(() => chapters.id).notNull(),
  pageNumber: integer('page_number').notNull(),
  content: text('content').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const scenes = pgTable('scenes', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id').references(() => chapters.id).notNull(),
  sceneNumber: integer('scene_number').notNull(),
  title: varchar('title', { length: 255 }),
  focus: varchar('focus', { length: 255 }),
  preliminarySceneFocus: varchar('preliminary_scene_focus', { length: 255 }),
  preliminarySceneDescription: text('preliminary_scene_description'),
  description: text('description'),
  // Scene Structure Fields
  setup: text('setup'),
  sensoryDetail: text('sensory_detail'),
  internalConflict: text('internal_conflict'),
  beatGoal: text('beat_goal'),
  tarotSymbolism: text('tarot_symbolism'),
  heroJourneyStage: varchar('hero_journey_stage', { length: 100 }),
  pages: varchar('pages', { length: 50 }),
  symbolism: text('symbolism'),
  // Enhanced Tarot Integration
  primaryTarotCard: varchar('primary_tarot_card', { length: 100 }), // Main card for the scene
  secondaryTarotCards: jsonb('secondary_tarot_cards'), // Supporting cards
  tarotCardId: uuid('tarot_card_id').references(() => trionfiCards.id), // Link to Trionfi card
  tarotNarrativeRole: varchar('tarot_narrative_role', { length: 255 }), // How card advances plot
  franciscoTarotConnection: text('francisco_tarot_connection'), // Francisco's relationship to card
  laSignoraTarotConnection: text('la_signora_tarot_connection'), // La Signora's relationship to card
  dagonTarotConnection: text('dagon_tarot_connection'), // Dagon's relationship to card
  temporalPowerManifested: text('temporal_power_manifested'), // How card's temporal power appears
  characterGrowthElement: text('character_growth_element'), // Character development aspect
  sceneCardProgression: integer('scene_card_progression'), // Position in overall Tarot journey (1-78)
  cardReversalSignificance: text('card_reversal_significance'), // If card is reversed, what it means
  // Timeline Coordination
  historicalDate: varchar('historical_date', { length: 50 }), // Actual historical date (e.g., "1321-04-15")
  storyTimelineDate: varchar('story_timeline_date', { length: 50 }), // Date within story timeline
  historicalEventIds: jsonb('historical_event_ids'), // Array of timeline event IDs
  temporalDivergencePoint: text('temporal_divergence_point'), // How fantasy elements affect history
  realWorldContext: text('real_world_context'), // Historical context for the scene
  alternateTimelineVariant: varchar('alternate_timeline_variant', { length: 100 }), // Which timeline branch
  chronologicalSequence: integer('chronological_sequence'), // Order in real chronology
  storySequence: integer('story_sequence'), // Order in narrative
  timelineSignificance: text('timeline_significance'), // Why this moment matters historically
  // Additional timeline and context fields from l_outline.json
  timeline_date: varchar('timeline_date', { length: 50 }), // e.g., "1/10/1320"
  timeline_variant: varchar('timeline_variant', { length: 100 }), // e.g., "Prime Timeline", "Timeline Fracture"
  location: varchar('location', { length: 255 }), // e.g., "Bologna City Square, Italy"
  pov: varchar('pov', { length: 100 }), // Point of view character or style
  tense: varchar('tense', { length: 100 }), // Narrative tense
  core_emotion: varchar('core_emotion', { length: 255 }), // Primary emotional state
  scene_tone: varchar('scene_tone', { length: 255 }), // Overall atmosphere/tone
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const taskGroups = pgTable('task_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id').references(() => chapters.id),
  parentTaskGroupId: uuid('parent_task_group_id'),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }),
  type: varchar('type', { length: 50 }), // 'Major Task Group', 'Specific Task Group'
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  tagline: text('tagline'),
  focusArea: varchar('focus_area', { length: 100 }),
  connectionToMajorTaskGroup: text('connection_to_major_task_group'),
  influencedByBooks: jsonb('influenced_by_books'),
  learningObjectives: jsonb('learning_objectives'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Character Arc and Story Development Tables
export const characterArcs = pgTable('character_arcs', {
  id: uuid('id').primaryKey().defaultRandom(),
  characterId: uuid('character_id').references(() => characters.id).notNull(),
  arcType: varchar('arc_type', { length: 100 }).notNull(), // 'Hero's Journey', 'Transformation', etc.
  triumphTheme: varchar('triumph_theme', { length: 100 }), // Links to one of the 9 Triumphs
  primaryBookId: uuid('primary_book_id').references(() => books.id),
  stages: jsonb('stages'), // Initial state, rising action, climax, etc.
  thematicElements: jsonb('thematic_elements'), // Power, love, knowledge themes
  keyMoments: jsonb('key_moments'), // Critical character development points
  characterDevelopment: jsonb('character_development'), // Progression through arc
  conflicts: jsonb('conflicts'), // Internal and external conflicts
  resolution: jsonb('resolution'), // How the arc concludes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const characterTriumphMapping = pgTable('character_triumph_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),
  characterId: uuid('character_id').references(() => characters.id).notNull(),
  triumphTheme: varchar('triumph_theme', { length: 100 }).notNull(), // Knowledge, Memory, Power, etc.
  relationship: varchar('relationship', { length: 100 }), // 'Primary', 'Secondary', 'Opposes', 'Embodies'
  developmentStage: varchar('development_stage', { length: 100 }), // Which stage of triumph they represent
  keyScenes: jsonb('key_scenes'), // Scenes where this relationship is most evident
  thematicRole: text('thematic_role'), // How they contribute to this triumph theme
  arcProgression: jsonb('arc_progression'), // How their arc supports this triumph
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const storyGaps = pgTable('story_gaps', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 100 }).notNull(), // e.g., 'Trionfi_Cards_System_Integration'
  title: varchar('title', { length: 255 }).notNull(),
  coreIssues: jsonb('core_issues'), // Array of core problems to address
  developmentSuggestions: jsonb('development_suggestions'), // Suggested solutions
  keyScenesToDevelop: jsonb('key_scenes_to_develop'), // Specific scenes needed
  characterQuestions: jsonb('character_questions'), // Questions to explore
  priority: varchar('priority', { length: 20 }), // 'High', 'Medium', 'Low'
  status: varchar('status', { length: 20 }), // 'Identified', 'In Progress', 'Resolved'
  relatedBookIds: jsonb('related_book_ids'), // Which books this affects
  relatedCharacterIds: jsonb('related_character_ids'), // Which characters this involves
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const characterThematicElements = pgTable('character_thematic_elements', {
  id: uuid('id').primaryKey().defaultRandom(),
  characterId: uuid('character_id').references(() => characters.id).notNull(),
  theme: varchar('theme', { length: 100 }).notNull(), // 'power', 'knowledge', 'love', etc.
  development: text('development'), // How this theme develops for the character
  keyMoments: jsonb('key_moments'), // Key moments for this thematic development
  progressionStages: jsonb('progression_stages'), // Stages of thematic development
  triumphConnection: varchar('triumph_connection', { length: 100 }), // Which Triumph this connects to
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Timeline Coordination Tables
export const sceneTimelineMapping = pgTable('scene_timeline_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),
  sceneId: uuid('scene_id').references(() => scenes.id).notNull(),
  timelineEventId: uuid('timeline_event_id').references(() => timelineEvents.id).notNull(),
  relationshipType: varchar('relationship_type', { length: 100 }), // 'occurs_during', 'references', 'causes', 'results_from'
  temporalDistance: varchar('temporal_distance', { length: 50 }), // 'concurrent', 'years_before', 'decades_after', etc.
  divergenceImpact: text('divergence_impact'), // How this scene affects the historical event
  narrativeSignificance: text('narrative_significance'), // Why this connection matters to the story
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const historicalCharacterMapping = pgTable('historical_character_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),
  characterId: uuid('character_id').references(() => characters.id).notNull(),
  historicalBirthDate: varchar('historical_birth_date', { length: 50 }),
  historicalDeathDate: varchar('historical_death_date', { length: 50 }),
  storyAge: integer('story_age'), // Age during main story events
  historicalAccuracy: varchar('historical_accuracy', { length: 50 }), // 'accurate', 'adapted', 'fictional'
  keyLifeEvents: jsonb('key_life_events'), // Important dates in their life
  contemporaryFigures: jsonb('contemporary_figures'), // Other historical figures they knew
  anachronisms: jsonb('anachronisms'), // Deliberate historical inaccuracies for story purposes
  historicalRole: text('historical_role'), // Their actual role in history
  fantasyRole: text('fantasy_role'), // Their role in the fantasy elements
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const timelineDivergencePoints = pgTable('timeline_divergence_points', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  historicalDate: varchar('historical_date', { length: 50 }),
  divergenceType: varchar('divergence_type', { length: 100 }), // 'major_alteration', 'minor_change', 'hidden_event'
  realTimelineOutcome: text('real_timeline_outcome'), // What actually happened in history
  storyTimelineOutcome: text('story_timeline_outcome'), // What happens in the Epic Arcana timeline
  causedBySceneIds: jsonb('caused_by_scene_ids'), // Which scenes trigger this divergence
  affectsSceneIds: jsonb('affects_scene_ids'), // Which scenes are affected by this divergence
  historicalConsequences: jsonb('historical_consequences'), // Long-term effects on history
  fantasyJustification: text('fantasy_justification'), // How fantasy elements explain the change
  cascadeEffects: jsonb('cascade_effects'), // Secondary changes this causes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chapterWritingGuidance = pgTable('chapter_writing_guidance', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id').references(() => chapters.id).notNull(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  chapterNumber: integer('chapter_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  povType: varchar('pov_type', { length: 100 }), // "3rd Person Limited", etc.
  povCharacter: varchar('pov_character', { length: 255 }), // Character name
  tense: varchar('tense', { length: 50 }), // "Past Tense", etc.
  whyThisPovAndTense: text('why_this_pov_and_tense'), // Explanation
  summary: text('summary'), // Chapter summary
  keyPlotDevelopments: jsonb('key_plot_developments'), // Array of strings
  narrativeFunction: jsonb('narrative_function'), // Array of strings
  toneAndVisualPrompts: jsonb('tone_and_visual_prompts'), // Array of strings
  tipsForWriting: jsonb('tips_for_writing'), // Array of strings
  fullText: text('full_text'), // Complete Sudowrite guidance text
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Character Arc 3D Visualization Tables
export const storyCards = pgTable('story_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  characterArcId: uuid('character_arc_id').references(() => characterArcs.id).notNull(),
  stageName: varchar('stage_name', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  chapterReferences: jsonb('chapter_references'),
  sceneGoals: jsonb('scene_goals'),
  arcDevelopment: text('arc_development'),
  positionX: real('position_x').default(0),
  positionY: real('position_y').default(0),
  positionZ: real('position_z').default(0),
  rotationX: real('rotation_x').default(0),
  rotationY: real('rotation_y').default(0),
  rotationZ: real('rotation_z').default(0),
  scale: real('scale').default(1),
  color: varchar('color', { length: 7 }).default('#6366f1'),
  displayOrder: integer('display_order').default(0),
  isVisible: boolean('is_visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const characterArcRelationships = pgTable('character_arc_relationships', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceCharacterId: uuid('source_character_id').references(() => characters.id).notNull(),
  targetCharacterId: uuid('target_character_id').references(() => characters.id).notNull(),
  relationshipType: varchar('relationship_type', { length: 100 }).notNull(),
  strength: integer('strength').default(1),
  chaptersActive: jsonb('chapters_active'),
  description: text('description'),
  visualStyle: jsonb('visual_style'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const arcVisualizationScenes = pgTable('arc_visualization_scenes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  cameraPosition: jsonb('camera_position'),
  cameraTarget: jsonb('camera_target'),
  lightingConfig: jsonb('lighting_config'),
  environmentSettings: jsonb('environment_settings'),
  characterFilters: jsonb('character_filters'),
  isDefault: boolean('is_default').default(false),
  createdBy: varchar('created_by', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const storyArcGoals = pgTable('story_arc_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  characterArcId: uuid('character_arc_id').references(() => characterArcs.id).notNull(),
  theme: varchar('theme', { length: 100 }).notNull(),
  chapterNumber: integer('chapter_number').notNull(),
  sceneNumber: integer('scene_number'),
  goalDescription: text('goal_description').notNull(),
  measurementCriteria: text('measurement_criteria'),
  arcDevelopmentNote: text('arc_development_note'),
  isCompleted: boolean('is_completed').default(false),
  positionIn3d: jsonb('position_in_3d'),
  visualProperties: jsonb('visual_properties'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Assessment System Enums
export const assessmentStatusEnum = pgEnum('assessment_status', ['in_progress', 'completed', 'abandoned']);
export const questionTypeEnum = pgEnum('question_type', ['situational', 'preference', 'behavioral', 'personality']);

// Assessment System Tables
export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: assessmentStatusEnum('status').default('in_progress').notNull(),
  currentQuestionIndex: integer('current_question_index').default(0).notNull(),
  totalQuestions: integer('total_questions').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assessmentQuestions = pgTable('assessment_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  questionId: varchar('question_id', { length: 100 }).notNull(),
  questionType: questionTypeEnum('question_type').notNull(),
  questionText: text('question_text').notNull(),
  questionData: jsonb('question_data').notNull(), // Contains options, scoring, etc.
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assessmentAnswers = pgTable('assessment_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  questionId: varchar('question_id', { length: 100 }).notNull(),
  selectedOptionIndex: integer('selected_option_index').notNull(),
  selectedOptionText: text('selected_option_text').notNull(),
  scoringData: jsonb('scoring_data').notNull(), // Contains Big Five scores, player type scores, etc.
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userAssessmentResults = pgTable('user_assessment_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  primaryPlayerType: varchar('primary_player_type', { length: 100 }).notNull(),
  secondaryPlayerType: varchar('secondary_player_type', { length: 100 }),
  bigFiveScores: jsonb('big_five_scores').notNull(), // {openness: number, conscientiousness: number, etc.}
  enneagramType: integer('enneagram_type'),
  heroJourneyStage: varchar('hero_journey_stage', { length: 100 }),
  colorCyclePosition: integer('color_cycle_position').default(1),
  trionfiCard: varchar('trionfi_card', { length: 100 }),
  personalityProfile: jsonb('personality_profile').notNull(), // Full personality data
  completedAt: timestamp('completed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Human Framework Calendar Tables
export const calendarSettings = pgTable('calendar_settings', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ name: 'calendar_settings_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const daySign = pgTable('day_sign', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ name: 'day_sign_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  index0: integer('index0').notNull().unique(), // 0-19
  name: varchar('name', { length: 255 }).notNull(),
  glyph: varchar('glyph', { length: 255 }), // asset path if any
  color: varchar('color', { length: 7 }), // hex color
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const daySignMapping = pgTable('day_sign_mapping', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ name: 'day_sign_mapping_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  daySignId: integer('day_sign_id').notNull().references(() => daySign.id, { onDelete: 'cascade' }),
  archetype: varchar('archetype', { length: 255 }).notNull(),
  theme: varchar('theme', { length: 255 }).notNull(),
  reflection: text('reflection').notNull(),
  ritual: text('ritual').notNull(),
  keywords: text('keywords').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dayOverride = pgTable('day_override', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ name: 'day_override_id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  dayOfYear: integer('day_of_year').notNull().unique(), // 1..365
  title: varchar('title', { length: 255 }),
  description: text('description'),
  ritual: text('ritual'),
  tags: text('tags'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});