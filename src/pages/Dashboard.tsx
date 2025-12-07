import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ProgressCharts from '@/components/dashboard/ProgressCharts';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import { useHabits } from '@/context/HabitContext';
import { Habit } from '@/types/habit';

const Dashboard = () => {
  const { habits } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCloseForm = (open: boolean) => {
    setShowForm(open);
    if (!open) setEditingHabit(null);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold gradient-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Track your daily habits and progress</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Habit
        </Button>
      </div>

      <StatsOverview />

      {habits.length > 0 ? (
        <>
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Today's Habits
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map((habit, index) => (
                <div 
                  key={habit.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <HabitCard habit={habit} onEdit={handleEdit} />
                </div>
              ))}
            </div>
          </div>

          <ProgressCharts />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-10 mb-6">
              <Plus className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full animate-ping bg-primary/10" />
          </div>
          <h3 className="text-2xl font-display font-semibold mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start building better habits today. Create your first habit and begin your journey!
          </p>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Habit
          </Button>
        </div>
      )}

      <HabitForm open={showForm} onOpenChange={handleCloseForm} editHabit={editingHabit} />
    </div>
  );
};

export default Dashboard;
