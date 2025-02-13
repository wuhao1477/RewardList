<template>
  <div class="min-h-screen bg-white p-6">
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">数据设置</h2>
        <div class="flex space-x-2">
          <button @click="handleSearch" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            <i class="fas fa-search mr-1"></i>搜索
          </button>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">数据统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="text-sm text-gray-600">总记录数</div>
            <div class="text-2xl font-bold text-primary mt-1">{{ statistics.totalCount }}</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="text-sm text-gray-600">总金额</div>
            <div class="text-2xl font-bold text-primary mt-1">{{ statistics.totalAmount }}万</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="text-sm text-gray-600">平均金额</div>
            <div class="text-2xl font-bold text-primary mt-1">{{ statistics.averageAmount }}万</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="text-sm text-gray-600">总赠品价值</div>
            <div class="text-2xl font-bold text-primary mt-1">{{ statistics.totalGiftPrice }}元</div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="text-sm text-gray-600 mb-2">金额分布</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">30万以上</span>
                <div class="flex-1 mx-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: statistics.amountDistribution.high + '%' }"></div>
                </div>
                <span class="text-sm text-gray-600">{{ statistics.amountDistribution.high }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">10-30万</span>
                <div class="flex-1 mx-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: statistics.amountDistribution.medium + '%' }"></div>
                </div>
                <span class="text-sm text-gray-600">{{ statistics.amountDistribution.medium }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">10万以下</span>
                <div class="flex-1 mx-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: statistics.amountDistribution.low + '%' }"></div>
                </div>
                <span class="text-sm text-gray-600">{{ statistics.amountDistribution.low }}%</span>
              </div>
            </div>
            <div class="mt-3 text-xs text-gray-500">
              最高: {{ statistics.maxAmount }}万 | 最低: {{ statistics.minAmount }}万
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="text-sm text-gray-600 mb-2">最近趋势（近5笔）</div>
            <div class="flex items-end h-32 space-x-2">
              <div v-for="(amount, index) in recentAmounts" :key="index"
                class="flex-1 bg-primary/20 rounded-t-sm relative group">
                <div class="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm transition-all duration-300"
                  :style="{ height: (amount / maxRecentAmount * 100) + '%' }">
                  <div class="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 
                             bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {{ amount }}万
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页切换 -->
      <div class="mb-6 border-b">
        <div class="flex space-x-4">
          <button @click="activeTab = 'records'" class="px-4 py-2 -mb-px"
            :class="activeTab === 'records' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500'">
            打款记录
          </button>
          <button @click="activeTab = 'gifts'" class="px-4 py-2 -mb-px"
            :class="activeTab === 'gifts' ? 'border-b-2 border-primary text-primary font-medium' : 'text-gray-500'">
            礼品管理
          </button>
        </div>
      </div>

      <!-- 打款记录标签页 -->
      <div v-show="activeTab === 'records'">
        <!-- 操作按钮 -->
        <div class="mb-4 flex justify-between items-center">
          <button @click="showAddForm = true" class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-200">
            <i class="fas fa-plus mr-1"></i>添加新记录
          </button>
          <div class="flex space-x-2">
            <button @click="handleExport('payments')"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              导出打款数据
            </button>
            <button @click="handleImport('payments')"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              导入打款数据
            </button>
            <button @click="handleClear('payments')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              清空打款记录
            </button>
          </div>
        </div>

        <!-- 数据列表 -->
        <div class="space-y-4">
          <div v-for="payment in store.payments" :key="payment.id"
            class="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div class="flex-1">
              <div class="font-medium">财主{{ payment.customer }} - {{ formatAmountWithUnit(payment.amount) }}</div>
              <div class="text-sm text-gray-600">{{ payment.gift }} ({{ payment.giftPrice }}元)</div>
              <div class="text-sm text-gray-500">{{ payment.thankText }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="handleEdit(payment)" class="text-blue-500 hover:text-blue-700">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deletePayment(payment.id)" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 礼品管理标签页 -->
      <div v-show="activeTab === 'gifts'" class="space-y-4">
        <div class="flex justify-between items-center">
          <button @click="showGiftForm = true" class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-200">
            <i class="fas fa-plus mr-1"></i>添加礼品
          </button>
          <div class="flex space-x-2">
            <button @click="handleExport('gifts')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              导出礼品数据
            </button>
            <button @click="handleImport('gifts')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              导入礼品数据
            </button>
            <button @click="handleClear('gifts')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              清空礼品列表
            </button>
          </div>
        </div>
        <GiftManager ref="giftManagerRef" @form-close="handleGiftFormClose" />
      </div>
    </div>
  </div>

  <!-- 添加/编辑表单弹窗 -->
  <PaymentSettings v-if="showAddForm || editingPayment" :editingPayment="editingPayment" @close="closeForm" />

  <!-- 导出数据弹窗 -->
  <div v-if="showExportDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] flex flex-col">
      <div class="flex justify-between items-center shrink-0 mb-4">
        <h3 class="text-xl font-bold text-gray-800">导出数据</h3>
        <button @click="showExportDialog = false" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="flex-1 overflow-hidden">
        <div class="h-full bg-gray-50 p-4 rounded-lg overflow-y-auto">
          <pre class="whitespace-pre-wrap break-all text-sm">{{ exportData }}</pre>
        </div>
      </div>
      <div class="flex justify-end space-x-2 mt-4 pt-4 border-t shrink-0">
        <button @click="copyToClipboard" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          复制到剪贴板
        </button>
        <button @click="showExportDialog = false" class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
          关闭
        </button>
      </div>
    </div>
  </div>

  <!-- 导入数据弹窗 -->
  <div v-if="showImportDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-3xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">导入数据</h3>
        <button @click="closeImportDialog" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">粘贴JSON数据</label>
          <textarea v-model="importData" class="w-full h-48 p-2 border rounded font-mono text-sm"
            placeholder="请粘贴要导入的JSON数据"></textarea>
        </div>
        <div v-if="importError" class="text-red-500 text-sm">
          {{ importError }}
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="closeImportDialog" class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
            取消
          </button>
          <button @click="confirmImport" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            :disabled="!isValidImportData">
            确认导入
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 搜索弹窗 -->
  <div v-if="showSearchDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
      <div class="flex justify-between items-center shrink-0 mb-4">
        <h3 class="text-xl font-bold text-gray-800">搜索记录</h3>
        <button @click="closeSearch" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="mb-4 shrink-0">
        <div class="flex space-x-2">
          <input v-model="searchQuery" @input="handleSearchInput" type="text" placeholder="输入客户名称、金额、赠品等关键词"
            class="flex-1 p-2 border rounded">
        </div>
      </div>

      <div class="flex-1 overflow-auto">
        <div v-if="searchResults.length === 0" class="text-gray-500 text-center py-4">
          {{ searchQuery ? '未找到匹配的记录' : '请输入搜索关键词' }}
        </div>
        <div v-else class="space-y-4">
          <div v-for="payment in searchResults" :key="payment.id"
            class="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div class="flex-1">
              <div class="font-medium">财主{{ payment.customer }} - {{ formatAmountWithUnit(payment.amount) }}</div>
              <div class="text-sm text-gray-600">{{ payment.gift }} ({{ payment.giftPrice }}元)</div>
              <div class="text-sm text-gray-500">{{ payment.thankText }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="handleSearchResultEdit(payment)" class="text-blue-500 hover:text-blue-700">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="handleSearchResultDelete(payment.id)" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 回到顶部按钮 -->
  <div v-show="showBackToTop" @click="scrollToTop"
    class="fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 shadow-lg transition-all duration-300">
    <i class="fas fa-arrow-up"></i>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePaymentStore, type Payment } from '../store/payment'
import { useGiftStore } from '../store/gift'
import GiftManager from '../components/GiftManager.vue'
import PaymentSettings from '../components/PaymentSettings.vue'

const store = usePaymentStore()
const giftStore = useGiftStore()

const activeTab = ref('records')
const showAddForm = ref(false)
const editingPayment = ref<Payment | null>(null)
const showExportDialog = ref(false)
const showImportDialog = ref(false)
const importData = ref('')
const importError = ref('')
const exportData = ref('')
const showSearchDialog = ref(false)
const searchQuery = ref('')
const searchResults = ref<Payment[]>([])
const showBackToTop = ref(false)
const importType = ref<'payments' | 'gifts'>('payments')
const giftManagerRef = ref()
const showGiftForm = ref(false)

// 统计数据计算
const statistics = computed(() => {
  const payments = store.payments
  const totalCount = payments.length
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const averageAmount = totalCount ? Math.round(totalAmount / totalCount * 10) / 10 : 0
  const totalGiftPrice = payments.reduce((sum, p) => sum + p.giftPrice, 0)

  // 计算金额分布
  const highCount = payments.filter(p => p.amount >= 30).length
  const mediumCount = payments.filter(p => p.amount >= 10 && p.amount < 30).length
  const lowCount = payments.filter(p => p.amount < 10).length

  // 计算最高和最低金额
  const amounts = payments.map(p => p.amount)
  const maxAmount = amounts.length ? Math.max(...amounts) : 0
  const minAmount = amounts.length ? Math.min(...amounts) : 0

  const amountDistribution = {
    high: totalCount ? Math.round(highCount / totalCount * 100) : 0,
    medium: totalCount ? Math.round(mediumCount / totalCount * 100) : 0,
    low: totalCount ? Math.round(lowCount / totalCount * 100) : 0
  }

  return {
    totalCount,
    totalAmount,
    averageAmount,
    totalGiftPrice,
    maxAmount,
    minAmount,
    amountDistribution
  }
})

// 最近趋势数据
const recentAmounts = computed(() => {
  return store.payments.slice(0, 5).map(p => p.amount)
})

const maxRecentAmount = computed(() => {
  return Math.max(...recentAmounts.value, 1)
})

// 处理清空列表
const handleClear = (type: 'payments' | 'gifts') => {
  const confirmMessage = type === 'payments'
    ? '确定要清空所有打款记录吗？此操作不可恢复！'
    : '确定要清空所有礼品数据吗？此操作不可恢复！'

  if (confirm(confirmMessage)) {
    if (confirm('再次确认：是否清空所有数据？')) {
      if (type === 'payments') {
        store.clearPayments()
        store.loadPayments()
        window.opener?.postMessage({ type: 'PAYMENT_UPDATED' }, '*')
      } else {
        giftStore.clearGifts()
        giftStore.loadGifts()
      }
    }
  }
}

// 处理数据导出
const handleExport = (type: 'payments' | 'gifts') => {
  exportData.value = JSON.stringify(
    type === 'payments' ? store.payments : giftStore.gifts,
    null,
    2
  )
  showExportDialog.value = true
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(exportData.value)
    alert('已复制到剪贴板')
  } catch (err) {
    alert('复制失败，请手动复制')
  }
}

// 处理数据导入
const handleImport = (type: 'payments' | 'gifts') => {
  importType.value = type
  importData.value = ''
  importError.value = ''
  showImportDialog.value = true
}

// 关闭导入对话框
const closeImportDialog = () => {
  showImportDialog.value = false
  importData.value = ''
  importError.value = ''
}

// 验证导入数据
const isValidImportData = computed(() => {
  try {
    if (!importData.value) return false
    const data = JSON.parse(importData.value)
    if (!Array.isArray(data)) {
      importError.value = '数据格式错误：必须是数组'
      return false
    }

    // 验证每条记录的格式
    const isValid = importType.value === 'payments'
      ? data.every(item => (
        typeof item.id === 'number' &&
        typeof item.customer === 'string' &&
        typeof item.amount === 'number' &&
        typeof item.gift === 'string' &&
        typeof item.giftPrice === 'number' &&
        typeof item.thankText === 'string'
      ))
      : data.every(item => (
        typeof item.id === 'number' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number'
      ))

    if (!isValid) {
      importError.value = '数据格式错误：某些记录格式不正确'
      return false
    }

    importError.value = ''
    return true
  } catch (err) {
    importError.value = '无效的JSON格式'
    return false
  }
})

// 确认导入
const confirmImport = () => {
  if (!isValidImportData.value) return

  const confirmMessage = importType.value === 'payments'
    ? '确定要导入这些打款数据吗？这将覆盖现有数据！'
    : '确定要导入这些礼品数据吗？这将覆盖现有数据！'

  if (confirm(confirmMessage)) {
    try {
      const data = JSON.parse(importData.value)
      if (importType.value === 'payments') {
        store.importPayments(data)
        window.opener?.postMessage({ type: 'PAYMENT_UPDATED' }, '*')
      } else {
        giftStore.importGifts(data)
      }
      closeImportDialog()
      alert('数据导入成功')
    } catch (err) {
      alert('导入失败：' + (err instanceof Error ? err.message : '未知错误'))
    }
  }
}

// 处理搜索
const handleSearch = () => {
  showSearchDialog.value = true
  searchQuery.value = ''
  searchResults.value = []
}

const closeSearch = () => {
  showSearchDialog.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const handleSearchInput = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = store.payments.filter(payment =>
    payment.customer.toLowerCase().includes(query) ||
    payment.amount.toString().includes(query) ||
    payment.gift.toLowerCase().includes(query) ||
    payment.giftPrice.toString().includes(query) ||
    payment.thankText.toLowerCase().includes(query)
  )
}

// 搜索结果的编辑和删除
const handleSearchResultEdit = (payment: Payment) => {
  editingPayment.value = payment
  closeSearch()
}

const handleSearchResultDelete = (id: number) => {
  if (confirm('确定要删除这条记录吗？')) {
    store.deletePayment(id)
    // 更新搜索结果
    handleSearchInput()
    // 通知主窗口数据已更新
    window.opener?.postMessage({ type: 'PAYMENT_UPDATED' }, '*')
  }
}

// 编辑记录
const handleEdit = (payment: Payment) => {
  editingPayment.value = payment
  showAddForm.value = true
}

// 删除记录
const deletePayment = (id: number) => {
  if (confirm('确定要删除这条记录吗？')) {
    store.deletePayment(id)
    // 通知主窗口数据已更新
    window.opener?.postMessage({ type: 'PAYMENT_UPDATED' }, '*')
  }
}

// 关闭表单
const closeForm = () => {
  showAddForm.value = false
  editingPayment.value = null
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

watch(showGiftForm, (newVal) => {
  if (newVal && giftManagerRef.value) {
    giftManagerRef.value.showAddForm = true
  }
})

// 监听礼品表单关闭事件
const handleGiftFormClose = () => {
  showGiftForm.value = false
}

// 在 script 部分添加格式化函数
const formatAmountWithUnit = (amount: number) => {
  if (amount >= 1) {
    return `${amount} 万`
  } else {
    return `${(amount * 10000).toLocaleString()} 元`
  }
}

onMounted(() => {
  store.loadPayments()
  giftStore.loadGifts()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.bg-pattern {
  background-size: 20px 20px;
  background-image: radial-gradient(circle, #9D1F35 1px, transparent 1px);
}
</style>