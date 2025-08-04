import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Goal, Milestone } from '../../types';
import { X, Plus, Target, Calendar, Flag, Trash2 } from 'lucide-react';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingGoal?: Goal;
  loading?: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({ isOpen, onClose, onSubmit, editingGoal, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal-growth' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    status: 'not-started' as Goal['status'],
    targetDate: '',
    progress: 0,
    milestones: [] as Omit<Milestone, 'id'>[],
  });

  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title,
        description: editingGoal.description,
        category: editingGoal.category,
        priority: editingGoal.priority,
        status: editingGoal.status,
        targetDate: editingGoal.targetDate,
        progress: editingGoal.progress,
        milestones: editingGoal.milestones.map(m => ({
          title: m.title,
          completed: m.completed,
          completedAt: m.completedAt,
        })),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'personal-growth',
        priority: 'medium',
        status: 'not-started',
        targetDate: '',
        progress: 0,
        milestones: [],
      });
    }
    setNewMilestone('');
  }, [editingGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Submitting goal form:', formData);
    const goalData = {
      ...formData,
      milestones: formData.milestones.map((milestone, index) => ({
        ...milestone,
        id: `milestone-${Date.now()}-${index}`,
      })),
    };
    
    onSubmit(goalData);
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setFormData({
        ...formData,
        milestones: [
          ...formData.milestones,
          {
            title: newMilestone.trim(),
            completed: false,
          },
        ],
      });
      setNewMilestone('');
    }
  };

  const removeMilestone = (index: number) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newMilestone.trim()) {
      e.preventDefault();
      addMilestone();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What do you want to achieve?"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal in detail..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-24 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* Category, Priority, Target Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Goal['category'] })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="mental-health">Mental Health</option>
                  <option value="physical-health">Physical Health</option>
                  <option value="relationships">Relationships</option>
                  <option value="career">Career</option>
                  <option value="personal-growth">Personal Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Goal['priority'] })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            {/* Status and Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Goal['status'] })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Progress: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Milestones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Milestones
              </label>
              
              <div className="space-y-3">
                {/* Add new milestone */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a milestone..."
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <motion.button
                    type="button"
                    onClick={addMilestone}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Existing milestones */}
                {formData.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="flex-1 text-gray-900 dark:text-gray-100">{milestone.title}</span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg"
              >
                {loading ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalForm;