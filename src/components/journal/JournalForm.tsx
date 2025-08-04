import React, { useState, useEffect } from 'react';
import { Journal } from '../../types';
import { X, Smile, Meh, Heart, Tag } from 'lucide-react';

interface JournalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (journal: Omit<Journal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingJournal?: Journal;
  loading?: boolean;
}

const moodOptions = [
  { value: 'positive', label: 'Positive', icon: Smile, color: 'text-green-600', bg: 'bg-green-50' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { value: 'negative', label: 'Negative', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
];

const JournalForm: React.FC<JournalFormProps> = ({ isOpen, onClose, onSubmit, editingJournal, loading = false }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    tags: [] as string[],
    mood: undefined as Journal['mood'],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingJournal) {
      setFormData({
        date: editingJournal.date,
        title: editingJournal.title,
        content: editingJournal.content,
        tags: editingJournal.tags,
        mood: editingJournal.mood,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        title: '',
        content: '',
        tags: [],
        mood: undefined,
      });
    }
    setTagInput('');
  }, [editingJournal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Submitting journal form:', formData);
    onSubmit({
      ...formData,
      category: 'reflection',
      isPrivate: false,
      wordCount: formData.content.trim().split(/\s+/).length,
      readingTime: Math.ceil(formData.content.trim().split(/\s+/).length / 200)
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood (optional)
                </label>
                <div className="flex space-x-2">
                  {moodOptions.map((mood) => {
                    const Icon = mood.icon;
                    const isSelected = formData.mood === mood.value;
                    return (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          mood: isSelected ? undefined : mood.value as Journal['mood']
                        })}
                        className={`
                          flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-200
                          ${isSelected 
                            ? `${mood.bg} border-current ${mood.color}` 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? mood.color : 'text-gray-400'}`} />
                        <span className={`text-sm ${isSelected ? mood.color : 'text-gray-600'}`}>
                          {mood.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your entry a meaningful title..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your thoughts, reflections, or experiences..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-40 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tags (press Enter to add)..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-100"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-primary-500 hover:text-primary-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
              >
                {loading ? 'Saving...' : editingJournal ? 'Update' : 'Save'} Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JournalForm;