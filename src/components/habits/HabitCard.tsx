import { Habit } from '@/types/habit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Pencil, Trash2, Flame } from 'lucide-react';
import { getHabitStats, isHabitCompletedToday } from '@/utils/habitHelpers';
import { useHabits } from '@/context/HabitContext';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

const HabitCard = ({ habit, onEdit }: HabitCardProps) => {
  const { toggleCompletion, deleteHabit } = useHabits();
  const stats = getHabitStats(habit);
  const isCompleted = isHabitCompletedToday(habit);

  const handleToggle = () => {
    toggleCompletion(habit.id, new Date());
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      deleteHabit(habit.id);
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: habit.color }}
            />
            <h3 className="font-semibold text-lg">{habit.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {habit.category}
            </Badge>
          </div>
          
          {habit.description && (
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{stats.currentStreak}</span>
              <span>day streak</span>
            </div>
            <div className="text-muted-foreground">
              <span className="font-medium">{stats.successRate}%</span> success
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            size="icon"
            onClick={handleToggle}
            className={isCompleted ? 'bg-primary' : ''}
          >
            <Check className={`h-4 w-4 ${isCompleted ? 'text-primary-foreground' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => onEdit(habit)}>
            <Pencil className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
