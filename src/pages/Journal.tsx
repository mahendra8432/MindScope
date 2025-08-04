import React, { useState } from 'react';
import { Plus, Search, Filter, Tag } from 'lucide-react';
import { useAPI, useMutation } from '../hooks/useAPI';
import { journalAPI } from '../services/api';
import { Journal as JournalType } from '../types';
import JournalCard from '../components/journal/JournalCard';
import JournalForm from '../components/journal/JournalForm';
import toast from 'react-hot-toast';

const Journal: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalType | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // API hooks
  const { data: journalsResponse, loading, refetch } = useAPI(() => journalAPI.getAll(), { immediate: true });
  const createMutation = useMutation(journalAPI.create, {
    onSuccess: () => {
      toast.success('Journal entry created successfully!');
      console.log('✅ Journal created, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });
  const updateMutation = useMutation(journalAPI.update, {
    onSuccess: () => {
      toast.success('Journal entry updated successfully!');
      console.log('✅ Journal updated, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });
  const deleteMutation = useMutation(journalAPI.delete, {
    onSuccess: () => {
      toast.success('Journal entry deleted successfully!');
      console.log('✅ Journal deleted, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });

  const journals = journalsResponse?.data || [];

  // Get all unique tags
  const allTags = Array.from(new Set(journals.flatMap(journal => journal.tags)));

  const handleSubmit = (journalData: Omit<JournalType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingJournal) {
      updateMutation.mutate(editingJournal.id, journalData);
    } else {
      createMutation.mutate(journalData);
    }
    setEditingJournal(undefined);
    setIsFormOpen(false);
  };

  const handleEdit = (journal: JournalType) => {
    setEditingJournal(journal);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJournal(undefined);
  };

  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === 'all' || journal.mood === filterMood;
    const matchesTag = selectedTag === 'all' || journal.tags.includes(selectedTag);
    return matchesSearch && matchesMood && matchesTag;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
          <p className="text-gray-600 mt-1">Reflect on your thoughts and experiences</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
          <h3 className="text-2xl font-bold text-primary-700 mb-1">{journals.length}</h3>
          <p className="text-primary-600 font-medium">Total Entries</p>
        </div>
        <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-100">
          <h3 className="text-2xl font-bold text-secondary-700 mb-1">{allTags.length}</h3>
          <p className="text-secondary-600 font-medium">Unique Tags</p>
        </div>
        <div className="bg-accent-50 rounded-xl p-6 border border-accent-100">
          <h3 className="text-2xl font-bold text-accent-700 mb-1">
            {journals.filter(j => j.date === new Date().toISOString().split('T')[0]).length}
          </h3>
          <p className="text-accent-600 font-medium">Today's Entries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white min-w-[130px]"
            >
              <option value="all">All Moods</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div className="relative">
            <Tag className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white min-w-[130px]"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="grid grid-cols-1 gap-6">
        {filteredJournals.map((journal) => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredJournals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {loading ? 'Loading...' : journals.length === 0 ? 'No journal entries yet' : 'No entries match your search'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {journals.length === 0 
              ? 'Start journaling to reflect on your thoughts, experiences, and personal growth.'
              : 'Try adjusting your search terms or filters to find what you\'re looking for.'
            }
          </p>
          {journals.length === 0 && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
            >
              Write Your First Entry
            </button>
          )}
        </div>
      )}

      {/* Journal Form Modal */}
      <JournalForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editingJournal={editingJournal}
        loading={createMutation.loading || updateMutation.loading}
      />
    </div>
  );
};

export default Journal;