import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/composables/useApi'
import type { Order, Address } from '@/types'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const addresses = ref<Address[]>([])
  const loading = ref(false)

  // 获取订单列表
  const fetchOrders = async (params?: { status?: string; page?: number; pageSize?: number }) => {
    loading.value = true
    try {
      const response = await api.get<{ list: Order[]; total: number }>('/orders', { params })
      orders.value = response.list
      return response
    } catch (error) {
      console.error('获取订单列表失败', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取订单详情
  const fetchOrderDetail = async (id: string) => {
    loading.value = true
    try {
      const response = await api.get<Order>(`/orders/${id}`)
      currentOrder.value = response
      return response
    } catch (error) {
      console.error('获取订单详情失败', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建订单
  const createOrder = async (data: { addressId: string; items: Array<{ productId: string; quantity: number }> }) => {
    loading.value = true
    try {
      const response = await api.post<Order>('/orders', data)
      return response
    } catch (error) {
      console.error('创建订单失败', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 取消订单
  const cancelOrder = async (id: string) => {
    loading.value = true
    try {
      const response = await api.put<Order>(`/orders/${id}/cancel`)
      const index = orders.value.findIndex(order => order.id === id)
      if (index !== -1) {
        orders.value[index] = response
      }
      return response
    } catch (error) {
      console.error('取消订单失败', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取收货地址列表
  const fetchAddresses = async () => {
    try {
      const response = await api.get<Address[]>('/addresses')
      addresses.value = response
      return response
    } catch (error) {
      console.error('获取收货地址失败', error)
      throw error
    }
  }

  // 添加收货地址
  const addAddress = async (address: Omit<Address, 'id'>) => {
    try {
      const response = await api.post<Address>('/addresses', address)
      addresses.value.push(response)
      return response
    } catch (error) {
      console.error('添加收货地址失败', error)
      throw error
    }
  }

  // 更新收货地址
  const updateAddress = async (id: string, address: Partial<Address>) => {
    try {
      const response = await api.put<Address>(`/addresses/${id}`, address)
      const index = addresses.value.findIndex(addr => addr.id === id)
      if (index !== -1) {
        addresses.value[index] = response
      }
      return response
    } catch (error) {
      console.error('更新收货地址失败', error)
      throw error
    }
  }

  // 删除收货地址
  const deleteAddress = async (id: string) => {
    try {
      await api.delete(`/addresses/${id}`)
      addresses.value = addresses.value.filter(addr => addr.id !== id)
    } catch (error) {
      console.error('删除收货地址失败', error)
      throw error
    }
  }

  return {
    orders,
    currentOrder,
    addresses,
    loading,
    fetchOrders,
    fetchOrderDetail,
    createOrder,
    cancelOrder,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress
  }
})
