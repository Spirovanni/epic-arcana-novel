'use client';

import { useState } from 'react';
import { CheckCircleIcon, PlusIcon, TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface LearningObjectivesData {
  title: string;
  author: string;
  connect_points: {
    point1: string;
    point2: string;
    point3: string;
  };
  section_of_focus: string;
  section_description: string;
  connection_focus_area: string;
  terminal_learning_objectives: {
    objective1: string;
    objective2: string;
    objective3: string;
  };
}

interface LearningObjectivesFormProps {
  initialData?: LearningObjectivesData;
  onSave: (data: LearningObjectivesData) => Promise<void>;
  isLoading?: boolean;
}

export default function LearningObjectivesForm({ 
  initialData, 
  onSave, 
  isLoading = false 
}: LearningObjectivesFormProps) {
  const [formData, setFormData] = useState<LearningObjectivesData>(() => ({
    title: initialData?.title || '',
    author: initialData?.author || '',
    connect_points: {
      point1: initialData?.connect_points?.point1 || '',
      point2: initialData?.connect_points?.point2 || '',
      point3: initialData?.connect_points?.point3 || '',
    },
    section_of_focus: initialData?.section_of_focus || '',
    section_description: initialData?.section_description || '',
    connection_focus_area: initialData?.connection_focus_area || '',
    terminal_learning_objectives: {
      objective1: initialData?.terminal_learning_objectives?.objective1 || '',
      objective2: initialData?.terminal_learning_objectives?.objective2 || '',
      objective3: initialData?.terminal_learning_objectives?.objective3 || '',
    },
  }));

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const updateConnectPoint = (pointKey: keyof typeof formData.connect_points, value: string) => {
    setFormData(prev => ({
      ...prev,
      connect_points: {
        ...prev.connect_points,
        [pointKey]: value,
      },
    }));
  };

  const updateObjective = (objectiveKey: keyof typeof formData.terminal_learning_objectives, value: string) => {
    setFormData(prev => ({
      ...prev,
      terminal_learning_objectives: {
        ...prev.terminal_learning_objectives,
        [objectiveKey]: value,
      },
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <BookOpenIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Learning Objectives Editor</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Create and edit learning objectives for chapter connections
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Book Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Book Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter book title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter author name"
              required
            />
          </div>
        </div>

        {/* Connection Points */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            Connection Points
          </h3>
          <div className="space-y-4">
            {(['point1', 'point2', 'point3'] as const).map((pointKey, index) => (
              <div key={pointKey}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Connection Point {index + 1}
                </label>
                <textarea
                  value={formData.connect_points[pointKey]}
                  onChange={(e) => updateConnectPoint(pointKey, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical"
                  placeholder={`Enter connection point ${index + 1}...`}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section Focus */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Section of Focus
            </label>
            <input
              type="text"
              value={formData.section_of_focus}
              onChange={(e) => setFormData(prev => ({ ...prev, section_of_focus: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter section of focus"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Section Description
            </label>
            <textarea
              value={formData.section_description}
              onChange={(e) => setFormData(prev => ({ ...prev, section_description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical"
              placeholder="Enter section description..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Connection Focus Area
            </label>
            <textarea
              value={formData.connection_focus_area}
              onChange={(e) => setFormData(prev => ({ ...prev, connection_focus_area: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical"
              placeholder="Enter connection focus area..."
              required
            />
          </div>
        </div>

        {/* Terminal Learning Objectives */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-blue-500" />
            Terminal Learning Objectives
          </h3>
          <div className="space-y-4">
            {(['objective1', 'objective2', 'objective3'] as const).map((objectiveKey, index) => (
              <div key={objectiveKey}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Objective {index + 1}
                </label>
                <textarea
                  value={formData.terminal_learning_objectives[objectiveKey]}
                  onChange={(e) => updateObjective(objectiveKey, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical"
                  placeholder={`Enter learning objective ${index + 1}...`}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* JSON Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            JSON Preview
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Save Learning Objectives
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              title: '',
              author: '',
              connect_points: { point1: '', point2: '', point3: '' },
              section_of_focus: '',
              section_description: '',
              connection_focus_area: '',
              terminal_learning_objectives: { objective1: '', objective2: '', objective3: '' },
            })}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}