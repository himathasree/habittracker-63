export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'completions' | 'habits';
  unlockedAt?: string;
}

export interface UserStats {
  totalCompletions: number;
  longestStreak: number;
  currentStreak: number;
  habitsCreated: number;
  achievements: Achievement[];
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  { id: 'streak_3', name: 'Getting Started', description: 'Reach a 3-day streak', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Reach a 7-day streak', icon: '⚡', requirement: 7, type: 'streak' },
  { id: 'streak_14', name: 'Consistency Champion', description: 'Reach a 14-day streak', icon: '🏆', requirement: 14, type: 'streak' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Reach a 30-day streak', icon: '👑', requirement: 30, type: 'streak' },
  { id: 'streak_100', name: 'Legendary', description: 'Reach a 100-day streak', icon: '💎', requirement: 100, type: 'streak' },
  
  // Completion achievements
  { id: 'completions_10', name: 'First Steps', description: 'Complete 10 habits', icon: '🌱', requirement: 10, type: 'completions' },
  { id: 'completions_50', name: 'Building Momentum', description: 'Complete 50 habits', icon: '🚀', requirement: 50, type: 'completions' },
  { id: 'completions_100', name: 'Century Club', description: 'Complete 100 habits', icon: '💯', requirement: 100, type: 'completions' },
  { id: 'completions_500', name: 'Habit Master', description: 'Complete 500 habits', icon: '🎯', requirement: 500, type: 'completions' },
  
  // Habit creation achievements
  { id: 'habits_3', name: 'Triple Threat', description: 'Create 3 habits', icon: '✨', requirement: 3, type: 'habits' },
  { id: 'habits_5', name: 'High Five', description: 'Create 5 habits', icon: '🖐️', requirement: 5, type: 'habits' },
  { id: 'habits_10', name: 'Habit Collector', description: 'Create 10 habits', icon: '📚', requirement: 10, type: 'habits' },
];

export const getStreakMilestone = (streak: number): { milestone: number; emoji: string; label: string } | null => {
  if (streak >= 100) return { milestone: 100, emoji: '💎', label: 'Legendary!' };
  if (streak >= 30) return { milestone: 30, emoji: '👑', label: 'Monthly Master!' };
  if (streak >= 14) return { milestone: 14, emoji: '🏆', label: 'Two Weeks!' };
  if (streak >= 7) return { milestone: 7, emoji: '⚡', label: 'One Week!' };
  if (streak >= 3) return { milestone: 3, emoji: '🔥', label: 'On Fire!' };
  return null;
};

export const getStreakColor = (streak: number): string => {
  if (streak >= 30) return 'from-amber-400 to-yellow-600';
  if (streak >= 14) return 'from-purple-500 to-pink-500';
  if (streak >= 7) return 'from-blue-500 to-cyan-500';
  if (streak >= 3) return 'from-orange-500 to-red-500';
  return 'from-gray-400 to-gray-500';
};
