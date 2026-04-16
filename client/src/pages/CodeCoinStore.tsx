import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ShieldCheck, Lock, Coins } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
}

export function CodeCoinStore() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Track purchased items — persisted in localStorage per user
  const [purchased, setPurchased] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(`store-purchased-${user?.id}`) || '[]'); }
    catch { return []; }
  });

  const { data: items = [], isLoading } = useQuery<StoreItem[]>({
    queryKey: ['/api/store/items'],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (item: StoreItem) => {
      const res = await apiRequest('POST', `/api/store/purchase/${item.id}`, {});
      return res.json();
    },
    onSuccess: (data, item) => {
      const next = [...purchased, item.id];
      setPurchased(next);
      localStorage.setItem(`store-purchased-${user?.id}`, JSON.stringify(next));
      updateUser({ codeCoins: data.remainingCoins } as any);
      toast({ title: 'Unlocked!', description: `You unlocked "${item.title}".` });
      setIsModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast({ title: 'Purchase failed', description: err.message, variant: 'destructive' });
      setIsModalOpen(false);
    },
  });

  const userCoins = (user as any)?.codeCoins ?? 0;

  const handleUnlock = (item: StoreItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const TYPE_COLORS: Record<string, string> = {
    pdf: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    template: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    notes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">CodeCoin Store</h1>
        <p className="text-muted-foreground">Use your earned CodeCoins to unlock exclusive content.</p>
        <div className="inline-flex items-center justify-center mt-4 bg-card border rounded-full px-5 py-2 gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="font-bold text-yellow-500 text-lg">{userCoins}</span>
          <span className="text-muted-foreground text-sm">CodeCoins</span>
        </div>
        {!user && (
          <p className="text-sm text-muted-foreground mt-2">Sign in to purchase items.</p>
        )}
      </div>

      {/* How to earn */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-2">How to earn CodeCoins:</p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>✅ Solve a problem → 10 coins</span>
            <span>🔥 Daily streak → 5 coins/day</span>
            <span>📚 Complete a module → 20 coins</span>
            <span>🏆 Daily challenge → 50 coins</span>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items as StoreItem[]).map(item => {
            const isOwned = purchased.includes(item.id);
            const canAfford = userCoins >= item.price;
            return (
              <Card key={item.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={TYPE_COLORS[item.type] || ''}>{item.type}</Badge>
                    <div className="flex items-center gap-1 font-bold text-yellow-500">
                      <Coins className="h-4 w-4" />
                      {item.price}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{item.description}</p>
                  <div className="mt-4">
                    {isOwned ? (
                      <div className="flex items-center text-sm font-semibold text-green-500">
                        <ShieldCheck className="h-4 w-4 mr-1" /> Unlocked
                      </div>
                    ) : (
                      <Button className="w-full" size="sm"
                        onClick={() => handleUnlock(item)}
                        disabled={!user || !canAfford}>
                        <Lock className="h-4 w-4 mr-1" />
                        {!user ? 'Sign in to unlock' : !canAfford ? `Need ${item.price - userCoins} more coins` : 'Unlock'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirm Dialog */}
      {selectedItem && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Unlock "{selectedItem.title}" for {selectedItem.price} CodeCoins.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Item Cost</span><span className="font-semibold text-yellow-500">{selectedItem.price} coins</span></div>
              <div className="flex justify-between"><span>Your Balance</span><span className="font-semibold">{userCoins} coins</span></div>
              <hr />
              <div className="flex justify-between font-bold"><span>Remaining</span><span>{userCoins - selectedItem.price} coins</span></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={() => purchaseMutation.mutate(selectedItem!)}
                disabled={purchaseMutation.isPending}>
                {purchaseMutation.isPending ? 'Processing...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
