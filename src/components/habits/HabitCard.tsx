import { Habit } from '@/types/habit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { getHabitStats, isHabitCompletedToday } from '@/utils/habitHelpers';
import { useHabits } from '@/context/HabitContext';
import StreakBadge from '@/components/gamification/StreakBadge';
import { cn } from '@/lib/utils';

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
    <Card className={cn(
      'glass p-5 transition-all duration-300 hover:shadow-card group',
      isCompleted && 'ring-2 ring-success/50 bg-success/5'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-background animate-scale-in" 
              style={{ 
                backgroundColor: habit.color,
                boxShadow: `0 0 12px ${habit.color}40`
              }}
            />
            <h3 className="font-display font-semibold text-lg">{habit.name}</h3>
            <Badge 
              variant="secondary" 
              className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20"
            >
              {habit.category}
            </Badge>
          </div>
          
          {habit.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{habit.description}</p>
          )}
          
          <div className="flex items-center gap-4">
            <StreakBadge streak={stats.currentStreak} size="sm" />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{stats.successRate}%</span>
              <span>success rate</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            size="icon"
            onClick={handleToggle}
            className={cn(
              'transition-all duration-300 h-11 w-11',
              isCompleted 
                ? 'bg-gradient-to-br from-success to-success-light hover:from-success-light hover:to-success shadow-lg' 
                : 'hover:border-success hover:text-success'
            )}
          >
            <Check className={cn('h-5 w-5', isCompleted && 'text-white')} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(habit)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
