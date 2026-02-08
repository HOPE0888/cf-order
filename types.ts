
export interface Product {
  id: string;
  name: {
    zh: string;
    ja: string;
  };
  price: number; // Native JPY price
  category: string;
  image: string;
  description: {
    zh: string;
    ja: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  pickupCode: string;
  wechatName: string;
  items: CartItem[];
  totalPriceJPY: number;
  totalPriceCNY: number;
  exchangeRate: number;
  pickupDate: string;
  pickupTime: string;
  status: OrderStatus;
  createdAt: number;
  paymentScreenshot?: string; // Base64 image
  storageArea?: string;
}

export type Language = 'zh' | 'ja';
