import { useMemo } from 'react';
import { Mood, Journal, Habit } from '../types';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subDays, isWithinInterval } from 'date-fns';

export function useAnalytics(moods: Mood[], journals: Journal[], habits: Habit[]) {
  const analytics = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const last30Days = subDays(now, 30);

    // Mood Analytics
    const moodValues = {
      excellent: 5,
      good: 4,
      neutral: 3,
      poor: 2,
      terrible: 1,
    };

    const recentMoods = moods.filter(mood => 
      new Date(mood.date) >= last30Days
    );

    const weeklyMoodData = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(date => {
      const dayMoods = moods.filter(mood => 
        format(new Date(mood.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const avgMood = dayMoods.length > 0 
        ? dayMoods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / dayMoods.length
        : 0;

      const avgIntensity = dayMoods.length > 0
        ? dayMoods.reduce((sum, mood) => sum + mood.intensity, 0) / dayMoods.length
        : 0;

      return {
        date: format(date, 'MMM dd'),
        mood: Number(avgMood.toFixed(1)),
        intensity: Number(avgIntensity.toFixed(1)),
        energy: dayMoods.length > 0 
          ? Number((dayMoods.reduce((sum, mood) => sum + (mood.energy || 5), 0) / dayMoods.length).toFixed(1))
          : 0,
        stress: dayMoods.length > 0 
          ? Number((dayMoods.reduce((sum, mood) => sum + (mood.stress || 5), 0) / dayMoods.length).toFixed(1))
          : 0,
      };
    });

    // Mood distribution
    const moodDistribution = Object.entries(moodValues).map(([mood, value]) => ({
      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
      count: recentMoods.filter(m => m.moodType === mood).length,
      percentage: recentMoods.length > 0 
        ? Math.round((recentMoods.filter(m => m.moodType === mood).length / recentMoods.length) * 100)
        : 0,
    }));

    // Journal Analytics
    const recentJournals = journals.filter(journal => 
      new Date(journal.date) >= last30Days
    );

    const journalStats = {
      totalEntries: journals.length,
      recentEntries: recentJournals.length,
      totalWords: journals.reduce((sum, journal) => sum + journal.wordCount, 0),
      averageWordsPerEntry: journals.length > 0 
        ? Math.round(journals.reduce((sum, journal) => sum + journal.wordCount, 0) / journals.length)
        : 0,
      categoriesUsed: [...new Set(journals.map(j => j.category))].length,
    };

    // Habit Analytics
    const habitStats = habits.map(habit => {
      const recentCompletions = habit.completions.filter(completion => 
        isWithinInterval(new Date(completion.date), { start: last30Days, end: now })
      );
      
      const completionRate = recentCompletions.length > 0 
        ? (recentCompletions.filter(c => c.completed).length / recentCompletions.length) * 100
        : 0;

      return {
        ...habit,
        recentCompletionRate: Math.round(completionRate),
        recentCompletions: recentCompletions.filter(c => c.completed).length,
      };
    });

    // Overall insights
    const insights = [];

    // Mood trend insight
    if (recentMoods.length >= 7) {
      const firstWeekAvg = recentMoods.slice(-14, -7).reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / 7;
      const lastWeekAvg = recentMoods.slice(-7).reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / 7;
      const trend = lastWeekAvg - firstWeekAvg;

      if (Math.abs(trend) > 0.3) {
        insights.push({
          type: 'mood-trend',
          title: trend > 0 ? 'Mood Improving' : 'Mood Declining',
          description: `Your average mood has ${trend > 0 ? 'improved' : 'declined'} by ${Math.abs(trend).toFixed(1)} points this week.`,
          importance: Math.abs(trend) > 0.5 ? 'high' : 'medium',
        });
      }
    }

    // Journal consistency insight
    if (recentJournals.length > 0) {
      const consistency = (recentJournals.length / 30) * 100;
      if (consistency >= 80) {
        insights.push({
          type: 'journal-consistency',
          title: 'Excellent Journaling Habit',
          description: `You've been journaling consistently with ${Math.round(consistency)}% frequency this month.`,
          importance: 'medium',
        });
      }
    }

    return {
      weeklyMoodData,
      moodDistribution,
      journalStats,
      habitStats,
      insights,
      summary: {
        averageMood: recentMoods.length > 0 
          ? Number((recentMoods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / recentMoods.length).toFixed(1))
          : 0,
        moodEntries: recentMoods.length,
        journalEntries: recentJournals.length,
        activeHabits: habits.filter(h => h.isActive).length,
        totalWords: journalStats.totalWords,
      }
    };
  }, [moods, journals, habits]);

  return analytics;
}