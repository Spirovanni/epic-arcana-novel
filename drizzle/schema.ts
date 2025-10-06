import { pgTable, unique, integer, varchar, timestamp, boolean, uuid, text, jsonb, foreignKey, pgEnum, real } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const affinityType = pgEnum("affinity_type", ['secondary', 'forbidden'])
export const arcanaType = pgEnum("arcana_type", ['major', 'minor'])
export const characterType = pgEnum("character_type", ['historical', 'mythic', 'fantasy'])
export const stationType = pgEnum("station_type", ['major_hub', 'minor_stop'])
export const suit = pgEnum("suit", ['Temporalis', 'Animae', 'Stellae', 'Materiae'])
export const trainComponentType = pgEnum("train_component_type", ['locomotive', 'passenger_car', 'observation_car'])
export const assessmentStatus = pgEnum("assessment_status", ['in_progress', 'completed', 'abandoned'])
export const questionType = pgEnum("question_type", ['situational', 'preference', 'behavioral', 'personality'])
export const membershipTier = pgEnum("membership_tier", ['free', 'basic', 'premium', 'ultimate'])


export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	role: varchar({ length: 255 }).default('user').notNull(),
	membershipTier: membershipTier("membership_tier").default('free').notNull(),
	membershipExpiresAt: timestamp("membership_expires_at", { mode: 'string' }),
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
	unique("users_email_unique").on(table.email),
	unique("users_clerkId_unique").on(table.clerkId),
]);

export const locations = pgTable("locations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	arcana: varchar({ length: 50 }),
	coordinates: jsonb(),
	faction: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const militaryOrders = pgTable("military_orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 255 }),
	origin: varchar({ length: 255 }),
	description: text(),
	lore: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("military_orders_name_unique").on(table.name),
]);

export const storyGaps = pgTable("story_gaps", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	category: varchar({ length: 100 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	coreIssues: jsonb("core_issues"),
	developmentSuggestions: jsonb("development_suggestions"),
	keyScenesToDevelop: jsonb("key_scenes_to_develop"),
	characterQuestions: jsonb("character_questions"),
	priority: varchar({ length: 20 }),
	status: varchar({ length: 20 }),
	relatedBookIds: jsonb("related_book_ids"),
	relatedCharacterIds: jsonb("related_character_ids"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const symbolicObjects = pgTable("symbolic_objects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 255 }),
	theme: varchar({ length: 255 }),
	description: text(),
	lore: text(),
	origin: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("symbolic_objects_name_unique").on(table.name),
]);

export const temporalEconomy = pgTable("temporal_economy", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 100 }),
	description: text(),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("temporal_economy_name_unique").on(table.name),
]);

export const temporalEducation = pgTable("temporal_education", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 100 }),
	description: text(),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("temporal_education_name_unique").on(table.name),
]);

export const temporalLaw = pgTable("temporal_law", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 100 }),
	description: text(),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("temporal_law_name_unique").on(table.name),
]);

export const temporalStations = pgTable("temporal_stations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: stationType().notNull(),
	features: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("temporal_stations_name_unique").on(table.name),
]);

export const temporalTechnology = pgTable("temporal_technology", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 100 }),
	description: text(),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("temporal_technology_name_unique").on(table.name),
]);

