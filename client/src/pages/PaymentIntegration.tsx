import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, Star, Crown, BookOpen, Lock, CreditCard, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// ── Types ──────────────────────────────────────────────────────────────────

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;   // in INR
  yearlyPrice: number;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  icon: any;
  color: string;
  subscriptionType: string;
}

interface PaymentRecord {
  id: number;
  amount: string;
  currency: string;
  subscriptionType: string;
  status: string;
  transactionId: string | null;
  createdAt: string;
}

// ── Plans ──────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    subscriptionType: 'free',
    icon: BookOpen,
    color: 'text-gray-500',
    features: ['Basic courses', 'Community forums', 'Basic coding problems', '5 sandbox projects', 'Email support'],
    notIncluded: ['Premium courses', 'AI code reviews', 'Unlimited projects'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 1999,
    yearlyPrice: 19999,
    subscriptionType: 'premium',
    popular: true,
    icon: Star,
    color: 'text-blue-500',
    features: [
      'All Free features', 'Unlimited learning hours', 'Premium courses & tutorials',
      'Advanced coding challenges', 'Unlimited sandbox projects',
      'AI-powered code reviews', 'Priority support', 'Downloadable resources',
      'Progress analytics', '500 CodeCoins/month',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 4999,
    yearlyPrice: 49999,
    subscriptionType: 'pro',
    icon: Crown,
    color: 'text-purple-500',
    features: [
      'All Pro features', 'Team management dashboard', '1-on-1 mentoring sessions',
      'Custom learning paths', 'Advanced analytics', 'Dedicated account manager',
      '24/7 support', 'Custom integrations', '2000 CodeCoins/month',
    ],
  },
];

// ── Razorpay loader ────────────────────────────────────────────────────────

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Component ──────────────────────────────────────────────────────────────

