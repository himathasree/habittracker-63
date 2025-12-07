import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useHabits } from '@/context/HabitContext';
import { getHabitStats } from '@/utils/habitHelpers';
import { Achievement, ACHIEVEMENTS } from '@/types/gamification';
import { useToast } from './use-toast';

interface UnlockedAchievement extends Achievement {
  unlockedAt: string;
}

export const useAchievements = () => {
  const { habits } = useHabits();
  const [unlockedIds, setUnlockedIds] = useLocalStorage<string[]>('unlocked-achievements', []);
  const { toast } = useToast();
  const prevUnlockedRef = useRef<string[]>([]);

  // Calculate current stats
  const stats = useMemo(() => {
    const totalCompletions = habits.reduce(
      (sum, habit) => sum + habit.completions.filter(c => c.completed).length,
      0
    );
    
    const streaks = habits.map(habit => getHabitStats(habit));
    const longestStreak = Math.max(...streaks.map(s => s.longestStreak), 0);
    const currentMaxStreak = Math.max(...streaks.map(s => s.currentStreak), 0);
    
    return {
      totalCompletions,
      longestStreak,
      currentStreak: currentMaxStreak,
      habitsCreated: habits.length,
    };
  }, [habits]);

  // Check which achievements should be unlocked
  const checkAchievements = useCallback(() => {
    const newUnlocked: string[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedIds.includes(achievement.id)) return;

      let shouldUnlock = false;
      switch (achievement.type) {
        case 'streak':
          shouldUnlock = stats.longestStreak >= achievement.requirement;
          break;
        case 'completions':
          shouldUnlock = stats.totalCompletions >= achievement.requirement;
          break;
        case 'habits':
          shouldUnlock = stats.habitsCreated >= achievement.requirement;
          break;
      }

      if (shouldUnlock) {
        newUnlocked.push(achievement.id);
      }
    });

    if (newUnlocked.length > 0) {
      setUnlockedIds([...unlockedIds, ...newUnlocked]);
    }

    return newUnlocked;
  }, [stats, unlockedIds, setUnlockedIds]);

  // Show toast for newly unlocked achievements
  useEffect(() => {
    const newlyUnlocked = unlockedIds.filter(id => !prevUnlockedRef.current.includes(id));
    
    newlyUnlocked.forEach(id => {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        toast({
          title: `${achievement.icon} Achievement Unlocked!`,
          description: `${achievement.name}: ${achievement.description}`,
        });
      }
    });

    prevUnlockedRef.current = unlockedIds;
  }, [unlockedIds, toast]);

  // Check achievements when stats change
  useEffect(() => {
    checkAchievements();
  }, [stats, checkAchievements]);

  const unlockedAchievements = useMemo((): UnlockedAchievement[] => {
    return ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).map(a => ({
      ...a,
      unlockedAt: new Date().toISOString(),
    }));
  }, [unlockedIds]);

  const lockedAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));
  }, [unlockedIds]);

  const getProgress = useCallback((achievement: Achievement): number => {
    let current = 0;
    switch (achievement.type) {
      case 'streak':
        current = stats.longestStreak;
        break;
      case 'completions':
        current = stats.totalCompletions;
        break;
      case 'habits':
        current = stats.habitsCreated;
        break;
    }
    return Math.min((current / achievement.requirement) * 100, 100);
  }, [stats]);

  return {
    stats,
    unlockedAchievements,
    lockedAchievements,
    allAchievements: ACHIEVEMENTS,
    getProgress,
    totalUnlocked: unlockedIds.length,
    totalAchievements: ACHIEVEMENTS.length,
  };
};
