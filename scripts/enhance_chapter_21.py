#!/usr/bin/env python3
"""
Enhance Chapter 21 - The Forge of Perseverance with comprehensive Sudowrite metadata
Learning Books: Endurance (Alfred Lansing), Can't Hurt Me (David Goggins), Peak (Anders Ericsson & Robert Pool)
"""

import json
import sys

# Read the outline file
with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json', 'r') as f:
    outline = json.load(f)

# Navigate to Chapter 21 (task_master_2, major_task_group_3, specific_task_group_2)
try:
    chapter_21 = outline['SelfImprovementSeries']['Books']['trilogies']['1st_trilogy']['trilogy_books']['Book1']['task_masters']['task_master_2']['major_task_groups']['major_task_group_3']['Specific_task_groups']['specific_task_group_2']
except KeyError as e:
    print(f"Error navigating to Chapter 21: {e}")
    sys.exit(1)

# Scene 1: The Hall of Infinite Lessons
scene_1 = chapter_21['scenes'][0]
scene_1['save_the_cat_beat'] = "The Midpoint - False Victory/Defeat"
scene_1['hero_journey_stage'] = "The Reward - Seizing the Wisdom"
scene_1['preliminary_scene_focus'] = "Understanding perseverance not as willpower but alignment with truth"
scene_1['preliminary_scene_description'] = "Francisco and Zara enter the Hall of Eternal Records where memory crystals reveal the true scope of the timeline war. Through witnessing histories of civilizations that failed or persevered, they understand that their cosmic commitment has only begun. The Crown of Ancient Ones is merely the first of many cosmic artifacts requiring generational effort."

scene_1['sudowrite_pov_guidance'] = """Third Person Limited anchored in Francisco's consciousness. Show his initial shock at the Hall's scale, his hands trembling as he approaches the memory crystals. When he touches a crystal, render the historical vision vividly—show him experiencing the fall of a civilization not as abstract information but as sensory immersion: the sound of crumbling cities, the weight of despair, the scent of ash. After the vision fades, show the profound disorientation of returning to his body. Include his internal monologue wrestling with the revelation: the Crown is not an endpoint but merely the beginning. Show his eyes searching for Zara's reaction, their silent acknowledgment of what they've learned. End with him touching the second crystal—Zara's experience—feeling through his connection to her the perseverance of civilizations that endured."""

scene_1['sudowrite_tone_guidance'] = """Mystical and profound, with undercurrents of sobering responsibility. The tone should shift from awe (encountering the Hall, the memory crystals' beauty) to gravity (understanding the weight of cosmic history) to determination (accepting the long path ahead). Include moments of wonder—show Francisco truly marveling at what he's witnessing—balanced with moments of profound recognition: this is not what I expected, and I am not prepared, yet I must be. The Council's role should feel mentor-like rather than judgmental, their presence calming yet weighty."""

scene_1['sudowrite_pacing_guidance'] = """Begin with deliberate, measured pacing as Francisco and Zara are led into the Hall—allow space for wonder and disorientation. When Francisco touches the first crystal and enters the vision, accelerate the pacing through the historical sequence while maintaining vivid sensory clarity. The vision should feel simultaneously brief and eternal. Return to normal pacing as Francisco emerges from the vision, with extended space for his processing and the revelation from the Council. End with slightly faster pacing as the weight of understanding settles—the urgency of the path ahead begins to crystallize."""

scene_1['sudowrite_sensory_focus'] = """Emphasize crystalline imagery and light refraction—the Hall should feel simultaneously beautiful and heavy with meaning. Show the memory crystals as emanating soft, multi-colored light. When Francisco enters the historical vision, engage ALL senses: the crumbling sound of failing civilizations, the weight of collective despair, the visual horror of collapse, the scent of abandonment. Upon returning to the Hall, contrast this with the peaceful clarity of success—civilizations that endured should feel different sensorily: warmer light, more stable ground beneath his feet, the resonance of voices in harmony. End the scene with the physical sensation of Francisco's hand on the altar or crystal—grounding his new understanding in his body."""

