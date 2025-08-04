import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal } from '../../types';
import { Calendar, Target, TrendingUp, Clock, CheckCircle, Circle, ChevronDown, ChevronUp, Trophy, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
}

const priorityConfig = {
  low: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  high: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

const statusConfig = {
  'not-started': { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  'in-progress': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  'completed': { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  'paused': { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onToggleMilestone }) => {
  const [showAllMilestones, setShowAllMilestones] = useState(false);
  const priorityConf = priorityConfig[goal.priority];
  const statusConf = statusConfig[goal.status];

  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;
  const allMilestonesCompleted = totalMilestones > 0 && completedMilestones === totalMilestones;

  const visibleMilestones = showAllMilestones ? goal.milestones : goal.milestones.slice(0, 3);
  const hasMoreMilestones = goal.milestones.length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ${
        allMilestonesCompleted ? 'ring-2 ring-green-400 ring-opacity-50' : ''
      }`}
    >
      {/* Goal Completion Celebration */}
      {allMilestonesCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Trophy className="w-8 h-8 text-yellow-500" />
            </motion.div>
            <div className="text-center">
              <h4 className="text-lg font-bold text-green-700 dark:text-green-400 flex items-center space-x-2">
                <span>🎉 Congratulations!</span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                You have completed this goal!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {goal.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConf.bg} ${priorityConf.color} ${priorityConf.border} border`}>
              {goal.priority}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {goal.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full ${
              allMilestonesCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-primary-500 to-secondary-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Milestones ({completedMilestones}/{totalMilestones})
            </h4>
            {hasMoreMilestones && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllMilestones(!showAllMilestones)}
                className="flex items-center space-x-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                <span>{showAllMilestones ? 'Show Less' : 'Show All'}</span>
                {showAllMilestones ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>
          
          <AnimatePresence>
            <div className="space-y-2">
              {visibleMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 2 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                  onClick={() => onToggleMilestone(goal.id, milestone.id)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex-shrink-0"
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    )}
                  </motion.div>
                  <span className={`text-sm flex-1 transition-all ${
                    milestone.completed 
                      ? 'text-gray-500 dark:text-gray-400 line-through' 
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                  }`}>
                    {milestone.title}
                  </span>
                  {milestone.completed && milestone.completedAt && (
                    <span className="text-xs text-green-500 font-medium">
                      ✓
                    </span>
                  )}
                </motion.div>
              ))}
              
              {!showAllMilestones && hasMoreMilestones && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowAllMilestones(true)}
                  className="w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  +{goal.milestones.length - 3} more milestones...
                </motion.button>
              )}
            </div>
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Due {formatDate(goal.targetDate)}
            </span>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConf.bg} ${statusConf.color} ${statusConf.border} border`}>
            {goal.status.replace('-', ' ')}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(goal)}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(goal.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalCard;