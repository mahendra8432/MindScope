import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '../../types';
import { Calendar, Flame, Target, TrendingUp, Trash2 } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface HabitTrackerProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, date: string) => void;
  onDeleteHabit?: (habitId: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habit, onToggleCompletion, onDeleteHabit }) => {
  const today = new Date();
  const last30Days = eachDayOfInterval({
    start: subDays(today, 29),
    end: today,
  });

  const getCompletionForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completions.find(c => c.date === dateStr);
  };

  // Calculate completion rate based on last 30 days only
  const last30DaysCompletions = habit.completions.filter(completion => {
    const completionDate = new Date(completion.date);
    return completionDate >= subDays(today, 29) && completionDate <= today;
  });

  const completionRate = last30DaysCompletions.length > 0 
    ? (last30DaysCompletions.filter(c => c.completed).length / 30) * 100  // Always calculate out of 30 days
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {habit.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {habit.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-bold text-orange-600">
              {habit.currentStreak}
            </span>
          </div>
          {onDeleteHabit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDeleteHabit(habit.id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete habit"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Flame className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current</span>
          </div>
          <p className="text-xl font-bold text-orange-600">{habit.currentStreak}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best</span>
          </div>
          <p className="text-xl font-bold text-green-600">{habit.longestStreak}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rate</span>
          </div>
          <p className="text-xl font-bold text-blue-600">{Math.round(completionRate)}%</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Last 30 Days</h4>
        <div className="grid grid-cols-10 gap-1">
          {last30Days.map((date, index) => {
            const completion = getCompletionForDate(date);
            const isCompleted = completion?.completed || false;
            const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleCompletion(habit.id, format(date, 'yyyy-MM-dd'))}
                className={`
                  w-6 h-6 rounded-md text-xs font-medium transition-all duration-200
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                  ${isToday ? 'ring-2 ring-primary-500 ring-offset-1' : ''}
                `}
                title={`${format(date, 'MMM dd')} - ${isCompleted ? 'Completed' : 'Not completed'}`}
              >
                {format(date, 'd')}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Progress
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {Math.round(completionRate)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{last30DaysCompletions.filter(c => c.completed).length} completed</span>
          <span>30 days</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitTracker;