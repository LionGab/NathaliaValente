import { supabase } from '../../../lib/supabase';
import { trackMonetization } from '../../../lib/analytics';

export interface NAVAProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: 'clothing' | 'accessories' | 'beauty' | 'home' | 'books' | 'courses';
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviews?: number;
  tags: string[];
  nathaliaRecommended?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: NAVAProduct;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
}

class NAVAShopService {
  private readonly SHIPPING_RATE = 15.9;
  private readonly FREE_SHIPPING_THRESHOLD = 199.9;

  /**
   * Get all NAVA products with filtering and pagination
   */
  async getProducts(
    options: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      nathaliaRecommended?: boolean;
      page?: number;
      limit?: number;
      sortBy?: 'price' | 'name' | 'rating' | 'newest';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ products: NAVAProduct[]; total: number; hasMore: boolean }> {
    try {
      let query = supabase.from('nava_products').select('*', { count: 'exact' });

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.search) {
        query = query.or(
          `name.ilike.%${options.search}%,description.ilike.%${options.search}%,tags.cs.{${options.search}}`
        );
      }

      if (options.minPrice !== undefined) {
        query = query.gte('price', options.minPrice);
      }

      if (options.maxPrice !== undefined) {
        query = query.lte('price', options.maxPrice);
      }

      if (options.inStock !== undefined) {
        query = query.eq('in_stock', options.inStock);
      }

      if (options.nathaliaRecommended !== undefined) {
        query = query.eq('nathalia_recommended', options.nathaliaRecommended);
      }

      // Apply sorting
      const sortBy = options.sortBy || 'newest';
      const sortOrder = options.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching NAVA products:', error);
        return { products: [], total: 0, hasMore: false };
      }

      const products = data as NAVAProduct[];
      const total = count || 0;
      const hasMore = page * limit < total;

