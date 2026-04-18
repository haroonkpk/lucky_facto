export interface BrandRevenueEntry {
  date: string;        
  rawDate?: string;
  [brand: string]: number | string | undefined;
}

export interface BrandRevenueData {
  data: BrandRevenueEntry[];
  brands: string[];
}