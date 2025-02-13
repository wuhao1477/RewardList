<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ editingPayment ? '修改记录' : '添加新记录' }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- 添加/编辑表单 -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">客户名称</label>
          <input v-model="newPayment.customer" type="text" class="w-full p-2 border rounded">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">金额（万）</label>
          <input v-model.number="newPayment.amount" type="number" class="w-full p-2 border rounded">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">赠品</label>
          <select v-model="selectedGiftId" class="w-full p-2 border rounded">
            <option value="">请选择赠品</option>
            <option v-for="gift in giftStore.gifts" :key="gift.id" :value="gift.id">
              {{ gift.name }} ({{ gift.price }}元)
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">感谢文本</label>
          <input v-model="newPayment.thankText" type="text" class="w-full p-2 border rounded">
        </div>
        <div class="flex justify-end space-x-2 pt-4">
          <button @click="$emit('close')" 
                  class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
            取消
          </button>
          <button @click="addNewPayment" 
                  class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-200">
            {{ editingPayment ? '保存修改' : '添加记录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { usePaymentStore, type Payment } from '../store/payment'
import { useGiftStore } from '../store/gift'

const props = defineProps<{
  editingPayment: Payment | null
}>()

const store = usePaymentStore()
const giftStore = useGiftStore()
const emit = defineEmits(['close'])

const selectedGiftId = ref<number | ''>('')

const newPayment = ref<Omit<Payment, 'id' | 'isNew'>>({
  customer: '',
  amount: 0,
  gift: '',
  giftPrice: 0,
  thankText: ''
})

// 监听选择的礼品变化
watch(selectedGiftId, (newId) => {
  if (newId) {
    const selectedGift = giftStore.getGiftById(newId)
    if (selectedGift) {
      newPayment.value.gift = selectedGift.name
      newPayment.value.giftPrice = selectedGift.price
    }
  } else {
    newPayment.value.gift = ''
    newPayment.value.giftPrice = 0
  }
})

// 如果是编辑模式，初始化表单数据
onMounted(() => {
  giftStore.loadGifts()
  if (props.editingPayment) {
    newPayment.value = {
      customer: props.editingPayment.customer,
      amount: props.editingPayment.amount,
      gift: props.editingPayment.gift,
      giftPrice: props.editingPayment.giftPrice,
      thankText: props.editingPayment.thankText
    }
    // 尝试找到对应的礼品
    const gift = giftStore.gifts.find(g => g.name === props.editingPayment?.gift)
    if (gift) {
      selectedGiftId.value = gift.id
    }
  }
})

const addNewPayment = () => {
  if (!newPayment.value.customer || !newPayment.value.amount) {
    alert('请填写客户名称和金额')
    return
  }

  if (!selectedGiftId.value) {
    alert('请选择赠品')
    return
  }

  if (props.editingPayment) {
    // 更新现有记录
    store.updatePayment({
      ...newPayment.value,
      id: props.editingPayment.id,
      isNew: false
    })
  } else {
    // 添加新记录
    store.addPayment({
      ...newPayment.value,
      id: Date.now(),
      isNew: true
    })
  }

  emit('close')
}
</script> 