#!/usr/bin/env python3
"""
Enhance Chapter 22 - The Treasury of Infinite Choices with comprehensive Sudowrite metadata
Learning Books: The Intelligent Investor (Benjamin Graham), Rich Dad Poor Dad (Robert Kiyosaki), The Psychology of Money (Morgan Housel)
"""

import json
import sys

# Read the outline file
with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json', 'r') as f:
    outline = json.load(f)

# Navigate to Chapter 22 (task_master_2, major_task_group_3, specific_task_group_3)
try:
    chapter_22 = outline['SelfImprovementSeries']['Books']['trilogies']['1st_trilogy']['trilogy_books']['Book1']['task_masters']['task_master_2']['major_task_groups']['major_task_group_3']['Specific_task_groups']['specific_task_group_3']
except KeyError as e:
    print(f"Error navigating to Chapter 22: {e}")
    sys.exit(1)

# Scene 1: The Master Treasurer's Welcome
scene_1 = chapter_22['scenes'][0]
scene_1['save_the_cat_beat'] = "The Reward - Building Resources for the Long Game"
scene_1['hero_journey_stage'] = "The Reward - Strategic Investment of Resources"
scene_1['preliminary_scene_focus'] = "Introducing the concept that cosmic guardianship requires practical resource management skills"
scene_1['preliminary_scene_description'] = "Francisco and Zara are escorted through unseen Academy corridors to the Treasury of Infinite Resources. They meet Master Treasurer Apollodorus, whose presence radiates wisdom about cosmic force management. The Treasury displays show the flow of resources across multiple realities. Apollodorus teaches them that commitment without strategic thinking results in noble failure."

scene_1['sudowrite_pov_guidance'] = """Third Person Limited anchored in Francisco's consciousness, though with subtle moments acknowledging Zara's parallel experience. Show Francisco's first impression of the Treasury as overwhelming: his scholar's mind struggling to categorize the floating displays, his eyes tracking resource flows across multiple realities simultaneously. When Apollodorus speaks, render Francisco's internal response: the immediate resistance (we already committed, why more learning?), followed by uncomfortable recognition that the master is right. Include moments of Francisco observing Zara's reactions—her practical warrior's mind already grasping implications he's still wrestling with intellectually. Show his hands touching crystalline displays, the data flowing through him not just intellectually but almost physically. End with Francisco beginning to understand: power without strategy is merely potential energy, waiting to dissipate."""

scene_1['sudowrite_tone_guidance'] = """Instructional but never pedantic. The tone should balance the grandeur of the Treasury setting with the practical seriousness of resource management. Apollodorus should feel like a wise mentor who has seen civilizations rise and fall based on resource decisions—his words carry weight without being ponderous. Include moments of wonder (the Treasury truly is breathtaking) balanced with moments of humbling reality (yes, we committed, but we're not prepared). The overall tone should shift from initial awe to thoughtful recognition of responsibility. Avoid making economics sound dry; frame it as the art of channeling power toward worthy ends versus letting it dissipate."""

scene_1['sudowrite_pacing_guidance'] = """Begin with measured, deliberate pacing as Francisco and Zara are led through Academy corridors—allow space to absorb that they're entering a place they've never seen, a realm of knowledge they didn't know existed. When they enter the Treasury, slightly accelerate the pacing as they take in the scale and complexity of the displays. Apollodorus's greeting should come at measured pace, with space between sentences for absorption. The revelation about civilizations (shown through the displays) should move through multiple examples at varying speeds: quick flashes of falling civilizations, extended focus on one that persevered. End the scene with slightly slower pacing as the weight of his words settles into understanding."""

