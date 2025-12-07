import AchievementsPanel from '@/components/gamification/AchievementsPanel';

const AchievementsPage = () => {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold gradient-text">
          Achievements
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and unlock rewards
        </p>
      </div>

      <AchievementsPanel />
    </div>
  );
};

export default AchievementsPage;
