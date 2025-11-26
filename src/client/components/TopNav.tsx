import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { signOut } from '../lib/authClient';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

type TopNavProps = {
  onDiscoverClick?: () => void;
};

export const TopNav = ({ onDiscoverClick }: TopNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm font-medium transition-colors hover:text-foreground',
      isActive ? 'text-foreground' : 'text-muted-foreground'
    );

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'block py-3 text-base font-medium transition-colors hover:text-foreground',
      isActive ? 'text-foreground' : 'text-muted-foreground'
    );

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
    onDiscoverClick?.();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                <NavLink to="/" className={mobileNavLinkClass} onClick={handleMobileNavClick}>
                  Discover
                </NavLink>
                <NavLink
                  to="/chat"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI Assistant
                </NavLink>
                <NavLink
                  to="/watchlist"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Watchlist
                </NavLink>
                <NavLink
                  to="/archive"
                  className={mobileNavLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Archive
                </NavLink>
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" className={navLinkClass} onClick={onDiscoverClick}>
              Discover
            </NavLink>
            <NavLink to="/chat" className={navLinkClass}>
              AI Assistant
            </NavLink>
            <NavLink to="/watchlist" className={navLinkClass}>
              Watchlist
            </NavLink>
            <NavLink to="/archive" className={navLinkClass}>
              Archive
            </NavLink>
          </div>

          {/* Desktop logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