scene_1['sudowrite_character_moments'] = [
    "Francisco's first step into the Hall: show him stopping mid-stride, awestruck by the scale, his scholar's mind struggling to catalog what he's seeing",
    "The moment before touching the first crystal: his hesitation, the internal question of whether he's ready, Zara's silent encouragement",
    "During the vision of civilization's fall: Francisco experiencing collective despair not intellectually but emotionally, his heart racing as if the danger were real",
    "Emerging from the vision: disorientation, gasping as if he'd been underwater, the physical effort of returning to his body",
    "Witnessing Zara's experience through connection: Francisco understanding her perspective on perseverance through protection rather than conquest",
    "The Council's revelation about the Crown: Francisco's internal resistance ('surely this is enough') immediately overcome by knowing-recognition ('no, this is only the beginning')",
    "The realization settling in: Francisco's shoulders straightening as he accepts the burden, his eyes meeting Zara's with new understanding",
    "His quiet acknowledgment: 'Then we have so much to learn' or similar—a moment of humble acceptance rather than heroic resolve",
    "Final moment: Francisco's hand touching the altar, feeling the weight of all guardians who came before, his commitment solidifying"
]

scene_1['learning_objective_integration'] = """Lansing's 'Endurance' teaches that survival requires understanding actual capability and committing to incremental persistence. Francisco recognizes in the fallen civilizations those that overextended their resources trying to solve everything immediately. Goggins' 'Can't Hurt Me' demonstrates that pain itself—the weight of cosmic history, the recognition of vast challenges—becomes fuel for commitment rather than paralysis. Ericsson's 'Peak' shows that deliberate practice through witnessing others' successes and failures accelerates learning. Francisco sees both cautionary tales and aspirational models, understanding that his commitment must be informed by historical wisdom, emotional resilience, and deliberate skill development across lifetimes."""

scene_1['sudowrite_target_length'] = "900-1100 words"
scene_1['sudowrite_key_challenge'] = "Balance wonder with weight—show the Hall as genuinely beautiful and awesome while keeping the underlying tone serious and sobering. Avoid treating the historical visions as mere information dumps; make them visceral and emotionally immediate."
scene_1['chapter_scene_focus'] = "Ch21S1: Cosmic Scope Recognition"
scene_1['foreshadowing_elements'] = [
    "The mention of many cosmic artifacts beyond the Crown foreshadows future quests and deeper layers of cosmic conflict",
    "The civilizations that failed through overextension hint at the strategic challenges Francisco and Zara will face",
    "The reference to timeline war across multiple realities previews the complexity of the challenges ahead",
    "The Guardians' transformation from judges to mentors sets up ongoing mentorship relationships",
    "The phrase about commitment across lifetimes foreshadows the generational scope of their mission"
]
scene_1['narrative_function'] = """Transition from ordeal survival to reward integration. Establish the vast scope of Francisco's cosmic mission and set up the book's final act. Prevent false victory by showing that surviving the ordeal is merely entry into a far larger cosmic struggle. Emotionally, move the characters from relief to determined purpose."""
scene_1['series_connection_resonance'] = """This scene's revelation that the Crown is merely the first artifact directly leads to multi-book exploration of other cosmic artifacts and the timeline war's true nature. The emphasis on civilizational persistence across generations establishes the long-view perspective essential for a multi-book arc. The Guardians' mentorship role continues throughout the series."""

# Scene 2: The Training of Endless Commitment
scene_2 = chapter_21['scenes'][1]
scene_2['save_the_cat_beat'] = "The Midpoint - False Victory/Defeat"
scene_2['hero_journey_stage'] = "The Reward - Seizing the Wisdom"
scene_2['preliminary_scene_focus'] = "Learning that true perseverance means maintaining commitment to necessary work when no one is watching"
scene_2['preliminary_scene_description'] = "In the Training Grounds of Persistence, Francisco and Zara face deliberately mundane but crucial tasks: repetitive incantations, identical problems with slight variations, unglamorous exercises that go unnoticed. They struggle with tasks offering no narrative satisfaction, slowly discovering that preventing problems through persistent work is the highest form of leadership."

scene_2['sudowrite_pov_guidance'] = """Third Person Limited anchored primarily in Zara's consciousness, with subtle shifts to Francisco's perspective showing parallel struggles. Render Zara's internal frustration vividly—her desire for visible victories, the way her mind rebels against the monotony, her hands aching from repetitive gestures. Show her noticing that no one celebrates the invisible barrier she's maintained, that protection-work feels thankless. Slowly show her shift as she realizes that the barriers HOLDING represents success more profound than any dramatic intervention. Include her comparing this to dramatic protection moments—show her recognizing that preventing disaster is harder psychologically than responding to disaster. Show her body language changing as acceptance settles: shoulders relaxing, movements becoming rhythmic and meditative rather than frustrated."""

