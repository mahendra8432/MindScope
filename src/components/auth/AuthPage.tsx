import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Sparkles } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-Pink" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                MindScope
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wellness Companion</p>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Your Journey to
            <span className="block bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Mental Wellness
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Track your moods, journal your thoughts, set meaningful goals, and build healthy habits. 
            Your personal wellness companion powered by AI insights.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { icon: '🧠', title: 'Mood Tracking', desc: 'Monitor emotional patterns' },
              { icon: '📝', title: 'Smart Journaling', desc: 'Reflect and grow daily' },
              { icon: '🎯', title: 'Goal Setting', desc: 'Achieve your aspirations' },
              { icon: '🔥', title: 'Habit Building', desc: 'Create lasting change' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center lg:text-left"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Trusted by thousands of users worldwide</span>
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <div className="w-full">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;