export interface Mood {
  id: string;
  date: string;
  moodType: 'excellent' | 'good' | 'neutral' | 'poor' | 'terrible';
  note: string;
  intensity: number; // 1-10 scale
  energy: number; // 1-10 scale
  stress: number; // 1-10 scale
  sleep: number; // 1-10 scale
  tags: string[];
  triggers?: string[];
  activities?: string[];
  location?: string;
  weather?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  mood?: 'positive' | 'neutral' | 'negative';
  category: 'reflection' | 'gratitude' | 'goals' | 'challenges' | 'memories' | 'dreams';
  isPrivate: boolean;
  wordCount: number;
  readingTime: number;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'mindfulness' | 'exercise' | 'sleep' | 'nutrition' | 'social' | 'stress' | 'productivity' | 'creativity';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  featured: boolean;
  rating: number;
  completions: number;
  benefits: string[];
  instructions: string[];
  resources?: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'mental-health' | 'physical-health' | 'relationships' | 'career' | 'personal-growth';
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  targetDate: string;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  _id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Habit {
  _id: string;
  name: string;
  description: string;
  category: 'health' | 'mindfulness' | 'productivity' | 'social' | 'learning';
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completions: {
    date: string;
    completed: boolean;
    note?: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  timezone: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    dailyReminders: boolean;
    weeklyReports: boolean;
    goalDeadlines: boolean;
    habitReminders: boolean;
    motivationalQuotes: boolean;
  };
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    widgets: string[];
  };
}

export interface UserStats {
  totalMoodEntries: number;
  totalJournalEntries: number;
  totalWordsWritten: number;
  currentMoodStreak: number;
  currentJournalStreak: number;
  goalsCompleted: number;
  habitsCompleted: number;
  averageMood: number;
  joinedDaysAgo: number;
}

export interface Insight {
  id: string;
  type: 'mood-pattern' | 'journal-theme' | 'goal-progress' | 'habit-streak' | 'wellness-tip';
  title: string;
  description: string;
  data: any;
  importance: 'low' | 'medium' | 'high';
  actionable: boolean;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // days
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  tasks: ChallengeTask[];
  rewards: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'insight' | 'social' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}