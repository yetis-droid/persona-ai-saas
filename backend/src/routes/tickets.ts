// ===================================
// 🎫 チケットシステム API
// 前払い制・リスクゼロ収益モデル
// ===================================

import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth'; // authMiddleware → authenticate

const router = express.Router();
const prisma = new PrismaClient();

// Stripe初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover' // バージョン統一
});

// ===================================
// チケット商品定義（手数料込み価格）
// ===================================

interface TicketProduct {
  amount: number;   // 価格（円）
  tickets: number;  // チケット数
  name: string;     // 商品名
  description: string; // 説明
  perTicketCost: number; // 1チケットあたりの価格
}

const TICKET_PRODUCTS: Record<string, TicketProduct> = {
  '10': {
    amount: 110,
    tickets: 10,
    name: '10回チケット',
    description: '10回分の会話チケット（有効期限180日）',
    perTicketCost: 11
  },
  '50': {
    amount: 440,
    tickets: 50,
    name: '50回チケット',
    description: '50回分の会話チケット（有効期限180日）🔥 人気No.1',
    perTicketCost: 8.8
  },
  '100': {
    amount: 770,
    tickets: 100,
    name: '100回チケット',
    description: '100回分の会話チケット（有効期限180日）💎 最安値',
    perTicketCost: 7.7
  }
};

// ===================================
// API エンドポイント
// ===================================

/**
 * チケット購入（Stripe Checkout）
 * POST /api/tickets/purchase
 */
router.post('/purchase', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { ticketType } = req.body;

    // チケットタイプ検証
    if (!TICKET_PRODUCTS[ticketType]) {
      return res.status(400).json({
        error: 'Invalid ticket type',
        message: '無効なチケットタイプです'
      });
    }

    const product = TICKET_PRODUCTS[ticketType];

    // ユーザー情報取得
    const dbUser = await prisma.user.findUnique({
      where: { id: user!.userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true
      }
    });

    if (!dbUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'ユーザーが見つかりません'
      });
    }

    // Stripeカスタマー作成（初回のみ）
    let customerId = dbUser.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: {
          userId: dbUser.id
        }
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // Stripe Checkout Session作成（前払い）
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment', // 一回払い（リスクゼロ）
      line_items: [{
        price_data: {
          currency: 'jpy',
          product_data: {
            name: product.name,
            description: product.description,
            images: []
          },
          unit_amount: product.amount
        },
        quantity: 1
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?ticket_success=true&tickets=${product.tickets}`,
      cancel_url: `${process.env.FRONTEND_URL}/tickets?ticket_canceled=true`,
      metadata: {
        userId: dbUser.id,
        ticketType: ticketType,
        tickets: product.tickets.toString(),
        productName: product.name
      }
    });

    res.json({
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error: any) {
    console.error('Ticket purchase error:', error);
    res.status(500).json({
      error: 'Purchase failed',
      message: 'チケット購入に失敗しました'
    });
  }
});

/**
 * チケット残高取得
 * GET /api/tickets/balance
 */
router.get('/balance', authenticate, async (req, res) => {
  try {
    const user = req.user;

    const dbUser = await prisma.user.findUnique({
      where: { id: user!.userId },
      select: {
        ticketBalance: true,
        ticketPurchaseHistory: true,
        ticketLastPurchaseAt: true
      }
    });

    if (!dbUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      balance: dbUser.ticketBalance || 0,
      history: dbUser.ticketPurchaseHistory || [],
      lastPurchaseAt: dbUser.ticketLastPurchaseAt
    });

  } catch (error: any) {
    console.error('Balance fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch balance'
    });
  }
});

/**
 * チケット商品一覧取得
 * GET /api/tickets/products
 */
router.get('/products', (req, res) => {
  res.json({
    products: Object.entries(TICKET_PRODUCTS).map(([key, product]) => ({
      id: key,
      ...product
    }))
  });
});

/**
 * チケット使用履歴取得
 * GET /api/tickets/usage-history
 */
router.get('/usage-history', authenticate, async (req, res) => {
  try {
    const user = req.user;

    // 過去30日間の会話ログを取得
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usageLogs = await prisma.usageLog.findMany({
      where: {
        userId: user!.userId,
        action: 'conversation',
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    res.json({
      history: usageLogs
    });

  } catch (error: any) {
    console.error('Usage history fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch usage history'
    });
  }
});

export default router;
