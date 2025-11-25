import { NavLink } from 'react-router-dom';
import { signOut } from '@/lib/authClient';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNavProps {
  onDiscoverClick?: () => void;
}

export const TopNav = ({ onDiscoverClick }: TopNavProps) => {
  const handleLogout = async () => {
    await signOut();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm font-medium transition-colors hover:text-foreground',
      isActive ? 'text-foreground' : 'text-muted-foreground'
    );

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex space-x-8">
            <NavLink to="/" className={navLinkClass} onClick={onDiscoverClick}>
              Discover
            </NavLink>
            <NavLink to="/watchlist" className={navLinkClass}>
              Watchlist
            </NavLink>
            <NavLink to="/archive" className={navLinkClass}>
              Archive
            </NavLink>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
