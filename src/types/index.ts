export type Condition = "BRAND_NEW" | "EX_UK" | "REFURBISHED" | "USED";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  brand: Brand;
  modelName: string;
  storageCapacity: string;
  ram?: string | null;
  color: string;
  condition: Condition;
  batteryHealth?: number | null;
  priceKES: number;
  priceUSD?: number | null;
  marketPriceKES?: number | null;
  marketPriceUSD?: number | null;
  images: string[];
  description?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isHero: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  brand?: string;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  storage?: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
