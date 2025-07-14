import { relations } from "drizzle-orm/relations";
import { chapters, chapterPages, characters, characterAffinities, trionfiCards, characterArcs, books, characterThematicElements, characterTriumphMapping, historicalCharacterMapping, scenes, sceneTimelineMapping, timelineEvents, taskGroups, uniqueCombinations, uniqueCombinationCards, novelSeries, majorTaskGroups, taskMasters, chapterDetails, chapterWritingGuidance } from "./schema";

export const chapterPagesRelations = relations(chapterPages, ({one}) => ({
	chapter: one(chapters, {
		fields: [chapterPages.chapterId],
		references: [chapters.id]
	}),
}));

export const chaptersRelations = relations(chapters, ({one, many}) => ({
	chapterPages: many(chapterPages),
	scenes: many(scenes),
	taskGroups: many(taskGroups),
	book: one(books, {
		fields: [chapters.bookId],
		references: [books.id]
	}),
	majorTaskGroup: one(majorTaskGroups, {
		fields: [chapters.majorTaskGroupId],
		references: [majorTaskGroups.id]
	}),
	chapterDetails: many(chapterDetails),
	chapterWritingGuidances: many(chapterWritingGuidance),
}));

export const characterAffinitiesRelations = relations(characterAffinities, ({one}) => ({
	character: one(characters, {
		fields: [characterAffinities.characterId],
		references: [characters.id]
	}),
	trionfiCard: one(trionfiCards, {
		fields: [characterAffinities.cardId],
		references: [trionfiCards.id]
	}),
}));

export const charactersRelations = relations(characters, ({one, many}) => ({
	characterAffinities: many(characterAffinities),
	characterArcs: many(characterArcs),
	characterThematicElements: many(characterThematicElements),
	characterTriumphMappings: many(characterTriumphMapping),
	historicalCharacterMappings: many(historicalCharacterMapping),
	uniqueCombinations: many(uniqueCombinations),
	trionfiCard: one(trionfiCards, {
		fields: [characters.primaryAffinityId],
		references: [trionfiCards.id]
	}),
}));

export const trionfiCardsRelations = relations(trionfiCards, ({many}) => ({
	characterAffinities: many(characterAffinities),
	scenes: many(scenes),
	uniqueCombinationCards: many(uniqueCombinationCards),
	characters: many(characters),
}));

export const characterArcsRelations = relations(characterArcs, ({one}) => ({
	character: one(characters, {
		fields: [characterArcs.characterId],
		references: [characters.id]
	}),
	book: one(books, {
		fields: [characterArcs.primaryBookId],
		references: [books.id]
	}),
}));

export const booksRelations = relations(books, ({one, many}) => ({
	characterArcs: many(characterArcs),
	novelSery: one(novelSeries, {
		fields: [books.seriesId],
		references: [novelSeries.id]
	}),
	chapters: many(chapters),
	taskMasters: many(taskMasters),
	chapterWritingGuidances: many(chapterWritingGuidance),
}));

export const characterThematicElementsRelations = relations(characterThematicElements, ({one}) => ({
	character: one(characters, {
		fields: [characterThematicElements.characterId],
		references: [characters.id]
	}),
}));

export const characterTriumphMappingRelations = relations(characterTriumphMapping, ({one}) => ({
	character: one(characters, {
		fields: [characterTriumphMapping.characterId],
		references: [characters.id]
	}),
}));

export const historicalCharacterMappingRelations = relations(historicalCharacterMapping, ({one}) => ({
	character: one(characters, {
		fields: [historicalCharacterMapping.characterId],
		references: [characters.id]
	}),
}));

export const scenesRelations = relations(scenes, ({one, many}) => ({
	chapter: one(chapters, {
		fields: [scenes.chapterId],
		references: [chapters.id]
	}),
	trionfiCard: one(trionfiCards, {
		fields: [scenes.tarotCardId],
		references: [trionfiCards.id]
	}),
	sceneTimelineMappings: many(sceneTimelineMapping),
}));

export const sceneTimelineMappingRelations = relations(sceneTimelineMapping, ({one}) => ({
	scene: one(scenes, {
		fields: [sceneTimelineMapping.sceneId],
		references: [scenes.id]
	}),
	timelineEvent: one(timelineEvents, {
		fields: [sceneTimelineMapping.timelineEventId],
		references: [timelineEvents.id]
	}),
}));

export const timelineEventsRelations = relations(timelineEvents, ({many}) => ({
	sceneTimelineMappings: many(sceneTimelineMapping),
}));

export const taskGroupsRelations = relations(taskGroups, ({one}) => ({
	chapter: one(chapters, {
		fields: [taskGroups.chapterId],
		references: [chapters.id]
	}),
}));

export const uniqueCombinationsRelations = relations(uniqueCombinations, ({one, many}) => ({
	character: one(characters, {
		fields: [uniqueCombinations.characterId],
		references: [characters.id]
	}),
	uniqueCombinationCards: many(uniqueCombinationCards),
}));

export const uniqueCombinationCardsRelations = relations(uniqueCombinationCards, ({one}) => ({
	uniqueCombination: one(uniqueCombinations, {
		fields: [uniqueCombinationCards.combinationId],
		references: [uniqueCombinations.id]
	}),
	trionfiCard: one(trionfiCards, {
		fields: [uniqueCombinationCards.cardId],
		references: [trionfiCards.id]
	}),
}));

export const novelSeriesRelations = relations(novelSeries, ({many}) => ({
	books: many(books),
}));

export const majorTaskGroupsRelations = relations(majorTaskGroups, ({one, many}) => ({
	chapters: many(chapters),
	taskMaster: one(taskMasters, {
		fields: [majorTaskGroups.taskMasterId],
		references: [taskMasters.id]
	}),
}));

export const taskMastersRelations = relations(taskMasters, ({one, many}) => ({
	book: one(books, {
		fields: [taskMasters.bookId],
		references: [books.id]
	}),
	majorTaskGroups: many(majorTaskGroups),
}));

export const chapterDetailsRelations = relations(chapterDetails, ({one}) => ({
	chapter: one(chapters, {
		fields: [chapterDetails.chapterId],
		references: [chapters.id]
	}),
}));

export const chapterWritingGuidanceRelations = relations(chapterWritingGuidance, ({one}) => ({
	chapter: one(chapters, {
		fields: [chapterWritingGuidance.chapterId],
		references: [chapters.id]
	}),
	book: one(books, {
		fields: [chapterWritingGuidance.bookId],
		references: [books.id]
	}),
}));