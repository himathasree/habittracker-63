import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import { useHabits } from '@/context/HabitContext';
import { Habit } from '@/types/habit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HabitsPage = () => {
  const { habits } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCloseForm = (open: boolean) => {
    setShowForm(open);
    if (!open) setEditingHabit(null);
  };

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(habits.map(h => h.category)))];

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            All Habits
          </h1>
          <p className="text-muted-foreground mt-2">Manage your habits and track progress</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Habit
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory} className="mt-6">
          {filteredHabits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredHabits.map(habit => (
                <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No habits found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <HabitForm open={showForm} onOpenChange={handleCloseForm} editHabit={editingHabit} />
    </div>
  );
};

export default HabitsPage;
