'use client';
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const MotionSection = dynamic(() => import("framer-motion").then(mod => mod.motion.section), { ssr: false });
const MotionDiv = dynamic(() => import("framer-motion").then(mod => mod.motion.div), { ssr: false });
const MotionButton = dynamic(() => import("framer-motion").then(mod => mod.motion.button), { ssr: false });

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
};

const cardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: { scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
};

export function MainContent() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-white p-8 pt-24 relative overflow-hidden font-ui transition-colors duration-300">
      {/* Background Overlay for Visual Depth */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/globe.svg"
          alt="Background Pattern"
          fill
          className="pointer-events-none object-cover"
        />
      </div>

      {/* Hero Section */}
      <MotionSection
        className="relative z-10 text-center mb-20 max-w-5xl mx-auto"
        {...fadeIn}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight mb-6 font-narrative">
          ChronoScriptor
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-mono">
          Forge intricate narratives, master temporal paradoxes, and weave destiny with the power of the Trionfi Arcana.
        </p>
        <MotionDiv
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link href="/dashboard" passHref>
            <MotionButton
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-full text-xl md:text-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Your Epic Journey
            </MotionButton>
          </Link>
        </MotionDiv>
      </MotionSection>

      {/* Feature Highlights Grid */}
      <section id="features" className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 max-w-7xl mx-auto">
        {/* Feature Card 1: World Map */}
        <MotionDiv
          className="story-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
          transition={{ delay: 0.2, ...cardVariants.transition }}
        >
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="text-3xl font-semibold text-red-600 dark:text-red-400 mb-3 font-narrative">Chapter-Centric World Map</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-ui">
            Visualize your narrative across a dynamic map. Connect chapters to precise locations and evolving lore, bringing your world to life.
          </p>
        </MotionDiv>

        {/* Feature Card 2: Timelines */}
        <MotionDiv
          className="story-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
          transition={{ delay: 0.3, ...cardVariants.transition }}
        >
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-3 font-narrative">Dynamic Timelines & Paradoxes</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-ui">
            Track branching narratives across Alpha, Beta, and Gamma timelines. Identify convergence points and manage temporal paradoxes with ease.
          </p>
        </MotionDiv>

        {/* Feature Card 3: Trionfi Cards */}
        <MotionDiv
          className="story-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
          transition={{ delay: 0.4, ...cardVariants.transition }}
        >
          <div className="text-5xl mb-4">🃏</div>
          <h2 className="text-3xl font-semibold text-green-600 dark:text-green-400 mb-3 font-narrative">Master the Trionfi Arcana</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-ui">
            Integrate a powerful tarot-based magic system. Embed Trionfi cards into scenes, track their effects, and unlock their arcane secrets.
          </p>
        </MotionDiv>

        {/* Feature Card 4: Characters */}
        <MotionDiv
          className="story-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-400 transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
          transition={{ delay: 0.5, ...cardVariants.transition }}
        >
          <div className="text-5xl mb-4">🎭</div>
          <h2 className="text-3xl font-semibold text-yellow-600 dark:text-yellow-400 mb-3 font-narrative">Evolving Character Arcs</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-ui">
            Visualize complex character relationships and their development across your saga. See how their destinies intertwine with the timelines.
          </p>
        </MotionDiv>

        {/* Feature Card 5: Lore Codex */}
        <MotionDiv
          className="story-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
          transition={{ delay: 0.6, ...cardVariants.transition }}
        >
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-3 font-narrative">Unified Lore & Narrative Codex</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-ui">
            A central encyclopedia for all your world-building elements. Auto-tagging and linking ensure your lore is always consistent and accessible.
          </p>
        </MotionDiv>

        {/* Feature Card 6: Chapter Builder */}
        <MotionDiv
          className="story-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-300"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
          transition={{ delay: 0.7, ...cardVariants.transition }}
        >
          <div className="text-5xl mb-4">✍️</div>
          <h2 className="text-3xl font-semibold text-pink-600 dark:text-pink-400 mb-3 font-narrative">Intuitive Chapter Builder</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-ui">
            Craft your narrative with a powerful Markdown-based editor. Seamlessly integrate with AI tools for drafting and style feedback.
          </p>
        </MotionDiv>
      </section>

      {/* Final Call to Action */}
      <MotionSection
        className="relative z-10 text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="text-3xl text-gray-600 dark:text-gray-200 mb-8 font-mono">
          Ready to transform your story ideas into an epic reality?
        </p>
        <Link href="/signup" passHref>
          <MotionButton
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-5 px-16 rounded-full text-2xl md:text-3xl transition-all duration-300 shadow-lg hover:shadow-2xl transform focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join ChronoScriptor Today
          </MotionButton>
        </Link>
      </MotionSection>
    </main>
  );
}