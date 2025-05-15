import { cn } from '@/lib/utils';
import {
    Bell,
    ChevronDown,
    LogOut,
    Settings,
    User,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface UserNavProps {
  className?: string;
}

export function UserNav({ className }: UserNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className={cn('relative', className)}>
      <button 
        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <Image
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo@example.com"
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-foreground">Alex Johnson</p>
          <p className="text-xs text-muted-foreground">alex@pulsepilot.io</p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover shadow-lg z-50">
          <div className="p-2">
            <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
              My Account
            </div>
            <div className="mt-1 space-y-1">
              <button
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profile
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                Notifications
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 