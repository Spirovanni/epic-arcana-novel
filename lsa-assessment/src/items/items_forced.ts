import { ForcedChoiceItem } from '../schema.js';

export const FORCED_CHOICE_ITEMS: ForcedChoiceItem[] = [
  {
    id: "L-FC-001",
    center: "Body",
    location: "Northern Gates of the Winter Citadels",
    vignette: "A breach opens in the icewall as night falls. The guard looks to you.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Seal the gate and take command, posting sentries in layered arcs.",
        keys: { 
          dimensions: { agency: 0.20, risk_tolerance: 0.12, social_dominance: 0.10 },
          types: { "8": 0.30, "1": 0.08 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Gather the wardens and the settlers to agree on a shared watch.",
        keys: { 
          dimensions: { cooperativeness: 0.18, stability: 0.16, adaptability: 0.08 },
          types: { "9": 0.28, "6": 0.06 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Blueprint the weak points and re-route flows through a backup gate.",
        keys: { 
          dimensions: { abstract_reasoning: 0.18, conscientiousness: 0.14, orderliness: 0.10 },
          types: { "1": 0.18, "5": 0.14 }, 
          instincts: { SP: 0.04 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-002",
    center: "Heart",
    location: "Shared Hearths of the Merchant District",
    vignette: "A traveling merchant weeps, having lost their caravan to bandits. Others watch from the shadows.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Rush to comfort them, offering your cloak and coin without question.",
        keys: { 
          dimensions: { empathy: 0.22, cooperativeness: 0.16, emotional_intensity: 0.10 },
          types: { "2": 0.25, "4": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Organize the onlookers to establish a fund and escort service.",
        keys: { 
          dimensions: { social_dominance: 0.18, orderliness: 0.14, agency: 0.12 },
          types: { "3": 0.22, "8": 0.10 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Share your own story of loss, finding connection through vulnerability.",
        keys: { 
          dimensions: { emotional_intensity: 0.20, empathy: 0.16, adaptability: 0.14 },
          types: { "4": 0.24, "2": 0.08 }, 
          instincts: { SX: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-003",
    center: "Head",
    location: "Archive of Quiet Stars",
    vignette: "Ancient texts describe a ritual that could save the city, but the warnings are unclear and time is short.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Research methodically, cross-referencing every source before acting.",
        keys: { 
          dimensions: { abstract_reasoning: 0.22, conscientiousness: 0.18, orderliness: 0.12 },
          types: { "5": 0.26, "1": 0.10 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Seek counsel from the wisest elders and follow their guidance.",
        keys: { 
          dimensions: { cooperativeness: 0.20, stability: 0.16, empathy: 0.10 },
          types: { "6": 0.24, "9": 0.08 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Trust your intuition and adapt the ritual as you go.",
        keys: { 
          dimensions: { adaptability: 0.20, novelty_seeking: 0.16, risk_tolerance: 0.12 },
          types: { "7": 0.24, "4": 0.08 }, 
          instincts: { SX: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-004",
    center: "Body",
    location: "Tower of Echoing Winds",
    vignette: "Winds carry news of approaching armies. The tower's bells must ring the alarm, but the mechanism is ancient and unpredictable.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Climb the tower yourself and ring the bells by hand with precise timing.",
        keys: { 
          dimensions: { agency: 0.18, conscientiousness: 0.16, risk_tolerance: 0.12 },
          types: { "1": 0.22, "8": 0.10 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Rally others to form a human chain, sharing the burden of the climb.",
        keys: { 
          dimensions: { cooperativeness: 0.20, social_dominance: 0.14, empathy: 0.10 },
          types: { "9": 0.20, "2": 0.12 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Protect the mechanism by taking charge and clearing all obstacles first.",
        keys: { 
          dimensions: { social_dominance: 0.22, agency: 0.18, risk_tolerance: 0.10 },
          types: { "8": 0.26, "3": 0.08 }, 
          instincts: { SP: 0.04 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-005",
    center: "Heart",
    location: "Garden of Reflecting Pools",
    vignette: "A child has fallen into the deepest pool and cannot swim. Onlookers freeze with fear.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Dive in immediately, pushing through your own fear to save them.",
        keys: { 
          dimensions: { agency: 0.20, empathy: 0.18, risk_tolerance: 0.14 },
          types: { "2": 0.22, "8": 0.12 }, 
          instincts: { SP: 0.08 } 
        } 
      },
      { 
        label: "Find a rope and organize others to form a rescue chain safely.",
        keys: { 
          dimensions: { orderliness: 0.18, cooperativeness: 0.16, stability: 0.12 },
          types: { "1": 0.20, "6": 0.10 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Create a distraction to calm the crowd while signaling for professional help.",
        keys: { 
          dimensions: { social_dominance: 0.20, adaptability: 0.16, imagination: 0.12 },
          types: { "3": 0.22, "7": 0.10 }, 
          instincts: { SO: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-006",
    center: "Head",
    location: "Observatory of Distant Lights",
    vignette: "The star charts show an alignment that could bring either great fortune or terrible disaster to Laurasia.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Map all possible outcomes and prepare contingencies for each scenario.",
        keys: { 
          dimensions: { abstract_reasoning: 0.20, orderliness: 0.16, conscientiousness: 0.14 },
          types: { "5": 0.24, "1": 0.08 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Consult with the council and build consensus on the safest course.",
        keys: { 
          dimensions: { cooperativeness: 0.18, stability: 0.16, empathy: 0.12 },
          types: { "6": 0.22, "2": 0.10 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Embrace the uncertainty and see what adventures the alignment brings.",
        keys: { 
          dimensions: { novelty_seeking: 0.22, adaptability: 0.18, risk_tolerance: 0.12 },
          types: { "7": 0.26, "4": 0.08 }, 
          instincts: { SX: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-007",
    center: "Body",
    location: "Workshop of Bound Elements",
    vignette: "The forge fires are dying and without them, the city's defenses will fail. The fuel is dangerous and unstable.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Take full responsibility and handle the volatile fuel yourself.",
        keys: { 
          dimensions: { agency: 0.22, risk_tolerance: 0.18, conscientiousness: 0.12 },
          types: { "8": 0.24, "1": 0.10 }, 
          instincts: { SP: 0.08 } 
        } 
      },
      { 
        label: "Work steadily with others to maintain the fires through teamwork.",
        keys: { 
          dimensions: { cooperativeness: 0.20, stability: 0.18, orderliness: 0.12 },
          types: { "9": 0.22, "6": 0.10 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Follow the ancient protocols exactly, no matter how long it takes.",
        keys: { 
          dimensions: { orderliness: 0.22, conscientiousness: 0.20, stability: 0.10 },
          types: { "1": 0.26, "5": 0.08 }, 
          instincts: { SP: 0.04 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-008",
    center: "Heart",
    location: "Council Chamber of the Resonant Voice",
    vignette: "Two factions are deadlocked in debate while urgent decisions await. Tensions rise with each passing moment.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Find the human needs beneath each position and address them directly.",
        keys: { 
          dimensions: { empathy: 0.22, cooperativeness: 0.18, emotional_intensity: 0.10 },
          types: { "2": 0.24, "4": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Present a compelling synthesis that advances both sides' core goals.",
        keys: { 
          dimensions: { social_dominance: 0.20, abstract_reasoning: 0.16, agency: 0.12 },
          types: { "3": 0.24, "7": 0.08 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Speak your truth regardless of politics, letting authenticity cut through the noise.",
        keys: { 
          dimensions: { agency: 0.18, emotional_intensity: 0.16, authenticity: 0.14 },
          types: { "4": 0.22, "8": 0.12 }, 
          instincts: { SX: 0.08 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-009",
    center: "Head",
    location: "Library of Living Stories",
    vignette: "A section of forbidden texts has been unsealed. The knowledge within could change everything, but the risks are unknown.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Study the texts thoroughly, documenting every detail before sharing.",
        keys: { 
          dimensions: { abstract_reasoning: 0.24, conscientiousness: 0.18, orderliness: 0.12 },
          types: { "5": 0.28, "1": 0.08 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Seek guidance from trusted advisors before proceeding further.",
        keys: { 
          dimensions: { cooperativeness: 0.20, stability: 0.18, empathy: 0.10 },
          types: { "6": 0.26, "2": 0.08 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Share discoveries immediately to spark innovation and debate.",
        keys: { 
          dimensions: { novelty_seeking: 0.22, social_dominance: 0.16, risk_tolerance: 0.14 },
          types: { "7": 0.24, "3": 0.10 }, 
          instincts: { SX: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-010",
    center: "Body",
    location: "Harbor of the Returning Tides",
    vignette: "Ships arrive bearing refugees from a distant war. Resources are limited and winter approaches fast.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Organize systematic distribution to ensure everyone receives something fair.",
        keys: { 
          dimensions: { orderliness: 0.20, conscientiousness: 0.18, cooperativeness: 0.14 },
          types: { "1": 0.24, "9": 0.10 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Take charge decisively, prioritizing the most vulnerable first.",
        keys: { 
          dimensions: { agency: 0.22, social_dominance: 0.18, empathy: 0.12 },
          types: { "8": 0.24, "2": 0.10 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Create harmony by bringing together locals and refugees in shared work.",
        keys: { 
          dimensions: { cooperativeness: 0.22, empathy: 0.18, adaptability: 0.12 },
          types: { "9": 0.26, "2": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-011",
    center: "Heart",
    location: "Sanctuary of the Nine Flames",
    vignette: "The sacred flames flicker low. Legend says they represent the spirits of the city, and their dimming signals great change.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Tend each flame with personal devotion, staying through the night.",
        keys: { 
          dimensions: { empathy: 0.20, emotional_intensity: 0.18, conscientiousness: 0.14 },
          types: { "4": 0.24, "2": 0.10 }, 
          instincts: { SP: 0.08 } 
        } 
      },
      { 
        label: "Rally others to join in caring for the flames as a community.",
        keys: { 
          dimensions: { social_dominance: 0.18, cooperativeness: 0.16, empathy: 0.12 },
          types: { "3": 0.20, "2": 0.12 }, 
          instincts: { SO: 0.10 } 
        } 
      },
      { 
        label: "Research the ancient texts to understand why the flames are dimming.",
        keys: { 
          dimensions: { abstract_reasoning: 0.20, conscientiousness: 0.16, orderliness: 0.12 },
          types: { "5": 0.22, "1": 0.10 }, 
          instincts: { SP: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-012",
    center: "Head",
    location: "Crossroads of the Seven Paths",
    vignette: "Seven roads diverge here, each leading to different kingdoms with different opportunities and dangers.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Map each path thoroughly, weighing all options before choosing.",
        keys: { 
          dimensions: { abstract_reasoning: 0.22, orderliness: 0.18, conscientiousness: 0.14 },
          types: { "5": 0.26, "1": 0.08 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Consult with fellow travelers to learn from their experiences.",
        keys: { 
          dimensions: { cooperativeness: 0.20, empathy: 0.16, stability: 0.12 },
          types: { "6": 0.24, "2": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Follow your instincts and explore whichever path calls to you most.",
        keys: { 
          dimensions: { novelty_seeking: 0.24, adaptability: 0.18, risk_tolerance: 0.12 },
          types: { "7": 0.28, "4": 0.08 }, 
          instincts: { SX: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-013",
    center: "Body",
    location: "Temple of the Undivided Light",
    vignette: "The temple's light has shattered into fragments. Without unity, the spiritual center of Laurasia weakens.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Carefully reassemble each fragment in its proper place systematically.",
        keys: { 
          dimensions: { orderliness: 0.24, conscientiousness: 0.20, stability: 0.12 },
          types: { "1": 0.28, "5": 0.08 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Take decisive action to restore the light, accepting responsibility for the outcome.",
        keys: { 
          dimensions: { agency: 0.24, social_dominance: 0.18, risk_tolerance: 0.12 },
          types: { "8": 0.28, "3": 0.08 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Bring people together in meditation, allowing unity to emerge naturally.",
        keys: { 
          dimensions: { cooperativeness: 0.22, empathy: 0.18, stability: 0.14 },
          types: { "9": 0.28, "2": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-014",
    center: "Heart",
    location: "Market of Endless Exchange",
    vignette: "A trader offers you something precious in exchange for your most valued possession, claiming it will help your city.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Give generously, trusting in the interconnection of all things.",
        keys: { 
          dimensions: { cooperativeness: 0.22, empathy: 0.20, risk_tolerance: 0.10 },
          types: { "2": 0.26, "9": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Negotiate skillfully to achieve the best outcome for everyone.",
        keys: { 
          dimensions: { social_dominance: 0.22, abstract_reasoning: 0.16, agency: 0.14 },
          types: { "3": 0.26, "7": 0.08 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Hold onto what matters most, refusing to compromise your values.",
        keys: { 
          dimensions: { emotional_intensity: 0.20, authenticity: 0.18, stability: 0.14 },
          types: { "4": 0.24, "8": 0.10 }, 
          instincts: { SP: 0.08 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-015",
    center: "Head",
    location: "Hall of the First Covenant",
    vignette: "Ancient laws conflict with present needs. The covenant that founded Laurasia must be interpreted for a new age.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Research the original intent behind each law with scholarly precision.",
        keys: { 
          dimensions: { abstract_reasoning: 0.24, conscientiousness: 0.20, orderliness: 0.14 },
          types: { "5": 0.28, "1": 0.10 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Seek consensus among all stakeholders about how to proceed.",
        keys: { 
          dimensions: { cooperativeness: 0.22, stability: 0.18, empathy: 0.12 },
          types: { "6": 0.26, "9": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Advocate for creative interpretations that serve the spirit of justice.",
        keys: { 
          dimensions: { novelty_seeking: 0.22, adaptability: 0.18, imagination: 0.14 },
          types: { "7": 0.26, "4": 0.08 }, 
          instincts: { SX: 0.06 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-016",
    center: "Body",
    location: "Restored Rivers beneath the Commons",
    vignette: "The rivers are rising beyond their restored banks. Swift action is needed to prevent flooding of the lower districts.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Engineer proper channels and barriers with methodical planning.",
        keys: { 
          dimensions: { orderliness: 0.22, abstract_reasoning: 0.18, conscientiousness: 0.14 },
          types: { "1": 0.24, "5": 0.10 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Lead evacuation efforts and coordinate emergency response personally.",
        keys: { 
          dimensions: { agency: 0.24, social_dominance: 0.20, risk_tolerance: 0.12 },
          types: { "8": 0.28, "3": 0.08 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Unite the community in shared efforts to protect every neighborhood.",
        keys: { 
          dimensions: { cooperativeness: 0.24, empathy: 0.18, adaptability: 0.12 },
          types: { "9": 0.26, "2": 0.10 }, 
          instincts: { SO: 0.08 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-017",
    center: "Heart",
    location: "Moonlit Commons where paths converge",
    vignette: "Under the full moon, strangers gather with stories of loss and hope. The atmosphere is thick with unspoken longing.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Open your heart completely, creating space for everyone's pain and joy.",
        keys: { 
          dimensions: { empathy: 0.24, emotional_intensity: 0.20, cooperativeness: 0.12 },
          types: { "2": 0.28, "4": 0.10 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Organize the gathering into something meaningful and memorable for all.",
        keys: { 
          dimensions: { social_dominance: 0.22, orderliness: 0.16, agency: 0.14 },
          types: { "3": 0.26, "1": 0.08 }, 
          instincts: { SO: 0.06 } 
        } 
      },
      { 
        label: "Share your deepest truth, creating intimate connection through vulnerability.",
        keys: { 
          dimensions: { emotional_intensity: 0.24, empathy: 0.20, risk_tolerance: 0.12 },
          types: { "4": 0.28, "8": 0.08 }, 
          instincts: { SX: 0.10 } 
        } 
      }
    ]
  },
  {
    id: "L-FC-018",
    center: "Head",
    location: "Twilight Bridges of the Ancient Quarter",
    vignette: "The bridges are failing after centuries of use. Each connects essential districts, and losing any would divide the city.",
    format: "forced_choice_best_worst",
    options: [
      { 
        label: "Design comprehensive repairs that will last another thousand years.",
        keys: { 
          dimensions: { abstract_reasoning: 0.24, orderliness: 0.20, conscientiousness: 0.16 },
          types: { "5": 0.28, "1": 0.10 }, 
          instincts: { SP: 0.06 } 
        } 
      },
      { 
        label: "Build consensus on which bridges to prioritize and how to fund repairs.",
        keys: { 
          dimensions: { cooperativeness: 0.22, stability: 0.18, social_dominance: 0.12 },
          types: { "6": 0.26, "3": 0.08 }, 
          instincts: { SO: 0.08 } 
        } 
      },
      { 
        label: "Explore innovative solutions that reimagine how the districts connect.",
        keys: { 
          dimensions: { novelty_seeking: 0.26, imagination: 0.20, adaptability: 0.14 },
          types: { "7": 0.30, "4": 0.08 }, 
          instincts: { SX: 0.06 } 
        } 
      }
    ]
  }
];

export function getForcedChoiceItems(): ForcedChoiceItem[] {
  return FORCED_CHOICE_ITEMS;
}