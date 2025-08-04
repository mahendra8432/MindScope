const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Public
const getDashboardAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get mood analytics
    const moods = await Mood.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });
    
    // Get journal analytics
    const journals = await Journal.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });
    
    // Get goal analytics
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    // Get habit analytics
    const habits = await Habit.find({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
    
    // Calculate mood statistics
    const moodStats = calculateMoodStats(moods);
    
    // Calculate journal statistics
    const journalStats = calculateJournalStats(journals);
    
    // Calculate goal statistics
    const goalStats = calculateGoalStats(goals);
    
    // Calculate habit statistics
    const habitStats = calculateHabitStats(habits);
    
    // Generate insights
    const insights = generateInsights(moods, journals, goals, habits);
    
    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalMoods: moods.length,
          totalJournals: journals.length,
          totalGoals: goals.length,
          totalHabits: habits.length,
          averageMood: moodStats.averageMood,
          totalWords: journalStats.totalWords,
          completedGoals: goalStats.completed,
          activeHabits: habits.filter(h => h.isActive).length
        },
        moodStats,
        journalStats,
        goalStats,
        habitStats,
        insights,
        weeklyMoodData: generateWeeklyMoodData(moods),
        moodDistribution: generateMoodDistribution(moods)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
};

// @desc    Get mood trends
// @route   GET /api/analytics/mood-trends
// @access  Public
const getMoodTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const moods = await Mood.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ date: 1 });
    
    const weeklyData = generateWeeklyMoodData(moods);
    const distribution = generateMoodDistribution(moods);
    const trends = calculateMoodTrends(moods);
    
    res.status(200).json({
      status: 'success',
      data: {
        weeklyData,
        distribution,
        trends,
        totalEntries: moods.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching mood trends',
      error: error.message
    });
  }
};

// Helper functions
function calculateMoodStats(moods) {
  if (moods.length === 0) {
    return {
      averageMood: 0,
      averageIntensity: 0,
      averageEnergy: 0,
      averageStress: 0,
      totalEntries: 0
    };
  }
  
  const moodValues = {
    excellent: 5,
    good: 4,
    neutral: 3,
    poor: 2,
    terrible: 1
  };
  
  const totalMoodValue = moods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0);
  const totalIntensity = moods.reduce((sum, mood) => sum + mood.intensity, 0);
  const totalEnergy = moods.reduce((sum, mood) => sum + (mood.energy || 5), 0);
  const totalStress = moods.reduce((sum, mood) => sum + (mood.stress || 5), 0);
  
  return {
    averageMood: Number((totalMoodValue / moods.length).toFixed(1)),
    averageIntensity: Number((totalIntensity / moods.length).toFixed(1)),
    averageEnergy: Number((totalEnergy / moods.length).toFixed(1)),
    averageStress: Number((totalStress / moods.length).toFixed(1)),
    totalEntries: moods.length
  };
}

function calculateJournalStats(journals) {
  const totalWords = journals.reduce((sum, journal) => sum + journal.wordCount, 0);
  const averageWords = journals.length > 0 ? Math.round(totalWords / journals.length) : 0;
  const categories = [...new Set(journals.map(j => j.category))];
  
  return {
    totalEntries: journals.length,
    totalWords,
    averageWords,
    categoriesUsed: categories.length,
    categories
  };
}

function calculateGoalStats(goals) {
  const completed = goals.filter(g => g.status === 'completed').length;
  const inProgress = goals.filter(g => g.status === 'in-progress').length;
  const notStarted = goals.filter(g => g.status === 'not-started').length;
  const paused = goals.filter(g => g.status === 'paused').length;
  
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;
  
  return {
    total: goals.length,
    completed,
    inProgress,
    notStarted,
    paused,
    averageProgress
  };
}

