import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useAPI, useMutation } from '../hooks/useAPI';
import { goalsAPI } from '../services/api';
import { Goal, Milestone } from '../types';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import toast from 'react-hot-toast';

const Goals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  // API hooks
  const { data: goalsResponse, loading, refetch } = useAPI(() => goalsAPI.getAll(), { immediate: true });
  const createMutation = useMutation(goalsAPI.create, {
    onSuccess: () => {
      toast.success('New goal created successfully!');
      console.log('✅ Goal created, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });
  const updateMutation = useMutation(goalsAPI.update, {
    onSuccess: () => {
      toast.success('Goal updated successfully!');
      console.log('✅ Goal updated, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });
  const deleteMutation = useMutation(goalsAPI.delete, {
    onSuccess: () => {
      toast.success('Goal deleted successfully');
      console.log('✅ Goal deleted, refreshing data...');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    }
  });
  const toggleMilestoneMutation = useMutation(goalsAPI.toggleMilestone, {
    onSuccess: () => {
      toast.success('Milestone updated!');
      refetch();
      localStorage.setItem('data-updated', Date.now().toString());
    },
    onError: (error) => {
      toast.error('Milestone not found');
      console.error(error);
    }
  });

  const goals = Array.isArray(goalsResponse) ? goalsResponse : [];

  const handleSubmit = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingGoal) {
      updateMutation.mutate(editingGoal.id, goalData);
    } else {
      createMutation.mutate(goalData);
    }
    setEditingGoal(undefined);
    setIsFormOpen(false);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGoal(undefined);
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    toggleMilestoneMutation.mutate(goalId, milestoneId);
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    averageProgress: goals.length > 0 
      ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
      : 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Goals & Aspirations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set meaningful goals and track your progress towards achieving them
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Goals', value: stats.total, icon: Target, color: 'from-blue-500 to-cyan-500' },
          { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { title: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'from-orange-500 to-red-500' },
          { title: 'Avg Progress', value: `${stats.averageProgress}%`, icon: Calendar, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none min-w-[150px]"
          >
            <option value="all">All Categories</option>
            <option value="mental-health">Mental Health</option>
            <option value="physical-health">Physical Health</option>
            <option value="relationships">Relationships</option>
            <option value="career">Career</option>
            <option value="personal-growth">Personal Growth</option>
          </select>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <GoalCard
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleMilestone={handleToggleMilestone}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filteredGoals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {loading ? 'Loading...' : goals.length === 0 ? 'No goals set yet' : 'No goals match your search'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {goals.length === 0 
              ? 'Start your journey by setting meaningful goals that align with your values and aspirations.'
              : 'Try adjusting your search terms or filters to find what you\'re looking for.'
            }
          </p>
          {goals.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFormOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg"
            >
              Set Your First Goal
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Goal Form Modal */}
      <GoalForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editingGoal={editingGoal}
        loading={createMutation.loading || updateMutation.loading}
      />
    </div>
  );
};

export default Goals;