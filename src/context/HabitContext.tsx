import React, { createContext, useContext, ReactNode } from 'react';
import { Habit } from '@/types/habit';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: Date, note?: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleCompletion = (habitId: string, date: Date, note?: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      
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
      
      return { ...habit, completions: updatedCompletions };
    }));
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, toggleCompletion }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
