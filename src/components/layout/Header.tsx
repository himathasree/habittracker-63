import { Link, useLocation } from 'react-router-dom';
import { Target, BarChart3, ListTodo, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/habits', label: 'Habits', icon: ListTodo },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Target className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            HabitFlow
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              asChild
              variant={location.pathname === path ? 'default' : 'ghost'}
            >
              <Link to={path} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          {navItems.map(({ path, icon: Icon }) => (
            <Button
              key={path}
              asChild
              variant={location.pathname === path ? 'default' : 'ghost'}
              size="icon"
            >
              <Link to={path}>
                <Icon className="h-4 w-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