export const timelineDivergencePoints = pgTable("timeline_divergence_points", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	historicalDate: varchar("historical_date", { length: 50 }),
	divergenceType: varchar("divergence_type", { length: 100 }),
	realTimelineOutcome: text("real_timeline_outcome"),
	storyTimelineOutcome: text("story_timeline_outcome"),
	causedBySceneIds: jsonb("caused_by_scene_ids"),
	affectsSceneIds: jsonb("affects_scene_ids"),
	historicalConsequences: jsonb("historical_consequences"),
	fantasyJustification: text("fantasy_justification"),
	cascadeEffects: jsonb("cascade_effects"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const zanettiTrainComponents = pgTable("zanetti_train_components", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: trainComponentType().notNull(),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const novelSeries = pgTable("novel_series", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	tagline: varchar({ length: 255 }),
	logline: text(),
	synopsis: text(),
	secondarySynopsis: text("secondary_synopsis"),
	description: text(),
	summary: text(),
	genres: jsonb(),
	themes: jsonb(),
	keyThemes: jsonb("key_themes"),
	positioning: jsonb(),
	tone: jsonb(),
	style: jsonb(),
	targetAudience: jsonb("target_audience"),
	keywords: jsonb(),
	tropes: jsonb(),
	coverThemeConcepts: jsonb("cover_theme_concepts"),
	settings: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("novel_series_title_unique").on(table.title),
]);

export const chapterPages = pgTable("chapter_pages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chapterId: uuid("chapter_id").notNull(),
	pageNumber: integer("page_number").notNull(),
	content: text().default(''),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "chapter_pages_chapter_id_chapters_id_fk"
		}),
]);

export const characterAffinities = pgTable("character_affinities", {
	characterId: uuid("character_id").notNull(),
	cardId: uuid("card_id").notNull(),
	affinityType: affinityType("affinity_type").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [characters.id],
			name: "character_affinities_character_id_characters_id_fk"
		}),
	foreignKey({
			columns: [table.cardId],
			foreignColumns: [trionfiCards.id],
			name: "character_affinities_card_id_trionfi_cards_id_fk"
		}),
]);

export const trionfiCards = pgTable("trionfi_cards", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	arcanaType: arcanaType("arcana_type").notNull(),
	suit: suit(),
	powerLevel: varchar("power_level", { length: 100 }),
	description: text(),
	temporalImpact: text("temporal_impact"),
	essence: text(),
	divineAspect: text("divine_aspect"),
	humanAspect: text("human_aspect"),
	interpretations: jsonb(),
	specialAbility: text("special_ability"),
	domain: text(),
	element: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("trionfi_cards_name_unique").on(table.name),
]);

export const characterArcs = pgTable("character_arcs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	characterId: uuid("character_id").notNull(),
	arcType: varchar("arc_type", { length: 100 }).notNull(),
	triumphTheme: varchar("triumph_theme", { length: 100 }),
	primaryBookId: uuid("primary_book_id"),
	stages: jsonb(),
	thematicElements: jsonb("thematic_elements"),
	keyMoments: jsonb("key_moments"),
	characterDevelopment: jsonb("character_development"),
	conflicts: jsonb(),
	resolution: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [characters.id],
			name: "character_arcs_character_id_characters_id_fk"
		}),
	foreignKey({
			columns: [table.primaryBookId],
			foreignColumns: [books.id],
			name: "character_arcs_primary_book_id_books_id_fk"
		}),
]);

export const characterThematicElements = pgTable("character_thematic_elements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	characterId: uuid("character_id").notNull(),
	theme: varchar({ length: 100 }).notNull(),
	development: text(),
	keyMoments: jsonb("key_moments"),
	progressionStages: jsonb("progression_stages"),
	triumphConnection: varchar("triumph_connection", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [characters.id],
			name: "character_thematic_elements_character_id_characters_id_fk"
		}),
]);

export const characterTriumphMapping = pgTable("character_triumph_mapping", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	characterId: uuid("character_id").notNull(),
	triumphTheme: varchar("triumph_theme", { length: 100 }).notNull(),
	relationship: varchar({ length: 100 }),
	developmentStage: varchar("development_stage", { length: 100 }),
	keyScenes: jsonb("key_scenes"),
	thematicRole: text("thematic_role"),
	arcProgression: jsonb("arc_progression"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [characters.id],
			name: "character_triumph_mapping_character_id_characters_id_fk"
		}),
]);

export const historicalCharacterMapping = pgTable("historical_character_mapping", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	characterId: uuid("character_id").notNull(),
	historicalBirthDate: varchar("historical_birth_date", { length: 50 }),
	historicalDeathDate: varchar("historical_death_date", { length: 50 }),
	storyAge: integer("story_age"),
	historicalAccuracy: varchar("historical_accuracy", { length: 50 }),
	keyLifeEvents: jsonb("key_life_events"),
	contemporaryFigures: jsonb("contemporary_figures"),
	anachronisms: jsonb(),
	historicalRole: text("historical_role"),
	fantasyRole: text("fantasy_role"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [characters.id],
			name: "historical_character_mapping_character_id_characters_id_fk"
		}),
]);