scene_2['sudowrite_tone_guidance'] = """Begin with frustration and resistance—the Training Grounds should initially feel tedious and beneath them. Include moments of genuine irritation: 'Why are we doing this?' The tone should gradually shift toward recognition and respect for the work. By the end, achieve a meditative, purposeful tone—monotony transforming into meditation, unglamorous work revealing its profound value. The Guardians' guidance should feel both patient (they expect this resistance) and firm (this is non-negotiable for cosmic leadership). Avoid making this inspirational or triumphant; instead, make it humble and quietly powerful."""

scene_2['sudowrite_pacing_guidance'] = """Establish a slow, rhythmic pacing that mirrors the repetitive work itself. Repetition in prose structure can reflect repetition in their tasks—but vary the sentences enough to prevent tedium from bleeding into the prose itself (you're showing tedium, not creating it for the reader). Move through multiple cycles of the tasks: attempt one, frustration, Guardian guidance, attempt again with slight understanding, repeat with different task. Allow extended space for Zara's internal wrestling with meaning. Toward the scene's end, accelerate slightly as understanding crystallizes and commitment solidifies."""

scene_2['sudowrite_sensory_focus'] = """Emphasize the unglamorous physical sensations: aching hands from repetitive incantations, the monotonous sound of repeated words losing meaning, the visual repetition of nearly-identical problems, the frustration of small variations that require full attention despite their seeming similarity. Include the sensory experience of barriers being maintained—not dramatic magical effects, but the subtle vibration of maintained force, the constancy of effort, the physical sensation of dedication. Show Zara's body gradually acclimating to the work: initial tension giving way to muscular memory, frustration giving way to rhythm, mind quieting into focused presence."""

scene_2['sudowrite_character_moments'] = [
    "Zara's first frustrated gesture: the repetitive incantation feeling beneath her, her eyes wanting to roll but catching herself",
    "The moment she realizes these tasks will continue indefinitely: the mental shock of 'oh, this is the whole scene, not just warm-up'",
    "Francisco struggling with knowledge-hoarding: his resistance to sharing magical formulas, his fear that others will use the knowledge wrongly",
    "Zara's recognition that barriers held are invisible victories: the quiet satisfaction of understanding that no disaster means her work succeeded",
    "The shift from 'when will this end?' to 'this IS my purpose': showing the exact moment of acceptance in her body language",
    "Francisco's parallel realization about knowledge-sharing: recognizing that invested-wisely knowledge compounds far beyond kept-knowledge",
    "A moment where both pause simultaneously, hands still moving through ritual but minds aligned in understanding",
    "The phrase 'work when no one is watching' truly sinking in: Zara's recognition that this is the core of cosmic leadership",
    "End-of-scene moment: Zara's hands stilling, her expression peaceful, having integrated this truth into her being"
]

scene_2['learning_objective_integration'] = """Lansing's 'Endurance' emphasizes that true leadership comes not from avoiding difficulty but from persisting through it despite its unglamorous nature. Goggins' 'Can't Hurt Me' applies here through the recognition that discomfort-avoidance prevents growth—Zara must embrace the monotony and frustration as her teacher rather than her enemy. Ericsson's 'Peak' shows that expert performance requires thousands of hours of repetitive practice: Zara learns that her mastery comes not from dramatic moments but from unglamorous daily commitment. All three books converge on the truth that invisible, persistent work—not celebrated achievements—builds lasting capability."""