scene_1['sudowrite_sensory_focus'] = """Emphasize the crystalline nature of the Treasury—floating displays with prismatic light refraction, the way light bends through crystal showing multiple realities simultaneously. The sensory experience of touching the displays should be central: tingling fingers as data flows through Francisco, the sensation of seeing resource flows not just visually but almost tactilely. Include Apollodorus's presence as a sensory element—the atmosphere shifts when he speaks, the air feels weighted with accumulated wisdom. Show the contrast between the beautiful displays and the sobering content they show (fallen civilizations, wasted resources). Include the subtle sound of the Treasury: not silence but the faint hum of cosmic forces in motion, the crystalline chiming of data flows."""

scene_1['sudowrite_character_moments'] = [
    "Francisco's first glimpse of the Treasury: awestruck, his scholar's mind simultaneously cataloging and overwhelmed by the scale of information available",
    "The moment Apollodorus reveals that commitment without strategy is noble failure: Francisco's internal resistance met by immediate recognition that the master is right",
    "Francisco witnessing a civilization's collapse through the displays: experiencing the reality of wasted resources and failed leadership, the emotional impact of historical failure",
    "Apollodorus's eyes as he watches Francisco absorb the lesson: recognition and compassion, knowing this weight must be carried by the new generation",
    "Francisco observing Zara's reaction to the displays: her warrior's mind grasping strategic implications faster than his scholarly approach",
    "The moment Francisco fully understands that power without strategy is merely potential energy: the intellectual shift from 'we have power' to 'we must use power wisely'",
    "Francisco's questions to Apollodorus: moving from philosophical resistance to genuine curiosity about how strategic thinking applies to cosmic guardianship",
    "Zara and Francisco's silent exchange: both recognizing they've entered a new phase of their learning, one equally demanding as their trials",
    "Final moment: Francisco's hand touching a display of a civilization that thrived through wise investment: understanding this is the model they must follow"
]

scene_1['learning_objective_integration'] = """Graham's 'Intelligent Investor' teaches that disciplined, long-term investment with margin of safety creates sustainable wealth. Francisco recognizes in the Treasury's displays that civilizations with deliberate strategies and resource discipline persevered, while those pursuing immediate power dissipated. Kiyosaki's 'Rich Dad Poor Dad' framework distinguishes assets (income-producing) from liabilities (capital-draining), and Francisco must learn to categorize his magical knowledge and abilities the same way. Housel's 'Psychology of Money' reminds them that strategy must account for human nature: Apollodorus's teaching incorporates the emotional discipline needed for long-term thinking over short-term temptation."""

scene_1['sudowrite_target_length'] = "950-1150 words"
scene_1['sudowrite_key_challenge'] = "Make economics and resource management feel epic and crucial without becoming dry or abstract. Show the Treasury as genuinely awe-inspiring while keeping the underlying tone serious. Help readers understand why strategic thinking matters as much as power itself."
scene_1['chapter_scene_focus'] = "Ch22S1: Strategic Investment Foundation"
scene_1['foreshadowing_elements'] = [
    "The displayed civilizations that persevered through strategic thinking foreshadow the complex civilizations and cosmic systems Francisco and Zara will need to build",
    "Apollodorus's introduction as a mentor figure suggests his ongoing role as resource management advisor throughout the series",
    "The emphasis on investment vs. hoarding sets up key choices Francisco and Zara will face in later chapters",
    "The reference to assets generating compounding returns previews the exponential impact of their choices over time",
    "The Treasury itself may become a resource they need to access or defend in future conflicts"
]
scene_1['narrative_function'] = """Transition from perseverance-focused reward to practical stewardship focus. Introduce resource management as crucial dimension of cosmic leadership equal to power and commitment. Begin the shift from idealistic heroism to pragmatic strategic thinking. Emotionally, move from understanding why (perseverance) to understanding how (strategy)."""
scene_1['series_connection_resonance'] = """Apollodorus's mentorship becomes foundational for multi-book strategy decisions. The principle of wise investment over accumulation guides major choices throughout the series. The displayed civilizations create context for understanding why certain approaches work and others fail, providing framework for evaluating strategic options across multiple books."""

