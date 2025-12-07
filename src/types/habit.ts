export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export type HabitCategory = 
  | 'health' 
  | 'productivity' 
  | 'learning' 
  | 'fitness' 
  | 'mindfulness' 
  | 'social' 
  | 'other';

export interface CompletionRecord {
  date: string; // ISO date string
  completed: boolean;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDays?: number[]; // For weekly: 0-6 (Sun-Sat), for custom
  color: string;
  icon?: string;
  targetStreak?: number;
  createdAt: string;
  completions: CompletionRecord[];
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  successRate: number;
  lastCompleted?: string;
}
