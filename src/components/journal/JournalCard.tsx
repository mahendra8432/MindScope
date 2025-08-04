import React from 'react';
import { Journal } from '../../types';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { Edit2, Trash2, Tag, Heart, Smile, Meh } from 'lucide-react';

interface JournalCardProps {
  journal: Journal;
  onEdit: (journal: Journal) => void;
  onDelete: (id: string) => void;
}

const moodIcons = {
  positive: { icon: Smile, color: 'text-green-600', bg: 'bg-green-100' },
  neutral: { icon: Meh, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  negative: { icon: Heart, color: 'text-red-600', bg: 'bg-red-100' },
};

const JournalCard: React.FC<JournalCardProps> = ({ journal, onEdit, onDelete }) => {
  const moodConfig = journal.mood ? moodIcons[journal.mood] : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{journal.title}</h3>
            {moodConfig && (
              <div className={`p-1.5 rounded-full ${moodConfig.bg}`}>
                <moodConfig.icon className={`w-4 h-4 ${moodConfig.color}`} />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(journal.date)} • {formatTime(journal.createdAt)}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(journal)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <button
            onClick={() => onDelete(journal.id)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
          {journal.content}
        </p>

        {journal.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {journal.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full border border-primary-200 dark:border-primary-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalCard;