import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const CalendarPage = () => {
  const { habits } = useHabits();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionRate = (date: Date) => {
    if (habits.length === 0) return 0;
    const dateStr = format(date, 'yyyy-MM-dd');
    const completed = habits.filter(habit => 
      habit.completions.some(c => c.date === dateStr && c.completed)
    ).length;
    return (completed / habits.length) * 100;
  };

  const getColorIntensity = (rate: number) => {
    if (rate === 0) return 'bg-muted';
    if (rate < 25) return 'bg-primary/20';
    if (rate < 50) return 'bg-primary/40';
    if (rate < 75) return 'bg-primary/60';
    if (rate < 100) return 'bg-primary/80';
    return 'bg-primary';
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Calendar View
        </h1>
        <p className="text-muted-foreground mt-2">Visual overview of your habit completions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Actual days */}
            {daysInMonth.map(date => {
              const rate = getCompletionRate(date);
              const isToday = isSameDay(date, new Date());
              
              return (
                <div
                  key={date.toISOString()}
                  className={`
                    aspect-square p-2 rounded-lg transition-all
                    ${getColorIntensity(rate)}
                    ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                    hover:scale-105 cursor-pointer
                  `}
                  title={`${format(date, 'MMM d')}: ${Math.round(rate)}% completed`}
                >
                  <div className={`text-sm font-medium ${rate > 50 ? 'text-primary-foreground' : ''}`}>
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">0%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/40" />
              <span className="text-muted-foreground">50%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span className="text-muted-foreground">100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {habits.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Create some habits to see your progress on the calendar!</p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
