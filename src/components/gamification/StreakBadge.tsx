import { Flame } from 'lucide-react';
import { getStreakMilestone, getStreakColor } from '@/types/gamification';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const StreakBadge = ({ streak, size = 'md', showLabel = false, className }: StreakBadgeProps) => {
  const milestone = getStreakMilestone(streak);
  const colorClass = getStreakColor(streak);
  
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs gap-1',
    md: 'h-8 px-3 text-sm gap-1.5',
    lg: 'h-10 px-4 text-base gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  if (streak === 0) {
    return (
      <div className={cn(
        'inline-flex items-center rounded-full bg-muted text-muted-foreground font-medium',
        sizeClasses[size],
        className
      )}>
        <Flame className={iconSizes[size]} />
        <span>0</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center rounded-full font-bold text-white',
      `bg-gradient-to-r ${colorClass}`,
      streak >= 7 && 'fire-glow',
      sizeClasses[size],
      className
    )}>
      {milestone ? (
        <span className={cn(size === 'lg' ? 'text-lg' : 'text-sm', 'animate-fire')}>
          {milestone.emoji}
        </span>
      ) : (
        <Flame className={cn(iconSizes[size], 'animate-fire')} />
      )}
      <span>{streak}</span>
      {showLabel && milestone && (
        <span className="ml-1 font-normal opacity-90">{milestone.label}</span>
      )}
    </div>
  );
};

export default StreakBadge;
