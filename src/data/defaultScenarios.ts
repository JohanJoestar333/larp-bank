import { Phase, ShopifyData, YouTubeData, CryptoData, BankData } from '../types';

export const INVOXION_AVATAR = '/images/invoxion_avatar_1790804765159.jpg';
export const THUMB_SKINWALKER = '/images/thumb_skinwalker_1790804774764.jpg';
export const THUMB_UNEXPLAINABLE = '/images/thumb_unexplainable_1790804784199.jpg';
export const THUMB_APPALACHIAN = '/images/thumb_appalachian_1790804793432.jpg';

export const THUMB_DESK = '/images/yt_video_thumb_desk_1790794572593.jpg';
export const THUMB_FINANCE = '/images/yt_video_thumb_finance_1790794583180.jpg';
export const PROD_BOTTLE = '/images/shopify_prod_bottle_1790794593124.jpg';
export const PROD_WALLET = '/images/shopify_prod_wallet_1790794601962.jpg';

export function recalculateShopify(data: Partial<ShopifyData>): ShopifyData {
  const ordersCount = data.ordersCount ?? 26;
  const aov = data.aov ?? 70.76;
  const sessions = data.sessions ?? 1120;
  const grossSales = Math.round(ordersCount * aov);
  const discounts = data.discounts ?? Math.round(grossSales * 0.03);
  const returns = data.returns ?? Math.round(grossSales * 0.02);
  const netSales = grossSales - discounts - returns;
  const conversionRate = sessions > 0 ? Number(((ordersCount / sessions) * 100).toFixed(2)) : 2.32;

  // Dynamically scale sales chart points proportionally to total sales
  const salesWeights = [0.07, 0.18, 0.31, 0.22, 0.49, 0.42, 0.46];
  const chartPoints = salesWeights.map((w, idx) => ({
    label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx],
    sales: Math.round(netSales * w),
    orders: Math.max(1, Math.round(ordersCount * w)),
  }));

  return {
    storeName: data.storeName || 'AURA GOODS',
    currency: data.currency || '$',
    totalSales: netSales,
    salesChange: data.salesChange ?? 22.4,
    ordersCount,
    ordersChange: data.ordersChange ?? 18.0,
    sessions,
    sessionsChange: data.sessionsChange ?? 15.5,
    conversionRate,
    aov,
    grossSales,
    discounts,
    returns,
    netSales,
    topProducts: data.topProducts || [],
    recentOrders: data.recentOrders || [],
    chartPoints,
    visitorsOnline: data.visitorsOnline,
    ordersToFulfill: data.ordersToFulfill,
    paymentsToCapture: data.paymentsToCapture,
  };
}

export function recalculateYouTube(data: Partial<YouTubeData>): YouTubeData {
  const views = data.views ?? 18500;
  const rpm = data.rpm ?? 5.3;
  const estimatedRevenue = Math.round((views / 1000) * rpm);
  const watchTimeHours = Math.round((views * 4.2) / 60);

  // Dynamically generate chart points scaled to views and estimated revenue
  const curveWeights = [0.08, 0.12, 0.16, 0.24, 0.19, 0.32, 0.40];
  const chartPoints = curveWeights.map((w, idx) => ({
    label: `Day ${idx === 0 ? 1 : idx * 4 + 4}`,
    views: Math.round(views * w),
    revenue: Number((estimatedRevenue * w).toFixed(2)),
  }));

  return {
    channelName: data.channelName || 'Invoxion',
    handle: data.handle || '@invoxion',
    avatarUrl: data.avatarUrl || INVOXION_AVATAR,
    subscribers: data.subscribers ?? 2840,
    subscriberChange: data.subscriberChange ?? 195,
    views,
    viewsChange: data.viewsChange ?? 14.2,
    watchTimeHours,
    watchTimeChange: data.watchTimeChange ?? 9.8,
    estimatedRevenue,
    revenueChange: data.revenueChange ?? 11.5,
    rpm,
    currency: data.currency || '$',
    period: data.period || '28d',
    topVideos: data.topVideos || [],
    chartPoints,
  };
}

export function recalculateCrypto(data: Partial<CryptoData>): CryptoData {
  const assets = data.assets || [];
  const totalValue = assets.reduce((acc, curr) => acc + (curr.quantity * curr.priceUsd), 0);
  const assetsWithValue = assets.map(a => ({
    ...a,
    valueUsd: Math.round(a.quantity * a.priceUsd * 100) / 100
  }));

  const change24hPercent = data.change24hPercent ?? 3.75;
  const change24h = Math.round(totalValue * (change24hPercent / 100));

  return {
    walletName: data.walletName || 'Coldcard Vault • Personal',
    currency: data.currency || '$',
    totalValue: Math.round(totalValue * 100) / 100,
    change24h,
    change24hPercent,
    assets: assetsWithValue,
    transactions: data.transactions || [],
    chartPoints: data.chartPoints || [],
  };
}

