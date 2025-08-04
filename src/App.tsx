import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Analytics from './pages/Analytics';
import WellnessTips from './pages/WellnessTips';
import { useTheme } from './hooks/useTheme';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { isAuthenticated, loading } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/mood': return 'Mood Tracker';
      case '/journal': return 'Journal';
      case '/goals': return 'Goals';
      case '/habits': return 'Habits';
      case '/analytics': return 'Analytics';
      case '/tips': return 'Wellness Tips';
      case '/challenges': return 'Challenges';
      case '/insights': return 'AI Insights';
      case '/settings': return 'Settings';
      default: return 'MindWell Pro';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🧠</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading MindScope...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${theme}`}>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <motion.div 
            className="flex flex-col min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Header 
              onMenuToggle={toggleSidebar} 
              title={getPageTitle(window.location.pathname)} 
            />
            <main className="flex-1 p-6">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/mood" element={<MoodTracker />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/tips" element={<WellnessTips />} />
                  <Route path="/challenges" element={
                    <div className="text-center py-16">
                      <div className="text-6xl mb-6">🏆</div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Challenges Coming Soon!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Join community challenges to boost your wellness journey.
                      </p>
                    </div>
                  } />
                  <Route path="/insights" element={
                    <div className="text-center py-16">
                      <div className="text-6xl mb-6">🧠</div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        AI Insights Coming Soon!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Get personalized insights powered by artificial intelligence.
                      </p>
                    </div>
                  } />
                  <Route path="/settings" element={
                    <div className="text-center py-16">
                      <div className="text-6xl mb-6">⚙️</div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Settings Coming Soon!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Customize your MindScope experience.
                      </p>
                    </div>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;