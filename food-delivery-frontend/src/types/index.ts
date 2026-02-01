// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  phone: string
  avatar?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  phone: string
}

export interface AuthResponse {
  token: string
  user: User
}

// 商品相关类型
export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  categoryName: string
  image: string
  stock: number
  sales: number
  rating: number
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

// 购物车相关类型
export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
}

// 地址相关类型
export interface Address {
  id: string
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: boolean
}

// 订单相关类型
export enum OrderStatus {
  PENDING = 'PENDING',           // 待支付
  PAID = 'PAID',                 // 已支付
  PREPARING = 'PREPARING',       // 准备中
  DELIVERING = 'DELIVERING',     // 配送中
  COMPLETED = 'COMPLETED',       // 已完成
  CANCELLED = 'CANCELLED'        // 已取消
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  address: Address
  totalAmount: number
  status: OrderStatus
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

// 支付相关类型
export interface PaymentRequest {
  orderId: string
  paymentMethod: 'alipay' | 'wechat' | 'credit'
}
