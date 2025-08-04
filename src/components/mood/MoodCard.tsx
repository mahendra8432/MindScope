import React from 'react';
import { Mood } from '../../types';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { Edit2, Trash2, Smile, Meh, Frown } from 'lucide-react';

interface MoodCardProps {
  mood: Mood;
  onEdit: (mood: Mood) => void;
  onDelete: (id: string) => void;
}

const moodConfig = {
  excellent: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Smile, label: 'Excellent' },
  good: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Smile, label: 'Good' },
  neutral: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Meh, label: 'Neutral' },
  poor: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: Frown, label: 'Poor' },
  terrible: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: Frown, label: 'Terrible' },
};

const MoodCard: React.FC<MoodCardProps> = ({ mood, onEdit, onDelete }) => {
  const config = moodConfig[mood.moodType];
  const Icon = config.icon;

  return (
    <div className={`
      bg-white dark:bg-gray-800 ${config.border} border rounded-xl p-6 
      hover:shadow-md transition-all duration-200 animate-slide-up
      border-gray-200 dark:border-gray-700
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${config.bg} p-3 rounded-full border ${config.border} shadow-sm`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${config.color} text-lg`}>{config.label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(mood.date)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${config.color}`}>
            {mood.intensity}/10
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(mood)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200"
            >
              <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <button
              onClick={() => onDelete(mood.id)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {mood.note && (
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{mood.note}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(mood.createdAt)}</p>
        </div>
      )}

      {/* Intensity bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Intensity</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{mood.intensity}/10</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              mood.intensity >= 8 ? 'bg-green-500' :
              mood.intensity >= 6 ? 'bg-blue-500' :
              mood.intensity >= 4 ? 'bg-yellow-500' :
              mood.intensity >= 2 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${mood.intensity * 10}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MoodCard;