export function recalculateBank(data: Partial<BankData>): BankData {
  const checking = data.checkingBalance ?? 4120;
  const savings = data.savingsBalance ?? 2300;
  const totalBalance = checking + savings;

  return {
    institutionName: data.institutionName || 'AURA PRIVATE RESERVE',
    accountHolder: data.accountHolder || 'Alexander M. Sterling',
    totalBalance,
    checkingBalance: checking,
    checkingNumber: data.checkingNumber || '•••• 4410',
    savingsBalance: savings,
    savingsNumber: data.savingsNumber || '•••• 8820',
    creditCard: data.creditCard || {
      cardNumber: '•••• •••• •••• 1098',
      cardHolder: 'ALEXANDER STERLING',
      expiry: '11/28',
      cvv: '•••',
      creditLimit: 10000,
      availableCredit: 8940,
      balance: 1060,
      cardType: 'Titanium Gold',
    },
    monthlyIncome: data.monthlyIncome ?? 3850,
    monthlyExpenses: data.monthlyExpenses ?? 2140,
    monthlySpending: data.monthlySpending ?? 1060,
    transactions: data.transactions || [],
    categories: data.categories || [],
  };
}

// Only Phase 1 is provided by default. The user adds all other phases themselves.
export const DEFAULT_PHASES: Phase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1: The Beginning',
    description: 'Modest early-stage creator and side hustle metrics for starting episodes.',
    createdAt: '2026-01-10T10:00:00Z',
    youtube: {
      channelName: 'Invoxion',
      handle: '@invoxion',
      avatarUrl: INVOXION_AVATAR,
      subscribers: 4280,
      subscriberChange: 380,
      views: 34640,
      viewsChange: 24.8,
      watchTimeHours: 1940,
      watchTimeChange: 18.5,
      estimatedRevenue: 184,
      revenueChange: 22.4,
      rpm: 5.30,
      currency: '$',
      period: '28d',
      topVideos: [
        {
          id: 'v1',
          title: "Reddit's Scariest Skinwalker Stories",
          views: 14800,
          likes: 1120,
          comments: 142,
          duration: '18:42',
          impressions: 64500,
          ctr: 8.2,
          dateAgo: '2 days ago',
          thumbnail: THUMB_SKINWALKER,
        },
        {
          id: 'v2',
          title: "Most Unexplainable Reddit Horror Stories",
          views: 11200,
          likes: 840,
          comments: 96,
          duration: '15:20',
          impressions: 51200,
          ctr: 7.5,
          dateAgo: '9 days ago',
          thumbnail: THUMB_UNEXPLAINABLE,
        },
        {
          id: 'v3',
          title: "Reddit's Most Terrifying Appalachian Stories",
          views: 8640,
          likes: 612,
          comments: 78,
          duration: '22:15',
          impressions: 39800,
          ctr: 6.9,
          dateAgo: '18 days ago',
          thumbnail: THUMB_APPALACHIAN,
        },
      ],
      chartPoints: [
        { label: 'Day 1', views: 2770, revenue: 14.7 },
        { label: 'Day 5', views: 4150, revenue: 22.1 },
        { label: 'Day 10', views: 5540, revenue: 29.4 },
        { label: 'Day 15', views: 8310, revenue: 44.2 },
        { label: 'Day 20', views: 6580, revenue: 35.0 },
        { label: 'Day 25', views: 11080, revenue: 58.9 },
        { label: 'Day 28', views: 13850, revenue: 73.6 },
      ]
    },
    shopify: {
      storeName: 'AURA GOODS',
      currency: '$',
      totalSales: 1840,
      salesChange: 22.4,
      ordersCount: 26,
      ordersChange: 18.0,
      sessions: 1120,
      sessionsChange: 15.5,
      conversionRate: 2.32,
      aov: 70.76,
      grossSales: 1950,
      discounts: 65,
      returns: 45,
      netSales: 1840,
      topProducts: [
        {
          id: 'p1',
          name: 'Thermal Matte Obsidian Tumbler',
          sales: 1120,
          unitsSold: 16,
          price: 70,
          image: PROD_BOTTLE,
        },
        {
          id: 'p2',
          name: 'Precision Titanium Card Carrier',
          sales: 720,
          unitsSold: 10,
          price: 72,
          image: PROD_WALLET,
        }
      ],
      recentOrders: [
        {
          id: 'ord-101',
          orderNumber: '#1026',
          customerName: 'Marcus Vance',
          itemsSummary: '1 item • Express',
          amount: 70.00,
          status: 'Paid',
          dateAgo: '2 hours ago',
        },
        {
          id: 'ord-102',
          orderNumber: '#1025',
          customerName: 'Elena Rostova',
          itemsSummary: '2 items • Standard',
          amount: 142.00,
          status: 'Fulfilled',
          dateAgo: '1 day ago',
        }
      ],
      chartPoints: [
        { label: 'Mon', sales: 140, orders: 2 },
        { label: 'Tue', sales: 210, orders: 3 },
        { label: 'Wed', sales: 180, orders: 2 },
        { label: 'Thu', sales: 320, orders: 4 },
        { label: 'Fri', sales: 410, orders: 6 },
        { label: 'Sat', sales: 290, orders: 4 },
        { label: 'Sun', sales: 290, orders: 5 },
      ]
    },
    crypto: {
      walletName: 'Coldcard Vault • Personal',
      currency: '$',
      totalValue: 3450.00,
      change24h: 124.50,
      change24hPercent: 3.75,
      assets: [
        { id: 'c1', symbol: 'BTC', name: 'Bitcoin', quantity: 0.028, priceUsd: 88500, valueUsd: 2478.00, change24hPercent: 2.8, color: '#f59e0b' },
        { id: 'c2', symbol: 'ETH', name: 'Ethereum', quantity: 0.22, priceUsd: 3420, valueUsd: 752.40, change24hPercent: 4.1, color: '#6366f1' },
        { id: 'c3', symbol: 'SOL', name: 'Solana', quantity: 1.15, priceUsd: 191, valueUsd: 219.60, change24hPercent: 6.4, color: '#14b8a6' },
      ],
      transactions: [
        { id: 'tx1', type: 'receive', assetSymbol: 'BTC', amount: 0.015, fiatValue: 1327.50, counterparty: 'Kraken Cold Pay', timestamp: 'Yesterday, 14:22', status: 'Confirmed', txHash: '8f4c...91b2' },
        { id: 'tx2', type: 'receive', assetSymbol: 'ETH', amount: 0.10, fiatValue: 342.00, counterparty: 'Mining Reserve', timestamp: 'Sep 24, 09:10', status: 'Confirmed', txHash: '2e7a...45d1' },
      ],
      chartPoints: [
        { label: '00:00', value: 3320 },
        { label: '04:00', value: 3360 },
        { label: '08:00', value: 3310 },
        { label: '12:00', value: 3390 },
        { label: '16:00', value: 3420 },
        { label: '20:00', value: 3450 },
      ]
    },
    bank: {
      institutionName: 'AURA PRIVATE RESERVE',
      accountHolder: 'Alexander M. Sterling',
      totalBalance: 6420.00,
      checkingBalance: 4120.00,
      checkingNumber: '•••• 4410',
      savingsBalance: 2300.00,
      savingsNumber: '•••• 8820',
      creditCard: {
        cardNumber: '•••• •••• •••• 1098',
        cardHolder: 'ALEXANDER STERLING',
        expiry: '11/28',
        cvv: '•••',
        creditLimit: 10000,
        availableCredit: 8940,
        balance: 1060,
        cardType: 'Titanium Gold',
      },
      monthlyIncome: 3850,
      monthlyExpenses: 2140,
      monthlySpending: 1060,
      transactions: [
        { id: 'bt1', name: 'Stripe Payout Aura', category: 'Income', amount: 840.00, type: 'credit', date: 'Today, 08:30', account: 'checking' },
        { id: 'bt2', name: 'Supabase Cloud', category: 'Software', amount: 25.00, type: 'debit', date: 'Yesterday', account: 'creditCard' },
        { id: 'bt3', name: 'Whole Foods Market', category: 'Dining', amount: 78.40, type: 'debit', date: 'Sep 28', account: 'checking' },
        { id: 'bt4', name: 'Figma Annual', category: 'Software', amount: 144.00, type: 'debit', date: 'Sep 26', account: 'creditCard' },
      ],
      categories: [
        { name: 'Inventory & Supplies', amount: 920, percentage: 43, color: '#38bdf8' },
        { name: 'Software & Tools', amount: 480, percentage: 22, color: '#818cf8' },
        { name: 'Living & Food', amount: 740, percentage: 35, color: '#34d399' },
      ]
    }
  }
];

export const DEFAULT_SCENARIOS = DEFAULT_PHASES;
