export interface Product {
  id: string;
  name: string;
  brand: 'NAVA' | 'OLLIN';
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviews?: number;
  tags: string[];
  createdAt: string;
  link?: string;
  isExternal?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export type ProductCategory =
  | 'bikinis'
  | 'leggings'
  | 'acessorios'
  | 'colecoes'
  | 'novidades';

export type ProductBrand = 'NAVA' | 'OLLIN';
