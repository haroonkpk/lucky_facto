export interface DashboardMetrics {
  pendingPayments: number;
  totalStock: number;
}

export interface FilteredPerformance {
  distributed: number;
  payments: number;
  deliveries: number;
}

export interface ChartPoint {
  label: string;
  distribution: number;
  payment: number;
}

export interface RegionData {
  name: string;
  amount: number;
}

export interface BrandStockData {
  brandName: string;
  currentStock: number;
}

export interface OverdueShop {
  id: string;
  name: string;
  region: string;
  balance: number;
  daysOverdue: number;
}