import { Router } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware";

const router = Router();

// Create payment order
router.post("/create-order", requireAuth, async (req, res) => {
  try {
    const { plan } = req.body; // 'pro' | 'enterprise'

    const PLAN_PRICES: Record<string, { amount: number; label: string }> = {
      pro:        { amount: 199900, label: 'Pro Monthly' },      // ₹1999
      'pro-yearly':    { amount: 1999900, label: 'Pro Yearly' }, // ₹19999
      enterprise: { amount: 499900, label: 'Enterprise Monthly' }, // ₹4999
      'enterprise-yearly': { amount: 4999900, label: 'Enterprise Yearly' }, // ₹49999
    };

    const planInfo = PLAN_PRICES[plan];
    if (!planInfo) return res.status(400).json({ message: "Invalid plan" });

    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: "Payment gateway not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" });
    }

    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

    const order = await razorpay.orders.create({
      amount: planInfo.amount,
      currency: 'INR',
      receipt: `order_${req.session.userId}_${Date.now()}`,
      notes: { userId: String(req.session.userId), plan },
    });

    // Save pending payment record
    await storage.createPayment({
      userId: req.session.userId!,
      amount: String(planInfo.amount / 100),
      currency: 'INR',
      subscriptionType: plan,
      paymentMethod: 'razorpay',
      status: 'pending',
      orderId: order.id,
      transactionId: null,
    });

    return res.json({
      orderId: order.id,
      amount: planInfo.amount,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      planLabel: planInfo.label,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Failed to create payment order" });
  }
});

// Verify payment
router.post("/verify", requireAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (!RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: "Payment gateway not configured" });
    }

    // Verify signature
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await storage.updatePaymentByOrderId(razorpay_order_id, { status: 'failed' });
      return res.status(400).json({ message: "Payment verification failed — invalid signature" });
    }

    // Mark payment completed
    await storage.updatePaymentByOrderId(razorpay_order_id, {
      status: 'completed',
      transactionId: razorpay_payment_id,
    });

    // Upgrade user subscription
    const subscriptionType = plan.startsWith('enterprise') ? 'pro' : 'premium';
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + (plan.includes('yearly') ? 12 : 1));

    await storage.updateUser(req.session.userId!, {
      subscriptionType,
      subscriptionExpiry: expiry,
    });

    return res.json({ message: "Payment verified successfully", subscriptionType });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
});

// Get payment history
router.get("/history", requireAuth, async (req, res) => {
  try {
    if (req.session.userId! <= 0) return res.json([]);
    const history = await storage.getUserPayments(req.session.userId!);
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get payment history" });
  }
});

export default router;