export const scenes = pgTable("scenes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chapterId: uuid("chapter_id").notNull(),
	sceneNumber: integer("scene_number").notNull(),
	title: varchar({ length: 255 }),
	focus: varchar({ length: 255 }),
	preliminarySceneFocus: varchar("preliminary_scene_focus", { length: 255 }),
	preliminarySceneDescription: text("preliminary_scene_description"),
	description: text(),
	tarotSymbolism: text("tarot_symbolism"),
	heroJourneyStage: varchar("hero_journey_stage", { length: 100 }),
	pages: varchar({ length: 50 }),
	primaryTarotCard: varchar("primary_tarot_card", { length: 100 }),
	secondaryTarotCards: jsonb("secondary_tarot_cards"),
	tarotCardId: uuid("tarot_card_id"),
	tarotNarrativeRole: varchar("tarot_narrative_role", { length: 255 }),
	franciscoTarotConnection: text("francisco_tarot_connection"),
	laSignoraTarotConnection: text("la_signora_tarot_connection"),
	dagonTarotConnection: text("dagon_tarot_connection"),
	temporalPowerManifested: text("temporal_power_manifested"),
	characterGrowthElement: text("character_growth_element"),
	sceneCardProgression: integer("scene_card_progression"),
	cardReversalSignificance: text("card_reversal_significance"),
	historicalDate: varchar("historical_date", { length: 50 }),
	storyTimelineDate: varchar("story_timeline_date", { length: 50 }),
	historicalEventIds: jsonb("historical_event_ids"),
	temporalDivergencePoint: text("temporal_divergence_point"),
	realWorldContext: text("real_world_context"),
	alternateTimelineVariant: varchar("alternate_timeline_variant", { length: 100 }),
	chronologicalSequence: integer("chronological_sequence"),
	storySequence: integer("story_sequence"),
	timelineSignificance: text("timeline_significance"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "scenes_chapter_id_chapters_id_fk"
		}),
	foreignKey({
			columns: [table.tarotCardId],
			foreignColumns: [trionfiCards.id],
			name: "scenes_tarot_card_id_trionfi_cards_id_fk"
		}),
]);

export const sceneTimelineMapping = pgTable("scene_timeline_mapping", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sceneId: uuid("scene_id").notNull(),
	timelineEventId: uuid("timeline_event_id").notNull(),
	relationshipType: varchar("relationship_type", { length: 100 }),
	temporalDistance: varchar("temporal_distance", { length: 50 }),
	divergenceImpact: text("divergence_impact"),
	narrativeSignificance: text("narrative_significance"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scenes.id],
			name: "scene_timeline_mapping_scene_id_scenes_id_fk"
		}),
	foreignKey({
			columns: [table.timelineEventId],
			foreignColumns: [timelineEvents.id],
			name: "scene_timeline_mapping_timeline_event_id_timeline_events_id_fk"
		}),
]);

export const timelineEvents = pgTable("timeline_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventKey: varchar("event_key", { length: 50 }).notNull(),
	label: varchar({ length: 255 }).notNull(),
	year: integer(),
	era: varchar({ length: 100 }).notNull(),
	historical: integer().notNull(),
	summary: text().notNull(),
	month: varchar({ length: 20 }),
	day: varchar({ length: 20 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("timeline_events_event_key_unique").on(table.eventKey),
]);

export const taskGroups = pgTable("task_groups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chapterId: uuid("chapter_id"),
	parentTaskGroupId: uuid("parent_task_group_id"),
	uniqueIdentifier: varchar("unique_identifier", { length: 50 }),
	type: varchar({ length: 50 }),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	tagline: text(),
	focusArea: varchar("focus_area", { length: 100 }),
	connectionToMajorTaskGroup: text("connection_to_major_task_group"),
	influencedByBooks: jsonb("influenced_by_books"),
	learningObjectives: jsonb("learning_objectives"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "task_groups_chapter_id_chapters_id_fk"
		}),
]);

