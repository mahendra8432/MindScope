import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAPI, useMutation } from '../hooks/useAPI';
import { moodAPI } from '../services/api';
import { Mood } from '../types';
import MoodCard from '../components/mood/MoodCard';
import MoodForm from '../components/mood/MoodForm';
import MoodStats from '../components/mood/MoodStats';
import toast from 'react-hot-toast';

const MoodTracker: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMood, setEditingMood] = useState<Mood | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');

  // API hooks
  const { data: moodsResponse, loading, refetch } = useAPI(() => moodAPI.getAll(), { immediate: true });
  const createMutation = useMutation(moodAPI.create, {
    onSuccess: () => {
      toast.success('Mood logged successfully!');
      console.log('✅ Mood created, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });
  const updateMutation = useMutation(moodAPI.update, {
    onSuccess: () => {
      toast.success('Mood updated successfully!');
      console.log('✅ Mood updated, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });
  const deleteMutation = useMutation(moodAPI.delete, {
    onSuccess: () => {
      toast.success('Mood deleted successfully!');
      console.log('✅ Mood deleted, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });

  const moods = moodsResponse?.data || [];

  const handleSubmit = (moodData: Omit<Mood, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMood) {
      updateMutation.mutate(editingMood.id, moodData);
    } else {
      createMutation.mutate(moodData);
    }
    setEditingMood(undefined);
    setIsFormOpen(false);
  };

  const handleEdit = (mood: Mood) => {
    setEditingMood(mood);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this mood entry?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMood(undefined);
  };

  const filteredMoods = moods.filter(mood => {
    const matchesSearch = mood.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mood.moodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMood === 'all' || mood.moodType === filterMood;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mood Tracker</h1>
          <p className="text-gray-600 mt-1">Track and monitor your daily emotional wellbeing</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Log Mood</span>
        </button>
      </div>

      {/* Stats */}
      <MoodStats moods={moods} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search mood entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white min-w-[150px]"
          >
            <option value="all">All Moods</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="neutral">Neutral</option>
            <option value="poor">Poor</option>
            <option value="terrible">Terrible</option>
          </select>
        </div>
      </div>

      {/* Mood Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMoods.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredMoods.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {loading ? 'Loading...' : moods.length === 0 ? 'No mood entries yet' : 'No entries match your search'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {moods.length === 0 
              ? 'Start tracking your mood today to better understand your emotional patterns and wellbeing.'
              : 'Try adjusting your search terms or filters to find what you\'re looking for.'
            }
          </p>
          {moods.length === 0 && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
            >
              Log Your First Mood
            </button>
          )}
        </div>
      )}

      {/* Mood Form Modal */}
      <MoodForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editingMood={editingMood}
        loading={createMutation.loading || updateMutation.loading}
      />
    </div>
  );
};

export default MoodTracker;