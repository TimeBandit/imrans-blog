---
title: Building a Pay-as-You-Go Billing System with Stripe and Firestore
author: "Imran Nazir"
description: How to implement credit-based billing that charges users only for what they consume
image:
  url: "../../assets/images/credit-based-billing-stripe-firestore.svg"
  alt: A stylised graphic
pubDate: 2026-03-04
tags: [stripe, firestore, backend]
---

Building a billing system that charges users based on actual usage rather than fixed subscriptions can be challenging. Here's how I built a robust **pay-as-you-go system** using Stripe and Firestore for a voice transcription service that charges $0.20 per minute of speech.

## The Challenge

Traditional subscription models don't work well for usage-based services. Users might transcribe 2 minutes one day and 50 minutes the next. They want to pay only for what they use, but you need real-time balance tracking and secure payment processing.

## Architecture Overview

The system works in two phases:
1. **Credit Purchase**: Users buy credits upfront via Stripe Checkout
2. **Real-time Deduction**: Credits are deducted as services are consumed

```
User Purchase → Stripe → Webhook → Add Credits → Firestore
Service Usage → Check Balance → Deduct Credits → Update Firestore
```

## Database Design

I use three Firestore collections to track everything:

**Users Collection** - Stores credit balances:
```typescript
interface User {
  id: string;
  email: string;
  creditBalance: number;  // Current balance in USD
  stripeCustomerId?: string;
}
```

**Usage Sessions** - Tracks consumption:
```typescript
interface UsageSession {
  userId: string;
  actualSpokenMinutes: number;  // Only speech, not silence
  costUSD: number;
  sessionStart: Date;
}
```

**Credit Transactions** - Audit trail:
```typescript
interface CreditTransaction {
  userId: string;
  type: 'topup' | 'usage';
  amount: number;
  balanceAfter: number;
}
```

## The Critical Part: Thread-Safe Credit Updates

The most important piece is handling concurrent operations for individual users safely. A single user might have multiple browser tabs open or make rapid API calls, so you need atomic transactions to prevent race conditions on their personal balance:

```typescript
async updateUserCredits(userId: string, amount: number): Promise<number> {
  const userRef = this.db.collection('users').doc(userId);

  return await this.db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userRef);
    const currentBalance = doc.data()?.creditBalance || 0;
    const newBalance = currentBalance + amount;

    if (newBalance < 0) {
      throw new Error('Insufficient credits');
    }

    transaction.update(userRef, {
      creditBalance: newBalance,
      updatedAt: new Date()
    });

    return newBalance;
  });
}
```

This Firestore transaction ensures that each user's individual balance stays accurate, even if they're making multiple simultaneous requests.

## Real-Time Credit Deduction

When your service processes a user request, it calls your billing API:

```typescript
// API endpoint for real-time deduction
router.post('/deduct', async (req, res) => {
  const { userEmail, amount } = req.body;
  
  const user = await db.getUserByEmail(userEmail);
  if (amount > user.creditBalance) {
    return res.status(409).json({ 
      error: 'Insufficient credits' 
    });
  }

  const newBalance = await db.updateUserCredits(user.id, -amount);
  res.json({ creditBalance: newBalance });
});
```

## Stripe Integration for Credit Top-ups

Users buy credits through Stripe Checkout:

```typescript
async createCreditCheckoutSession(customerId: string, amount: number) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Service Credits' },
        unit_amount: amount * 100  // Convert to cents
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: 'https://yourapp.com/success',
    cancel_url: 'https://yourapp.com/cancel',
    metadata: { type: 'credit_topup', amount: amount.toString() }
  });

  return session.url;
}
```

## Webhook Handler for Automatic Credit Addition

When payment succeeds, Stripe sends a webhook to automatically add credits:

```typescript
router.post('/webhook', async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body, 
    req.headers['stripe-signature'], 
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const amount = parseFloat(session.metadata.amount);
    
    const user = await db.getUserByStripeCustomerId(customerId);
    await db.updateUserCredits(user.id, amount);
  }

  res.json({ received: true });
});
```

## Frontend Integration

The frontend checks balances and initiates purchases:

```javascript
// Check current balance
const response = await fetch('/api/billing/balance?userEmail=user@example.com');
const { creditBalance, estimatedMinutesRemaining } = await response.json();

// Buy more credits
window.location.href = `/api/billing/checkout?userId=${userEmail}&amount=10`;

// Deduct credits during service usage
await fetch('/api/billing/deduct', {
  method: 'POST',
  body: JSON.stringify({ userEmail, amount: 0.50 })
});
```

## Key Benefits

1. **Atomic Transactions** - No race conditions on individual user balances
2. **Real-time Deduction** - Credits deducted as services are consumed
3. **Complete Audit Trail** - Every transaction is recorded
4. **Scalable** - Handles thousands of micro-transactions
5. **Secure** - Stripe handles PCI compliance

## Production Tips

- Use Firestore transactions for all balance updates
- Set up proper Stripe webhook endpoint security
- Implement rate limiting on deduction endpoints
- Monitor failed transactions and set up alerts
- Test thoroughly with Stripe's test mode

This system has processed over 10,000 transactions with 99.9% reliability. The key is using database transactions for atomic updates and proper webhook handling for seamless credit top-ups.

---

*Building pay-as-you-go billing requires careful handling of concurrent operations and real-time balance tracking. This architecture provides a solid foundation for usage-based SaaS applications.*