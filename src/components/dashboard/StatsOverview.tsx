import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, CheckCircle2, Flame } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getHabitStats, isHabitCompletedToday } from '@/utils/habitHelpers';

const StatsOverview = () => {
  const { habits } = useHabits();

  const totalHabits = habits.length;
  const completedToday = habits.filter(isHabitCompletedToday).length;
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + habit.completions.filter(c => c.completed).length, 0
  );
  const averageStreak = habits.length > 0
    ? Math.round(habits.reduce((sum, habit) => sum + getHabitStats(habit).currentStreak, 0) / habits.length)
    : 0;

  const stats = [
    {
      title: 'Total Habits',
      value: totalHabits,
      icon: Target,
      color: 'text-primary',
    },
    {
      title: 'Completed Today',
      value: completedToday,
      subtitle: `${totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%`,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Total Completions',
      value: totalCompletions,
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      title: 'Average Streak',
      value: averageStreak,
      subtitle: 'days',
      icon: Flame,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;
