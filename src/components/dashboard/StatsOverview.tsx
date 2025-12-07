import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, CheckCircle2, Trophy } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getHabitStats, isHabitCompletedToday } from '@/utils/habitHelpers';
import { useAchievements } from '@/hooks/useAchievements';
import StreakBadge from '@/components/gamification/StreakBadge';

const StatsOverview = () => {
  const { habits } = useHabits();
  const { totalUnlocked, totalAchievements, stats: achievementStats } = useAchievements();

  const totalHabits = habits.length;
  const completedToday = habits.filter(isHabitCompletedToday).length;
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + habit.completions.filter(c => c.completed).length, 0
  );

  const statCards = [
    {
      title: 'Total Habits',
      value: totalHabits,
      icon: Target,
      gradient: 'from-primary to-secondary',
    },
    {
      title: 'Completed Today',
      value: completedToday,
      subtitle: `${totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%`,
      icon: CheckCircle2,
      gradient: 'from-success to-success-light',
    },
    {
      title: 'Total Completions',
      value: totalCompletions,
      icon: TrendingUp,
      gradient: 'from-secondary to-accent',
    },
    {
      title: 'Achievements',
      value: `${totalUnlocked}/${totalAchievements}`,
      icon: Trophy,
      gradient: 'from-gold to-gold-light',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="glass overflow-hidden group hover:shadow-card transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-display font-bold">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Best Streak Highlight */}
      {achievementStats.longestStreak > 0 && (
        <Card className="glass overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
                <p className="text-lg font-display font-semibold">Keep pushing your limits!</p>
              </div>
              <StreakBadge streak={achievementStats.longestStreak} size="lg" showLabel />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsOverview;
