import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // 购物车列表
  const items = ref<CartItem[]>([])
  const loading = ref(false)

  // 购物车商品总数
  const totalCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 购物车总金额
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  // 添加商品到购物车
  const addToCart = (product: any) => {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      // 如果商品已存在,增加数量
      existingItem.quantity += 1
    } else {
      // 如果商品不存在,添加到购物车
      items.value.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }

    // 保存到 localStorage
    saveToLocalStorage()
  }

  // 从购物车移除商品
  const removeFromCart = (productId: string) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // 更新商品数量
  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        // 如果数量为0或负数,移除商品
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }

  // 增加商品数量
  const incrementQuantity = (productId: string) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity += 1
      saveToLocalStorage()
    }
  }

  // 减少商品数量
  const decrementQuantity = (productId: string) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
        saveToLocalStorage()
      } else {
        // 如果数量为1,移除商品
        removeFromCart(productId)
      }
    }
  }

  // 清空购物车
  const clearCart = () => {
    items.value = []
    saveToLocalStorage()
  }

  // 保存到 localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('保存购物车到 localStorage 失败:', error)
    }
  }

  // 从 localStorage 加载购物车
  const loadFromLocalStorage = () => {
    try {
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        items.value = JSON.parse(cartData)
      }
    } catch (error) {
      console.error('从 localStorage 加载购物车失败:', error)
      items.value = []
    }
  }

  // 初始化时加载购物车数据
  loadFromLocalStorage()

  return {
    items,
    loading,
    totalCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    loadFromLocalStorage
  }
})