function calculateHabitStats(habits) {
  return habits.map(habit => {
    const recentCompletions = habit.completions.filter(completion => {
      const completionDate = new Date(completion.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return completionDate >= thirtyDaysAgo && completion.completed;
    });
    
    const completionRate = Math.round((recentCompletions.length / 30) * 100);
    
    return {
      id: habit._id,
      name: habit.name,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      recentCompletionRate: completionRate,
      recentCompletions: recentCompletions.length
    };
  });
}

function generateWeeklyMoodData(moods) {
  const weekData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayMoods = moods.filter(mood => mood.date === dateStr);
    
    const moodValues = {
      excellent: 5,
      good: 4,
      neutral: 3,
      poor: 2,
      terrible: 1
    };
    
    const avgMood = dayMoods.length > 0 
      ? dayMoods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / dayMoods.length
      : 0;
    
    const avgIntensity = dayMoods.length > 0
      ? dayMoods.reduce((sum, mood) => sum + mood.intensity, 0) / dayMoods.length
      : 0;
    
    const avgEnergy = dayMoods.length > 0
      ? dayMoods.reduce((sum, mood) => sum + (mood.energy || 5), 0) / dayMoods.length
      : 0;
    
    const avgStress = dayMoods.length > 0
      ? dayMoods.reduce((sum, mood) => sum + (mood.stress || 5), 0) / dayMoods.length
      : 0;
    
    weekData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: Number(avgMood.toFixed(1)),
      intensity: Number(avgIntensity.toFixed(1)),
      energy: Number(avgEnergy.toFixed(1)),
      stress: Number(avgStress.toFixed(1))
    });
  }
  
  return weekData;
}

function generateMoodDistribution(moods) {
  const distribution = {
    Excellent: 0,
    Good: 0,
    Neutral: 0,
    Poor: 0,
    Terrible: 0
  };
  
  moods.forEach(mood => {
    const moodType = mood.moodType.charAt(0).toUpperCase() + mood.moodType.slice(1);
    distribution[moodType]++;
  });
  
  const total = moods.length;
  
  return Object.entries(distribution).map(([mood, count]) => ({
    mood,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));
}

function calculateMoodTrends(moods) {
  if (moods.length < 14) {
    return { trend: 'insufficient_data', change: 0 };
  }
  
  const moodValues = {
    excellent: 5,
    good: 4,
    neutral: 3,
    poor: 2,
    terrible: 1
  };
  
  const recentWeek = moods.slice(-7);
  const previousWeek = moods.slice(-14, -7);
  
  const recentAvg = recentWeek.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / recentWeek.length;
  const previousAvg = previousWeek.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / previousWeek.length;
  
  const change = Number((recentAvg - previousAvg).toFixed(2));
  
  let trend = 'stable';
  if (change > 0.3) trend = 'improving';
  else if (change < -0.3) trend = 'declining';
  
  return { trend, change };
}

function generateInsights(moods, journals, goals, habits) {
  const insights = [];
  
  // Mood insights
  if (moods.length === 0) {
    insights.push({
      type: 'mood-pattern',
      title: 'Start Your Wellness Journey',
      description: 'Begin by tracking your mood daily. This simple habit can provide valuable insights into your emotional patterns.',
      importance: 'high'
    });
  } else if (moods.length >= 7) {
    const moodValues = { excellent: 5, good: 4, neutral: 3, poor: 2, terrible: 1 };
    const avgMood = moods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / moods.length;
    
    if (avgMood >= 4) {
      insights.push({
        type: 'mood-pattern',
        title: 'Positive Mood Trend',
        description: 'Your mood has been consistently positive! Keep up the great work with whatever strategies are working for you.',
        importance: 'low'
      });
    }
  }
  
  // Journal insights
  if (journals.length === 0) {
    insights.push({
      type: 'journal-theme',
      title: 'Try Journaling',
      description: 'Writing down your thoughts can be incredibly therapeutic. Start with just 5 minutes a day.',
      importance: 'medium'
    });
  } else if (journals.length >= 10) {
    insights.push({
      type: 'journal-theme',
      title: 'Excellent Journaling Habit',
      description: `You've written ${journals.length} thoughtful entries. Your reflection journey is inspiring!`,
      importance: 'low'
    });
  }
  
  // Goal insights
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  if (goals.length > 0 && completedGoals === goals.length) {
    insights.push({
      type: 'goal-progress',
      title: 'Goal Master',
      description: 'You\'ve completed all your goals! You\'re truly mastering your life objectives.',
      importance: 'low'
    });
  }
  
  // Habit insights
  const highPerformingHabits = habits.filter(h => {
    const recentCompletions = h.completions.filter(c => {
      const date = new Date(c.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo && c.completed;
    });
    return (recentCompletions.length / 30) >= 0.8;
  });
  
  if (highPerformingHabits.length > 0) {
    insights.push({
      type: 'habit-streak',
      title: 'Habit Champion',
      description: `You're maintaining excellent consistency with ${highPerformingHabits.length} habit${highPerformingHabits.length > 1 ? 's' : ''}!`,
      importance: 'low'
    });
  }
  
  return insights.slice(0, 5); // Return max 5 insights
}

module.exports = {
  getDashboardAnalytics,
  getMoodTrends
};