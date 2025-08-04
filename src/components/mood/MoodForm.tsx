import React, { useState, useEffect } from 'react';
import { Mood } from '../../types';
import { X, Smile, Meh, Frown } from 'lucide-react';

interface MoodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mood: Omit<Mood, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingMood?: Mood;
  loading?: boolean;
}

const moodTypes = [
  { value: 'excellent', label: 'Excellent', icon: Smile, color: 'text-green-600', bg: 'bg-green-50', hover: 'hover:bg-green-100' },
  { value: 'good', label: 'Good', icon: Smile, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-100' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-yellow-600', bg: 'bg-yellow-50', hover: 'hover:bg-yellow-100' },
  { value: 'poor', label: 'Poor', icon: Frown, color: 'text-orange-600', bg: 'bg-orange-50', hover: 'hover:bg-orange-100' },
  { value: 'terrible', label: 'Terrible', icon: Frown, color: 'text-red-600', bg: 'bg-red-50', hover: 'hover:bg-red-100' },
];

const MoodForm: React.FC<MoodFormProps> = ({ isOpen, onClose, onSubmit, editingMood, loading = false }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    moodType: 'neutral' as Mood['moodType'],
    note: '',
    intensity: 5,
  });

  useEffect(() => {
    if (editingMood) {
      setFormData({
        date: editingMood.date,
        moodType: editingMood.moodType,
        note: editingMood.note,
        intensity: editingMood.intensity,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        moodType: 'neutral',
        note: '',
        intensity: 5,
      });
    }
  }, [editingMood, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Submitting mood form:', formData);
    onSubmit({
      ...formData,
      energy: formData.energy || 5,
      stress: formData.stress || 5,
      sleep: formData.sleep || 7,
      tags: formData.tags || [],
      triggers: [],
      activities: [],
      location: '',
      weather: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingMood ? 'Edit Mood Entry' : 'Add Mood Entry'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How are you feeling?
              </label>
              <div className="grid grid-cols-1 gap-3">
                {moodTypes.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = formData.moodType === mood.value;
                  return (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, moodType: mood.value as Mood['moodType'] })}
                      className={`
                        flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200
                        ${isSelected 
                          ? `${mood.bg} border-current ${mood.color} shadow-md` 
                          : `border-gray-200 hover:border-gray-300 ${mood.hover}`
                        }
                      `}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? mood.color : 'text-gray-400'}`} />
                      <span className={`font-medium ${isSelected ? mood.color : 'text-gray-700'}`}>
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity Level: {formData.intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="What's on your mind? Any specific thoughts or events contributing to this mood?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-24 resize-none"
              />
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
                {loading ? 'Saving...' : editingMood ? 'Update' : 'Save'} Mood
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MoodForm;