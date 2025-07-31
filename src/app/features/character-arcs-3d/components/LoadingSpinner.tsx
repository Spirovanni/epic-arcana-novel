'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading Character Arcs
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing 3D visualization...
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center space-x-1 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}