export const uniqueCombinations = pgTable("unique_combinations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	characterId: uuid("character_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	effect: text(),
	cost: text(),
}, (table) => [
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [characters.id],
			name: "unique_combinations_character_id_characters_id_fk"
		}),
]);

export const uniqueCombinationCards = pgTable("unique_combination_cards", {
	combinationId: uuid("combination_id").notNull(),
	cardId: uuid("card_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.combinationId],
			foreignColumns: [uniqueCombinations.id],
			name: "unique_combination_cards_combination_id_unique_combinations_id_"
		}),
	foreignKey({
			columns: [table.cardId],
			foreignColumns: [trionfiCards.id],
			name: "unique_combination_cards_card_id_trionfi_cards_id_fk"
		}),
]);

export const characters = pgTable("characters", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	characterType: characterType("character_type").notNull(),
	pronouns: varchar({ length: 50 }),
	relation: varchar({ length: 255 }),
	personality: text(),
	background: text(),
	physicalDescription: text("physical_description"),
	dialogueStyle: text("dialogue_style"),
	role: varchar({ length: 255 }),
	goal: text(),
	birthYear: varchar("birth_year", { length: 50 }),
	died: varchar({ length: 50 }),
	storyYear: varchar("story_year", { length: 50 }),
	storyAge: varchar("story_age", { length: 50 }),
	groups: jsonb(),
	description: text(),
	birthPlace: varchar("birth_place", { length: 255 }),
	birthPlaceDescription: text("birth_place_description"),
	deathPlace: varchar("death_place", { length: 255 }),
	deathPlaceDescription: text("death_place_description"),
	aka: varchar({ length: 255 }),
	primaryAffinityId: uuid("primary_affinity_id"),
	evolution: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	lastSeenChapter: integer("last_seen_chapter"),
	slug: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.primaryAffinityId],
			foreignColumns: [trionfiCards.id],
			name: "characters_primary_affinity_id_trionfi_cards_id_fk"
		}),
	unique("characters_name_unique").on(table.name),
	unique("characters_slug_unique").on(table.slug),
]);

