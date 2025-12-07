import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Track your daily habits and progress</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Habit
        </Button>
      </div>

      <StatsOverview />

      {habits.length > 0 ? (
        <>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Today's Habits</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map(habit => (
                <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
              ))}
            </div>
          </div>

          <ProgressCharts />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-8 mb-4">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start building better habits today. Click the button above to create your first habit.
          </p>
        </div>
      )}

      <HabitForm open={showForm} onOpenChange={handleCloseForm} editHabit={editingHabit} />
    </div>
  );
};

export default Dashboard;
