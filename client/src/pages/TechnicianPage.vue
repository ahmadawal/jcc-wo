<template>
  <div
    class="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-12 mb-8 text-center relative"
  >
    <div class="">
      <div class="flex items-center justify-between">
        <router-link
          to="/"
          class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl text-gray-700 transition-all duration-200"
          style="text-decoration: none"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </router-link>
      </div>
      <div class="flex items-center place-content-center">
        <div class="flex items-center">
          <h1 class="text-3xl font-bold text-gray-800 text-center mb-8">
            Service Route
          </h1>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Electrical Button -->
        <router-link
          to="/repair"
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
          Service selected:
          <span class="font-semibold capitalize">{{ lastClicked }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Zap, Wrench, Settings } from "lucide-vue-next";

export default {
  name: "ServiceButtons",
  components: {
    Zap,
    Wrench,
    Settings,
  },
  setup() {
    const lastClicked = ref("");

    const handleClick = (service) => {
      lastClicked.value = service;
      console.log(`${service} service selected!`);
    };

    return {
      lastClicked,
      handleClick,
    };
  },
};
</script>
