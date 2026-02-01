import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/composables/useApi'
import type { Product, Category } from '@/types'

// 模拟分类数据
const mockCategories: Category[] = [
  { id: '1', name: '汉堡', icon: 'hamburger' },
  { id: '2', name: '披萨', icon: 'pizza' },
  { id: '3', name: '炸鸡', icon: 'chicken' },
  { id: '4', name: '咖啡', icon: 'coffee' },
  { id: '5', name: '甜点', icon: 'dessert' },
  { id: '6', name: '饮品', icon: 'watermelon' }
]

// 模拟商品数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: '经典芝士汉堡',
    description: '精选牛肉饼配芝士、生菜、番茄、洋葱，新鲜美味',
    price: 28.00,
    categoryId: '1',
    categoryName: '汉堡',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    stock: 100,
    sales: 1250,
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: '玛格丽特披萨',
    description: '经典意式披萨，番茄酱、马苏里拉奶酪、新鲜罗勒',
    price: 58.00,
    categoryId: '2',
    categoryName: '披萨',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    stock: 50,
    sales: 890,
    rating: 4.7,
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: '香辣炸鸡桶',
    description: '外酥里嫩的香辣炸鸡，配薯条和可乐',
    price: 45.00,
    categoryId: '3',
    categoryName: '炸鸡',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    stock: 80,
    sales: 2100,
    rating: 4.9,
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    name: '焦糖玛奇朵',
    description: '浓缩咖啡配香草糖浆和牛奶，焦糖酱点缀',
    price: 32.00,
    categoryId: '4',
    categoryName: '咖啡',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    stock: 200,
    sales: 1580,
    rating: 4.6,
    createdAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    name: '草莓蛋糕',
    description: '新鲜草莓配奶油，松软海绵蛋糕',
    price: 38.00,
    categoryId: '5',
    categoryName: '甜点',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    stock: 60,
    sales: 680,
    rating: 4.8,
    createdAt: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '6',
    name: '冰柠檬茶',
    description: '新鲜柠檬，清爽解暑',
    price: 18.00,
    categoryId: '6',
    categoryName: '饮品',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400',
    stock: 150,
    sales: 980,
    rating: 4.5,
    createdAt: '2024-01-06T00:00:00.000Z'
  },
  {
    id: '7',
    name: '双层牛肉堡',
    description: '双层牛肉饼，双倍满足',
    price: 36.00,
    categoryId: '1',
    categoryName: '汉堡',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
    stock: 70,
    sales: 1050,
    rating: 4.7,
    createdAt: '2024-01-07T00:00:00.000Z'
  },
  {
    id: '8',
    name: '意式香肠披萨',
    description: '意大利香肠、蘑菇、洋葱、马苏里拉奶酪',
    price: 68.00,
    categoryId: '2',
    categoryName: '披萨',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    stock: 40,
    sales: 750,
    rating: 4.6,
    createdAt: '2024-01-08T00:00:00.000Z'
  }
]

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)

  // 获取商品列表
  const fetchProducts = async (params?: { categoryId?: string; keyword?: string; page?: number; pageSize?: number }) => {
    loading.value = true
    try {
      const response = await api.get<{ list: Product[]; total: number }>('/products', { params })
      products.value = response.list
      return response
    } catch (error) {
      console.log('使用模拟数据')
      // 如果 API 失败，使用模拟数据
      products.value = mockProducts
      return { list: mockProducts, total: mockProducts.length }
    } finally {
      loading.value = false
    }
  }

  // 获取商品详情
  const fetchProductDetail = async (id: string) => {
    loading.value = true
    try {
      const response = await api.get<Product>(`/products/${id}`)
      currentProduct.value = response
      return response
    } catch (error) {
      console.log('使用模拟商品详情数据')
      // 如果 API 失败，使用模拟数据
      const product = mockProducts.find(p => p.id === id)
      currentProduct.value = product || null
      return product
    } finally {
      loading.value = false
    }
  }

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>('/categories')
      categories.value = response
      return response
    } catch (error) {
      console.log('使用模拟分类数据')
      // 如果 API 失败，使用模拟数据
      categories.value = mockCategories
      return mockCategories
    }
  }

  return {
    products,
    categories,
    currentProduct,
    loading,
    fetchProducts,
    fetchProductDetail,
    fetchCategories
  }
})
