import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Bell, User, Search, Sun, Moon, Monitor,
  Settings, LogOut, Gift, Zap, Crown, Brain
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, title }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Refs for click outside detection
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  // Search functionality
  const searchItems = [
    { title: 'Log Mood', path: '/mood', description: 'Track your emotional state' },
    { title: 'New Journal', path: '/journal', description: 'Write your thoughts' },
    { title: 'Set Goal', path: '/goals', description: 'Create personal goals' },
    { title: 'Track Habit', path: '/habits', description: 'Monitor daily habits' },
    { title: 'Analytics', path: '/analytics', description: 'View your progress' },
    { title: 'Wellness Tips', path: '/tips', description: 'Get helpful advice' },
  ];

  const filteredSearchItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowProfile(false);
        setShowSearch(false);
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSearchItemClick = (path: string) => {
    navigate(path);
    setShowSearch(false);
    setSearchTerm('');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          
          <div>
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={title}
              onClick={() => navigate('/')}
            >
              {title === 'Dashboard' ? 'MindScope' : title}
            </motion.h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowSearch(!showSearch);
                setShowNotifications(false);
                setShowProfile(false);
                setShowThemeMenu(false);
              }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
                >
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  
                  {searchTerm && (
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {filteredSearchItems.length > 0 ? (
                        filteredSearchItems.map((item, index) => (
                          <motion.button
                            key={item.path}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSearchItemClick(item.path)}
                            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {item.description}
                            </div>
                          </motion.button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <div className="relative" ref={themeRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowNotifications(false);
                setShowProfile(false);
                setShowSearch(false);
              }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' && <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              {theme === 'dark' && <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              {theme === 'system' && <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
            </motion.button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 z-50"
                >
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        onClick={() => {
                          setTheme(option.value as any);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors ${
                          theme === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
                setShowSearch(false);
                setShowThemeMenu(false);
              }}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 10).map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              !notification.read ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {notification.title}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
                setShowSearch(false);
                setShowThemeMenu(false);
              }}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'User'}</p>
                <div className="flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Wellness User</p>
                </div>
              </div>
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{user?.name || 'User'}</p>
                        <div className="flex items-center space-x-1">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors"
                    >
                      <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-700 dark:text-gray-300">Upgrade to Premium</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors"
                    >
                      <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">Refer Friends</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Settings</span>
                    </motion.button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-gray-700 dark:text-gray-300">Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;