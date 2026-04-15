import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ShieldCheck, Lock } from 'lucide-react';
import { User } from '@/types';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'pdf' | 'template' | 'notes';
}

// Mock Data
const storeItems: StoreItem[] = [
  { id: 'res1', title: 'Advanced CSS Cheatsheet', description: 'Quick reference for modern CSS.', price: 30, type: 'pdf' },
  { id: 'res2', title: 'React Project Template', description: 'A starter kit for your next project.', price: 100, type: 'template' },
  { id: 'res3', title: 'Node.js API Notes', description: 'In-depth notes on building APIs.', price: 50, type: 'notes' },
];

interface ResourceCardProps {
  item: StoreItem;
  user: User | null;
  unlockedItems: string[];
  onUnlock: (item: StoreItem) => void;
}

function ResourceCard({ item, user, unlockedItems, onUnlock }: ResourceCardProps) {
  const isUnlocked = unlockedItems.includes(item.id);
  const canAfford = user ? (user.codeCoins || 0) >= item.price : false;

  return (
    <Card className="flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground flex-1">{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center font-bold text-yellow-500">
            <img src="/coin.svg" alt="CodeCoin" className="h-5 w-5 mr-1" />
            {item.price}
          </div>
          {isUnlocked ? (
            <div className="flex items-center text-sm font-semibold text-green-500">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Unlocked
            </div>
          ) : (
            <Button size="sm" onClick={() => onUnlock(item)} disabled={!canAfford || !user}>
              <Lock className="h-4 w-4 mr-1" />
              Unlock
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function CodeCoinStore() {
  const { user } = useAuth();
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['res2']);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUnlockClick = (item: StoreItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedItem || !user) return;

    // API call to backend to spend coins would happen here
    setUnlockedItems([...unlockedItems, selectedItem.id]);
    // Also update user.codeCoins in your auth context
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">CodeCoin Store</h1>
        <p className="text-muted-foreground mt-2">Use your earned CodeCoins to unlock exclusive content.</p>
        <div className="inline-flex items-center justify-center mt-4 bg-card border rounded-full px-4 py-2">
          Your Balance: 
          <span className="flex items-center font-bold text-yellow-500 ml-2">
            <img src="/coin.svg" alt="CodeCoin" className="h-5 w-5 mr-1" />
            {user?.codeCoins || 0}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeItems.map(item => (
          <ResourceCard key={item.id} item={item} user={user} unlockedItems={unlockedItems} onUnlock={handleUnlockClick} />
        ))}
      </div>

      {selectedItem && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Unlock</DialogTitle>
              <DialogDescription>
                You are about to unlock "{selectedItem.title}". This will be deducted from your CodeCoin balance.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 space-y-2">
              <div className="flex justify-between"><span>Item Cost:</span> <span className="font-semibold text-yellow-500">{selectedItem.price} Coins</span></div>
              <div className="flex justify-between"><span>Your Balance:</span> <span className="font-semibold">{user?.codeCoins || 0} Coins</span></div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold"><span>Remaining Balance:</span> <span>{(user?.codeCoins || 0) - selectedItem.price} Coins</span></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmPurchase}>Confirm & Unlock</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
