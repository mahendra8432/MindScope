import React from 'react';
import { Mood } from '../../types';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

interface MoodStatsProps {
  moods: Mood[];
}

const MoodStats: React.FC<MoodStatsProps> = ({ moods }) => {
  const moodValues = {
    excellent: 5,
    good: 4,
    neutral: 3,
    poor: 2,
    terrible: 1,
  };

  const averageMood = moods.length > 0 
    ? moods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / moods.length
    : 0;

  const averageIntensity = moods.length > 0
    ? moods.reduce((sum, mood) => sum + mood.intensity, 0) / moods.length
    : 0;

  const recentMoods = moods.slice(0, 7);
  const olderMoods = moods.slice(7, 14);
  
  const recentAverage = recentMoods.length > 0
    ? recentMoods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / recentMoods.length
    : 0;
  
  const olderAverage = olderMoods.length > 0
    ? olderMoods.reduce((sum, mood) => sum + moodValues[mood.moodType], 0) / olderMoods.length
    : 0;

  const trend = recentAverage > olderAverage ? 'up' : recentAverage < olderAverage ? 'down' : 'stable';

  const stats = [
    {
      title: 'Average Mood',
      value: averageMood.toFixed(1),
      subtitle: 'out of 5.0',
      icon: Target,
      color: averageMood >= 4 ? 'text-green-600' : averageMood >= 3 ? 'text-blue-600' : 'text-orange-600',
      bg: averageMood >= 4 ? 'bg-green-50' : averageMood >= 3 ? 'bg-blue-50' : 'bg-orange-50',
    },
    {
      title: 'Intensity Level',
      value: averageIntensity.toFixed(1),
      subtitle: 'out of 10.0',
      icon: TrendingUp,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      title: 'Total Entries',
      value: moods.length.toString(),
      subtitle: 'mood logs',
      icon: Calendar,
      color: 'text-secondary-600',
      bg: 'bg-secondary-50',
    },
    {
      title: 'Trend',
      value: trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→',
      subtitle: trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable',
      icon: trend === 'up' ? TrendingUp : TrendingDown,
      color: trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600',
      bg: trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`${stat.bg} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.bg} border border-gray-200`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MoodStats;