# Scene 2: The Investment Simulation
scene_2 = chapter_22['scenes'][1]
scene_2['save_the_cat_beat'] = "The Reward - Building Resources for the Long Game"
scene_2['hero_journey_stage'] = "The Reward - Strategic Investment of Resources"
scene_2['preliminary_scene_focus'] = "Learning through practice that good intentions must be backed by strategic thinking and resource allocation"
scene_2['preliminary_scene_description'] = "In the Investment Simulation Chambers, Francisco and Zara face realistic scenarios: saving immediate victims versus building infrastructure, accepting power through compromises, spending dramatically versus strengthening systems. The chamber shows long-term consequences through accelerated time. Francisco gravitates toward hoarding knowledge while Zara wants to spend everything immediately on visible protection. Both learn wisdom lies in strategic allocation maximizing impact."

scene_2['sudowrite_pov_guidance'] = """Third Person Limited anchored primarily in Zara's consciousness, showing her decision-making process and frustration with abstract scenarios. Render the weight of her choices viscerally: when Apollodorus presents the scenario of ten thousand people now versus one hundred thousand over a century, show Zara's heart pulling toward immediate action—she can see the people who will die if she chooses the long-term investment. Include her warrior's instinct to solve visible problems immediately versus Apollodorus's patient guidance toward exponential thinking. Show her hands making choices in the simulation, then watching through accelerated time-displays as her decisions unfold. Include moments where she realizes her immediate-response choices prevented visible suffering but allowed hidden suffering later. Show the psychological difficulty of choosing invisible prevention over visible salvation. Meanwhile, subtly show Francisco's parallel struggle: hoarding knowledge 'for future use' versus accepting that shared knowledge multiplies impact."""

scene_2['sudowrite_tone_guidance'] = """Challenging and educational, with growing respect for the difficulty of strategic thinking. Begin with frustration—Zara wants simple answers and immediate victories, but the scenarios offer no 'right' choices, only trade-offs. The tone should convey that strategic thinking is harder psychologically than dramatic action. Include moments of Apollodorus's patient wisdom—he's not criticizing their initial instincts but showing them why those instincts must be tempered with thinking. The tone should shift from resistance to grudging recognition to genuine appreciation for the complexity. By the end, achieve a tone of intellectual humility: understanding that resource management is an art requiring judgment, not science offering certainty."""

scene_2['sudowrite_pacing_guidance'] = """Use pacing to reflect the escalating complexity of scenarios. Begin with relatively simple scenario (immediate people versus infrastructure), move through several scenarios of increasing complexity. For each scenario, establish the choice quickly, then extend time showing the consequences through accelerated-time displays. The pace should quicken slightly as Zara recognizes patterns in her own decision-making: her bias toward immediate action, Francisco's toward accumulation. Toward the scene's end, slow pacing slightly as both integrate the lessons and begin to see resource allocation as an ongoing practice rather than a single decision."""

scene_2['sudowrite_sensory_focus'] = """Emphasize the simulation chambers' ability to make theoretical choices feel visceral. When considering the ten thousand people now: show Zara feeling the weight of their individual faces, the emotional reality of those specific people. When the accelerated time-display shows consequences a century ahead: render the sensory experience of watching civilizations unfold at fast-forward speed, populations rising and falling, problems emerging and resolving. Include the sensation of Zara's hands making choices (perhaps through magical gestures or crystalline interfaces), the physical feedback of decisions being made. Show the temperature in the chamber shifting with different scenarios, the light changing to reflect prosperity or decline. End with sensory grounding as both return to normal time and breathe normally again."""