scene_2['sudowrite_target_length'] = "950-1150 words"
scene_2['sudowrite_key_challenge'] = "Make repetitive work feel compelling to the reader without making the prose itself repetitive to the point of tedium. Show the characters' frustration and resistance while building respect for what they're learning. Avoid sentimentality; this scene should feel real and challenging."
scene_2['chapter_scene_focus'] = "Ch21S2: Invisible Victory Recognition"
scene_2['foreshadowing_elements'] = [
    "The emphasis on invisible work foreshadows Zara's future role building protective systems that operate without public recognition",
    "Francisco's learning to share knowledge sets up future mentorship relationships and knowledge networks",
    "The revelation that preventing problems is higher-value work than solving them shapes strategic approaches in later chapters",
    "The meditative acceptance of monotony hints at deeper spiritual/magical development across the series",
    "The Guardians' patience with their resistance foreshadows ongoing challenges that require perseverance"
]
scene_2['narrative_function'] = """Deepen the reward phase by showing internal transformation rather than external achievement. Establish that cosmic leadership requires emotional and psychological maturity, not just power. Begin shifting the characters' understanding of victory from external (things accomplished) to internal (commitment maintained). Emotionally, move from frustration to humble acceptance."""
scene_2['series_connection_resonance'] = """The invisibility-of-good-work theme becomes central to Book 1's final act and carries into future books where the characters must choose long-term prevention over immediate dramatic solutions. Francisco's learning about knowledge-sharing creates foundations for the mentorship and teaching he'll do throughout the series. The meditative, disciplined approach to magic developed here contrasts with more dramatic magical approaches encountered later."""

# Scene 3: The Covenant of Eternal Service
scene_3 = chapter_21['scenes'][2]
scene_3['save_the_cat_beat'] = "The Midpoint - False Victory/Defeat"
scene_3['hero_journey_stage'] = "The Reward - Seizing the Wisdom"
scene_3['preliminary_scene_focus'] = "Making ultimate commitment to lifelong cosmic service as eternal dedication to something greater than themselves"
scene_3['preliminary_scene_description'] = "At the Altar of Eternal Service, Francisco and Zara make a quiet covenant to persist in cosmic protection across lifetimes. This is not dramatic oath but humble promise through victories and defeats, recognition and obscurity. They feel connection to all guardians who came before, understanding they are part of unbroken chain of dedication."

scene_3['sudowrite_pov_guidance'] = """Third Person Limited, alternating between Francisco and Zara's inner experience while maintaining unified narrative voice. For Francisco: show his mind intellectually grasping cosmic responsibility while his heart recognizes sacred commitment. His hands should tremble slightly—not from fear but from the weight of what he's undertaking. Include his sensory anchoring: the cool stone of the altar beneath his palms, the light filtering through the spire, the physical sensation of Zara's presence beside him. For Zara: show her experiencing this differently—where Francisco intellectualizes, Zara feels the commitment in her bones, her protective instinct expanding from individuals to systems to eternities. Show her eyes tracking the empty altar space, imagining all the guardians who have stood here before. Coordinate their inner monologues so moments of perfect understanding create resonance between them."""

scene_3['sudowrite_tone_guidance'] = """Sacred and eternal, but intimate rather than grandiose. Avoid epic orchestral language; instead, use quiet, grounded tone suggesting power through stillness rather than through drama. The afternoon light should feel blessing rather than theatrical. The Guardians' presence should be gentle-but-absolute, their understanding that this moment matters profoundly but requires no additional ceremony. Include reverence for what came before (the chain of guardians) and acceptance of the burdens ahead. The tone should suggest quiet joy—not happiness exactly, but deep rightness and alignment with purpose."""

scene_3['sudowrite_pacing_guidance'] = """Begin at measured pace as Francisco and Zara approach the altar, allowing space to absorb the location's weight and history. Slightly accelerate the pacing during the covenant moment itself—but keep it controlled and intentional, not breathless. The Guardians' words should come relatively slowly, with space between phrases for absorption. After the covenant is made, extend the moment in time: show the stillness after commitment, allow readers to sit with the characters in what they've just undertaken. The scene should feel timeless—not rushed, not eternally lingering, but outside normal temporal pressure."""

scene_3['sudowrite_sensory_focus'] = """Emphasize tactile sensations: cool stone of the altar beneath hands, the physical connection of Francisco and Zara standing shoulder-to-shoulder, the subtle vibration of cosmic energy recognizing their commitment. Visual focus on afternoon light filtered through the spire—create a specific quality of light that feels sacred without being clichéd. Include the sensory experience of feeling the presence of previous guardians: not as ghosts exactly, but as the weight of history-made-tangible, the resonance of voices across time, the sense of joining something ancient and ongoing. Sound: the quietness of the spire, the absence of drama, possibly the subtle resonance of the altar itself recognizing the covenant."""

