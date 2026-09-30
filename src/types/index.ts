export type PlatformType = 'launcher' | 'youtube' | 'shopify' | 'crypto' | 'bank';

export type TimePeriod = 'today' | 'yesterday' | '7d' | '28d' | '90d' | 'custom';

export interface YouTubeVideo {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  impressions: number;
  ctr: number;
  dateAgo: string;
  thumbnail: string;
}

export interface YouTubeData {
  channelName: string;
  handle: string;
  avatarUrl: string;
  subscribers: number;
  subscriberChange: number;
  views: number;
  viewsChange: number;
  watchTimeHours: number;
  watchTimeChange: number;
  estimatedRevenue: number;
  revenueChange: number;
  rpm: number;
  currency: string;
  period: TimePeriod;
  topVideos: YouTubeVideo[];
  chartPoints: { label: string; views: number; revenue: number }[];
}

export interface ShopifyProduct {
  id: string;
  name: string;
  sales: number;
  unitsSold: number;
  price: number;
  image: string;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsSummary: string;
  amount: number;
  status: 'Paid' | 'Unfulfilled' | 'Fulfilled' | 'Authorized';
  dateAgo: string;
}

export interface ShopifyData {
  storeName: string;
  currency: string;
  totalSales: number;
  salesChange: number;
  ordersCount: number;
  ordersChange: number;
  sessions: number;
  sessionsChange: number;
  conversionRate: number;
  aov: number;
  grossSales: number;
  discounts: number;
  returns: number;
  netSales: number;
  topProducts: ShopifyProduct[];
  recentOrders: ShopifyOrder[];
  chartPoints: { label: string; sales: number; orders: number }[];
  /** Optional home-screen extras (fall back to sensible defaults in the UI) */
  visitorsOnline?: number;
  ordersToFulfill?: number;
  paymentsToCapture?: number;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  priceUsd: number;
  valueUsd: number;
  change24hPercent: number;
  color: string;
}

export interface CryptoTransaction {
  id: string;
  type: 'receive' | 'send';
  assetSymbol: string;
  amount: number;
  fiatValue: number;
  counterparty: string;
  timestamp: string;
  status: 'Confirmed' | 'Pending';
  txHash: string;
}

export interface CryptoData {
  walletName: string;
  currency: string;
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  assets: CryptoAsset[];
  transactions: CryptoTransaction[];
  chartPoints: { label: string; value: number }[];
}

export interface BankTransaction {
  id: string;
  name: string;
  category: 'Income' | 'Shopping' | 'Dining' | 'Software' | 'Transfer' | 'Travel' | 'Entertainment';
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  account: 'checking' | 'savings' | 'creditCard';
}

export interface BankData {
  institutionName: string;
  accountHolder: string;
  totalBalance: number;
  checkingBalance: number;
  checkingNumber: string;
  savingsBalance: number;
  savingsNumber: string;
  creditCard: {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    creditLimit: number;
    availableCredit: number;
    balance: number;
    cardType: 'Obsidian Black' | 'Platinum Reserve' | 'Titanium Gold';
  };
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySpending: number;
  transactions: BankTransaction[];
  categories: { name: string; amount: number; percentage: number; color: string }[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  youtube: YouTubeData;
  shopify: ShopifyData;
  crypto: CryptoData;
  bank: BankData;
}

// Deprecated alias for backwards compatibility
export type Scenario = Phase;

export interface NotificationItem {
  id: string;
  platform: 'youtube' | 'shopify' | 'crypto' | 'bank';
  title: string;
  message: string;
  amount?: string;
  timestamp: string;
  sound?: boolean;
}
