import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Heart, BookOpen, Lightbulb, TrendingUp, Smile, Plus, 
  Target, Award, Zap, Brain, Activity, Sparkles, Crown, Gift, Clock, X, Play
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';
import { useAPI } from '../hooks/useAPI';
import { moodAPI, journalAPI, goalsAPI, habitsAPI, analyticsAPI } from '../services/api';
import { Mood, Journal, Goal, Habit } from '../types';
import { mockTips } from '../data/mockData';
import MoodChart from '../components/analytics/MoodChart';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  // Fetch real data from API
  const { data: moodsResponse, refetch: refetchMoods } = useAPI(() => moodAPI.getAll(), { immediate: true });
  const { data: journalsResponse, refetch: refetchJournals } = useAPI(() => journalAPI.getAll(), { immediate: true });
  const { data: goalsResponse, refetch: refetchGoals } = useAPI(() => goalsAPI.getAll(), { immediate: true });
  const { data: habitsResponse, refetch: refetchHabits } = useAPI(() => habitsAPI.getAll(), { immediate: true });
  const { data: analyticsResponse, refetch: refetchAnalytics } = useAPI(() => analyticsAPI.getDashboard(), { immediate: true });
  
  const moods = moodsResponse?.data || [];
  const journals = journalsResponse?.data || [];
  const goals = goalsResponse?.data || [];
  const habits = habitsResponse?.data || [];
  const analytics = analyticsResponse?.data || {
    summary: { averageMood: 0, totalWords: 0, moodEntries: 0, journalEntries: 0, activeHabits: 0 },
    weeklyMoodData: [],
    moodDistribution: [],
    journalStats: { totalEntries: 0, totalWords: 0, averageWords: 0, categoriesUsed: 0 },
    habitStats: [],
    insights: []
  };
  
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Rotate daily tip based on current date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setCurrentTipIndex(dayOfYear % mockTips.length);
  }, []);

  // Refetch all data when component mounts or when data changes
  const refetchAllData = () => {
    console.log('🔄 Refreshing all dashboard data...');
    refetchMoods();
    refetchJournals();
    refetchGoals();
    refetchHabits();
    refetchAnalytics();
  };

  // Auto-refresh data every 30 seconds to catch any missed updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAllData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for storage events to refresh data when other tabs make changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'data-updated') {
        refetchAllData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const quickActions = [
    { 
      title: 'Log Mood', 
      icon: Heart, 
      color: 'from-red-500 to-pink-500', 
      action: () => navigate('/mood'),
      description: 'Track your current emotional state'
    },
    { 
      title: 'New Journal', 
      icon: BookOpen, 
      color: 'from-green-500 to-emerald-500', 
      action: () => navigate('/journal'),
      description: 'Write your thoughts and reflections'
    },
    { 
      title: 'Set Goal', 
      icon: Target, 
      color: 'from-purple-500 to-violet-500', 
      action: () => navigate('/goals'),
      description: 'Create a new personal goal'
    },
    { 
      title: 'Track Habit', 
      icon: Calendar, 
      color: 'from-blue-500 to-cyan-500', 
      action: () => navigate('/habits'),
      description: 'Mark today\'s habit completion'
    },
  ];

  // Check actual achievements based on user data
  const checkAchievements = () => {
    const moodStreak = moods.length >= 7;
    const journalCount = journals.length >= 10;
    
    const allGoalsCompleted = goals.length > 0 && goals.every(g => g.status === 'completed');
    
    const habitStreak = habits.some(h => h.currentStreak >= 30);

    return {
      moodStreak,
      journalCount,
      allGoalsCompleted,
      habitStreak
    };
  };

  const achievementStatus = checkAchievements();

  const achievements = [
    { 
      title: '7-Day Streak', 
      icon: Zap, 
      unlocked: achievementStatus.moodStreak, 
      description: 'Logged mood for 7 consecutive days',
      onClick: () => {
        if (achievementStatus.moodStreak) {
          addNotification({
            type: 'achievement',
            title: '🔥 Streak Master!',
            message: 'You\'ve maintained a 7-day mood tracking streak! Keep it up!'
          });
          toast.success('Achievement unlocked: 7-Day Streak! 🔥');
        } else {
          toast(`Log your mood for ${7 - moods.length} more days to unlock this achievement!`, { icon: '🎯' });
        }
      }
    },
    { 
      title: 'Mindful Writer', 
      icon: BookOpen, 
      unlocked: achievementStatus.journalCount, 
      description: 'Written 10 journal entries',
      onClick: () => {
        if (achievementStatus.journalCount) {
          addNotification({
            type: 'achievement',
            title: '📝 Mindful Writer!',
            message: 'You\'ve written 10 thoughtful journal entries. Your reflection journey is inspiring!'
          });
          toast.success('Achievement unlocked: Mindful Writer! 📝');
        } else {
          toast(`Write ${10 - journals.length} more journal entries to unlock this achievement!`, { icon: '📝' });
        }
      }
    },
    { 
      title: 'Goal Master', 
      icon: Target, 
      unlocked: achievementStatus.allGoalsCompleted, 
      description: 'Complete all your goals',
      onClick: () => {
        if (achievementStatus.allGoalsCompleted) {
          addNotification({
            type: 'achievement',
            title: '🎯 Goal Master!',
            message: 'You\'ve completed all your goals! You\'re truly mastering your life objectives.'
          });
          toast.success('Achievement unlocked: Goal Master! 🎯');
        } else {
          const incompleteGoals = goals.filter(g => g.status !== 'completed').length;
          if (goals.length === 0) {
            toast('Set and complete your first goal to unlock this achievement!', { icon: '🎯' });
          } else {
            toast(`Complete ${incompleteGoals} more goals to unlock this achievement!`, { icon: '🎯' });
          }
        }
      }
    },
    { 
      title: 'Habit Master', 
      icon: Crown, 
      unlocked: achievementStatus.habitStreak, 
      description: 'Maintain a 30-day habit streak',
      onClick: () => {
        if (achievementStatus.habitStreak) {
          addNotification({
            type: 'achievement',
            title: '👑 Habit Master!',
            message: 'You\'ve maintained a 30-day habit streak! You\'re truly mastering consistency.'
          });
          toast.success('Achievement unlocked: Habit Master! 👑');
        } else {
          toast('Maintain a 30-day habit streak to unlock this achievement!', { icon: '👑' });
        }
      }
    },
  ];

  const quickTips = [
    {
      title: '5-Minute Breathing Exercise',
      description: 'Simple deep breathing to reduce stress and increase focus',
      duration: 5,
      instructions: 'Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat for 5 minutes.',
    },
    {
      title: 'Gratitude Reflection',
      description: 'Think of 3 things you\'re grateful for today',
      duration: 3,
      instructions: 'Close your eyes and think of three specific things you\'re grateful for. Feel the appreciation.',
    },
    {
      title: 'Body Scan Meditation',
      description: 'Quick body awareness exercise to release tension',
      duration: 10,
      instructions: 'Start from your toes and mentally scan up through your body, noticing any tension.',
    },
    {
      title: 'Mindful Walking',
      description: 'Take a short walk focusing on your surroundings',
      duration: 15,
      instructions: 'Walk slowly and pay attention to what you see, hear, and feel around you.',
    },
    {
      title: 'Positive Affirmations',
      description: 'Repeat encouraging statements to boost confidence',
      duration: 5,
      instructions: 'Say 3 positive affirmations about yourself out loud or in your mind.',
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release muscle groups to reduce physical stress',
      duration: 12,
      instructions: 'Tense each muscle group for 5 seconds, then relax. Start with your feet and work up.',
    },
    {
      title: 'Mindful Eating',
      description: 'Eat a small snack with full attention and awareness',
      duration: 10,
      instructions: 'Choose a healthy snack and eat it slowly, focusing on taste, texture, and smell.',
    },
    {
      title: 'Visualization Exercise',
      description: 'Imagine a peaceful place to reduce anxiety',
      duration: 8,
      instructions: 'Close your eyes and visualize a calm, peaceful place in detail.',
    },
    {
      title: 'Stretching Break',
      description: 'Simple stretches to release physical tension',
      duration: 7,
      instructions: 'Do gentle neck, shoulder, and back stretches. Hold each stretch for 30 seconds.',
    },
    {
      title: 'Journaling Prompt',
      description: 'Quick reflection on your current feelings',
      duration: 10,
      instructions: 'Write about how you\'re feeling right now and what might be causing those feelings.',
    },
    {
      title: 'Cold Water Face Splash',
      description: 'Instant energy boost and mental clarity',
      duration: 2,
      instructions: 'Splash cold water on your face and wrists. Take 3 deep breaths.',
    },
    {
      title: 'Power Pose',
      description: 'Stand confidently to boost self-esteem',
      duration: 3,
      instructions: 'Stand with feet shoulder-width apart, hands on hips, chin up for 2 minutes.',
    },
    {
      title: 'Desk Yoga',
      description: 'Simple yoga poses you can do at your desk',
      duration: 8,
      instructions: 'Do neck rolls, shoulder shrugs, and seated spinal twists.',
    },
    {
      title: 'Mindful Tea/Coffee',
      description: 'Drink your beverage with full attention',
      duration: 10,
      instructions: 'Focus on the aroma, temperature, and taste of your drink.',
    },
    {
      title: 'Quick Declutter',
      description: 'Organize your immediate space for mental clarity',
      duration: 15,
      instructions: 'Spend 15 minutes organizing your desk or immediate surroundings.',
    },
  ];

  const getAIInsights = () => {
    const insights = [];
    
    if (moods.length === 0) {
      insights.push({
        title: 'Start Your Wellness Journey',
        description: 'Begin by tracking your mood daily. This simple habit can provide valuable insights into your emotional patterns and help you identify what affects your wellbeing.',
        importance: 'high' as const
      });
    } else if (moods.length < 7) {
      insights.push({
        title: 'Build Consistency',
        description: 'You\'ve started tracking your mood! Try to log your feelings daily for at least a week to begin seeing meaningful patterns in your emotional wellbeing.',
        importance: 'medium' as const
      });
    }

    if (journals.length === 0) {
      insights.push({
        title: 'Try Journaling',
        description: 'Writing down your thoughts can be incredibly therapeutic. Start with just 5 minutes a day reflecting on your experiences, feelings, or things you\'re grateful for.',
        importance: 'medium' as const
      });
    }

    if (goals.length === 0) {
      insights.push({
        title: 'Set Meaningful Goals',
        description: 'Having clear, achievable goals gives direction to your wellness journey. Consider setting a small, specific goal related to your mental or physical health.',
        importance: 'medium' as const
      });
    }

    if (habits.length === 0) {
      insights.push({
        title: 'Build Healthy Habits',
        description: 'Small daily habits compound over time to create significant positive changes. Start with one simple habit like drinking more water or taking a short walk.',
        importance: 'medium' as const
      });
    }

    // Add positive insights if user has data
    if (moods.length >= 7) {
      const recentMoods = moods.slice(0, 7);
      const avgMood = recentMoods.reduce((sum, mood) => {
        const moodValues = { excellent: 5, good: 4, neutral: 3, poor: 2, terrible: 1 };
        return sum + moodValues[mood.moodType];
      }, 0) / recentMoods.length;

      if (avgMood >= 4) {
        insights.push({
          title: 'Positive Mood Trend',
          description: 'Your mood has been consistently positive this week! Keep up the great work with whatever strategies are working for you.',
          importance: 'low' as const
        });
      }
    }

    // Default insights if no specific recommendations
    if (insights.length === 0) {
      insights.push(
        {
          title: 'Practice Mindfulness',
          description: 'Take a few minutes each day to practice mindfulness. Even 5 minutes of deep breathing or meditation can significantly improve your mental clarity and reduce stress.',
          importance: 'medium' as const
        },
        {
          title: 'Stay Hydrated',
          description: 'Drinking enough water is crucial for both physical and mental wellbeing. Aim for 8 glasses a day to maintain optimal brain function and energy levels.',
          importance: 'low' as const
        },
        {
          title: 'Connect with Others',
          description: 'Social connections are vital for mental health. Reach out to a friend or family member today, even if it\'s just a quick message to say hello.',
          importance: 'medium' as const
        }
      );
    }

    return insights.slice(0, 3); // Return max 3 insights
  };

  const handleQuickAction = (action: () => void, title: string) => {
    action();
    // Trigger data refresh after navigation
    setTimeout(() => {
      refetchAllData();
      localStorage.setItem('data-updated', Date.now().toString());
    }, 500);
  };

  const handleTipClick = () => {
    setShowTipsModal(true);
  };

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setTimerActive(true);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          toast.success('Timer completed! Great job! 🎉');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDailyTip = mockTips[currentTipIndex];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-gray-900 dark:to-secondary-900/20 rounded-3xl p-8 border border-primary-100 dark:border-primary-800"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-200/30 to-primary-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
            </h1>
          </div>
          
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            You're on a <span className="font-semibold text-primary-600 dark:text-primary-400">12-day streak</span> of mindful living! 
            Here's your wellness summary for today.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickAction(action.action, action.title)}
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{action.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
            >
              <Activity className="w-4 h-4" />
              <span>Mood: {analytics.summary.averageMood.toFixed(1)}/5.0</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              <span>{analytics.summary.totalWords} words written</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium"
            >
              <Target className="w-4 h-4" />
              <span>{goals.filter(g => g.status === 'completed').length} goals completed</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MoodChart data={analytics.weeklyMoodData} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Achievements
            </h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={achievement.onClick}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className={`p-3 rounded-full ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.unlocked 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-yellow-500"
                    >
                      <Crown className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Insights & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Personalized recommendations based on your data</p>
            </div>
          </div>

          <div className="space-y-4">
            {getAIInsights().map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    insight.importance === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                    insight.importance === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                    'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  }`}>
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={handleTipClick}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Daily Tip</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {currentDailyTip.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {currentDailyTip.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {currentDailyTip.duration}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {currentDailyTip.difficulty}
                </span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                Try Now →
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tips Modal */}
      <AnimatePresence>
        {showTipsModal && (
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
                    Quick Wellness Tips
                  </h2>
                  <button
                    onClick={() => {
                      setShowTipsModal(false);
                      setSelectedTip(null);
                      setTimerActive(false);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {!selectedTip ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedTip(tip)}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {tip.title}
                          </h3>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{tip.duration}m</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {tip.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedTip.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {selectedTip.description}
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Instructions:</h4>
                        <p className="text-gray-700 dark:text-gray-300">{selectedTip.instructions}</p>
                      </div>
                    </div>

                    {timerActive && (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {formatTime(timeLeft)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Time remaining</p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startTimer(selectedTip.duration)}
                        disabled={timerActive}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="w-5 h-5" />
                        <span>{timerActive ? 'Timer Running...' : 'Try Now'}</span>
                      </motion.button>
                    </div>

                    <button
                      onClick={() => setSelectedTip(null)}
                      className="w-full px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Back to Tips
                    </button>
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

export default Dashboard;