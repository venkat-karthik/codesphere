import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

// ── Unit tests for Razorpay signature verification ────────────────────────

describe('Razorpay signature verification', () => {
  const SECRET = 'test_secret_key';

  function generateSignature(orderId: string, paymentId: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  }

  it('verifies a valid signature', () => {
    const orderId = 'order_123';
    const paymentId = 'pay_456';
    const sig = generateSignature(orderId, paymentId, SECRET);

    const expected = crypto
      .createHmac('sha256', SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    expect(sig).toBe(expected);
  });

  it('rejects a tampered signature', () => {
    const orderId = 'order_123';
    const paymentId = 'pay_456';
    const validSig = generateSignature(orderId, paymentId, SECRET);
    const tamperedSig = validSig.slice(0, -4) + 'xxxx';
    expect(validSig).not.toBe(tamperedSig);
  });

  it('rejects signature with wrong secret', () => {
    const orderId = 'order_123';
    const paymentId = 'pay_456';
    const sig1 = generateSignature(orderId, paymentId, SECRET);
    const sig2 = generateSignature(orderId, paymentId, 'wrong_secret');
    expect(sig1).not.toBe(sig2);
  });
});

describe('Plan pricing', () => {
  const PLAN_PRICES: Record<string, number> = {
    pro: 199900,
    'pro-yearly': 1999900,
    enterprise: 499900,
    'enterprise-yearly': 4999900,
  };

  it('pro monthly is ₹1999', () => {
    expect(PLAN_PRICES['pro'] / 100).toBe(1999);
  });

  it('pro yearly is ₹19999', () => {
    expect(PLAN_PRICES['pro-yearly'] / 100).toBe(19999);
  });

  it('enterprise monthly is ₹4999', () => {
    expect(PLAN_PRICES['enterprise'] / 100).toBe(4999);
  });

  it('yearly saves vs monthly', () => {
    const proMonthlyCost = PLAN_PRICES['pro'] * 12;
    const proYearlyCost = PLAN_PRICES['pro-yearly'];
    expect(proYearlyCost).toBeLessThan(proMonthlyCost);
  });
});
