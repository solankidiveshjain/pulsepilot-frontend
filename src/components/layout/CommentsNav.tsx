import { cn } from '@/lib/utils';
import { Award, BarChart2, Settings } from 'lucide-react';
import Link from 'next/link';
import { UserNav } from './UserNav';

export type NavTab = 'comments' | 'analytics' | 'rewards' | 'settings';

interface CommentsNavProps {
  activeTab: NavTab;
  className?: string;
}

export function CommentsNav({ activeTab, className }: CommentsNavProps) {
  return (
    <div className={cn('border-b bg-card', className)}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-foreground">
            PulsePilot
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/comments"
              className={cn(
                'py-4 px-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'comments'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Comments
            </Link>
            <Link
              href="/analytics"
              className={cn(
                'py-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center',
                activeTab === 'analytics'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              Analytics
            </Link>
            <Link
              href="/rewards"
              className={cn(
                'py-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center',
                activeTab === 'rewards'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Award className="h-4 w-4 mr-1" />
              Rewards
            </Link>
            <Link
              href="/settings"
              className={cn(
                'py-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center',
                activeTab === 'settings'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </nav>
        </div>
        
        <UserNav />
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="flex justify-between">
          <Link
            href="/comments"
            className={cn(
              'flex flex-1 flex-col items-center py-2 text-xs font-medium',
              activeTab === 'comments'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <span>Comments</span>
          </Link>
          <Link
            href="/analytics"
            className={cn(
              'flex flex-1 flex-col items-center py-2 text-xs font-medium',
              activeTab === 'analytics'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <BarChart2 className="h-4 w-4 mb-1" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/rewards"
            className={cn(
              'flex flex-1 flex-col items-center py-2 text-xs font-medium',
              activeTab === 'rewards'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Award className="h-4 w-4 mb-1" />
            <span>Rewards</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              'flex flex-1 flex-col items-center py-2 text-xs font-medium',
              activeTab === 'settings'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Settings className="h-4 w-4 mb-1" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 