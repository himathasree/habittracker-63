import NotificationSettings from '@/components/notifications/NotificationSettings';

const SettingsPage = () => {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold gradient-text">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize your habit tracking experience
        </p>
      </div>

      <div className="max-w-2xl">
        <NotificationSettings />
      </div>
    </div>
  );
};

export default SettingsPage;
