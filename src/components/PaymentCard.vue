<template>
  <div class="payment-card bg-[#F5F0E6] rounded-lg p-6 backdrop-blur-sm border-2 border-[#9D1F35]/10"
       :class="{'new-payment': payment.isNew}">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-[#333333] mb-2">
          财主{{ payment.customer }}
          <span class="text-[#9D1F35] ml-2 font-medium">
            豪掷 {{ formatAmountWithUnit(payment.amount) }}
          </span>
        </h3>
        <p class="text-[#333333]/90 text-lg mb-2">
          赠送{{ payment.customer }}
          <template v-if="settingsStore.showGiftPrice">价值 {{ payment.giftPrice }} 元</template>
          {{ payment.gift }}
        </p>
        <p class="text-[#333333]/80">{{ payment.thankText }}</p>
      </div>
      <div class="payment-amount text-4xl font-bold flex items-center">
        <span class="text-[#D4AF37] drop-shadow-lg mr-1">¥</span>
        <span class="text-[#D4AF37] payment-number">{{ formatAmount(payment.amount) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Payment } from '../store/payment'
import { useSettingsStore } from '../store/settings'

defineProps<{
  payment: Payment
}>()

const settingsStore = useSettingsStore()

const formatAmount = (amount: number) => {
  return (amount * 10000).toLocaleString()
}

const formatAmountWithUnit = (amount: number) => {
  if (amount >= 1) {
    return `${amount} 万`
  } else {
    return `${(amount * 10000).toLocaleString()} 元`
  }
}
</script>

<style scoped>
.payment-card {
  min-width: 100%;
  transition: all 0.5s ease;
  box-shadow: 0 8px 15px -3px rgba(157, 31, 53, 0.1), 0 4px 6px -2px rgba(157, 31, 53, 0.05);
}

.new-payment {
  animation: newPayment 2s ease;
}

.payment-amount {
  text-shadow: 2px 2px 4px rgba(157, 31, 53, 0.2);
}

.payment-number {
  background: linear-gradient(135deg, #D4AF37 0%, #FFE5A0 50%, #D4AF37 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(2px 2px 4px rgba(212, 175, 55, 0.3));
}

@keyframes newPayment {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(157, 31, 53, 0);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(157, 31, 53, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 8px 15px -3px rgba(157, 31, 53, 0.1), 0 4px 6px -2px rgba(157, 31, 53, 0.05);
  }
}
</style> 