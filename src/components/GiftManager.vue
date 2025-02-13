<template>
  <div class="bg-white rounded-lg p-6">
    <!-- 礼品列表 -->
    <div class="space-y-4">
      <div v-for="gift in giftStore.gifts" :key="gift.id" 
           class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div class="font-medium">{{ gift.name }}</div>
          <div class="text-sm text-gray-600">价值：{{ gift.price }}元</div>
          <div v-if="gift.description" class="text-sm text-gray-500">{{ gift.description }}</div>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="handleEdit(gift)" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="handleDelete(gift.id)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑表单弹窗 -->
    <div v-if="showAddForm || editingGift" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{ editingGift ? '编辑礼品' : '添加礼品' }}</h3>
          <button @click="closeForm" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">礼品名称</label>
            <input v-model="formData.name" type="text" class="w-full p-2 border rounded">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">价值（元）</label>
            <input v-model.number="formData.price" type="number" class="w-full p-2 border rounded">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">描述（可选）</label>
            <input v-model="formData.description" type="text" class="w-full p-2 border rounded">
          </div>
          <div class="flex justify-end space-x-2 pt-4">
            <button @click="closeForm" class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
              取消
            </button>
            <button @click="submitForm" 
                    class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-200">
              {{ editingGift ? '保存' : '添加' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useGiftStore, type Gift } from '../store/gift'

const giftStore = useGiftStore()
const showAddForm = ref(false)
const editingGift = ref<Gift | null>(null)

const emit = defineEmits(['form-close'])

const formData = ref<Omit<Gift, 'id'>>({
  name: '',
  price: 0,
  description: ''
})

const resetForm = () => {
  formData.value = {
    name: '',
    price: 0,
    description: ''
  }
}

const closeForm = () => {
  showAddForm.value = false
  editingGift.value = null
  resetForm()
  emit('form-close')
}

const handleEdit = (gift: Gift) => {
  editingGift.value = gift
  formData.value = {
    name: gift.name,
    price: gift.price,
    description: gift.description
  }
}

const handleDelete = (id: number) => {
  if (confirm('确定要删除这个礼品吗？')) {
    giftStore.deleteGift(id)
  }
}

const submitForm = () => {
  if (!formData.value.name || !formData.value.price) {
    alert('请填写礼品名称和价值')
    return
  }

  if (editingGift.value) {
    giftStore.updateGift({
      ...formData.value,
      id: editingGift.value.id
    })
  } else {
    giftStore.addGift(formData.value)
  }

  closeForm()
}

// 初始化加载礼品数据
giftStore.loadGifts()

// 暴露属性给父组件
defineExpose({
  showAddForm
})
</script> 