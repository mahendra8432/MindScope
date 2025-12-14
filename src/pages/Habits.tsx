import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Flame, Target, TrendingUp, X, Check } from 'lucide-react';
import { useAPI, useMutation } from '../hooks/useAPI';
import { habitsAPI } from '../services/api';
import { Habit } from '../types';
import HabitTracker from '../components/habits/HabitTracker';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Default habits template
const defaultHabits = [
  {
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day for better health and energy',
    category: 'health',
    frequency: 'daily',
    targetCount: 8,
  },
  {
    name: '10 minutes meditation',
    description: 'Practice mindfulness to reduce stress and improve focus',
    category: 'mindfulness',
    frequency: 'daily',
    targetCount: 1,
  },
  {
    name: 'Read for 30 minutes',
    description: 'Expand knowledge and improve cognitive function',
    category: 'learning',
    frequency: 'daily',
    targetCount: 1,
  },
  {
    name: '30 minutes exercise',
    description: 'Maintain physical fitness and boost energy levels',
    category: 'health',
    frequency: 'daily',
    targetCount: 1,
  },
  {
    name: 'Write in journal',
    description: 'Reflect on daily experiences and thoughts',
    category: 'mindfulness',
    frequency: 'daily',
    targetCount: 1,
  },
  {
    name: 'No phone 1 hour before bed',
    description: 'Improve sleep quality by reducing screen time',
    category: 'health',
    frequency: 'daily',
    targetCount: 1,
  },
];