scene_2['sudowrite_character_moments'] = [
    "Zara's first scenario: the immediate pull of ten thousand faces needing saving now, her warrior's instinct screaming to choose immediate action",
    "Francisco's first scenario: his resistance to sharing knowledge revealed, his fear that invested-knowledge will be misused or lost",
    "The accelerated-time moment: Zara watching her immediate-action choice result in visible saved lives but hidden future suffering, the psychological complexity settling in",
    "Francisco's parallel realization: watching hoarded knowledge stagnate while shared knowledge compounds exponentially through others' discovery and advancement",
    "Zara's second scenario: choosing infrastructure over immediate victims, feeling the weight of invisible suffering prevented, the loneliness of that choice",
    "The moment both recognize patterns in their biases: Zara's immediate-action preference, Francisco's accumulation preference—both are leadership liabilities",
    "Apollodorus's quiet comment about a civilization they're studying: 'This one fell not because they made wrong choices, but because they never learned to make strategic ones'",
    "Francisco and Zara collaborating on a scenario: recognizing how their different perspectives—immediate protection and long-term vision—complement when aligned",
    "Final moment: both emerging from simulation with new humility, understanding that every choice is investment and consequences ripple across decades"
]

scene_2['learning_objective_integration'] = """Graham's margin of safety principle appears in scenarios where characters learn to build redundancy and buffers rather than betting everything on optimal outcomes. Kiyosaki's asset-versus-liability distinction becomes concrete: Francisco learns that knowledge can be asset (shared, creating networks) or liability (hoarded, stagnating), while Zara learns that immediate spending is liability while preventive infrastructure is asset. Housel's behavioral insights apply throughout: both characters' initial biases (Zara toward dramatic action, Francisco toward control) are revealed as emotional patterns limiting strategic vision. The scenarios teach that overcoming these emotional patterns is as important as understanding investment mathematics."""

scene_2['sudowrite_target_length'] = "1000-1200 words"
scene_2['sudowrite_key_challenge'] = "Make abstract economic scenarios feel emotionally compelling and consequential. Show the genuine difficulty of strategic thinking—avoiding a tone that makes it seem obvious or easy in hindsight. Prevent the simulation from feeling gamified or disconnected from real stakes."
scene_2['chapter_scene_focus'] = "Ch22S2: Strategic Thinking Integration"
scene_2['foreshadowing_elements'] = [
    "The scenarios Zara and Francisco face foreshadow real choices they'll encounter in later chapters where both immediate action and long-term building matter",
    "The distinction between knowledge hoarding and knowledge sharing directly sets up Francisco's future role as teacher and mentor",
    "The emphasis on systems thinking over individual heroics previews the civilizational-scale challenges they'll face in later books",
    "The accelerated-time displays suggest magical technology they may need to develop or use again in future conflicts",
    "The patterns of civilizations rising through strategy foreshadows studying and potentially encountering those advanced civilizations later"
]
scene_2['narrative_function'] = """Deepen reward integration through practice and learning. Show characters applying abstract principles to concrete scenarios, developing intuition for strategic thinking. Begin shifting their understanding from 'what is right' to 'what is effective.' Emotionally, move from frustration with complexity to growing confidence in their developing strategic judgment."""
scene_2['series_connection_resonance'] = """The strategic frameworks learned here become tools for evaluating options throughout the series. Characters' recognition of their own biases (Zara's immediate-action preference, Francisco's accumulation preference) creates internal character development arcs across multiple books. The civilizations studied in simulation may be encountered directly in future stories, creating dramatic resonance with prior learning."""

# Scene 3: The Portfolio of Purpose
scene_3 = chapter_22['scenes'][2]
scene_3['save_the_cat_beat'] = "The Reward - Building Resources for the Long Game"
scene_3['hero_journey_stage'] = "The Reward - Strategic Investment of Resources"
scene_3['preliminary_scene_focus'] = "Creating comprehensive long-term plan demonstrating understanding of strategic resource management and integration of idealism with strategic planning"
scene_3['preliminary_scene_description'] = "As afternoon light filters through Treasury's crystal walls, Apollodorus guides Francisco and Zara to create their Portfolio of Purpose—comprehensive plan for investing time, energy, magical abilities, knowledge, relationships over coming decades. They learn they are themselves assets requiring strategic development. Francisco balances love of learning with need to share knowledge optimally. Zara discovers building training programs multiplies protective impact. Together they craft plan including immediate needs, medium-term growth, long-term legacy."

