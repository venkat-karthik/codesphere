import { useState } from 'react';
import { Sun, Moon, Monitor, Star, Code, Zap, Leaf, Waves, Sunset, SquareDot, Sparkles, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'star-trek', label: 'Star Trek', icon: Star },
  { value: 'coding-vibe', label: 'Coding Vibe', icon: Code },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: Zap },
  { value: 'nature', label: 'Nature', icon: Leaf },
  { value: 'ocean', label: 'Ocean', icon: Waves },
  { value: 'sunset', label: 'Sunset', icon: Sunset },
  { value: 'matrix', label: 'Matrix', icon: SquareDot },
  { value: 'retro', label: 'Retro', icon: Sparkles },
  { value: 'minimal', label: 'Minimal', icon: Minus },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themeOptions.find(t => t.value === theme) || themeOptions[1];
  const IconComponent = currentTheme.icon;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 relative"
        >
          <IconComponent className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themeOptions.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value as any);
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <ThemeIcon className="h-4 w-4" />
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}