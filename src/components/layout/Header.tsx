import { Link, useLocation } from 'react-router-dom';
import { Target, BarChart3, ListTodo, Calendar, Trophy, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAchievements } from '@/hooks/useAchievements';

const Header = () => {
  const location = useLocation();
  const { totalUnlocked } = useAchievements();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/habits', label: 'Habits', icon: ListTodo },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/achievements', label: 'Achievements', icon: Trophy, badge: totalUnlocked },
    { path: '/settings', label: 'Settings', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary transition-transform group-hover:scale-110">
            <Target className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold gradient-text">
            HabitFlow
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon, badge }) => (
            <Button
              key={path}
              asChild
              variant={location.pathname === path ? 'default' : 'ghost'}
              className={location.pathname === path 
                ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90' 
                : 'hover:bg-muted'
              }
            >
              <Link to={path} className="flex items-center gap-2 relative">
                <Icon className="h-4 w-4" />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                    {badge}
                  </span>
                )}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="md:hidden flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, badge }) => (
            <Button
              key={path}
              asChild
              variant={location.pathname === path ? 'default' : 'ghost'}
              size="icon"
              className={location.pathname === path 
                ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                : ''
              }
            >
              <Link to={path} className="relative">
                <Icon className="h-4 w-4" />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-black">
                    {badge}
                  </span>
                )}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