const Habits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customHabit, setCustomHabit] = useState({
    name: '',
    description: '',
    category: 'health' as const,
    frequency: 'daily' as const,
    targetCount: 1,
  });

  const {
    data: habitsResponse,
    loading,
    error,
    refetch
  } = useAPI(() => habitsAPI.getAll({ isActive: true }), { immediate: true });

  const createMutation = useMutation(habitsAPI.create, {
    onSuccess: () => {
      toast.success('Habit created successfully!');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to create habit');
      console.error(err);
    },
  });

  const deleteMutation = useMutation(habitsAPI.delete, {
    onSuccess: () => {
      console.log('🗑️ Delete successful, refetching habits...');
      toast.success('Habit deleted successfully');
      
      // Force refetch with a small delay to ensure backend processing is complete
      setTimeout(() => {
        refetch();
      }, 100);
    },
    onError: (err) => {
      console.error('🗑️ Delete failed:', err);
      toast.error('Failed to delete habit');
      console.error(err);
    },
  });

  const toggleCompletionMutation = useMutation(habitsAPI.toggleCompletion, {
    onSuccess: () => {
      toast.success('Habit updated');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to update habit');
      console.error(err);
    },
  });

  // Fix: Handle different response structures from useAPI hook
  const habits: Habit[] = (() => {
    if (!habitsResponse) return [];
    
    // If habitsResponse is already an array (useAPI returns data directly)
    if (Array.isArray(habitsResponse)) return habitsResponse;
    
    // If habitsResponse has a data property
    if (Array.isArray(habitsResponse.data)) return habitsResponse.data;
    
    // If habitsResponse has the full API response structure
    if (habitsResponse.status === 'success' && Array.isArray(habitsResponse.data)) {
      return habitsResponse.data;
    }
    
    return [];
  })();

  // Debug logging
  React.useEffect(() => {
    console.log('🔄 Habits Response:', habitsResponse);
    console.log('🔄 Response type:', typeof habitsResponse);
    console.log('🔄 Is array:', Array.isArray(habitsResponse));
    console.log('🔄 Has data property:', habitsResponse?.data);
    console.log('🔄 Parsed Habits:', habits);
    console.log('🔄 Habits length:', habits.length);
    console.log('🔄 Loading:', loading);
    console.log('🔄 Error:', error);
    
    // Log each habit's status
    if (habits.length > 0) {
      console.log('🔄 Individual habits:');
      habits.forEach((habit, index) => {
        console.log(`   ${index + 1}. "${habit.name}" - isActive: ${habit.isActive}, id: ${habit._id}`);
      });
    }
  }, [habitsResponse, habits, loading, error]);

  const handleToggleCompletion = (habitId: string, date: string) => {
    toggleCompletionMutation.mutate(habitId, { date });
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h._id === habitId);
    if (habit && confirm(`Delete "${habit.name}"?`)) {
      deleteMutation.mutate(habitId);
    }
  };

  const handleAddHabit = (habitData: any) => {
    createMutation.mutate(habitData);
  };

  const handleAddCustomHabit = () => {
    if (!customHabit.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }
    createMutation.mutate(customHabit);
    setCustomHabit({ name: '', description: '', category: 'health', frequency: 'daily', targetCount: 1 });
    setShowCustomForm(false);
    setShowHabitForm(false);
  };

  const matchesSearch = (habit: Habit) =>
    habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    habit.description.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory = (habit: Habit) =>
    filterCategory === 'all' || habit.category === filterCategory;

  const filteredHabits = habits.filter(
    habit => matchesSearch(habit) && matchesCategory(habit)
  );

  const today = format(new Date(), 'yyyy-MM-dd');

  // Calculate stats using useMemo to ensure they update when habits change
  const stats = React.useMemo(() => {
    console.log('📊 Calculating stats for habits:', habits.length);
    console.log('📊 All habits:', habits.map(h => ({ name: h.name, isActive: h.isActive, id: h._id })));
    
    // Filter only truly active habits
    const activeHabits = habits.filter(h => {
      // Consider habit active if isActive is not explicitly false
      const isActive = h.isActive !== false;
      console.log(`📊 Habit "${h.name}": isActive = ${h.isActive}, considered active = ${isActive}`);
      return isActive;
    });
    
    console.log('📊 Active habits count:', activeHabits.length);
    console.log('📊 Active habits:', activeHabits.map(h => h.name));
    
    const completedTodayCount = activeHabits.filter(h => 
      h.completions?.some(c => c.date === today && c.completed)
    ).length;
    
    const longestStreakValue = activeHabits.length > 0 ? 
      Math.max(...activeHabits.map(h => h.longestStreak || 0), 0) : 0;
    
    const averageCompletionValue = activeHabits.length > 0
      ? Math.round(
          activeHabits.reduce((sum, habit) => {
            const last30 = habit.completions?.filter(c => {
              const d = new Date(c.date);
              const now = new Date();
              const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              return d >= past && d <= now;
            }) || [];
            return sum + (last30.filter(c => c.completed).length / 30) * 100;
          }, 0) / activeHabits.length
        )
      : 0;
    
    const finalStats = {
      total: activeHabits.length,
      completedToday: completedTodayCount,
      longestStreak: longestStreakValue,
      averageCompletion: averageCompletionValue,
    };
    
    console.log('📊 Final stats:', finalStats);
    return finalStats;
  }, [habits, today]);

  // Show error if there's an API error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Habits</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Daily Habits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Build positive habits and track your consistency over time
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHabitForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Habit</span>
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Habits', value: stats.total, icon: Calendar, color: 'from-blue-500 to-cyan-500' },
          { title: 'Completed Today', value: stats.completedToday, icon: Target, color: 'from-green-500 to-emerald-500' },
          { title: 'Longest Streak', value: stats.longestStreak, icon: Flame, color: 'from-orange-500 to-red-500' },
          { title: 'Avg Completion', value: `${stats.averageCompletion}%`, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none min-w-[150px]"
          >
            <option value="all">All Categories</option>
            <option value="health">Health</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="productivity">Productivity</option>
            <option value="social">Social</option>
            <option value="learning">Learning</option>
          </select>
        </div>
      </motion.div>

      {/* Habits Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHabits.map((habit, index) => (
            <motion.div
              key={habit._id} // Back to using just _id since we'll fix the real issue
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <HabitTracker
                habit={habit}
                onToggleCompletion={handleToggleCompletion}
                onDeleteHabit={handleDeleteHabit}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filteredHabits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-6">📅</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {loading ? 'Loading...' : habits.length === 0 ? 'No habits created yet' : 'No habits match your search'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {habits.length === 0 
              ? 'Start building positive habits that will improve your daily life and well-being.'
              : 'Try adjusting your search terms or filters to find what you\'re looking for.'
            }
          </p>
          {habits.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHabitForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-medium shadow-lg"
            >
              Create Your First Habit
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Habit Form Modal */}
      <AnimatePresence>
        {showHabitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Add New Habit
                  </h2>
                  <button
                    onClick={() => {
                      setShowHabitForm(false);
                      setShowCustomForm(false);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {!showCustomForm ? (
                  <>
                    {/* Create Custom Habit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCustomForm(true)}
                      className="w-full mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-600 transition-all"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                          Create Your Own Habit
                        </span>
                      </div>
                      <p className="text-sm text-purple-500 dark:text-purple-400 mt-2">
                        Design a custom habit that fits your unique goals
                      </p>
                    </motion.button>

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Or choose from popular habits:
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {defaultHabits.map((habit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {habit.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {habit.description}
                              </p>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                {habit.category}
                              </span>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              handleAddHabit(habit);
                              setShowHabitForm(false);
                            }}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span>Add Habit</span>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Habit Name *
                      </label>
                      <input
                        type="text"
                        value={customHabit.name}
                        onChange={(e) => setCustomHabit({ ...customHabit, name: e.target.value })}
                        placeholder="e.g., Drink more water, Exercise daily..."
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={customHabit.description}
                        onChange={(e) => setCustomHabit({ ...customHabit, description: e.target.value })}
                        placeholder="Describe your habit and why it's important to you..."
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-24 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={customHabit.category}
                        onChange={(e) => setCustomHabit({ ...customHabit, category: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="health">Health</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="productivity">Productivity</option>
                        <option value="social">Social</option>
                        <option value="learning">Learning</option>
                      </select>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowCustomForm(false)}
                        className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAddCustomHabit}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg"
                      >
                        Create Habit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Habits;