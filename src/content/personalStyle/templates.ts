import { PersonalityContext } from './engine'
import { summarizeDims, getFamilyHeuristics } from './rules'

export const PARAGRAPH_ORDER = ["identity", "operating", "decisions", "collaboration", "stress", "growth"] as const

export type ParagraphType = typeof PARAGRAPH_ORDER[number]

export type FamilyTemplateFunction = (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => string

// Seeded random selection for consistent but varied content
function seededSelect<T>(items: T[], seed: number): T {
  const index = Math.abs(seed) % items.length
  return items[index]
}

function combineSeeds(...seeds: number[]): number {
  return seeds.reduce((acc, seed) => acc * 31 + seed, 1)
}

export const FAMILY_TEMPLATES: Record<number, FamilyTemplateFunction> = {
  1: createOrderSystemsTemplate(),
  2: createBelongingCareTemplate(),
  3: createAmbitionMasteryTemplate(), 
  4: createAuthenticityExpressionTemplate(),
  5: createInsightKnowledgeTemplate(),
  6: createSecurityLoyaltyTemplate(),
  7: createFreedomDiscoveryTemplate(),
  8: createSovereigntyProtectionTemplate(),
  9: createHarmonyIntegrationTemplate()
}

// Family 1: Order / Systems
function createOrderSystemsTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Approaches life with a clear sense of right and wrong, viewing themselves as someone who improves systems and upholds standards.",
      "Sees the world through a lens of potential improvement, naturally identifying inefficiencies and working toward better outcomes.",
      "Operates from a deep conviction that things can and should be better, taking personal responsibility for positive change.",
      "Views themselves as a principled contributor who creates order from chaos and maintains quality standards.",
      "Naturally gravitates toward situations where their systematic thinking and moral clarity can make a meaningful difference."
    ],
    operating: [
      "Organizes tasks and environments to support optimal outcomes, preferring clear structures and defined processes.",
      "Maintains consistent routines while remaining open to improvements that enhance effectiveness.",
      "Approaches daily responsibilities with methodical attention to detail and a focus on getting things right.",
      "Creates systems that anticipate problems and prevent errors before they occur.",
      "Balances perfectionistic tendencies with practical progress, knowing when good enough serves the greater good."
    ],
    decisions: [
      "Evaluates options against clear criteria and values, often taking time to ensure alignment with principles.",
      "Considers the long-term implications of choices, particularly how decisions affect quality and integrity.",
      "Seeks input from trusted sources while maintaining final accountability for outcomes.",
      "Weighs competing priorities by assessing which choice best serves improvement and effectiveness.",
      "Makes decisions through systematic analysis combined with intuitive sense of rightness."
    ],
    collaboration: [
      "Contributes to teams by raising standards and identifying opportunities for improvement.",
      "Offers clear, constructive feedback focused on enhancing collective outcomes.",
      "Takes responsibility for ensuring group processes support quality results.",
      "Maintains diplomatic approach while addressing issues that compromise effectiveness.",
      "Builds trust through consistent reliability and commitment to shared excellence."
    ],
    stress: [
      "May become overly critical or rigid when overwhelmed by imperfection or inefficiency.",
      "Tends to over-focus on details or take on excessive responsibility during high-pressure situations.",
      "Recovers through stepping back to gain perspective and reconnecting with core values and purpose.",
      "Benefits from reminding themselves that progress matters more than perfection.",
      "Restores balance by engaging in activities that provide clarity and renewed motivation."
    ],
    growth: [
      "Develops by learning to channel perfectionist energy toward sustainable improvement rather than endless refinement.",
      "Grows through practicing acceptance of imperfection while maintaining commitment to quality.",
      "Expands capacity by developing patience with others' different approaches to excellence.",
      "Evolves by integrating spontaneity and flexibility into their systematic approach.",
      "Matures through recognizing that meaningful change often requires working with imperfect situations."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 2: Belonging / Care  
function createBelongingCareTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Naturally attunes to others' needs and emotions, seeing themselves as someone who creates connection and provides support.",
      "Views relationships as central to life meaning, taking genuine pleasure in helping others thrive.",
      "Operates from an intuitive understanding of human dynamics and a desire to foster belonging.",
      "Sees themselves as a bridge-builder who helps people feel valued and understood.",
      "Approaches life with warmth and generosity, naturally creating environments where others feel welcome."
    ],
    operating: [
      "Organizes daily life around maintaining relationships and being available to those who matter.",
      "Balances personal needs with responsiveness to others, often prioritizing connection over efficiency.", 
      "Approaches tasks through the lens of how they affect relationships and community well-being.",
      "Creates supportive environments that encourage open communication and mutual care.",
      "Maintains awareness of group emotional climate and adjusts approach to promote harmony."
    ],
    decisions: [
      "Considers how choices will impact relationships and the well-being of loved ones.",
      "Seeks consensus and input from others, valuing collaborative decision-making processes.",
      "Weighs options based on both practical outcomes and relational consequences.",
      "Makes choices that demonstrate care while respecting others' autonomy and dignity.",
      "Balances personal desires with commitment to supporting those they care about."
    ],
    collaboration: [
      "Contributes to teams by fostering inclusive environments and attending to interpersonal dynamics.",
      "Offers encouragement and support to help teammates perform at their best.",
      "Facilitates communication and helps resolve conflicts through empathetic mediation.",
      "Takes initiative to ensure all voices are heard and valued in group processes.",
      "Builds team cohesion through genuine appreciation and thoughtful attention to individuals."
    ],
    stress: [
      "May neglect personal needs or become overly involved in others' problems during stressful periods.",
      "Tends to internalize relationship conflicts or blame themselves for others' difficulties.", 
      "Recovers by setting loving boundaries and engaging in self-care practices that restore energy.",
      "Benefits from remembering that caring for themselves enables better care for others.",
      "Restores balance through activities that provide emotional nourishment and connection."
    ],
    growth: [
      "Develops by learning to balance generous giving with healthy receiving and personal boundaries.",
      "Grows through practicing direct communication of their own needs and preferences.",
      "Expands capacity by developing confidence in their intrinsic worth beyond helpfulness to others.",
      "Evolves by integrating assertiveness with their natural empathy and care.",
      "Matures through recognizing that authentic relationships require mutual vulnerability and support."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 3: Ambition / Mastery
function createAmbitionMasteryTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Focuses on achieving goals and creating successful outcomes, seeing themselves as capable and results-oriented.",
      "Views life through the lens of accomplishment and progress, naturally setting and pursuing meaningful objectives.",
      "Operates with energy and drive toward mastery, taking pride in competent performance and tangible achievements.",
      "Sees themselves as someone who turns vision into reality through focused effort and strategic thinking.",
      "Approaches challenges with confidence and adaptability, finding motivation in opportunities to excel."
    ],
    operating: [
      "Organizes time and energy around priority goals, maintaining focus on activities that drive meaningful progress.",
      "Balances multiple projects and commitments through efficient systems and strategic prioritization.",
      "Approaches daily tasks with purpose and momentum, seeking ways to optimize performance and outcomes.",
      "Maintains awareness of progress indicators and adjusts strategies based on results and feedback.",
      "Creates productive environments that support sustained effort toward important objectives."
    ],
    decisions: [
      "Evaluates options based on potential for success and alignment with strategic goals.",
      "Considers both short-term effectiveness and long-term positioning when making choices.",
      "Seeks information and advice that enhance decision quality while maintaining ownership of outcomes.",
      "Weighs risks and benefits with focus on maximizing positive impact and avoiding significant setbacks.",
      "Makes decisions efficiently while ensuring adequate analysis of key factors and alternatives."
    ],
    collaboration: [
      "Contributes to teams by driving results and maintaining focus on shared objectives.",
      "Offers strategic thinking and practical solutions that move projects forward effectively.",
      "Takes leadership when needed while supporting others in achieving their best performance.",
      "Maintains team morale through celebrating progress and recognizing individual contributions.",
      "Builds productive partnerships by aligning individual strengths with collective goals."
    ],
    stress: [
      "May become overly competitive or impatient when progress feels blocked or insufficient.",
      "Tends to over-work or neglect personal relationships during high-pressure achievement periods.",
      "Recovers by reconnecting with intrinsic motivation and the deeper purpose behind goals.",
      "Benefits from balancing achievement drive with attention to process and relationships.",
      "Restores equilibrium through activities that provide fulfillment beyond external validation."
    ],
    growth: [
      "Develops by integrating authentic self-expression with achievement orientation.",
      "Grows through practicing vulnerability and connecting with others beyond performance contexts.",
      "Expands capacity by learning to value process and relationships alongside outcomes.",
      "Evolves by developing patience with different paces of progress and styles of contribution.",
      "Matures through recognizing that sustainable success includes attention to well-being and meaning."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 4: Authenticity / Expression
function createAuthenticityExpressionTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Seeks authentic self-expression and meaningful connection, valuing depth and individuality above conformity.",
      "Views life as an opportunity for creative and emotional exploration, naturally drawn to what feels genuine and significant.",
      "Operates from a desire to understand and express their unique perspective, finding meaning through personal truth.",
      "Sees themselves as someone who brings depth and authenticity to relationships and creative endeavors.",
      "Approaches life with emotional honesty and creative curiosity, naturally exploring the richness of human experience."
    ],
    operating: [
      "Organizes life around activities and relationships that provide meaning and creative fulfillment.",
      "Balances spontaneous inspiration with disciplined development of ideas and projects.",
      "Approaches daily experiences with openness to emotional depth and creative possibility.",
      "Maintains environments that support both solitary reflection and meaningful connection with others.",
      "Creates space for processing emotions and insights that emerge from life experiences."
    ],
    decisions: [
      "Evaluates choices based on alignment with personal values and potential for authentic expression.",
      "Considers the emotional and creative implications of options, seeking decisions that feel meaningful.",
      "Weighs practical considerations alongside intuitive sense of rightness and personal significance.",
      "Seeks input from trusted sources while maintaining connection to inner wisdom and authentic preferences.",
      "Makes decisions that honor both emotional truth and practical wisdom."
    ],
    collaboration: [
      "Contributes to teams by bringing creative insights and authentic perspective to group endeavors.",
      "Offers empathetic support and encourages others to express their genuine thoughts and feelings.",
      "Facilitates deeper conversations and helps groups move beyond surface-level interactions.",
      "Takes initiative to ensure that diverse perspectives and emotional realities are acknowledged.",
      "Builds meaningful partnerships through vulnerability, creativity, and mutual understanding."
    ],
    stress: [
      "May become overly intense or withdrawn when feeling misunderstood or emotionally overwhelmed.",
      "Tends to ruminate on negative emotions or compare themselves unfavorably to others during difficult periods.",
      "Recovers through creative expression and connecting with sources of beauty and meaning.",
      "Benefits from balancing emotional processing with positive action and connection.",
      "Restores balance through activities that provide creative outlet and emotional resonance."
    ],
    growth: [
      "Develops by learning to share their gifts consistently rather than waiting for perfect conditions.",
      "Grows through practicing emotional regulation while maintaining authentic self-expression.",
      "Expands capacity by developing appreciation for ordinary moments alongside extraordinary ones.",
      "Evolves by integrating stable routine with creative spontaneity and emotional depth.",
      "Matures through recognizing their unique contribution while remaining connected to others."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 5: Insight / Knowledge
function createInsightKnowledgeTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Seeks deep understanding and competent mastery, viewing themselves as someone who thinks independently and sees patterns others miss.",
      "Views life through a lens of intellectual curiosity and systematic investigation, naturally drawn to complex ideas and frameworks.",
      "Operates from a desire to understand how things work, finding satisfaction in developing expertise and insight.",
      "Sees themselves as a thoughtful observer who contributes through careful analysis and innovative thinking.",
      "Approaches challenges with intellectual rigor and creative problem-solving, preferring to understand rather than simply react."
    ],
    operating: [
      "Organizes time and mental energy around deep focus and systematic exploration of interests.",
      "Balances solitary thinking with selective sharing of insights and collaborative problem-solving.",
      "Approaches daily tasks through conceptual frameworks that enhance understanding and efficiency.",
      "Maintains environments that support concentration and minimize unnecessary interruptions.",
      "Creates systems for processing information and developing ideas over time."
    ],
    decisions: [
      "Evaluates options through systematic analysis and consideration of multiple perspectives and implications.",
      "Takes time to research and understand situations thoroughly before committing to significant choices.",
      "Weighs evidence and logic while remaining open to intuitive insights and creative alternatives.",
      "Seeks input from knowledgeable sources while maintaining independence of thought and analysis.",
      "Makes decisions based on competent understanding rather than external pressure or emotional urgency."
    ],
    collaboration: [
      "Contributes to teams by providing analytical insight, strategic thinking, and innovative solutions.",
      "Offers well-researched perspectives and helps groups think through complex problems systematically.",
      "Takes initiative to understand root causes and systemic factors that affect group outcomes.",
      "Maintains objectivity while supporting team goals through competent and reliable contribution.",
      "Builds partnerships through intellectual honesty, competence, and respect for others' expertise."
    ],
    stress: [
      "May become overly withdrawn or intellectually rigid when feeling overwhelmed or incompetent.",
      "Tends to over-think decisions or procrastinate when facing situations that require immediate action.",
      "Recovers through solitary reflection and re-engaging with activities that restore sense of competence.",
      "Benefits from balancing intellectual processing with practical action and social connection.",
      "Restores equilibrium through learning, creating, or engaging deeply with meaningful ideas."
    ],
    growth: [
      "Develops by learning to share insights and expertise in ways that benefit others and create positive impact.",
      "Grows through practicing engagement with the practical world while maintaining intellectual depth.",
      "Expands capacity by developing comfort with collaboration and interdependence.",
      "Evolves by integrating emotional intelligence with intellectual competence.",
      "Matures through recognizing that wisdom includes both understanding and compassionate action."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 6: Security / Loyalty  
function createSecurityLoyaltyTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Approaches life with careful attention to potential risks and commitment to trusted relationships and values.",
      "Views themselves as reliable and responsible, naturally focusing on creating security for themselves and others.",
      "Operates from a foundation of loyalty and practical wisdom, taking seriously their commitments and obligations.",
      "Sees themselves as someone who builds stable foundations and provides dependable support in uncertain times.",
      "Approaches challenges with thorough preparation and collaborative problem-solving, valuing both caution and courage."
    ],
    operating: [
      "Organizes life around maintaining security and fulfilling responsibilities to important people and commitments.",
      "Balances careful planning with flexibility to respond to changing circumstances and new information.",
      "Approaches daily tasks with attention to potential problems and systematic preparation for various outcomes.",
      "Maintains environments that feel safe and predictable while remaining adaptable to necessary changes.",
      "Creates systems for managing responsibilities and maintaining connection with trusted relationships."
    ],
    decisions: [
      "Evaluates options carefully, considering potential risks and seeking input from trusted sources.",
      "Takes time to think through implications and gather information before making important choices.",
      "Weighs security considerations alongside growth opportunities, seeking balanced approaches to risk.",
      "Seeks advice from reliable sources while developing confidence in their own judgment and wisdom.",
      "Makes decisions that balance prudent caution with necessary action and reasonable risk-taking."
    ],
    collaboration: [
      "Contributes to teams by providing reliable support, practical thinking, and loyal commitment to shared goals.",
      "Offers careful analysis of potential challenges and helps groups prepare for various contingencies.",
      "Takes responsibility for ensuring team processes are reliable and that important details are addressed.",
      "Maintains team cohesion through consistent support and commitment to collective success.",
      "Builds partnerships through trustworthiness, practical competence, and mutual loyalty."
    ],
    stress: [
      "May become anxious or overly cautious when facing significant uncertainty or conflicting pressures.",
      "Tends to seek excessive reassurance or become paralyzed by analysis during high-stress situations.",
      "Recovers through reconnecting with trusted relationships and engaging in grounding activities.",
      "Benefits from balancing caution with courage and seeking support from reliable sources.",
      "Restores balance through activities that provide security and reaffirm their competence and value."
    ],
    growth: [
      "Develops by building confidence in their ability to handle uncertainty and navigate challenges independently.",
      "Grows through practicing courage in situations that stretch their comfort zone appropriately.",
      "Expands capacity by learning to trust their intuition alongside careful analysis.",
      "Evolves by integrating self-reliance with healthy interdependence and collaborative strength.",
      "Matures through recognizing their own wisdom and ability to provide guidance and stability for others."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 7: Freedom / Discovery
function createFreedomDiscoveryTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Naturally explores possibilities and maintains optimistic engagement with life's opportunities and adventures.",
      "Views the world as rich with potential experiences, seeing themselves as someone who creates joy and discovers new possibilities.",
      "Operates with enthusiasm and curiosity, finding energy through variety, learning, and creative exploration.",
      "Sees themselves as an innovative contributor who brings fresh perspectives and positive energy to situations.",
      "Approaches life with spontaneity and intellectual agility, naturally generating options and maintaining forward momentum."
    ],
    operating: [
      "Organizes life to maintain variety and flexibility while ensuring important commitments are fulfilled.",
      "Balances multiple interests and projects, often working on several things simultaneously for stimulation.",
      "Approaches daily tasks with creative energy, seeking ways to make routine activities more interesting.",
      "Maintains environments that support both focused work and spontaneous exploration of new ideas.",
      "Creates systems that provide structure without limiting freedom to pursue emerging opportunities."
    ],
    decisions: [
      "Evaluates options by considering potential for growth, learning, and positive outcomes.",
      "Seeks to keep multiple possibilities open while making timely decisions that move things forward.",
      "Weighs practical considerations alongside excitement and intuitive sense of potential value.",
      "Gathers information efficiently while avoiding analysis paralysis that might limit opportunity.",
      "Makes decisions that balance commitment with flexibility to adapt as new information emerges."
    ],
    collaboration: [
      "Contributes to teams by generating creative ideas, maintaining positive energy, and facilitating innovative solutions.",
      "Offers fresh perspectives and helps groups see possibilities they might otherwise miss.",
      "Takes initiative to keep projects moving forward and maintains team morale through optimism and enthusiasm.",
      "Facilitates brainstorming and helps teams think outside conventional boundaries.",
      "Builds partnerships through shared exploration, mutual learning, and collaborative creativity."
    ],
    stress: [
      "May become scattered or restless when feeling trapped or limited in options and freedom.",
      "Tends to avoid negative emotions or over-commit to activities as a way of maintaining positive energy.",
      "Recovers through engaging with new experiences and reconnecting with sources of inspiration and joy.",
      "Benefits from balancing stimulation with reflection and addressing underlying concerns directly.",
      "Restores equilibrium through activities that provide both novelty and deeper meaning."
    ],
    growth: [
      "Develops by learning to channel enthusiasm into sustained focus on meaningful projects and commitments.",
      "Grows through practicing completion and developing patience with necessary routine and follow-through.",
      "Expands capacity by integrating emotional depth with natural optimism and forward-looking orientation.",
      "Evolves by developing appreciation for limitation and constraint as sources of creative focus.",
      "Matures through recognizing that true freedom includes the ability to commit deeply and see things through."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 8: Sovereignty / Protection
function createSovereigntyProtectionTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Approaches life with natural authority and strength, viewing themselves as someone who protects and empowers others.",
      "Sees the world through a lens of justice and impact, naturally taking charge when leadership is needed.",
      "Operates with directness and intensity, finding meaning through making significant positive impact.",
      "Views themselves as a powerful advocate who stands up for what matters and creates meaningful change.",
      "Approaches challenges with courage and determination, naturally rising to meet difficult situations head-on."
    ],
    operating: [
      "Organizes life around making meaningful impact while maintaining personal autonomy and strength.",
      "Balances decisive action with strategic thinking, often taking charge when situations require leadership.",
      "Approaches daily responsibilities with energy and focus, seeking to accomplish important objectives efficiently.",
      "Maintains environments that support both individual effectiveness and collaborative achievement.",
      "Creates systems that enhance both personal power and the empowerment of others."
    ],
    decisions: [
      "Evaluates options based on potential for positive impact and alignment with core values and principles.",
      "Makes decisions quickly when action is needed while ensuring adequate consideration of important factors.",
      "Weighs practical outcomes alongside justice considerations and effects on people they care about.",
      "Seeks input from trusted sources while maintaining final authority over important choices.",
      "Makes choices that demonstrate strength and integrity while considering long-term consequences."
    ],
    collaboration: [
      "Contributes to teams by providing strong leadership, clear direction, and protection of team interests.",
      "Offers decisive action and practical solutions when groups face challenges or difficult decisions.",
      "Takes initiative to ensure fairness and advocate for team members and organizational values.",
      "Maintains team focus and energy through direct communication and commitment to shared success.",
      "Builds partnerships through mutual respect, honest feedback, and collaborative pursuit of meaningful goals."
    ],
    stress: [
      "May become controlling or confrontational when feeling powerless or when important values are threatened.",
      "Tends to take on excessive responsibility or become impatient with others' slower pace during pressure situations.",
      "Recovers through engaging in activities that restore sense of personal power and meaningful impact.",
      "Benefits from balancing intensity with relaxation and connecting with sources of personal renewal.",
      "Restores equilibrium through physical activity, time in nature, or engaging with trusted relationships."
    ],
    growth: [
      "Develops by learning to exercise power with restraint and to influence through inspiration rather than domination.",
      "Grows through practicing vulnerability and interdependence while maintaining personal strength.",
      "Expands capacity by developing patience with others' different styles and paces of contribution.",
      "Evolves by integrating gentleness with strength and developing emotional intelligence alongside power.",
      "Matures through recognizing that true leadership serves others' growth and empowerment."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Family 9: Harmony / Integration
function createHarmonyIntegrationTemplate(): FamilyTemplateFunction {
  const templates = {
    identity: [
      "Naturally seeks harmony and understanding, viewing themselves as someone who brings peace and facilitates connection.",
      "Sees life through a lens of interconnection and wholeness, finding meaning through creating unity from diversity.",
      "Operates from a desire for balance and mutual understanding, naturally mediating conflicts and building bridges.",
      "Views themselves as a stabilizing presence who helps others feel comfortable and included.",
      "Approaches life with patience and acceptance, naturally creating environments where everyone can contribute authentically."
    ],
    operating: [
      "Organizes daily life around maintaining harmony while ensuring important responsibilities are fulfilled.",
      "Balances multiple perspectives and priorities, often serving as a stabilizing influence in complex situations.",
      "Approaches tasks with steady consistency, preferring sustainable paces that support long-term effectiveness.",
      "Maintains environments that feel peaceful and inclusive while remaining productive and goal-oriented.",
      "Creates systems that support both individual well-being and collective harmony."
    ],
    decisions: [
      "Evaluates options by considering multiple perspectives and seeking choices that benefit everyone involved.",
      "Takes time to understand all sides of complex situations before making decisions that affect others.",
      "Weighs harmony considerations alongside practical outcomes, seeking win-win solutions when possible.",
      "Seeks input from various sources while developing confidence in their own synthesis and wisdom.",
      "Makes decisions that promote long-term stability and mutual benefit rather than short-term advantage."
    ],
    collaboration: [
      "Contributes to teams by facilitating communication, mediating conflicts, and ensuring inclusive participation.",
      "Offers patient listening and helps groups find common ground among diverse perspectives and interests.",
      "Takes initiative to ensure all voices are heard and that team processes support both efficiency and harmony.",
      "Maintains team stability through consistent support and diplomatic resolution of interpersonal tensions.",
      "Builds partnerships through genuine understanding, patient collaboration, and commitment to mutual success."
    ],
    stress: [
      "May become passive or avoidant when facing significant conflict or pressure to take decisive action.",
      "Tends to merge with others' agendas or lose touch with personal priorities during overwhelming situations.",
      "Recovers through solitude, time in nature, and reconnecting with personal values and preferences.",
      "Benefits from balancing accommodation with assertion and seeking support for taking necessary action.",
      "Restores balance through activities that provide peace, comfort, and connection to inner wisdom."
    ],
    growth: [
      "Develops by learning to assert personal priorities and take initiative while maintaining collaborative spirit.",
      "Grows through practicing decisive action when situations require leadership and clear direction.",
      "Expands capacity by developing comfort with necessary conflict and healthy disagreement.",
      "Evolves by integrating personal agency with natural ability to facilitate harmony and understanding.",
      "Matures through recognizing their unique contribution and the power of their mediating presence."
    ]
  }

  return (context: PersonalityContext, paragraphType: ParagraphType, seed: number) => {
    const baseSeed = combineSeeds(seed, context.chapter, context.wing_bin)
    const template = seededSelect(templates[paragraphType], baseSeed)
    return addPersonalization(template, context, paragraphType)
  }
}

// Helper function to add personalization based on context
function addPersonalization(template: string, context: PersonalityContext, paragraphType: ParagraphType): string {
  const { dimensions, wing_bin, development_bin, dominant_instinct } = context
  const dimSummary = summarizeDims(dimensions)
  const heuristics = getFamilyHeuristics(context.family_number, dimensions)

  let personalized = template

  // Add dimension-specific adjustments
  if (dimSummary.highs.length > 0 && paragraphType === 'operating') {
    const topDim = dimSummary.highs[0]
    if (topDim.dimension === 'risk_tolerance' && topDim.value > 0.7) {
      personalized += " Takes calculated risks and adapts quickly when circumstances change."
    } else if (topDim.dimension === 'empathy' && topDim.value > 0.7) {
      personalized += " Naturally attunes to others' emotional states and adjusts approach accordingly."
    } else if (topDim.dimension === 'orderliness' && topDim.value > 0.7) {
      personalized += " Creates structured approaches that enhance both efficiency and quality."
    }
  }

  // Add wing-based micro-adjustments (subtle lean)
  if (wing_bin <= 2) {
    // Left-leaning wing
    personalized = personalized.replace(/approaches/g, 'carefully approaches')
  } else if (wing_bin >= 6) {
    // Right-leaning wing  
    personalized = personalized.replace(/maintains/g, 'actively maintains')
  }

  // Add development-based language adjustments
  if (development_bin >= 3 && paragraphType === 'growth') {
    personalized = personalized.replace(/develops by/g, 'continues developing by')
    personalized = personalized.replace(/grows through/g, 'deepens growth through')
  } else if (development_bin <= 1 && paragraphType === 'stress') {
    personalized = personalized.replace(/may become/g, 'sometimes becomes')
  }

  // Add instinct-specific behavioral notes
  if (paragraphType === 'operating') {
    if (dominant_instinct === 'SP') {
      personalized += " Prioritizes sustainable pacing and resource management."
    } else if (dominant_instinct === 'SO') {
      personalized += " Maintains awareness of group dynamics and social context."
    } else if (dominant_instinct === 'SX') {
      personalized += " Focuses intensely on meaningful connections and compelling projects."
    }
  }

  // Add family-specific heuristics where relevant
  if (heuristics.leadership && paragraphType === 'collaboration') {
    personalized += ` ${heuristics.leadership.charAt(0).toUpperCase() + heuristics.leadership.slice(1)}.`
  } else if (heuristics.growth && paragraphType === 'growth') {
    personalized += ` ${heuristics.growth.charAt(0).toUpperCase() + heuristics.growth.slice(1)}.`
  }

  return personalized
}

export const MUTATIONS = {
  wingBin: (wingBin: number) => {
    if (wingBin <= 2) {
      return {
        'approaches': 'carefully approaches',
        'considers': 'thoroughly considers',
        'maintains': 'steadily maintains'
      }
    } else if (wingBin >= 6) {
      return {
        'approaches': 'dynamically approaches', 
        'considers': 'quickly considers',
        'maintains': 'actively maintains'
      }
    }
    return {}
  },
  
  devBin: (devBin: number) => {
    if (devBin >= 3) {
      return {
        'develops': 'continues developing',
        'grows': 'deepens growth',
        'learns': 'continues learning',
        'may become': 'occasionally becomes'
      }
    } else if (devBin <= 1) {
      return {
        'naturally': 'often',
        'tends to': 'sometimes',
        'may become': 'can become'
      }
    }
    return {}
  },

  instincts: (dominant: 'SP'|'SO'|'SX') => {
    switch (dominant) {
      case 'SP':
        return {
          'focuses': 'sustainably focuses',
          'approaches': 'resourcefully approaches',
          'maintains': 'carefully maintains'
        }
      case 'SO':
        return {
          'focuses': 'collectively focuses',
          'approaches': 'socially approaches', 
          'maintains': 'relationally maintains'
        }
      case 'SX':
        return {
          'focuses': 'intensely focuses',
          'approaches': 'passionately approaches',
          'maintains': 'dynamically maintains'
        }
      default:
        return {}
    }
  }
}