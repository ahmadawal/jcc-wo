<template>
  <div class="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-12 mb-8 text-center relative">
    <div class="">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-8">Service Dashboard</h1>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Electrical Button -->
        <router-link to="/repair"
          class="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Zap class="w-5 h-5" />
          Electrical
        </router-link>

        <!-- Maintenance Button -->
        <button 
          @click="handleClick('maintenance')"
          class="flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Wrench class="w-5 h-5" />
          Maintenance
        </button>

        <!-- Utility Button -->
        <button 
          @click="handleClick('utility')"
          class="flex items-center gap-3 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          <Settings class="w-5 h-5" />
          Utility
        </button>
      </div>

      <!-- Feedback Display -->
      <div v-if="lastClicked" class="text-center mt-6">
        <p class="text-gray-600">
          Service selected: <span class="font-semibold capitalize">{{ lastClicked }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Zap, Wrench, Settings } from 'lucide-vue-next'

export default {
  name: 'ServiceButtons',
  components: {
    Zap,
    Wrench,
    Settings
  },
  setup() {
    const lastClicked = ref('')

    const handleClick = (service) => {
      lastClicked.value = service
      console.log(`${service} service selected!`)
    }

    return {
      lastClicked,
      handleClick
    }
  }
}
</script>