'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Html } from '@react-three/drei'
// import { useDrag, useDrop } from 'react-dnd' // Commented out for build simplicity

interface StoryCard {
  id: string
  title: string
  stage: string
  description: string
  chapterRefs: string[]
  position: [number, number, number]
  color: string
  characterArcId: string
}

interface EditableStoryCardProps {
  card: StoryCard
  onUpdate: (cardId: string, updates: Partial<StoryCard>) => void
  onDelete: (cardId: string) => void
  onDuplicate: (card: StoryCard) => void
  isSelected: boolean
  onSelect: (cardId: string) => void
}

export function EditableStoryCard({
  card,
  onUpdate,
  onDelete,
  onDuplicate,
  isSelected,
  onSelect
}: EditableStoryCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: card.title,
    description: card.description,
    chapterRefs: card.chapterRefs.join(', '),
    color: card.color
  })
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Simplified drag state (drag and drop functionality can be enhanced later)
  const isDragging = false

  const handleSave = () => {
    const updates: Partial<StoryCard> = {
      title: editData.title,
      description: editData.description,
      chapterRefs: editData.chapterRefs.split(',').map(ref => ref.trim()).filter(Boolean),
      color: editData.color
    }
    
    onUpdate(card.id, updates)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      title: card.title,
      description: card.description,
      chapterRefs: card.chapterRefs.join(', '),
      color: card.color
    })
    setIsEditing(false)
  }

  const predefinedColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  return (
    <Html position={card.position} center>
      <motion.div
        className={`
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border-2 
          ${isSelected ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700'}
          ${isDragging ? 'opacity-50' : 'opacity-100'}
          cursor-move transition-all duration-200 hover:shadow-3xl
        `}
        style={{ 
          width: '320px',
          borderLeftColor: card.color,
          borderLeftWidth: '6px'
        }}
        onClick={() => onSelect(card.id)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Card Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full cursor-pointer relative"
                style={{ backgroundColor: card.color }}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowColorPicker(!showColorPicker)
                }}
              >
                {showColorPicker && (
                  <div className="absolute top-6 left-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2">
                    <div className="grid grid-cols-5 gap-1">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors"
                          style={{ backgroundColor: color }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditData(prev => ({ ...prev, color }))
                            onUpdate(card.id, { color })
                            setShowColorPicker(false)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {card.stage}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Edit Card"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate(card)
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                title="Duplicate Card"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Are you sure you want to delete this story card?')) {
                    onDelete(card.id)
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete Card"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {isEditing ? (
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter card title..."
                />
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Enter card description..."
                />
              </div>

              {/* Chapter References */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chapter References
                </label>
                <input
                  type="text"
                  value={editData.chapterRefs}
                  onChange={(e) => setEditData(prev => ({ ...prev, chapterRefs: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Chapter 1, Chapter 2..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {card.description}
              </p>

              {/* Chapter References */}
              {card.chapterRefs.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {card.chapterRefs.map((ref, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Position: ({card.position[0].toFixed(1)}, {card.position[1].toFixed(1)}, {card.position[2].toFixed(1)})</span>
                <span>{card.chapterRefs.length} chapters</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Html>
  )
}