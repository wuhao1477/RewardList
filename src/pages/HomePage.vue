<template>
  <div class="min-h-screen bg-gradient-to-b from-[#9D1F35] to-[#C72F40] bg-pattern py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h1 @click="handleTitleClick" class="text-6xl font-bold text-[#D4AF37] mb-8 cursor-pointer">财主榜</h1>
        <p class="text-[#d55b5b] text-2xl opacity-90">感谢各位客户的信任与支持</p>
      </div>

      <!-- 打款记录展示区域 -->
      <div class="payment-container">
        <transition-group name="payment-list" tag="div" class="space-y-6">
          <PaymentCard v-for="item in displayPayments" 
                      :key="item.id" 
                      :payment="item" />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { usePaymentStore } from '../store/payment'
import PaymentCard from '../components/PaymentCard.vue'
import { createClickDetector, openWindow, listenToStorageChange } from '../utils/window'
import { CLICK_THRESHOLD, REQUIRED_CLICKS, STORAGE_KEYS, ROUTES, WINDOW_CONFIG, MESSAGE_TYPES } from '../constants'

const store = usePaymentStore()
const currentIndex = ref(0)
const displayPayments = computed(() => {
  const totalPayments = store.payments.length
  const payments = [...store.payments]
  // 如果记录数小于等于3，直接返回所有记录
  if (totalPayments <= 3) return payments
  // 否则返回从当前索引开始的3条记录，并处理循环
  const result = []
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex.value + i) % totalPayments
    result.push(payments[index])
  }
  return result
})

// 自动滚动函数
const autoScroll = () => {
  const totalPayments = store.payments.length
  if (totalPayments > 3) {
    currentIndex.value = (currentIndex.value + 1) % totalPayments
  }
}

let scrollInterval: NodeJS.Timer | null = null

// 处理标题点击
const handleTitleClick = createClickDetector(CLICK_THRESHOLD, REQUIRED_CLICKS, () => {
  if (settingsWindow && !settingsWindow.closed) {
    settingsWindow.focus()
  } else {
    settingsWindow = openWindow(ROUTES.SETTINGS, WINDOW_CONFIG.SETTINGS)
  }
})

// 监听子窗口的消息
const handleMessage = (event: MessageEvent) => {
  if (event.data.type === MESSAGE_TYPES.PAYMENT_UPDATED) {
    store.loadPayments()
  }
}

onMounted(() => {
  store.loadPayments()
  window.addEventListener('message', handleMessage)
  listenToStorageChange(STORAGE_KEYS.PAYMENTS, () => store.loadPayments())
  // 启动自动滚动，每3秒滚动一次
  scrollInterval = setInterval(autoScroll, 3000)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
  // 清除定时器
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
})
</script>

<style scoped>
.bg-pattern {
  background-image: url('https://ai-public.mastergo.com/ai/img_res/8e41801b2ca7dec2b9f8f6961d60ff60.jpg');
  background-repeat: repeat;
  background-size: cover;
  background-blend-mode: soft-light;
}

.payment-list-enter-active,
.payment-list-leave-active {
  transition: all 0.8s ease-in-out;
  position: absolute;
}

.payment-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.payment-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.payment-list-move {
  transition: transform 0.8s ease;
}

/* 添加容器样式以处理绝对定位 */
.payment-container {
  position: relative;
  height: 400px; /* 根据实际卡片高度调整 */
  margin-bottom: 2rem;
}
</style> 