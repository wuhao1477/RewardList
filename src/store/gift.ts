import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Gift {
  id: number
  name: string
  price: number
  description?: string
}

// 预设的礼品数据
const DEFAULT_GIFTS: Gift[] = [
  {
    "name": "苹果iphone 16 手机一台",
    "price": 6999,
    "description": "",
    "id": 1739383238461
  },
  {
    "name": "iPhone16手机一台",
    "price": 6999,
    "description": "",
    "id": 1739384601088
  },
  {
    "name": "惠普笔记本电脑一台",
    "price": 4999,
    "description": "",
    "id": 1739384641754
  },
  {
    "name": "品牌风炮一支",
    "price": 2999,
    "description": "",
    "id": 1739384673327
  },
  {
    "name": "联想平板电脑一台",
    "price": 1999,
    "description": "",
    "id": 1739384686815
  },
  {
    "name": "欢乐砸金蛋机会一次",
    "price": 999,
    "description": "",
    "id": 1739384721601
  }
]

export const useGiftStore = defineStore('gift', () => {
  const gifts = ref<Gift[]>([])

  // 从本地存储加载数据
  const loadGifts = () => {
    try {
      // 检查是否已经初始化过
      const isInitialized = localStorage.getItem('gifts_initialized')
      
      if (!isInitialized) {
        // 如果未初始化，写入预设数据
        gifts.value = DEFAULT_GIFTS
        saveGifts()
        // 设置初始化标志
        localStorage.setItem('gifts_initialized', 'true')
      } else {
        // 如果已初始化，从本地存储加载数据
        const stored = localStorage.getItem('gifts')
        if (stored) {
          gifts.value = JSON.parse(stored)
        }
      }
    } catch (error) {
      console.error('加载礼品数据失败:', error)
    }
  }

  // 重置为默认数据
  const resetToDefault = () => {
    gifts.value = DEFAULT_GIFTS
    saveGifts()
  }

  // 保存数据到本地存储
  const saveGifts = () => {
    try {
      localStorage.setItem('gifts', JSON.stringify(gifts.value))
    } catch (error) {
      console.error('保存礼品数据失败:', error)
    }
  }

  // 添加礼品
  const addGift = (gift: Omit<Gift, 'id'>) => {
    const newGift = {
      ...gift,
      id: Date.now()
    }
    gifts.value.push(newGift)
    saveGifts()
    return newGift
  }

  // 更新礼品
  const updateGift = (gift: Gift) => {
    const index = gifts.value.findIndex(g => g.id === gift.id)
    if (index !== -1) {
      gifts.value[index] = gift
      saveGifts()
    }
  }

  // 删除礼品
  const deleteGift = (id: number) => {
    gifts.value = gifts.value.filter(g => g.id !== id)
    saveGifts()
  }

  // 获取所有礼品
  const getAllGifts = () => gifts.value

  // 获取指定礼品
  const getGiftById = (id: number) => gifts.value.find(g => g.id === id)

  // 清空礼品列表
  const clearGifts = () => {
    gifts.value = []
    saveGifts()
  }

  // 导入礼品数据
  const importGifts = (data: Gift[]) => {
    gifts.value = data
    saveGifts()
  }

  return {
    gifts,
    loadGifts,
    addGift,
    updateGift,
    deleteGift,
    getAllGifts,
    getGiftById,
    clearGifts,
    importGifts,
    resetToDefault
  }
}) 