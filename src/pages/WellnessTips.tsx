import React, { useState } from 'react';
import { Search, Filter, Star, Heart } from 'lucide-react';
import { useAPI, useMutation } from '../hooks/useAPI';
import { tipsAPI } from '../services/api';
import { Tip } from '../types';
import TipCard from '../components/tips/TipCard';
import toast from 'react-hot-toast';

const WellnessTips: React.FC = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteTips', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // API hooks
  const { data: tipsResponse, loading } = useAPI(() => tipsAPI.getAll());
  const completeTipMutation = useMutation(tipsAPI.complete, {
    onSuccess: () => {
      toast.success('Tip completed! Great job! 🎉');
    }
  });

  const tips = tipsResponse?.data || [];

  const categories = ['all', 'mindfulness', 'exercise', 'sleep', 'nutrition', 'social', 'stress'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const handleToggleFavorite = (tipId: string) => {
    setFavorites(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tip.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || tip.difficulty === difficultyFilter;
    const matchesFavorites = !showFavoritesOnly || favorites.includes(tip.id);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites;
  });

  const featuredTips = filteredTips.filter(tip => tip.featured);
  const regularTips = filteredTips.filter(tip => !tip.featured);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wellness Tips</h1>
          <p className="text-gray-600 mt-1">Practical advice for better mental health and wellbeing</p>
        </div>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors font-medium ${
            showFavoritesOnly 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          <span>{showFavoritesOnly ? 'Show All' : 'Favorites Only'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
          <h3 className="text-2xl font-bold text-primary-700 mb-1">{tips.length}</h3>
          <p className="text-primary-600 font-medium">Total Tips</p>
        </div>
        <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-100">
          <h3 className="text-2xl font-bold text-secondary-700 mb-1">{featuredTips.length}</h3>
          <p className="text-secondary-600 font-medium">Featured</p>
        </div>
        <div className="bg-accent-50 rounded-xl p-6 border border-accent-100">
          <h3 className="text-2xl font-bold text-accent-700 mb-1">{favorites.length}</h3>
          <p className="text-accent-600 font-medium">Favorites</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-2xl font-bold text-purple-700 mb-1">{categories.length - 1}</h3>
          <p className="text-purple-600 font-medium">Categories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white min-w-[140px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white min-w-[120px]"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Tips */}
      {featuredTips.length > 0 && !showFavoritesOnly && (
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <h2 className="text-xl font-semibold text-gray-900">Featured Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featuredTips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                onToggleFavorite={handleToggleFavorite}
                isFavorited={favorites.includes(tip.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Tips */}
      {regularTips.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {showFavoritesOnly ? 'Your Favorite Tips' : 'More Tips'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                onToggleFavorite={handleToggleFavorite}
                isFavorited={favorites.includes(tip.id)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {loading ? 'Loading...' : showFavoritesOnly ? 'No favorite tips yet' : 'No tips match your search'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {showFavoritesOnly
              ? 'Start adding tips to your favorites by clicking the heart icon on any tip card.'
              : 'Try adjusting your search terms or filters to find what you\'re looking for.'
            }
          </p>
          {showFavoritesOnly && (
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
            >
              Browse All Tips
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WellnessTips;