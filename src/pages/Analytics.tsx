import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Activity, Brain, Target } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import { analyticsAPI } from '../services/api';
import MoodChart from '../components/analytics/MoodChart';
import MoodDistribution from '../components/analytics/MoodDistribution';

const Analytics: React.FC = () => {
  // API hooks
  const { data: analyticsResponse, loading, refetch } = useAPI(() => analyticsAPI.getDashboard(), { immediate: true });
  
  const analytics = analyticsResponse?.data || {
    summary: { averageMood: 0, totalWords: 0, moodEntries: 0, journalEntries: 0, activeHabits: 0 },
    weeklyMoodData: [],
    moodDistribution: [],
    journalStats: { totalEntries: 0, totalWords: 0, averageWords: 0, categoriesUsed: 0 },
    habitStats: [],
    insights: []
  };

  // Auto-refresh analytics data every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing analytics data...');
      refetch();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Listen for data updates from other components
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'data-updated') {
        console.log('🔄 Data updated elsewhere, refreshing analytics...');
        refetch();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refetch]);
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);
  const insightCards = [
    {
      title: 'Mood Trends',
      description: 'Your mood has been trending upward this week',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      value: '+12%',
    },
    {
      title: 'Journal Consistency',
      description: 'You\'ve maintained excellent writing habits',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      value: '85%',
    },
    {
      title: 'Habit Success',
      description: 'Your habit completion rate is impressive',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      value: '92%',
    },
    {
      title: 'Wellness Score',
      description: 'Overall wellness index based on all metrics',
      icon: Activity,
      color: 'from-orange-500 to-red-500',
      value: '8.2/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover patterns in your wellness journey with detailed analytics and AI-powered insights
        </p>
      </motion.div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {card.value}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {!loading && (
          <>
            <MoodChart data={analytics.weeklyMoodData} />
            <MoodDistribution data={analytics.moodDistribution} />
          </>
        )}
        {loading && (
          <div className="col-span-2 text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
          </div>
        )}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Journal Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Journal Statistics
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Entries</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {analytics.journalStats.totalEntries}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Words Written</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {analytics.journalStats.totalWords.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Avg Words/Entry</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {analytics.journalStats.averageWordsPerEntry}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Categories Used</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {analytics.journalStats.categoriesUsed}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Habit Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Habit Performance
            </h3>
          </div>

          <div className="space-y-4">
            {analytics.habitStats.slice(0, 3).map((habit, index) => (
              <div key={habit.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {habit.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {habit.recentCompletionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${habit.recentCompletionRate}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Insights
            </h3>
          </div>

          <div className="space-y-4">
            {analytics.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {insight.description}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  insight.importance === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                  insight.importance === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`}>
                  {insight.importance} priority
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;