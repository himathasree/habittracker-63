import { Bell, BellOff, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { 
    settings, 
    permission, 
    toggleEnabled, 
    updateSettings, 
    isSupported,
    sendNotification,
  } = useNotifications();
  const { toast } = useToast();

  const handleToggle = async () => {
    const success = await toggleEnabled();
    if (success && !settings.enabled) {
      toast({
        title: 'Notifications enabled! 🔔',
        description: 'You will now receive habit reminders.',
      });
    }
  };

  const handleTestNotification = () => {
    const notification = sendNotification('Test Notification 🎯', {
      body: 'Your notifications are working perfectly!',
    });
    
    if (!notification) {
      toast({
        title: 'Notifications are disabled',
        description: 'Enable notifications to receive reminders.',
        variant: 'destructive',
      });
    }
  };

  if (!isSupported) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support notifications. Try using a modern browser like Chrome, Firefox, or Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Bell className="h-5 w-5 text-primary" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Get reminded to complete your daily habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-enabled" className="font-medium">
              Enable Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              {permission === 'denied' 
                ? 'Notifications are blocked in your browser settings'
                : 'Receive reminders for your habits'}
            </p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={settings.enabled}
            onCheckedChange={handleToggle}
            disabled={permission === 'denied'}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Reminder Time */}
            <div className="space-y-2">
              <Label htmlFor="reminder-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Daily Reminder Time
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                className="w-40"
              />
              <p className="text-sm text-muted-foreground">
                We'll remind you to check your habits at this time
              </p>
            </div>

            {/* Daily Reminder Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-reminder">Daily Reminder</Label>
                <p className="text-sm text-muted-foreground">
                  Get a daily summary of incomplete habits
                </p>
              </div>
              <Switch
                id="daily-reminder"
                checked={settings.dailyReminder}
                onCheckedChange={(checked) => updateSettings({ dailyReminder: checked })}
              />
            </div>

            {/* Test Button */}
            <Button 
              variant="outline" 
              onClick={handleTestNotification}
              className="w-full"
            >
              Send Test Notification
            </Button>
          </>
        )}

        {permission === 'denied' && (
          <p className="text-sm text-destructive">
            To enable notifications, please allow them in your browser settings and refresh the page.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
