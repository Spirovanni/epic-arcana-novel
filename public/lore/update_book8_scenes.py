#!/usr/bin/env python3
"""
Script to update Book 8 chapters in l_outline.json with simplified scenes structure.
This script will add a "scenes" array to each Book 8 chapter following the same pattern as Books 1-7.
"""

import json
import re

def split_chapter_summary_into_scenes(summary, chapter_title):
    """Split chapter summary into 4 scene setups."""
    if not summary:
        return [
            f"Opening scene for {chapter_title} - setting up the initial situation and establishing the cosmic context.",
            f"Development scene for {chapter_title} - exploring the challenges and obstacles that arise.",
            f"Climax scene for {chapter_title} - reaching the pivotal moment of the chapter.",
            f"Resolution scene for {chapter_title} - concluding the chapter and transitioning to the next phase."
        ]
    
    # Split summary into sentences
    sentences = re.split(r'[.!?]+', summary)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) >= 4:
        # Distribute sentences across 4 scenes
        scenes_per_quarter = max(1, len(sentences) // 4)
        scene_setups = []
        
        for i in range(4):
            start_idx = i * scenes_per_quarter
            if i == 3:  # Last scene gets remaining sentences
                end_idx = len(sentences)
            else:
                end_idx = (i + 1) * scenes_per_quarter
            
            scene_sentences = sentences[start_idx:end_idx]
            scene_setup = '. '.join(scene_sentences)
            if scene_setup and not scene_setup.endswith('.'):
                scene_setup += '.'
            scene_setups.append(scene_setup)
        
        return scene_setups
    else:
        # If not enough sentences, create logical splits
        base_text = summary if summary else f"Chapter {chapter_title} content"
        return [
            f"Opening: {base_text[:len(base_text)//4]}..." if len(base_text) > 100 else f"Opening scene establishing the context for {chapter_title}.",
            f"Development: Building upon the opening, exploring the central challenges.",
            f"Climax: The pivotal moment where key decisions are made.",
            f"Resolution: Concluding the chapter and setting up future developments."
        ]

def create_scenes_structure(chapter_summary, chapter_title):
    """Create the scenes structure for a chapter."""
    scene_setups = split_chapter_summary_into_scenes(chapter_summary, chapter_title)
    
    scenes = []
    for i, setup in enumerate(scene_setups, 1):
        scene = {
            "scene_number": i,
            "title": f"Scene {i}",
            "setup": setup,
            "symbolism": f"Symbolic elements of scene {i}",
            "beat_goal": f"Advance the narrative through scene {i}"
        }
        scenes.append(scene)
    
    return scenes

# Book 8 chapter data from the source file
book8_chapters = [
    {"chapter": 1, "title": "Wisdom", "summary": "Francisco emerges as the Dweller Between the Waters, positioned at the cosmic intersection where all universal forces converge. Having mastered cosmic transformation and restructuring in Book 7, he now possesses ultimate cosmic wisdom that allows him to perceive all realities simultaneously. This wisdom becomes the foundation for the final phase of universal transformation that will determine the fate of all existence."},
    {"chapter": 2, "title": "Containment", "summary": "Francisco learns the importance of cosmic containment - creating boundaries and structures that can hold the immense forces required for universal transformation. He discovers that ultimate cosmic power requires ultimate cosmic responsibility, including the ability to contain and direct forces that could destroy or create entire realities."},
    {"chapter": 3, "title": "Charged Up", "summary": "Francisco harnesses and charges up the ultimate cosmic energies needed for universal transformation. He learns to draw power from all cosmic sources simultaneously - time, space, matter, energy, consciousness, and spirit - creating a charged state that can initiate the final transformation of all existence."},
    {"chapter": 4, "title": "Skill Development", "summary": "Francisco develops the ultimate cosmic skills needed for universal transformation - abilities that transcend ordinary cosmic powers and enable reality-level changes. He practices and refines techniques for consciousness manipulation, timeline restructuring, and universal law modification that will be essential for the final transformation."},
    {"chapter": 5, "title": "Liberty", "summary": "Francisco confronts the ultimate question of cosmic liberty - whether universal transformation should preserve or transcend free will across all existence. He grapples with the philosophical and practical implications of cosmic freedom and determines how to balance universal harmony with individual and collective liberty."},
    {"chapter": 6, "title": "Abundance", "summary": "Francisco receives the call to create ultimate cosmic abundance - not just material prosperity but abundance of consciousness, creativity, love, wisdom, and possibility throughout all existence. This call challenges him to envision and implement a universe where all beings can experience infinite abundance in all dimensions of existence."},
    {"chapter": 7, "title": "Tested Faith", "summary": "Francisco's cosmic faith is tested by challenges that question whether universal transformation is truly possible or desirable. He faces opposition from cosmic entities who prefer the current state of existence and must maintain faith in the vision of ultimate cosmic harmony despite overwhelming doubts and resistance."},
    {"chapter": 8, "title": "Contribution", "summary": "Francisco learns that ultimate cosmic transformation requires contributions from all conscious beings throughout existence. He develops systems for enabling every entity to contribute their unique gifts and perspectives to the universal transformation, recognizing that collective contribution is essential for complete cosmic change."},
    {"chapter": 9, "title": "Facing Fears", "summary": "Francisco confronts his ultimate cosmic fears about the responsibility and consequences of universal transformation. He faces fears about unintended consequences, the weight of cosmic responsibility, and the possibility of failure on a universal scale. This confrontation becomes essential for moving beyond doubt to decisive action."},
    {"chapter": 10, "title": "Lucidity", "summary": "Under ultimate cosmic pressure, Francisco achieves perfect lucidity - absolute clarity about the nature of universal transformation and his role in it. This cosmic lucidity allows him to see through all illusions and understand exactly what must be done for ultimate cosmic transformation. The theme of cosmic consciousness and clear perception becomes central to his mission."},
    {"chapter": 11, "title": "Withdrawal", "summary": "In a critical moment, Francisco practices cosmic withdrawal - temporarily stepping back from active engagement to achieve deeper understanding and inner peace before the final transformation. He learns that ultimate cosmic action requires periods of cosmic stillness and withdrawal for clarity and strength."},
    {"chapter": 12, "title": "Abundance", "summary": "Francisco cultivates an abundance mindset among his cosmic allies, mentors, and helpers, ensuring that all beings involved in universal transformation approach the work from a perspective of infinite possibility rather than scarcity. This cosmic abundance thinking becomes essential for achieving the expansive vision of universal transformation."},
    {"chapter": 13, "title": "Meditation", "summary": "Francisco crosses the threshold into the final phase of cosmic transformation through profound cosmic meditation that connects him with the ultimate source of universal consciousness. This meditation marks his transition from preparation to action, as he aligns with the deepest cosmic forces and prepares to initiate the ultimate transformation of all existence."},
    {"chapter": 14, "title": "Valor", "summary": "Now functioning as the Ruler of Flux and Reflux, Francisco demonstrates cosmic valor by embracing vulnerability and courage in his cosmic leadership role. He learns that ultimate cosmic transformation requires the courage to be vulnerable to cosmic forces while maintaining the valor to lead universal change despite enormous risks and uncertainties."},
    {"chapter": 15, "title": "Authority", "summary": "Francisco establishes cosmic authority based on wisdom, service, and transformational capability rather than force or dominance. He creates new models of cosmic leadership that inspire voluntary cooperation and collective participation in universal transformation rather than commanding obedience through power."},
    {"chapter": 16, "title": "Independence", "summary": "Francisco explores cosmic independence concepts, ensuring that universal transformation enhances rather than diminishes the independence and autonomy of all cosmic beings. He develops approaches to cosmic unity that preserve individual freedom and self-determination while achieving collective harmony."},
    {"chapter": 17, "title": "Prescience", "summary": "Francisco develops cosmic prescience - the ability to perceive and understand future cosmic developments with perfect accuracy. This prescience allows him to anticipate the consequences of universal transformation and guide the process to ensure optimal outcomes for all existence."},
    {"chapter": 18, "title": "Unknown", "summary": "Francisco explores cosmic perceptions of the unknown and develops comfort with cosmic mystery and uncertainty. He learns that ultimate cosmic transformation requires embracing the unknown rather than needing to understand everything, finding peace and happiness even in the face of cosmic mystery."},
    {"chapter": 19, "title": "Moving On", "summary": "Francisco learns to adapt to cosmic change and move forward from previous phases of universal transformation. He develops the ability to let go of old approaches and embrace new cosmic realities, ensuring that universal transformation can continue evolving rather than becoming fixed in previous patterns."},
    {"chapter": 20, "title": "Inner Alignment", "summary": "At the cosmic midpoint, Francisco achieves perfect inner alignment between all aspects of his cosmic being - wisdom, power, love, service, and transformation capability. This internal alignment becomes the foundation for the external cosmic transformation and marks his readiness for the supreme cosmic challenges ahead."},
    {"chapter": 21, "title": "Principles", "summary": "Through his inner alignment, Francisco establishes the fundamental cosmic principles that will guide universal transformation. These principles become his reward for achieving internal harmony and provide the unchanging foundation for all cosmic change, ensuring that transformation serves the highest good of all existence."},
    {"chapter": 22, "title": "Energy Stream", "summary": "Francisco harnesses the cosmic energy stream - the flow of creative and transformational energy throughout the universe. He learns to direct this energy stream for maximum creativity and productivity in cosmic transformation, using it as a tool for implementing the principles he has established."},
    {"chapter": 23, "title": "Subconscious Mind", "summary": "Francisco faces his supreme ordeal by mastering the cosmic subconscious mind - the deeper levels of universal consciousness that operate beneath ordinary awareness. He learns to utilize subconscious cosmic forces to achieve transformation goals that transcend conscious planning and control, accessing the deeper wisdom of universal consciousness."},
    {"chapter": 24, "title": "Stable Growth", "summary": "Francisco emerges as the Lord of the Fire of the World, the ultimate cosmic force responsible for stable and enduring transformation growth. When cosmic transformation seems to have failed, he develops principles for achieving stable cosmic growth that can endure any challenges and continue expanding throughout all existence."},
    {"chapter": 25, "title": "Five Senses", "summary": "Francisco masters the cosmic five senses - the fundamental ways of perceiving and understanding universal reality through all possible sensory and consciousness channels. He learns to integrate all forms of cosmic perception to gain complete understanding of universal transformation requirements and possibilities."},
    {"chapter": 26, "title": "Emanation", "summary": "Francisco learns cosmic emanation - the ability to project and radiate transformational energy and creative potential throughout all existence. He overcomes internal barriers to unleash unlimited creative potential, becoming a source of transformational emanation that can inspire and empower all cosmic beings."},
    {"chapter": 27, "title": "Synchronized", "summary": "Francisco achieves cosmic synchronization - the perfect harmony and timing between all cosmic forces and transformation activities. He learns that universal transformation requires synchronicity in leadership and personal growth, ensuring that all cosmic changes occur in perfect harmony and optimal timing."},
    {"chapter": 28, "title": "Spiritual Growth", "summary": "In his cosmic dark night of the soul, Francisco pursues ultimate spiritual growth for lasting cosmic happiness and fulfillment. He learns that cosmic transformation requires not just external change but profound spiritual development that creates permanent cosmic joy and satisfaction for all beings."},
    {"chapter": 29, "title": "Friendship", "summary": "In the depths of cosmic crisis, Francisco builds strong and lasting cosmic friendships that provide support and strength through the darkest moments. He learns that cosmic transformation requires genuine friendship and mutual support among all cosmic beings, creating bonds that transcend individual differences."},
    {"chapter": 30, "title": "Defeat", "summary": "At his darkest cosmic moment, Francisco learns to transform defeats into opportunities for growth and greater cosmic understanding. He discovers that apparent cosmic failure can become the foundation for even greater cosmic transformation success, using defeat as a catalyst for breakthrough advancement."},
    {"chapter": 31, "title": "Bold Actions", "summary": "Drawing on inner cosmic power, Francisco embraces vulnerability to take bold cosmic actions that could transform all existence. He learns that ultimate cosmic transformation requires the courage to take unprecedented bold steps, even when the outcomes are uncertain and the risks are cosmic in scale."},
    {"chapter": 32, "title": "Desolation", "summary": "Francisco achieves the ultimate boon of cosmic emotional mastery by managing emotions in times of cosmic distress and desolation. He learns to maintain emotional balance and clarity even when facing the potential failure of universal transformation, using emotional mastery as the foundation for ultimate cosmic action."},
    {"chapter": 33, "title": "Take Charge", "summary": "Francisco takes ultimate cosmic charge as the leader responsible for making the final decisions about universal transformation. He embraces the full weight of cosmic leadership and makes the decisive choices that will determine the fate of all existence, accepting complete responsibility for cosmic transformation outcomes."},
    {"chapter": 34, "title": "Challenging Decision", "summary": "As cosmic forces converge, Francisco faces the most challenging cosmic decision - how to implement universal transformation in a way that honors all beings and possibilities. He learns to make better choices by considering all cosmic perspectives and finding solutions that serve the highest good of all existence."},
    {"chapter": 35, "title": "Appreciating the Moment", "summary": "During cosmic flight toward ultimate transformation, Francisco learns to appreciate the present moment and embrace peace and contentment even amid cosmic change. He discovers that cosmic transformation must include the ability to find joy and satisfaction in each moment of the transformational process."},
    {"chapter": 36, "title": "Manifesting Vision", "summary": "As cosmic battle approaches, Francisco focuses on manifesting his clear vision of universal transformation through cosmic leadership and innovation. He learns that the importance of vision in cosmic leadership cannot be overstated - clear vision becomes the guiding force that enables ultimate cosmic transformation success."},
    {"chapter": 37, "title": "Abandonment", "summary": "At the cosmic climax, Francisco embraces the process of cosmic abandonment - letting go of all personal attachments and moving forward with complete dedication to universal transformation. He learns that ultimate cosmic service requires abandoning all personal considerations to serve the transformation of all existence."},
    {"chapter": 38, "title": "Conscious Mind", "summary": "As cosmic rescue arrives, Francisco explores the cosmic conscious mind - the conscious aspects of universal thought and decision-making. He achieves mastery of cosmic consciousness that enables him to think and decide at the level of universal mind, making choices that serve all existence."},
    {"chapter": 39, "title": "Competition", "summary": "As cosmic resolution approaches, Francisco develops tactics for gaining the upper hand in cosmic competition - not against other beings, but against the forces of limitation, division, and suffering that have constrained universal potential. He competes against cosmic limitation to achieve ultimate cosmic liberation."},
    {"chapter": 40, "title": "Meaningful", "summary": "Francisco achieves mastery of two worlds by discovering ultimate meaning and purpose in all cosmic experiences. As the complete master of cosmic transformation, he understands that every aspect of existence has profound meaning and purpose. Ready to guide the final cosmic transformation in Book 9, he stands prepared to help all existence discover its ultimate meaning and achieve its highest purpose."}
]

print("Book 8 chapter data prepared.")
print(f"Total chapters: {len(book8_chapters)}")

# Example of creating scenes for chapter 1
example_scenes = create_scenes_structure(book8_chapters[0]["summary"], book8_chapters[0]["title"])
print(f"\nExample scenes for Chapter 1 ({book8_chapters[0]['title']}):")
for scene in example_scenes:
    print(f"  Scene {scene['scene_number']}: {scene['setup'][:100]}...")