export function PaymentIntegration() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [paying, setPaying] = useState(false);

  const { data: history = [], isLoading: historyLoading } = useQuery<PaymentRecord[]>({
    queryKey: ['/api/payments/history'],
    enabled: !!user && user.id > 0,
  });

  // Check if Razorpay is configured
  const { data: payConfig } = useQuery<{ configured: boolean }>({
    queryKey: ['/api/payments/config'],
    queryFn: async () => {
      const res = await fetch('/api/payments/config', { credentials: 'include' });
      if (!res.ok) return { configured: false };
      return res.json();
    },
  });
  const razorpayConfigured = payConfig?.configured ?? false;

  const createOrderMutation = useMutation({
    mutationFn: async (planId: string) => {
      const key = billing === 'yearly' ? `${planId}-yearly` : planId;
      const res = await apiRequest('POST', '/api/payments/create-order', { plan: key });
      return res.json();
    },
    onSuccess: async (orderData, planId) => {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast({ title: 'Error', description: 'Failed to load payment gateway.', variant: 'destructive' });
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CodeSphere',
        description: orderData.planLabel,
        order_id: orderData.orderId,
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : '',
          email: user?.email || '',
        },
        theme: { color: '#6366f1' },
        handler: async (response: any) => {
          setPaying(true);
          try {
            const key = billing === 'yearly' ? `${planId}-yearly` : planId;
            const verifyRes = await apiRequest('POST', '/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: key,
            });
            const data = await verifyRes.json();
            updateUser({ subscriptionType: data.subscriptionType } as any);
            qc.invalidateQueries({ queryKey: ['/api/payments/history'] });
            toast({ title: 'Payment Successful!', description: `You are now on the ${PLANS.find(p => p.id === planId)?.name} plan.` });
          } catch {
            toast({ title: 'Verification failed', description: 'Contact support with your payment ID.', variant: 'destructive' });
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to initiate payment.', variant: 'destructive' });
    },
  });

  const currentSub = (user as any)?.subscriptionType || 'free';
  const currentPlan = PLANS.find(p => p.subscriptionType === currentSub) || PLANS[0];

  const getPrice = (plan: Plan) => billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const getSaving = (plan: Plan) => Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-8">

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">Unlock premium features and accelerate your coding career</p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={billing === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>Monthly</span>
          <button
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-12 h-6 rounded-full transition-colors ${billing === 'yearly' ? 'bg-primary' : 'bg-muted'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${billing === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
          <span className={billing === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}>Yearly</span>
          {billing === 'yearly' && <Badge className="bg-green-100 text-green-800">Save up to 17%</Badge>}
        </div>
      </div>

      {/* Razorpay not configured banner */}
      {!razorpayConfigured && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-700">Payment Gateway Not Configured</p>
            <p className="text-sm text-yellow-600 mt-0.5">
              Razorpay keys are not set in <code className="bg-yellow-500/20 px-1 rounded">.env</code>.
              Add <code className="bg-yellow-500/20 px-1 rounded">RAZORPAY_KEY_ID</code> and{' '}
              <code className="bg-yellow-500/20 px-1 rounded">RAZORPAY_KEY_SECRET</code> to enable payments.
              Plan selection is shown for preview only.
            </p>
          </div>
        </div>
      )}

      {/* Current plan banner */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-background rounded-lg shadow-sm">
              <currentPlan.icon className={`h-6 w-6 ${currentPlan.color}`} />
            </div>
            <div>
              <p className="font-semibold text-lg">Current Plan: {currentPlan.name}</p>
              <p className="text-muted-foreground text-sm">
                {currentPlan.monthlyPrice === 0 ? 'Free forever' : `₹${currentPlan.monthlyPrice}/month`}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
        </CardContent>
      </Card>

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {PLANS.map(plan => {
          const price = getPrice(plan);
          const isCurrentPlan = plan.subscriptionType === currentSub;
          const isUpgrade = PLANS.indexOf(plan) > PLANS.findIndex(p => p.subscriptionType === currentSub);

          return (
            <Card key={plan.id} className={`relative flex flex-col ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-3 pb-4">
                <div className="mx-auto p-3 bg-muted rounded-full w-fit">
                  <plan.icon className={`h-8 w-8 ${plan.color}`} />
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      {price === 0 ? 'Free' : `₹${price.toLocaleString()}`}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground text-sm">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                  {billing === 'yearly' && price > 0 && (
                    <p className="text-xs text-green-600 mt-1">Save {getSaving(plan)}% vs monthly</p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-4">
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded?.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm opacity-50">
                      <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan || price === 0 || paying || createOrderMutation.isPending}
                  onClick={() => !isCurrentPlan && price > 0 && createOrderMutation.mutate(plan.id)}
                >
                  {paying && createOrderMutation.variables === plan.id ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Processing...</>
                  ) : isCurrentPlan ? 'Current Plan'
                    : price === 0 ? 'Free Forever'
                    : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment History */}
      {user && user.id > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (history as PaymentRecord[]).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No payments yet.</p>
            ) : (
              <div className="divide-y">
                {(history as PaymentRecord[]).map(p => (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium capitalize">{p.subscriptionType} Plan</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(p.createdAt).toLocaleDateString()}
                        {p.transactionId && ` · ${p.transactionId}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{parseFloat(p.amount).toLocaleString()}</p>
                      <Badge className={p.status === 'completed' ? 'bg-green-500/20 text-green-600' : p.status === 'failed' ? 'bg-red-500/20 text-red-600' : 'bg-yellow-500/20 text-yellow-600'}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feature comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Feature</th>
                <th className="text-center py-3">Free</th>
                <th className="text-center py-3">Pro</th>
                <th className="text-center py-3">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ['Basic Courses', true, true, true],
                ['Community Access', true, true, true],
                ['Premium Courses', false, true, true],
                ['AI Code Reviews', false, true, true],
                ['Unlimited Projects', false, true, true],
                ['CodeCoins Monthly', false, true, true],
                ['1-on-1 Mentoring', false, false, true],
                ['Team Management', false, false, true],
                ['Custom Integrations', false, false, true],
              ].map(([feature, free, pro, ent], i) => (
                <tr key={i}>
                  <td className="py-3 font-medium">{feature as string}</td>
                  {[free, pro, ent].map((v, j) => (
                    <td key={j} className="text-center py-3">
                      {v ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        Payments are processed securely by Razorpay. We never store your card details.
      </div>
    </div>
  );
}