scene_3['sudowrite_pov_guidance'] = """Third Person Limited, moving fluidly between Francisco and Zara's inner experience as they work collaboratively on their Portfolio. For Francisco: show his mind simultaneously liberating and frightening itself with the implications of his choices. When he realizes his scholarly treasures must be shared, include the complex emotion: grief at releasing control, excitement at exponential impact, fear that shared knowledge will be misused. Show his hands writing their portfolio, the physical act of planning grounding his understanding. For Zara: show her discovering that she herself is the asset to be developed and deployed strategically—her protective capability multiplies when she trains others. Include her internal surprise at this realization, the shift from seeing herself as individual protector to multiplier of protectors. Show both of them gradually recognizing that legacy-building—work that extends beyond their lifetimes—is the highest-value investment."""

scene_3['sudowrite_tone_guidance'] = """Accomplished and forward-looking, with the confidence that comes from having integrated difficult lessons. The tone should shift from the previous scene's struggle to a tone of growing mastery and purposefulness. Apollodorus should feel like he's witnessing something important: two leaders beginning to think at scale. Include moments of wonder—the Portfolio of Purpose becomes visibly real as they plan, transformed from abstract concept to concrete path forward. The tone should convey both the weight of commitment (this is binding and will shape decades) and the joy of alignment (yes, this is what we want to do). End with tone of quiet determination: they understand the path ahead is long, but they're ready."""

scene_3['sudowrite_pacing_guidance'] = """Begin at measured, collaborative pace as Francisco and Zara work together on their Portfolio, allowing space for them to make discoveries and articulate realizations. Move through different time horizons (immediate needs, medium-term growth, long-term legacy) at varying speeds: quick for immediate decisions, extended for medium-term planning, almost meditative for long-term legacy elements. Apollodorus's guidance should come at moments when pacing shifts, helping them transition between time horizons. The scene should build momentum as they see their Portfolio taking shape: early decisions feeling uncertain, later decisions gaining confidence and clarity. End with slightly faster pacing as they finalize their Portfolio and both feel the shift from planning to readiness."""

scene_3['sudowrite_sensory_focus'] = """Emphasize the physical act of portfolio creation—the sensation of crystalline writing materials, the way their vision becomes tangible as they write. Show the afternoon light becoming golden, filtering through Treasury crystal walls, the quality of light shifting as afternoon progresses. Include the sensory experience of both recognition and commitment: when Francisco articulates his first shared-knowledge investment, show the physical sensation in his chest—opening, release, vulnerability. When Zara recognizes multiplying protection, show her sitting straighter, her shoulders releasing tension, her hands steadier. Include Apollodorus's presence: his gentle guidance, the way his attention validates their decisions, the sensation of his approval when they make wise choices. End with sensory grounding in the physical: both feeling the weight of commitment but also the grounding of having a clear path forward."""

scene_3['sudowrite_character_moments'] = [
    "Francisco's first articulation of shared knowledge: the vulnerability of opening his accumulated treasures, the fear that others will misuse what he shares",
    "Apollodorus's response to Francisco's fear: gentle wisdom showing that impact requires releasing control, that hoarded knowledge is safe but useless",
    "Zara recognizing that her training programs multiply protective impact: the shift from seeing herself as individual fighter to multiplier of fighters",
    "The moment both realize they are themselves assets requiring strategic development: neither can be depleted carelessly or allowed to stagnate",
    "Francisco and Zara's conversation about legacy: both recognizing that their greatest impact will come from work extending beyond their lifetimes",
    "The physical act of writing their Portfolio: Francisco perhaps more hesitant (releasing control), Zara more eager (seeing exponential possibility)",
    "Apollodorus acknowledging their Portfolio: 'Now you begin to understand true wealth—not what you accumulate, but what you generate for others'",
    "Francisco and Zara's silent exchange as they finalize their Portfolio: both feeling the shift from cosmic servants to strategic stewards",
    "Final moment: both standing back from their completed Portfolio, seeing it as concrete expression of their cosmic commitment across decades"
]

