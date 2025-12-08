import { useState } from 'react';
import { Habit } from '@/types/habit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { getHabitStats, isHabitCompletedToday } from '@/utils/habitHelpers';
import { useHabits } from '@/context/HabitContext';
import StreakBadge from '@/components/gamification/StreakBadge';
import ProgressRing from './ProgressRing';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

const HabitCard = ({ habit, onEdit }: HabitCardProps) => {
  const { toggleCompletion, deleteHabit } = useHabits();
  const stats = getHabitStats(habit);
  const isCompleted = isHabitCompletedToday(habit);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (!isCompleted) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    toggleCompletion(habit.id, new Date());
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      deleteHabit(habit.id);
    }
  };

  return (
    <Card className={cn(
      'glass p-5 transition-all duration-300 hover:shadow-card group relative overflow-hidden',
      isCompleted && 'ring-2 ring-success/50 bg-success/5',
      isAnimating && 'animate-pulse'
    )}>
      {/* Completion celebration effect */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-success/10 animate-fade-in" />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: habit.color }}
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="relative flex-shrink-0">
            <ProgressRing 
              progress={stats.successRate} 
              size={56} 
              strokeWidth={4}
              color={habit.color}
            />
            <div 
              className={cn(
                "absolute inset-0 flex items-center justify-center text-xs font-bold transition-all duration-300",
                isCompleted && "scale-110"
              )}
              style={{ color: habit.color }}
            >
              {stats.successRate}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  isCompleted && "scale-125"
                )}
                style={{ 
                  backgroundColor: habit.color,
                  boxShadow: isCompleted ? `0 0 16px ${habit.color}` : `0 0 8px ${habit.color}40`
                }}
              />
              <h3 className={cn(
                "font-display font-semibold text-lg transition-all duration-300",
                isCompleted && "text-success"
              )}>
                {habit.name}
              </h3>
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
                <span className="font-semibold text-foreground">{stats.totalCompletions}</span>
                <span>total completions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            size="icon"
            onClick={handleToggle}
            className={cn(
              'transition-all duration-300 h-12 w-12 relative',
              isCompleted 
                ? 'bg-gradient-to-br from-success to-success-light hover:from-success-light hover:to-success shadow-lg' 
                : 'hover:border-success hover:text-success hover:scale-105',
              isAnimating && 'scale-110'
            )}
          >
            <Check className={cn(
              'h-5 w-5 transition-all duration-300',
              isCompleted && 'text-white',
              isAnimating && 'scale-125'
            )} />
            {isCompleted && (
              <span 
                className="absolute inset-0 rounded-md animate-ping opacity-30 bg-success" 
                style={{ animationDuration: '1s', animationIterationCount: '1' }}
              />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(habit)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-destructive hover:bg-destructive/10 hover:scale-105"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
