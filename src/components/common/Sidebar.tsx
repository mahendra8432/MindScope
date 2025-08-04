import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Heart, BookOpen, Lightbulb, Target, Calendar, 
  TrendingUp, Settings, Menu, X, Sparkles, Award,
  Brain, Activity
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/mood', icon: Heart, label: 'Mood Tracker', color: 'text-red-500' },
    { path: '/journal', icon: BookOpen, label: 'Journal', color: 'text-green-600' },
    { path: '/goals', icon: Target, label: 'Goals', color: 'text-purple-600' },
    { path: '/habits', icon: Calendar, label: 'Habits', color: 'text-orange-600' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics', color: 'text-indigo-600' },
    { path: '/tips', icon: Lightbulb, label: 'Wellness Tips', color: 'text-yellow-600' },
    { path: '/challenges', icon: Award, label: 'Challenges', color: 'text-pink-600' },
  ];

  const bottomNavItems = [
    { path: '/insights', icon: Brain, label: 'AI Insights', color: 'text-cyan-600' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-600' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -320,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        }}
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 
          lg:relative lg:translate-x-0 lg:shadow-xl
          w-80 border-r border-gray-200 dark:border-gray-700
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  MindScope
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Wellness Companion</p>
              </div>
            </motion.div>
            <button 
              onClick={onToggle}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && onToggle()}
                      className={({ isActive }) => `
                        group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 text-primary-700 dark:text-primary-300 shadow-md border border-primary-100 dark:border-primary-800' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl"
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center space-x-3 w-full">
                            <Icon className={`w-5 h-5 ${isActive ? item.color : ''} transition-colors`} />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                {bottomNavItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + index) * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => window.innerWidth < 1024 && onToggle()}
                        className={({ isActive }) => `
                          group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 text-primary-700 dark:text-primary-300 shadow-md border border-primary-100 dark:border-primary-800' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                          }
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            )}
                            <div className="relative z-10 flex items-center space-x-3 w-full">
                              <Icon className={`w-5 h-5 ${isActive ? item.color : ''} transition-colors`} />
                              <span className="font-medium">{item.label}</span>
                              {item.path === '/insights' && (
                                <div className="ml-auto">
                                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <motion.div 
            className="p-6 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-900/20 dark:via-secondary-900/20 dark:to-accent-900/20 rounded-2xl p-4 border border-primary-100 dark:border-primary-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Daily Inspiration</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Powered by AI</p>
                </div>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                "The mind is everything. What you think you become. Every small step towards wellness is a victory worth celebrating."
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">- Buddha (adapted)</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;