scene_3['learning_objective_integration'] = """Graham's principle that true investing is about understanding intrinsic value becomes: Francisco and Zara learning to evaluate which investments generate compounding returns for universal good versus those that dissipate. Kiyosaki's asset development framework applies to themselves: they are assets requiring cultivation, and the decisions about which activities develop them and which drain them are as important as portfolio allocation. Housel's behavioral insight that temperament shapes sustainable strategy becomes: their Portfolio must be designed around their actual natures (Francisco's scholarship, Zara's protection focus) rather than trying to force themselves into strategies requiring unnatural behavior. The completed Portfolio represents integration of all three books: disciplined long-term thinking (Graham), asset/liability clarity (Kiyosaki), and temperament-aligned strategy (Housel)."""

scene_3['sudowrite_target_length'] = "950-1150 words"
scene_3['sudowrite_key_challenge'] = "Render strategic planning as emotionally compelling and character-revealing rather than dry. Show the Portfolio of Purpose as both practical document and spiritual commitment. Make readers feel the weight of long-term commitment while conveying the satisfaction of creating clarity."
scene_3['chapter_scene_focus'] = "Ch22S3: Strategic Steward Emergence"
scene_3['foreshadowing_elements'] = [
    "Francisco's decision to build knowledge-sharing networks directly sets up his mentoring role in later chapters and books",
    "Zara's recognition that multiplied protection through trained others previews building protective organizations across multiple realities",
    "The Portfolio of Purpose becomes a touchstone document they return to in future chapters when making strategic decisions",
    "The emphasis on legacy-building across decades foreshadows how their current decisions create ripples affecting future generations of guardians",
    "Apollodorus's statement about true wealth generating for others hints at a prosperity-building role they may take in later civilization-helping missions"
]
scene_3['narrative_function'] = """Complete the reward phase by crystallizing learning into actionable strategy. Show characters moving from reactive heroes to proactive strategists. Demonstrate that cosmic service requires sustained strategic thinking, not just courage and power. Emotionally, move to alignment and purposefulness—both characters feel ready for the final act challenges ahead."""
scene_3['series_connection_resonance'] = """The Portfolio of Purpose becomes internal anchor point throughout the series, guiding characters when facing temptation or uncertainty. Their strategic frameworks directly influence how they approach challenges in remaining Book 1 chapters and subsequent books. The emphasis on legacy-building across generations creates context for understanding civilizations they encounter and mentorship relationships they develop. Francisco's knowledge-sharing and Zara's protective systems become ongoing developments across multiple books."""

# Write the updated outline back to file
with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json', 'w') as f:
    json.dump(outline, f, indent=2, ensure_ascii=False)

print("✓ Successfully enhanced Chapter 22 with comprehensive Sudowrite metadata!")
print(f"  Scene 1: The Master Treasurer's Welcome - {len(scene_1['sudowrite_character_moments'])} character moments")
print(f"  Scene 2: The Investment Simulation - {len(scene_2['sudowrite_character_moments'])} character moments")
print(f"  Scene 3: The Portfolio of Purpose - {len(scene_3['sudowrite_character_moments'])} character moments")
print("\nAll 14 metadata fields populated for each scene:")
print("  ✓ save_the_cat_beat, hero_journey_stage, preliminary_scene_focus, preliminary_scene_description")
print("  ✓ sudowrite_pov_guidance, sudowrite_tone_guidance, sudowrite_pacing_guidance, sudowrite_sensory_focus")
print("  ✓ sudowrite_character_moments (9 moments each), learning_objective_integration")
print("  ✓ sudowrite_target_length, sudowrite_key_challenge, chapter_scene_focus")
print("  ✓ foreshadowing_elements (5 per scene), narrative_function, series_connection_resonance")
