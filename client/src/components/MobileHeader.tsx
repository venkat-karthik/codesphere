import { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MobileHeaderProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export function MobileHeader({ onMenuClick, pageTitle }: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="lg:hidden bg-[#1E1B4B] border-b border-slate-700 p-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="text-slate-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
          {!showSearch && (
            <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {showSearch ? (
            <div className="flex-1 max-w-sm">
              <Input
                type="text"
                placeholder="Search..."
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="text-slate-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
