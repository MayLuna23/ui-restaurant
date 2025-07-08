export interface Product {
  productId: number;
  name: string;
  price: number;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  total: number;
  createdAt: string;
  orderItems: {
    product: Product;
    quantity: number;
  }[];
}