      return { products, total, hasMore };
    } catch (error) {
      console.error('Error fetching NAVA products:', error);
      return { products: [], total: 0, hasMore: false };
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<NAVAProduct | null> {
    try {
      const { data, error } = await supabase
        .from('nava_products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return data as NAVAProduct;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Get featured products (Nathália's recommendations)
   */
  async getFeaturedProducts(limit: number = 8): Promise<NAVAProduct[]> {
    try {
      const { data, error } = await supabase
        .from('nava_products')
        .select('*')
        .eq('nathalia_recommended', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }

      return data as NAVAProduct[];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<{ name: string; count: number; image: string }[]> {
    try {
      const { data, error } = await supabase
        .from('nava_products')
        .select('category')
        .eq('in_stock', true);

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      const categoryCounts = data.reduce((acc: any, product: any) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      const categories = [
        { name: 'clothing', label: 'Roupas', image: '/images/categories/clothing.jpg' },
        { name: 'accessories', label: 'Acessórios', image: '/images/categories/accessories.jpg' },
        { name: 'beauty', label: 'Beleza', image: '/images/categories/beauty.jpg' },
        { name: 'home', label: 'Casa', image: '/images/categories/home.jpg' },
        { name: 'books', label: 'Livros', image: '/images/categories/books.jpg' },
        { name: 'courses', label: 'Cursos', image: '/images/categories/courses.jpg' },
      ];

      return categories.map((cat) => ({
        name: cat.name,
        label: cat.label,
        count: categoryCounts[cat.name] || 0,
        image: cat.image,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Add product to cart
   */
  async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1,
    options?: {
      size?: string;
      color?: string;
    }
  ): Promise<boolean> {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Get current cart
      const cart = await this.getCart(userId);

      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.id === productId &&
          item.selectedSize === options?.size &&
          item.selectedColor === options?.color
      );

      if (existingItemIndex >= 0) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          product,
          quantity,
          selectedSize: options?.size,
          selectedColor: options?.color,
        });
      }

      // Recalculate totals
      this.calculateCartTotals(cart);

      // Save to database
      await this.saveCart(userId, cart);

      // Track engagement
      trackMonetization('add_to_cart', product.price * quantity);

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  /**
   * Remove product from cart
   */
  async removeFromCart(
    userId: string,
    productId: string,
    options?: {
      size?: string;
      color?: string;
    }
  ): Promise<boolean> {
    try {
      const cart = await this.getCart(userId);

      cart.items = cart.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === options?.size &&
            item.selectedColor === options?.color
          )
      );

      this.calculateCartTotals(cart);
      await this.saveCart(userId, cart);

      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
    options?: {
      size?: string;
      color?: string;
    }
  ): Promise<boolean> {
    try {
      const cart = await this.getCart(userId);

      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.id === productId &&
          item.selectedSize === options?.size &&
          item.selectedColor === options?.color
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = quantity;
        }

        this.calculateCartTotals(cart);
        await this.saveCart(userId, cart);
      }

      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
  }

  /**
   * Get user's cart
   */
  async getCart(userId: string): Promise<Cart> {
    try {
      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_data')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Not found error
        console.error('Error fetching cart:', error);
        return this.createEmptyCart();
      }

      if (!data) {
        return this.createEmptyCart();
      }

      return data.cart_data as Cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return this.createEmptyCart();
    }
  }

  /**
   * Save cart to database
   */
  private async saveCart(userId: string, cart: Cart): Promise<void> {
    try {
      const { error } = await supabase.from('user_carts').upsert({
        user_id: userId,
        cart_data: cart,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error saving cart:', error);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  /**
   * Calculate cart totals
   */
  private calculateCartTotals(cart: Cart): void {
    cart.subtotal = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    cart.shipping = cart.subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_RATE;
    cart.discount = 0; // Apply discount codes here
    cart.total = cart.subtotal + cart.shipping - cart.discount;
  }

  /**
   * Create empty cart
   */
  private createEmptyCart(): Cart {
    return {
      items: [],
      subtotal: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    };
  }

  /**
   * Create order
   */
  async createOrder(
    userId: string,
    shippingAddress: any,
    paymentMethod: string
  ): Promise<Order | null> {
    try {
      const cart = await this.getCart(userId);

      if (cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const order: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        items: cart.items,
        shippingAddress,
        paymentMethod: paymentMethod as any,
        status: 'pending',
        total: cart.total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save order to database
      const { error } = await supabase.from('orders').insert(order);

      if (error) {
        console.error('Error creating order:', error);
        return null;
      }

      // Clear cart
      await this.saveCart(userId, this.createEmptyCart());

      // Track monetization
      trackMonetization('purchase', order.total);

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      return data as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      return data as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  /**
   * Apply discount code
   */
  async applyDiscountCode(
    userId: string,
    code: string
  ): Promise<{ success: boolean; discount: number; message: string }> {
    try {
      // Check if discount code exists and is valid
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        return {
          success: false,
          discount: 0,
          message: 'Código de desconto inválido',
        };
      }

      // Check if code is expired
      if (new Date(data.expires_at) < new Date()) {
        return {
          success: false,
          discount: 0,
          message: 'Código de desconto expirado',
        };
      }

      // Check if user has already used this code
      const { data: usage } = await supabase
        .from('discount_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('discount_code', code.toUpperCase())
        .single();

      if (usage) {
        return {
          success: false,
          discount: 0,
          message: 'Código já utilizado',
        };
      }

      // Apply discount to cart
      const cart = await this.getCart(userId);
      const discount = data.type === 'percentage' ? (cart.subtotal * data.value) / 100 : data.value;

      cart.discount = Math.min(discount, cart.subtotal);
      this.calculateCartTotals(cart);
      await this.saveCart(userId, cart);

      return {
        success: true,
        discount: cart.discount,
        message: `Desconto de ${data.type === 'percentage' ? data.value + '%' : 'R$ ' + data.value} aplicado!`,
      };
    } catch (error) {
      console.error('Error applying discount code:', error);
      return {
        success: false,
        discount: 0,
        message: 'Erro ao aplicar desconto',
      };
    }
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(
          `
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `
        )
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  /**
   * Add product review
   */
  async addProductReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('product_reviews').insert({
        user_id: userId,
        product_id: productId,
        rating,
        comment,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error adding review:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  }
}

export const navaShopService = new NAVAShopService();
