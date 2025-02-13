import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MESSAGE_TYPES } from '../constants'

export interface Payment {
  id: number
  customer: string
  amount: number
  gift: string
  giftPrice: number
  thankText: string
  isNew?: boolean
}

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<Payment[]>([])

  // 从本地存储加载数据
  const loadPayments = () => {
    try {
      const stored = localStorage.getItem('payments')
      if (stored) {
        // 按 id 倒序排序，确保最新的记录在前面
        payments.value = JSON.parse(stored).sort((a, b) => b.id - a.id)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  // 保存数据到本地存储
  const savePayments = () => {
    try {
      localStorage.setItem('payments', JSON.stringify(payments.value))
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  // 添加新支付记录
  const addPayment = (payment: Payment) => {
    payments.value = [payment, ...payments.value]
    savePayments()
    notifyUpdate()
  }

  // 更新支付记录
  const updatePayment = (payment: Payment) => {
    const index = payments.value.findIndex(p => p.id === payment.id)
    if (index !== -1) {
      payments.value[index] = payment
      savePayments()
      notifyUpdate()
    }
  }

  // 删除支付记录
  const deletePayment = (id: number) => {
    payments.value = payments.value.filter(p => p.id !== id)
    savePayments()
    notifyUpdate()
  }

  // 清空所有记录
  const clearPayments = () => {
    payments.value = []
    savePayments()
    notifyUpdate()
  }

  // 导入数据
  const importPayments = (data: Payment[]) => {
    // 按 id 倒序排序，确保最新的记录在前面
    payments.value = data.sort((a, b) => b.id - a.id)
    savePayments()
    notifyUpdate()
  }

  // 通知更新
  const notifyUpdate = () => {
    if (window.opener) {
      // 如果是设置窗口，通知主窗口
      window.opener.postMessage({ type: MESSAGE_TYPES.PAYMENT_UPDATED }, '*')
    } else {
      // 如果是主窗口，重新加载数据
      loadPayments()
    }
  }

  // 监听 storage 事件
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === 'payments') {
        loadPayments()
      }
    })
  }

  return {
    payments,
    loadPayments,
    addPayment,
    updatePayment,
    deletePayment,
    clearPayments,
    importPayments
  }
}) 