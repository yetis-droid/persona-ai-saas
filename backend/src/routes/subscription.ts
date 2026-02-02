import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Stripe初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// 価格設定
const PREMIUM_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
const PREMIUM_PRICE = 980; // 円

/**
 * チェックアウトセッションを作成
 */
router.post('/create-checkout-session', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    // すでにプレミアムユーザーの場合
    if (user.subscriptionTier === 'premium' && user.subscriptionStatus === 'active') {
      return res.status(400).json({ error: 'すでにプレミアムプランに加入しています' });
    }

    // Stripeカスタマーを作成または取得
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'Persona AI プレミアムプラン',
              description: '1日100回会話、人格3個まで、LINE連携対応',
            },
            unit_amount: PREMIUM_PRICE,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'チェックアウトセッションの作成に失敗しました' });
  }
});

/**
 * サブスクリプションをキャンセル
 */
router.post('/cancel-subscription', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeSubscriptionId) {
      return res.status(404).json({ error: 'サブスクリプションが見つかりません' });
    }

    // Stripeでキャンセル（期間終了時にキャンセル）
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ message: 'サブスクリプションをキャンセルしました。期間終了時に無効化されます。' });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'サブスクリプションのキャンセルに失敗しました' });
  }
});

/**
 * カスタマーポータルセッションを作成
 */
router.post('/customer-portal', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: 'Stripeカスタマーが見つかりません' });
    }

    // カスタマーポータルセッションを作成
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Customer portal error:', error);
    res.status(500).json({ error: 'カスタマーポータルの作成に失敗しました' });
  }
});

/**
 * Stripe Webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);

    // イベントタイプ別の処理
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tickets = session.metadata?.tickets;

        // チケット購入の場合（前払い・リスクゼロ）
        if (userId && tickets && !session.subscription) {
          const ticketCount = parseInt(tickets);
          const productName = session.metadata?.productName || 'チケット';

          // チケット付与
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              ticketBalance: true,
              ticketPurchaseHistory: true
            }
          });

          const newHistory = [
            ...(Array.isArray(user?.ticketPurchaseHistory) ? user.ticketPurchaseHistory : []),
            {
              date: new Date().toISOString(),
              tickets: ticketCount,
              amount: (session.amount_total || 0) / 100,
              sessionId: session.id,
              productName: productName
            }
          ];

          await prisma.user.update({
            where: { id: userId },
            data: {
              ticketBalance: {
                increment: ticketCount
              },
              ticketPurchaseHistory: newHistory,
              ticketLastPurchaseAt: new Date()
            },
          });

          console.log(`✅ Tickets granted: ${ticketCount} tickets to user ${userId}`);
        }
        // サブスクリプション購入の場合
        else if (userId && session.subscription) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: 'premium',
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: 'active',
            },
          });

          console.log(`✅ Premium subscription activated for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
              subscriptionEndsAt: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000)
                : null,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionTier: 'free',
              subscriptionStatus: 'canceled',
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * サブスクリプション情報を取得
 */
router.get('/subscription', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        dailyConversationCount: true,
        lastConversationDate: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'サブスクリプション情報の取得に失敗しました' });
  }
});

export default router;
