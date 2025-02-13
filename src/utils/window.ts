/**
 * 创建点击检测器
 * @param threshold 时间阈值（毫秒）
 * @param requiredClicks 所需点击次数
 * @param callback 达到条件时的回调函数
 */
export const createClickDetector = (
  threshold: number,
  requiredClicks: number,
  callback: () => void
) => {
  const clicks: number[] = []
  
  return () => {
    const now = Date.now()
    clicks.push(now)
    
    // 移除超过阈值的点击记录
    while (clicks.length > 0 && now - clicks[0] > threshold) {
      clicks.shift()
    }
    
    // 如果在阈值时间内点击达到要求次数，执行回调
    if (clicks.length >= requiredClicks) {
      callback()
      clicks.length = 0 // 清空点击记录
    }
  }
}

/**
 * 打开新窗口
 * @param url 目标URL
 * @param config 窗口配置
 */
export const openWindow = (
  url: string,
  config: { width: number; height: number }
) => {
  const { width, height } = config
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  
  return window.open(
    url,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top}`
  )
}

/**
 * 通知父窗口
 * @param type 消息类型
 * @param data 消息数据
 */
export const notifyParentWindow = (type: string, data?: any) => {
  if (window.opener) {
    window.opener.postMessage({ type, data }, '*')
  }
}

/**
 * 监听存储变化
 * @param key 存储键名
 * @param callback 回调函数
 */
export const listenToStorageChange = (
  key: string,
  callback: (newValue: string | null) => void
) => {
  const handler = (e: StorageEvent) => {
    if (e.key === key) {
      callback(e.newValue)
    }
  }
  
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
} 