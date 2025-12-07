import { Achievement } from '@/types/gamification';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
}

const AchievementCard = ({ achievement, isUnlocked, progress }: AchievementCardProps) => {
  return (
    <Card className={cn(
      'relative overflow-hidden p-4 transition-all duration-300',
      isUnlocked 
        ? 'glass border-gold/30 achievement-glow' 
        : 'bg-muted/50 opacity-70'
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          'flex h-14 w-14 items-center justify-center rounded-xl text-2xl',
          isUnlocked 
            ? 'bg-gradient-to-br from-gold to-gold-light animate-bounce-in' 
            : 'bg-muted'
        )}>
          {isUnlocked ? (
            achievement.icon
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 space-y-1">
          <h4 className={cn(
            'font-display font-semibold',
            isUnlocked ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {achievement.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
          
          {!isUnlocked && (
            <div className="pt-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </div>
      </div>
      
      {isUnlocked && (
        <div className="absolute top-2 right-2 text-xs font-medium text-gold">
          ✓ Unlocked
        </div>
      )}
    </Card>
  );
};

export default AchievementCard;
