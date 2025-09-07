import { LikertItem } from '../schema.js';

export const LIKERT_ITEMS: LikertItem[] = [
  {
    id: "L-LK-001",
    center: "Head",
    location: "Archive of Quiet Stars",
    statement: "Before acting, I map patterns others miss, even under pressure from the council.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { abstract_reasoning: 0.22, orderliness: 0.10 },
      types: { "5": 0.22, "1": 0.06 }, 
      instincts: { SP: 0.04 } 
    }
  },
  {
    id: "L-LK-002",
    center: "Heart",
    location: "Shared Hearths of the Merchant District",
    statement: "I naturally sense what others need and feel compelled to provide it.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { empathy: 0.24, cooperativeness: 0.12 },
      types: { "2": 0.26, "9": 0.08 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-003",
    center: "Body",
    location: "Northern Gates of the Winter Citadels",
    statement: "When crisis strikes, I instinctively take charge and expect others to follow.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { agency: 0.22, social_dominance: 0.14 },
      types: { "8": 0.28, "3": 0.10 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-004",
    center: "Heart",
    location: "Garden of Reflecting Pools",
    statement: "I feel things more intensely than most people seem to.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { emotional_intensity: 0.26, empathy: 0.10 },
      types: { "4": 0.24, "2": 0.08 }, 
      instincts: { SX: 0.06 } 
    }
  },
  {
    id: "L-LK-005",
    center: "Body",
    location: "Workshop of Bound Elements",
    statement: "There is a right way to do things, and I become frustrated when others ignore proper methods.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { orderliness: 0.24, conscientiousness: 0.14 },
      types: { "1": 0.28, "8": 0.06 }, 
      instincts: { SP: 0.04 } 
    }
  },
  {
    id: "L-LK-006",
    center: "Head",
    location: "Observatory of Distant Lights",
    statement: "I trust my inner circle completely but remain cautious with outsiders.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { stability: 0.20, cooperativeness: 0.12 },
      types: { "6": 0.24, "2": 0.08 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-007",
    center: "Head",
    location: "Tower of Echoing Winds",
    statement: "I see possibilities everywhere and get excited about exploring new paths.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { novelty_seeking: 0.26, imagination: 0.12 },
      types: { "7": 0.28, "4": 0.08 }, 
      instincts: { SX: 0.06 } 
    }
  },
  {
    id: "L-LK-008",
    center: "Heart",
    location: "Council Chamber of the Resonant Voice",
    statement: "Success energizes me more than comfort or security ever could.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { agency: 0.18, social_dominance: 0.16 },
      types: { "3": 0.26, "8": 0.10 }, 
      instincts: { SO: 0.04 } 
    }
  },
  {
    id: "L-LK-009",
    center: "Body",
    location: "Moonlit Commons where paths converge",
    statement: "I prefer harmony over confrontation and will adapt to maintain peace.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { cooperativeness: 0.24, adaptability: 0.14 },
      types: { "9": 0.28, "2": 0.08 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-010",
    center: "Head",
    location: "Library of Living Stories",
    statement: "I need time alone to process experiences before sharing them with others.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { abstract_reasoning: 0.18, stability: 0.14 },
      types: { "5": 0.24, "4": 0.08 }, 
      instincts: { SP: 0.08 } 
    }
  },
  {
    id: "L-LK-011",
    center: "Heart",
    location: "Sanctuary of the Nine Flames",
    statement: "My authentic self is more important than fitting in with the group.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { emotional_intensity: 0.26, empathy: 0.12 },
      types: { "4": 0.28, "8": 0.08 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-012",
    center: "Body",
    location: "Harbor of the Returning Tides",
    statement: "I work methodically through tasks, completing each one fully before moving on.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { conscientiousness: 0.24, orderliness: 0.16 },
      types: { "1": 0.26, "5": 0.10 }, 
      instincts: { SP: 0.04 } 
    }
  },
  {
    id: "L-LK-013",
    center: "Heart",
    location: "Market of Endless Exchange",
    statement: "I'm drawn to people with intensity and depth over those who seem shallow.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { emotional_intensity: 0.20, empathy: 0.14 },
      types: { "4": 0.22, "5": 0.10 }, 
      instincts: { SX: 0.08 } 
    }
  },
  {
    id: "L-LK-014",
    center: "Head",
    location: "Crossroads of the Seven Paths",
    statement: "I question authority when their decisions don't align with my values.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { agency: 0.18, risk_tolerance: 0.14 },
      types: { "8": 0.24, "4": 0.10 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-015",
    center: "Body",
    location: "Temple of the Undivided Light",
    statement: "I believe in finding the middle path that everyone can accept.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { cooperativeness: 0.22, stability: 0.16 },
      types: { "9": 0.26, "6": 0.08 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-016",
    center: "Heart",
    location: "Restored Rivers beneath the Commons",
    statement: "I feel responsible for the wellbeing of everyone in my community.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { empathy: 0.22, cooperativeness: 0.14 },
      types: { "2": 0.24, "1": 0.08 }, 
      instincts: { SO: 0.08 } 
    }
  },
  {
    id: "L-LK-017",
    center: "Head",
    location: "Hall of the First Covenant",
    statement: "I analyze situations from multiple angles before committing to action.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { abstract_reasoning: 0.24, conscientiousness: 0.12 },
      types: { "5": 0.22, "6": 0.10 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-018",
    center: "Body",
    location: "Twilight Bridges of the Ancient Quarter",
    statement: "I'm comfortable taking risks when the potential reward is significant.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { risk_tolerance: 0.26, agency: 0.12 },
      types: { "7": 0.22, "8": 0.12 }, 
      instincts: { SX: 0.06 } 
    }
  },
  {
    id: "L-LK-019",
    center: "Heart",
    location: "Garden of Reflecting Pools",
    statement: "I adapt my approach based on what each person needs from me.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { adaptability: 0.20, empathy: 0.16 },
      types: { "3": 0.22, "9": 0.10 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-020",
    center: "Head",
    location: "Archive of Quiet Stars",
    statement: "I value competence above almost all other qualities in myself and others.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { abstract_reasoning: 0.20, conscientiousness: 0.16 },
      types: { "5": 0.26, "3": 0.08 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-021",
    center: "Body",
    location: "Northern Gates of the Winter Citadels",
    statement: "I stand up for others even when it puts me at personal risk.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { agency: 0.20, empathy: 0.16 },
      types: { "8": 0.22, "2": 0.12 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-022",
    center: "Heart",
    location: "Moonlit Commons where paths converge",
    statement: "I'm energized by social gatherings and meeting new people.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { social_dominance: 0.18, cooperativeness: 0.14 },
      types: { "7": 0.20, "3": 0.14 }, 
      instincts: { SO: 0.08 } 
    }
  },
  {
    id: "L-LK-023",
    center: "Body",
    location: "Workshop of Bound Elements",
    statement: "I prefer to work independently rather than coordinate with a team.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { stability: 0.18, orderliness: 0.14 },
      types: { "5": 0.20, "1": 0.12 }, 
      instincts: { SP: 0.08 } 
    }
  },
  {
    id: "L-LK-024",
    center: "Heart",
    location: "Council Chamber of the Resonant Voice",
    statement: "I'm motivated by achieving recognition and admiration from others.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { social_dominance: 0.22, agency: 0.14 },
      types: { "3": 0.28, "7": 0.08 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-025",
    center: "Head",
    location: "Observatory of Distant Lights",
    statement: "I worry about potential problems and prepare for worst-case scenarios.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { conscientiousness: 0.20, stability: 0.16 },
      types: { "6": 0.26, "1": 0.08 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-026",
    center: "Body",
    location: "Harbor of the Returning Tides",
    statement: "I believe most people can be trusted if you give them a chance.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { cooperativeness: 0.22, empathy: 0.14 },
      types: { "9": 0.24, "2": 0.10 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-027",
    center: "Heart",
    location: "Sanctuary of the Nine Flames",
    statement: "I'm drawn to what's missing or forbidden rather than what's easily available.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { novelty_seeking: 0.20, emotional_intensity: 0.16 },
      types: { "4": 0.24, "7": 0.10 }, 
      instincts: { SX: 0.08 } 
    }
  },
  {
    id: "L-LK-028",
    center: "Head",
    location: "Library of Living Stories",
    statement: "I keep my options open rather than committing to a single path too early.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { adaptability: 0.22, novelty_seeking: 0.16 },
      types: { "7": 0.26, "9": 0.08 }, 
      instincts: { SX: 0.06 } 
    }
  },
  {
    id: "L-LK-029",
    center: "Body",
    location: "Temple of the Undivided Light",
    statement: "I have strong opinions about right and wrong that don't change easily.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { orderliness: 0.22, agency: 0.16 },
      types: { "1": 0.24, "8": 0.10 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-030",
    center: "Heart",
    location: "Market of Endless Exchange",
    statement: "I find it natural to influence and persuade others toward my viewpoint.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { social_dominance: 0.24, agency: 0.14 },
      types: { "8": 0.22, "3": 0.14 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-031",
    center: "Head",
    location: "Crossroads of the Seven Paths",
    statement: "I enjoy intellectual challenges more than social or physical ones.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { abstract_reasoning: 0.26, orderliness: 0.12 },
      types: { "5": 0.28, "1": 0.08 }, 
      instincts: { SP: 0.06 } 
    }
  },
  {
    id: "L-LK-032",
    center: "Body",
    location: "Restored Rivers beneath the Commons",
    statement: "I go along with group decisions rather than assert my individual preferences.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { cooperativeness: 0.24, adaptability: 0.16 },
      types: { "9": 0.26, "6": 0.08 }, 
      instincts: { SO: 0.06 } 
    }
  },
  {
    id: "L-LK-033",
    center: "Heart",
    location: "Garden of Reflecting Pools",
    statement: "I'm sensitive to criticism and take feedback personally.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { emotional_intensity: 0.24, empathy: 0.14 },
      types: { "4": 0.26, "2": 0.08 }, 
      instincts: { SX: 0.06 } 
    }
  },
  {
    id: "L-LK-034",
    center: "Head",
    location: "Tower of Echoing Winds",
    statement: "I reframe problems as opportunities and focus on possibilities rather than limitations.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { novelty_seeking: 0.24, adaptability: 0.16 },
      types: { "7": 0.28, "3": 0.08 }, 
      instincts: { SX: 0.04 } 
    }
  },
  {
    id: "L-LK-035",
    center: "Body",
    location: "Hall of the First Covenant",
    statement: "I feel compelled to correct mistakes and improve systems I encounter.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { orderliness: 0.26, conscientiousness: 0.14 },
      types: { "1": 0.28, "5": 0.08 }, 
      instincts: { SP: 0.04 } 
    }
  },
  {
    id: "L-LK-036",
    center: "Heart",
    location: "Twilight Bridges of the Ancient Quarter",
    statement: "I connect deeply with a few people rather than maintaining many casual relationships.",
    scale: [1, 2, 3, 4, 5],
    keys: { 
      dimensions: { emotional_intensity: 0.20, empathy: 0.16 },
      types: { "4": 0.22, "5": 0.12 }, 
      instincts: { SX: 0.08 } 
    }
  }
];

export function getLikertItems(): LikertItem[] {
  return LIKERT_ITEMS;
}