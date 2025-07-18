<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'toast-item',
          'max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300',
          toast.type === 'success' ? 'border-green-500' : '',
          toast.type === 'error' ? 'border-red-500' : '',
          toast.type === 'warning' ? 'border-yellow-500' : '',
          toast.type === 'info' ? 'border-blue-500' : ''
        ]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg v-if="toast.type === 'success'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <!-- Error Icon -->
            <svg v-else-if="toast.type === 'error'" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <!-- Warning Icon -->
            <svg v-else-if="toast.type === 'warning'" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <!-- Info Icon -->
            <svg v-else-if="toast.type === 'info'" class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
            <p v-if="toast.message" class="mt-1 text-sm text-gray-500">{{ toast.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="removeToast(toast.id)"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Progress bar -->
        <div class="mt-2">
          <div 
            class="h-1 bg-gray-200 rounded-full overflow-hidden"
            :class="{
              'bg-green-200': toast.type === 'success',
              'bg-red-200': toast.type === 'error',
              'bg-yellow-200': toast.type === 'warning',
              'bg-blue-200': toast.type === 'info'
            }"
          >
            <div 
              class="h-full transition-all duration-300 ease-linear"
              :class="{
                'bg-green-500': toast.type === 'success',
                'bg-red-500': toast.type === 'error',
                'bg-yellow-500': toast.type === 'warning',
                'bg-blue-500': toast.type === 'info'
              }"
              :style="{ width: toast.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Toast',
  setup() {
    const toasts = ref([])
    let nextId = 1

    const addToast = (type, title, message = '', duration = 5000) => {
      const id = nextId++
      const toast = {
        id,
        type,
        title,
        message,
        progress: 100
      }
      
      toasts.value.push(toast)
      
      // Auto-remove after duration
      if (duration > 0) {
        const startTime = Date.now()
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
          toast.progress = remaining
          
          if (remaining <= 0) {
            clearInterval(progressInterval)
            removeToast(id)
          }
        }, 50)
      }
    }

    const removeToast = (id) => {
      const index = toasts.value.findIndex(toast => toast.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }

    // Expose methods globally
    const showSuccess = (title, message) => addToast('success', title, message)
    const showError = (title, message) => addToast('error', title, message)
    const showWarning = (title, message) => addToast('warning', title, message)
    const showInfo = (title, message) => addToast('info', title, message)

    // Make methods available globally
    window.$toast = {
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo
    }

    onUnmounted(() => {
      delete window.$toast
    })

    return {
      toasts,
      addToast,
      removeToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style> 