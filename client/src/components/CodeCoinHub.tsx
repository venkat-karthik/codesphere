import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function CodeCoinHub({ onNavigateToStore, className }: { onNavigateToStore: () => void, className?: string }) {
  const { user } = useAuth();

  // Mock data for recent activity
  const recentActivity = [
    { type: 'earn', amount: 10, reason: 'Daily Login Streak' },
    { type: 'earn', amount: 50, reason: 'Completed React Quiz' },
    { type: 'spend', amount: 30, reason: 'Unlocked CSS Cheatsheet' },
  ];

  if (!user) {
    return null;
  }

  return (
    <Card className={`bg-gradient-to-br from-background to-card/50 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">CodeCoin Wallet</CardTitle>
        <img src="/coin.svg" alt="CodeCoin" className="h-6 w-6" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-yellow-500 mb-2">{(user as any).codeCoins || 0}</div>
        <p className="text-xs text-muted-foreground mb-4">Your reward balance for learning</p>
        
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-muted-foreground">RECENT ACTIVITY</h4>
          {recentActivity.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                {item.type === 'earn' ? (
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                )}
                <span>{item.reason}</span>
              </div>
              <span className={`font-semibold ${item.type === 'earn' ? 'text-green-500' : 'text-red-500'}`}>
                {item.type === 'earn' ? '+' : '-'}{item.amount}
              </span>
            </div>
          ))}
        </div>

        <Button onClick={onNavigateToStore} className="w-full">
          Visit CodeCoin Store
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
} 