export const books = pgTable("books", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	seriesId: uuid("series_id").notNull(),
	bookNumber: integer("book_number").notNull(),
	uniqueIdentifier: varchar("unique_identifier", { length: 50 }),
	title: varchar({ length: 255 }).notNull(),
	fictionNovelTitle: varchar("fiction_novel_title", { length: 255 }),
	subject: varchar({ length: 100 }),
	focus: varchar({ length: 255 }),
	tagline: text(),
	logline: text(),
	description: text(),
	themes: jsonb(),
	keyThemes: jsonb("key_themes"),
	triumph: varchar({ length: 100 }),
	militaryComponent: varchar("military_component", { length: 100 }),
	businessModel: varchar("business_model", { length: 100 }),
	personalityType: varchar("personality_type", { length: 100 }),
	enneagramType: varchar("enneagram_type", { length: 100 }),
	enneagramDescription: text("enneagram_description"),
	coveyHabit: varchar("covey_habit", { length: 100 }),
	associatedSin: varchar("associated_sin", { length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	epicNovelPlot: varchar("epic_novel_plot", { length: 255 }),
	uniqueTheme: varchar("unique_theme", { length: 255 }),
	businessModelGeneration: varchar("business_model_generation", { length: 100 }),
	businessModelYou: varchar("business_model_you", { length: 255 }),
	type: varchar({ length: 50 }),
}, (table) => [
	foreignKey({
			columns: [table.seriesId],
			foreignColumns: [novelSeries.id],
			name: "books_series_id_novel_series_id_fk"
		}),
]);

export const chapters = pgTable("chapters", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	bookId: uuid("book_id").notNull(),
	chapterNumber: integer("chapter_number").notNull(),
	uniqueIdentifier: varchar("unique_identifier", { length: 50 }),
	title: varchar({ length: 255 }),
	focus: varchar({ length: 255 }),
	epicNovelPages: varchar("epic_novel_pages", { length: 50 }),
	epicChapterFocus: varchar("epic_chapter_focus", { length: 255 }),
	epicNovelChapterFocus: varchar("epic_novel_chapter_focus", { length: 255 }),
	epicNovelSectionName: varchar("epic_novel_section_name", { length: 255 }),
	description: text(),
	tarotCardLink: varchar("tarot_card_link", { length: 100 }),
	tarotFamily: varchar("tarot_family", { length: 50 }),
	tarotCardItem: varchar("tarot_card_item", { length: 50 }),
	colorTheme: jsonb("color_theme"),
	iconPath: varchar("icon_path", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	majorTaskGroupId: uuid("major_task_group_id"),
	type: varchar({ length: 50 }),
	colorName: varchar("color_name", { length: 100 }),
	hexCode: varchar("hex_code", { length: 7 }),
	red: integer(),
	green: integer(),
	blue: integer(),
	focusArea: varchar("focus_area", { length: 100 }),
	connectionToMajorTaskGroup: text("connection_to_major_task_group"),
	specificTaskGroupDescription: text("specific_task_group_description"),
	specificTaskGroupTagline: text("specific_task_group_tagline"),
	specificTaskGroupBooksInfluencedBy: jsonb("specific_task_group_books_influenced_by"),
	terminalLearningObjectives: jsonb("terminal_learning_objectives"),
}, (table) => [
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "chapters_book_id_books_id_fk"
		}),
	foreignKey({
			columns: [table.majorTaskGroupId],
			foreignColumns: [majorTaskGroups.id],
			name: "chapters_major_task_group_id_major_task_groups_id_fk"
		}),
]);

export const taskMasters = pgTable("task_masters", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	bookId: uuid("book_id").notNull(),
	uniqueIdentifier: varchar("unique_identifier", { length: 50 }),
	type: varchar({ length: 50 }),
	colorName: varchar("color_name", { length: 100 }),
	hexCode: varchar("hex_code", { length: 7 }),
	red: integer(),
	green: integer(),
	blue: integer(),
	title: varchar({ length: 255 }).notNull(),
	tagline: text(),
	description: text(),
	fictionNovelSectionTitle: varchar("fiction_novel_section_title", { length: 255 }),
	fictionNovelSectionDescription: text("fiction_novel_section_description"),
	fictionNovelSectionTagline: text("fiction_novel_section_tagline"),
	fictionNovelSectionBooksInfluencedBy: jsonb("fiction_novel_section_books_influenced_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "task_masters_book_id_books_id_fk"
		}),
]);

export const majorTaskGroups = pgTable("major_task_groups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	taskMasterId: uuid("task_master_id").notNull(),
	uniqueIdentifier: varchar("unique_identifier", { length: 50 }),
	type: varchar({ length: 50 }),
	colorName: varchar("color_name", { length: 100 }),
	hexCode: varchar("hex_code", { length: 7 }),
	red: integer(),
	green: integer(),
	blue: integer(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	tagline: text(),
	booksInfluencedBy: jsonb("books_influenced_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.taskMasterId],
			foreignColumns: [taskMasters.id],
			name: "major_task_groups_task_master_id_task_masters_id_fk"
		}),
]);

export const chapterDetails = pgTable("chapter_details", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chapterId: uuid("chapter_id").notNull(),
	povType: varchar("pov_type", { length: 255 }),
	povCharacterName: varchar("pov_character_name", { length: 255 }),
	tense: varchar({ length: 50 }),
	whyPovAndTense: text("why_pov_and_tense"),
	summary: text(),
	keyPlotDevelopments: jsonb("key_plot_developments"),
	narrativeFunction: jsonb("narrative_function"),
	toneAndVisualPrompts: jsonb("tone_and_visual_prompts"),
	tipsForWriting: jsonb("tips_for_writing"),
	fullText: text("full_text"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "chapter_details_chapter_id_chapters_id_fk"
		}).onDelete("cascade"),
	unique("chapter_details_chapter_id_unique").on(table.chapterId),
]);