scene_3['sudowrite_character_moments'] = [
    "Francisco's first moment approaching the altar: recognition that this is not like other moments in his hero's journey, something fundamentally different is about to happen",
    "Zara taking his hand before they reach the altar: silent communication that they do this together, equal partners in commitment",
    "The moment their hands touch the altar: both of them experiencing the weight of all guardians who came before, the unbroken chain becoming tangible",
    "Francisco's internal voice shifting from 'I commit' to 'we commit' to 'I am part of something eternal': the expanding scope of his understanding",
    "Zara feeling the distinction between this covenant and her previous protective commitments: this is different, larger, more fundamental",
    "The instant they both realize this commitment transcends their individual lives: they will be succeeded, their work will continue beyond them, and that's how it should be",
    "Francisco meeting Zara's eyes and seeing his own understanding reflected back: the moment of perfect alignment",
    "Their hands remaining on the altar after the covenant is complete: neither wanting to move, both absorbing the permanence of what just occurred",
    "Final moment: Francisco and Zara stepping away from the altar transformed, no longer heroes on a quest but guardians in an eternal chain"
]

scene_3['learning_objective_integration'] = """All three learning books converge here: Lansing's 'Endurance' shows that true leadership means accepting missions that will outlast you; Goggins' 'Can't Hurt Me' demonstrates that the hardest challenge is choosing to persist beyond your own lifetime; Ericsson's 'Peak' reveals that mastery includes understanding you are part of an ongoing chain of developing expertise. The covenant represents integration of all three—endurance through generations, emotional resilience for long-term commitment, and participation in something larger than individual achievement. This is where cosmic service becomes concrete and binding."""

scene_3['sudowrite_target_length'] = "850-1050 words"
scene_3['sudowrite_key_challenge'] = "Make spiritual/eternal commitment feel real and grounded rather than abstract. Prevent false victory by emphasizing that this is beginning not end, that larger challenges remain. Balance the sacred/ceremonial nature with honest acknowledgment of the burden being undertaken."
scene_3['chapter_scene_focus'] = "Ch21S3: Eternal Service Covenant"
scene_3['foreshadowing_elements'] = [
    "The reference to unbroken chain of guardians foreshadows Book 2-3 encounters with other cosmic guardians and mentors",
    "The emphasis on this being merely beginning of responsibility sets up increasingly complex challenges in remaining Book 1 chapters",
    "The generational commitment perspective previews the multi-generational scope of the series' overarching conflict",
    "Francisco and Zara's equality in commitment foreshadows their partnership through increasingly complex challenges",
    "The altar itself may become pilgrimage point or meeting place in future books"
]
scene_3['narrative_function'] = """Complete the reward phase by crystallizing Francisco and Zara's internal transformation into external commitment. This is the moment where they transition from heroes on personal quests to servants of something eternal and vast. Prevent the false-victory peaking by emphasizing this covenant acknowledges vast challenges ahead, not endpoint. Emotionally, move to acceptance of burden and alignment with purpose."""
scene_3['series_connection_resonance'] = """This covenant becomes the anchor point for all subsequent choices across the series. When faced with temptation to abandon their mission, or to take easier paths, this commitment recalls them. The unbroken chain of guardians provides ongoing connection to ancient wisdom and suggests other guardians will appear throughout the series. The covenant's emphasis on persistence across lifetimes (possibly including reincarnation in future books) opens narrative possibilities for long-view storytelling."""

# Write the updated outline back to file
with open('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json', 'w') as f:
    json.dump(outline, f, indent=2, ensure_ascii=False)

print("✓ Successfully enhanced Chapter 21 with comprehensive Sudowrite metadata!")
print(f"  Scene 1: The Hall of Infinite Lessons - {len(scene_1['sudowrite_character_moments'])} character moments")
print(f"  Scene 2: The Training of Endless Commitment - {len(scene_2['sudowrite_character_moments'])} character moments")
print(f"  Scene 3: The Covenant of Eternal Service - {len(scene_3['sudowrite_character_moments'])} character moments")
print("\nAll 14 metadata fields populated for each scene:")
print("  ✓ save_the_cat_beat, hero_journey_stage, preliminary_scene_focus, preliminary_scene_description")
print("  ✓ sudowrite_pov_guidance, sudowrite_tone_guidance, sudowrite_pacing_guidance, sudowrite_sensory_focus")
print("  ✓ sudowrite_character_moments (9 moments each), learning_objective_integration")
print("  ✓ sudowrite_target_length, sudowrite_key_challenge, chapter_scene_focus")
print("  ✓ foreshadowing_elements (5 per scene), narrative_function, series_connection_resonance")
