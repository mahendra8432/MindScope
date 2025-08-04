import React from 'react';
import { Tip } from '../../types';
import { Clock, Star, Target, Zap, Moon, Heart, Users, Brain } from 'lucide-react';

interface TipCardProps {
  tip: Tip;
  onToggleFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

const categoryConfig = {
  mindfulness: { icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  exercise: { icon: Zap, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  sleep: { icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  nutrition: { icon: Heart, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  social: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  stress: { icon: Target, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
};

const difficultyConfig = {
  easy: { label: 'Easy', color: 'text-green-700', bg: 'bg-green-100' },
  medium: { label: 'Medium', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  hard: { label: 'Hard', color: 'text-red-700', bg: 'bg-red-100' },
};

const TipCard: React.FC<TipCardProps> = ({ tip, onToggleFavorite, isFavorited = false }) => {
  const categoryConf = categoryConfig[tip.category];
  const difficultyConf = difficultyConfig[tip.difficulty];
  const CategoryIcon = categoryConf.icon;

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 
      hover:shadow-lg transition-all duration-300 animate-slide-up
      ${tip.featured ? 'ring-2 ring-primary-200 ring-opacity-50' : ''}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${categoryConf.bg} dark:bg-gray-700 p-3 rounded-full border ${categoryConf.border} dark:border-gray-600`}>
            <CategoryIcon className={`w-6 h-6 ${categoryConf.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{tip.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyConf.bg} ${difficultyConf.color}`}>
                {difficultyConf.label}
              </span>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Clock className="w-3 h-3 mr-1" />
                {tip.duration}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {tip.featured && (
            <div className="text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
            </div>
          )}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(tip.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorited 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{tip.content}</p>

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryConf.bg} dark:bg-gray-700 ${categoryConf.color} border ${categoryConf.border} dark:border-gray-600`}>
          {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
        </span>
        
        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors">
          Try Now →
        </button>
      </div>
    </div>
  );
};

export default TipCard;