export const chapterWritingGuidance = pgTable("chapter_writing_guidance", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chapterId: uuid("chapter_id").notNull(),
	bookId: uuid("book_id").notNull(),
	chapterNumber: integer("chapter_number").notNull(),
	title: varchar({ length: 255 }).notNull(),
	povType: varchar("pov_type", { length: 100 }),
	povCharacter: varchar("pov_character", { length: 255 }),
	tense: varchar({ length: 50 }),
	whyThisPovAndTense: text("why_this_pov_and_tense"),
	summary: text(),
	keyPlotDevelopments: jsonb("key_plot_developments"),
	narrativeFunction: jsonb("narrative_function"),
	toneAndVisualPrompts: jsonb("tone_and_visual_prompts"),
	tipsForWriting: jsonb("tips_for_writing"),
	fullText: text("full_text"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "chapter_writing_guidance_chapter_id_chapters_id_fk"
		}),
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "chapter_writing_guidance_book_id_books_id_fk"
		}),
]);

// Character Arc 3D Visualization Tables
export const storyCards = pgTable("story_cards", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	characterArcId: uuid("character_arc_id").notNull(),
	stageName: varchar("stage_name", { length: 100 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	chapterReferences: jsonb("chapter_references"),
	sceneGoals: jsonb("scene_goals"),
	arcDevelopment: text("arc_development"),
	positionX: real("position_x").default(0),
	positionY: real("position_y").default(0),
	positionZ: real("position_z").default(0),
	rotationX: real("rotation_x").default(0),
	rotationY: real("rotation_y").default(0),
	rotationZ: real("rotation_z").default(0),
	scale: real().default(1),
	color: varchar({ length: 7 }).default('#6366f1'),
	displayOrder: integer("display_order").default(0),
	isVisible: boolean("is_visible").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.characterArcId],
		foreignColumns: [characterArcs.id],
		name: "story_cards_character_arc_id_character_arcs_id_fk"
	}).onDelete("cascade"),
]);

export const characterArcRelationships = pgTable("character_arc_relationships", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sourceCharacterId: uuid("source_character_id").notNull(),
	targetCharacterId: uuid("target_character_id").notNull(),
	relationshipType: varchar("relationship_type", { length: 100 }).notNull(),
	strength: integer().default(1),
	chaptersActive: jsonb("chapters_active"),
	description: text(),
	visualStyle: jsonb("visual_style"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.sourceCharacterId],
		foreignColumns: [characters.id],
		name: "character_arc_relationships_source_character_id_characters_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.targetCharacterId],
		foreignColumns: [characters.id],
		name: "character_arc_relationships_target_character_id_characters_id_fk"
	}).onDelete("cascade"),
]);

export const arcVisualizationScenes = pgTable("arc_visualization_scenes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	cameraPosition: jsonb("camera_position"),
	cameraTarget: jsonb("camera_target"),
	lightingConfig: jsonb("lighting_config"),
	environmentSettings: jsonb("environment_settings"),
	characterFilters: jsonb("character_filters"),
	isDefault: boolean("is_default").default(false),
	createdBy: varchar("created_by", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const storyArcGoals = pgTable("story_arc_goals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	characterArcId: uuid("character_arc_id").notNull(),
	theme: varchar({ length: 100 }).notNull(),
	chapterNumber: integer("chapter_number").notNull(),
	sceneNumber: integer("scene_number"),
	goalDescription: text("goal_description").notNull(),
	measurementCriteria: text("measurement_criteria"),
	arcDevelopmentNote: text("arc_development_note"),
	isCompleted: boolean("is_completed").default(false),
	positionIn3d: jsonb("position_in_3d"),
	visualProperties: jsonb("visual_properties"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.characterArcId],
		foreignColumns: [characterArcs.id],
		name: "story_arc_goals_character_arc_id_character_arcs_id_fk"
	}).onDelete("cascade"),
]);

// Assessment System Tables
export const assessments = pgTable("assessments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	status: assessmentStatus().default('in_progress').notNull(),
	currentQuestionIndex: integer("current_question_index").default(0).notNull(),
	totalQuestions: integer("total_questions").notNull(),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "assessments_user_id_users_id_fk"
	}).onDelete("cascade"),
]);

export const assessmentQuestions = pgTable("assessment_questions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	assessmentId: uuid("assessment_id").notNull(),
	questionId: varchar("question_id", { length: 100 }).notNull(),
	questionType: questionType().notNull(),
	questionText: text("question_text").notNull(),
	questionData: jsonb("question_data").notNull(), // Contains options, scoring, etc.
	orderIndex: integer("order_index").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.assessmentId],
		foreignColumns: [assessments.id],
		name: "assessment_questions_assessment_id_assessments_id_fk"
	}).onDelete("cascade"),
]);

export const assessmentAnswers = pgTable("assessment_answers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	assessmentId: uuid("assessment_id").notNull(),
	questionId: varchar("question_id", { length: 100 }).notNull(),
	selectedOptionIndex: integer("selected_option_index").notNull(),
	selectedOptionText: text("selected_option_text").notNull(),
	scoringData: jsonb("scoring_data").notNull(), // Contains Big Five scores, player type scores, etc.
	answeredAt: timestamp("answered_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.assessmentId],
		foreignColumns: [assessments.id],
		name: "assessment_answers_assessment_id_assessments_id_fk"
	}).onDelete("cascade"),
]);

export const userAssessmentResults = pgTable("user_assessment_results", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	assessmentId: uuid("assessment_id").notNull(),
	primaryPlayerType: varchar("primary_player_type", { length: 100 }).notNull(),
	secondaryPlayerType: varchar("secondary_player_type", { length: 100 }),
	bigFiveScores: jsonb("big_five_scores").notNull(), // {openness: number, conscientiousness: number, etc.}
	enneagramType: integer("enneagram_type"),
	heroJourneyStage: varchar("hero_journey_stage", { length: 100 }),
	colorCyclePosition: integer("color_cycle_position").default(1),
	trionfiCard: varchar("trionfi_card", { length: 100 }),
	personalityProfile: jsonb("personality_profile").notNull(), // Full personality data
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "user_assessment_results_user_id_users_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.assessmentId],
		foreignColumns: [assessments.id],
		name: "user_assessment_results_assessment_id_assessments_id_fk"
	}).onDelete("cascade"),
	unique("user_assessment_results_user_id_assessment_id_unique").on(table.userId, table.assessmentId),
]);

// Human Framework Calendar Tables
export const calendarSettings = pgTable("calendar_settings", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "calendar_settings_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	key: varchar({ length: 255 }).notNull(),
	value: text().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("calendar_settings_key_unique").on(table.key),
]);

export const daySign = pgTable("day_sign", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "day_sign_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	index0: integer().notNull(), // 0-19
	name: varchar({ length: 255 }).notNull(),
	glyph: varchar({ length: 255 }), // asset path if any
	color: varchar({ length: 7 }), // hex color
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("day_sign_index0_unique").on(table.index0),
]);

export const daySignMapping = pgTable("day_sign_mapping", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "day_sign_mapping_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	daySignId: integer("day_sign_id").notNull(),
	archetype: varchar({ length: 255 }).notNull(),
	theme: varchar({ length: 255 }).notNull(),
	reflection: text().notNull(),
	ritual: text().notNull(),
	keywords: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.daySignId],
		foreignColumns: [daySign.id],
		name: "day_sign_mapping_day_sign_id_day_sign_id_fk"
	}).onDelete("cascade"),
]);

export const dayOverride = pgTable("day_override", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "day_override_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	dayOfYear: integer("day_of_year").notNull(), // 1..365
	title: varchar({ length: 255 }),
	description: text(),
	ritual: text(),
	tags: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("day_override_day_of_year_unique").on(table.dayOfYear),
]);
