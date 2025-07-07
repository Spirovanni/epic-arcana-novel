'use client';

import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 py-8 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="container mx-auto text-center">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} ChronoScriptor. Crafted for epic storytelling.
          </div>
          <div className="flex gap-6 text-sm">
            <motion.a
              href="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Privacy
            </motion.a>
            <motion.a
              href="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Terms
            </motion.a>
            <motion.a
              href="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Contact
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
