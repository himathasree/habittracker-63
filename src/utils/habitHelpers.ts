import { Habit, HabitStats, CompletionRecord } from '@/types/habit';
import { format, parseISO, differenceInDays, startOfDay, isToday, isSameDay } from 'date-fns';

export const calculateStreak = (completions: CompletionRecord[]): { current: number; longest: number } => {
  if (completions.length === 0) return { current: 0, longest: 0 };

  const sorted = [...completions]
    .filter(c => c.completed)
    .map(c => parseISO(c.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (sorted.length === 0) return { current: 0, longest: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  const today = startOfDay(new Date());

  // Check if most recent completion is today or yesterday
  const daysSinceLastCompletion = differenceInDays(today, startOfDay(sorted[0]));
  
  if (daysSinceLastCompletion <= 1) {
    currentStreak = 1;
    
    for (let i = 1; i < sorted.length; i++) {
      const diff = differenceInDays(startOfDay(sorted[i - 1]), startOfDay(sorted[i]));
      if (diff === 1) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInDays(startOfDay(sorted[i - 1]), startOfDay(sorted[i]));
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak, 1);

  return { current: currentStreak, longest: longestStreak };
};

export const getHabitStats = (habit: Habit): HabitStats => {
  const { current: currentStreak, longest: longestStreak } = calculateStreak(habit.completions);
  const completedRecords = habit.completions.filter(c => c.completed);
  const totalCompletions = completedRecords.length;
  
  const daysSinceCreation = differenceInDays(new Date(), parseISO(habit.createdAt)) + 1;
  const successRate = daysSinceCreation > 0 ? (totalCompletions / daysSinceCreation) * 100 : 0;
  
  const lastCompleted = completedRecords.length > 0
    ? completedRecords.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())[0].date
    : undefined;

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    successRate: Math.round(successRate),
    lastCompleted,
  };
};

export const isHabitCompletedToday = (habit: Habit): boolean => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayCompletion = habit.completions.find(c => c.date === todayStr);
  return todayCompletion?.completed || false;
};

export const toggleHabitCompletion = (habit: Habit, date: Date, note?: string): Habit => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const existingIndex = habit.completions.findIndex(c => c.date === dateStr);
  
  const updatedCompletions = [...habit.completions];
  
  if (existingIndex >= 0) {
    updatedCompletions[existingIndex] = {
      ...updatedCompletions[existingIndex],
      completed: !updatedCompletions[existingIndex].completed,
      note: note || updatedCompletions[existingIndex].note,
    };
  } else {
    updatedCompletions.push({
      date: dateStr,
      completed: true,
      note,
    });
  }
  
  return {
    ...habit,
    completions: updatedCompletions,
  };
};

export const getHabitColor = (category: string): string => {
  const colors: Record<string, string> = {
    health: 'hsl(142, 76%, 36%)',
    productivity: 'hsl(221, 83%, 53%)',
    learning: 'hsl(262, 83%, 58%)',
    fitness: 'hsl(0, 84%, 60%)',
    mindfulness: 'hsl(280, 67%, 55%)',
    social: 'hsl(39, 96%, 51%)',
    other: 'hsl(187, 70%, 45%)',
  };
  return colors[category] || colors.other;
};
