// 点击检测相关
export const CLICK_THRESHOLD = 5000 // 5秒内
export const REQUIRED_CLICKS = 10 // 需要的点击次数

// 本地存储键名
export const STORAGE_KEYS = {
  PAYMENTS: 'payments'
} as const

// 路由
export const ROUTES = {
  SETTINGS: '/settings'
} as const

// 窗口配置
export const WINDOW_CONFIG = {
  SETTINGS: {
    width: 800,
    height: 800
  }
} as const

// 消息类型
export const MESSAGE_TYPES = {
  PAYMENT_UPDATED: 'PAYMENT_UPDATED'
} as const 