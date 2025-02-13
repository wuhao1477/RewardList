import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const showGiftPrice = ref(false)

  // 从本地存储加载设置
  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('settings')
      if (stored) {
        const settings = JSON.parse(stored)
        showGiftPrice.value = settings.showGiftPrice ?? true
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  // 保存设置到本地存储
  const saveSettings = () => {
    try {
      localStorage.setItem('settings', JSON.stringify({
        showGiftPrice: showGiftPrice.value
      }))
    } catch (error) {
      console.error('保存设置失败:', error)
    }
  }

  // 更新礼品价值显示设置
  const toggleGiftPrice = () => {
    showGiftPrice.value = !showGiftPrice.value
    saveSettings()
  }

  // 初始加载设置
  loadSettings()

  return {
    showGiftPrice,
    toggleGiftPrice
  }
}) 