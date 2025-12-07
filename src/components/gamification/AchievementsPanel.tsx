import { useAchievements } from '@/hooks/useAchievements';
import AchievementCard from './AchievementCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Flame } from 'lucide-react';

const AchievementsPanel = () => {
  const { 
    stats, 
    unlockedAchievements, 
    lockedAchievements, 
    getProgress,
    totalUnlocked,
    totalAchievements,
  } = useAchievements();

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-2xl font-display font-bold">
                {totalUnlocked}/{totalAchievements}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fire to-fire-dark">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Streak</p>
              <p className="text-2xl font-display font-bold">{stats.longestStreak} days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success to-success-light">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Completions</p>
              <p className="text-2xl font-display font-bold">{stats.totalCompletions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold flex items-center gap-2">
            <span className="text-gold">🏆</span> Unlocked
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {unlockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={true}
                progress={100}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold text-muted-foreground">
            🔒 Locked
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {lockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={false}
                progress={getProgress(achievement)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel;
