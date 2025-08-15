<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Interactive Background -->
    <div class="absolute inset-0">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        :style="particle.style"
        class="absolute w-4 h-4 bg-white/10 rounded-full animate-float interactive-element"
        @click="interactWithParticle(index)"
        @mouseenter="particle.hover = true"
        @mouseleave="particle.hover = false"
      ></div>
      <!-- Floating geometric shapes -->
      <div
        v-for="(shape, index) in shapes"
        :key="`shape-${index}`"
        :style="shape.style"
        :class="shape.class"
        class="absolute interactive-element"
        @click="interactWithShape(index)"
      ></div>
    </div>
    <!-- Main Content -->
    <div
      class="relative z-10 min-h-screen flex items-center justify-center px-4"
    >
      <div class="text-center max-w-8xl mx-auto">
        <!-- Welcome Header -->
        <div
          class="floating-card p-8 mb-8 animate-float bg-black/20 backdrop-blur-sm"
        >
          <h1
            class="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse-slow"
          >
            JCC
          </h1>
          <p class="text-xl md:text-2xl text-blue-200 mb-6">
            Work Order Maintenance System
          </p>
          <div class="flex flex-wrap justify-center gap-6 mb-8">
            <router-link
              to="/report"
              class="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-lg shadow transition-all duration-300 hover:scale-105 bg-green-600/90 hover:bg-green-700/90 text-white animate-pulse-slow"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Buat Laporan
            </router-link>
            <router-link
              to="/technician"
              class="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-lg shadow transition-all duration-300 hover:scale-105 bg-orange-600/90 hover:bg-orange-700/90 text-white animate-pulse-slow"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v-6H3v6z"
                />
              </svg>
              Perbaikan Mesin
            </router-link>
            <router-link
              to="/export"
              class="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-lg shadow transition-all duration-300 hover:scale-105 bg-blue-600/90 hover:bg-blue-700/90 text-white animate-pulse-slow"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                />
              </svg>
              Download Excel
            </router-link>
          </div>
        </div>
        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <!-- Total Reports Card -->
          <div
            class="floating-card p-6 text-center interactive-element bg-gradient-to-br from-yellow-500/70 to-yellow-600/70 backdrop-blur-sm animate-float animate-pulse-slow"
          >
            <div class="text-4xl mb-4">🧑‍🔧</div>
            <h3 class="text-xl font-semibold text-white mb-2">Mekanik</h3>
            <div class="text-3xl font-bold text-white mb-2">
              {{ stats.allMechanical }}
            </div>
            <p class="text-blue-200 text-sm">Laporan kerusakan mesin</p>
            <div class="mt-3 text-xs text-blue-200">
              <div class="flex justify-between">
                <span>New: {{ stats.newMechanical }}</span>
                <span>In Progress: {{ stats.inProgressReports }}</span>
              </div>
            </div>
          </div>

          <!-- Total Reports Card -->
          <div
            class="floating-card p-6 text-center interactive-element bg-gradient-to-br from-blue-500/70 to-blue-600/70 backdrop-blur-sm animate-float animate-pulse-slow"
          >
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="text-xl font-semibold text-white mb-2">Elektrik</h3>
            <div class="text-3xl font-bold text-white mb-2">
              {{ stats.allElectrical }}
            </div>
            <p class="text-blue-200 text-sm">Laporan kerusakan mesin</p>
            <div class="mt-3 text-xs text-blue-200">
              <div class="flex justify-between">
                <span>New: {{ stats.newElectrical }}</span>
                <span>In Progress: {{ stats.inProgressReports }}</span>
              </div>
            </div>
          </div>

          <!-- Total Repairs Card -->
          <div
            class="floating-card p-6 text-center interactive-element bg-gradient-to-br from-green-500/70 to-green-600/70 backdrop-blur-sm animate-bounce-slow animate-pulse-slow"
          >
            <div class="text-4xl mb-4">🔧</div>
            <h3 class="text-xl font-semibold text-white mb-2">Utility</h3>
            <div class="text-3xl font-bold text-white mb-2">
              {{ stats.allUtility }}
            </div>
            <p class="text-green-200 text-sm">Perbaikan yang dilakukan</p>
            <div class="mt-3 text-xs text-blue-200">
              <div class="flex justify-between">
                <span>New: {{ stats.newUtility }}</span>
                <span>In Progress: {{ stats.inProgressReports }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity Card -->
          <div
            class="floating-card p-6 text-center interactive-element bg-gradient-to-br from-purple-500/70 to-purple-600/70 backdrop-blur-sm animate-pulse-slow"
          >
            <div class="text-4xl mb-4">⏱️</div>
            <h3 class="text-xl font-semibold text-white mb-2">Kalibrasi</h3>
            <div class="text-3xl font-bold text-white mb-2">
              {{ stats.allCalibration }}
            </div>
            <p class="text-purple-200 text-sm">Hari ini</p>
            <div class="mt-3 text-xs text-blue-200">
              <div class="flex justify-between">
                <span>New: {{ stats.newCalibration }}</span>
                <span>In Progress: {{ stats.inProgressReports }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Display -->
        <div
          class="floating-card p-4 mt-8 bg-black/20 backdrop-blur-sm animate-pulse-slow"
        >
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <div
                  class="w-3 h-3 rounded-full mr-3 animate-pulse status-indicator"
                  :class="{
                    'bg-green-500': systemStatus === 'System Online',
                    'bg-red-500': systemStatus === 'Error loading data',
                    'bg-yellow-500': systemStatus === 'Loading data...',
                  }"
                ></div>
                <p class="text-white">
                  <span class="font-semibold gradient-text"
                    >Status Sistem:</span
                  >
                  <span
                    class="ml-2 font-bold"
                    :class="{
                      'text-green-400 animate-pulse':
                        systemStatus === 'System Online',
                      'text-red-400 animate-pulse':
                        systemStatus === 'Error loading data',
                      'text-yellow-400 animate-pulse':
                        systemStatus === 'Loading data...',
                    }"
                    >{{ systemStatus }}</span
                  >
                </p>
              </div>
              <p class="text-blue-200 text-sm">
                <span class="inline-flex items-center">
                  <span
                    class="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-ping"
                  ></span>
                  Last Updated: {{ lastUpdated }}
                </span>
                <span class="mx-2">|</span>
                <span class="inline-flex items-center">
                  <span
                    class="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-bounce"
                  ></span>
                  Total Records: {{ stats.totalReports + stats.totalRepairs }}
                </span>
              </p>
            </div>
            <button
              @click="refreshDashboard"
              class="bg-blue-600/80 hover:bg-blue-700/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-110 backdrop-blur-sm transform hover:rotate-12 relative overflow-hidden group"
            >
              <span class="relative z-10 flex items-center">
                <span
                  class="mr-2 group-hover:animate-spin transition-transform duration-300"
                  >🔄</span
                >
                Refresh
              </span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Notification -->
    <div
      v-if="notification.show"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-slow"
    >
      {{ notification.message }}
    </div>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

export default {
  name: 'HomePage',
  setup() {
    const particles = ref([])
    const shapes = ref([])
    const stats = ref({
      totalReports: 0,
      newReports: 0,
      newMechanical: 0,
      newElectrical: 0,
      newUtility: 0,
      newCalibration: 0,
      inProgressReports: 0,
      totalRepairs: 0,
      completedRepairs: 0,
      pendingRepairs: 0,
      recentActivity: 0,
      todayReports: 0,
      todayRepairs: 0,
      totalMechanic: 0,
      totalElectric: 0,
      totalUtility: 0,
      totalCalibration: 0,
    })
    const systemStatus = ref('Loading...')
    const lastUpdated = ref('')
    const interactionCount = ref(0)
    const animationActive = ref(true)
    const notification = ref({ show: false, message: '' })
    const generateParticles = () => {
      particles.value = Array.from({ length: 20 }, (_, i) => ({
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
        },
        hover: false,
      }))
    }
    const generateShapes = () => {
      shapes.value = Array.from({ length: 8 }, (_, i) => ({
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          transform: `rotate(${Math.random() * 360}deg)`,
        },
        class:
          i % 2 === 0
            ? 'w-16 h-16 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full animate-spin-slow'
            : 'w-12 h-12 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 transform rotate-45 animate-wiggle',
      }))
    }

    const fetchDashboardData = async () => {
      try {
        systemStatus.value = 'Loading data...'

        // Fetch reports
        const reportsResponse = await axios.get(
          'http://localhost:5000/api/reports'
        )
        const reports = reportsResponse.data.data || []

        // Fetch all repairs
        const repairsResponse = await axios.get(
          'http://localhost:5000/api/repairs'
        )
        const allRepairs = repairsResponse.data.data || []

        const totalMechnical = await axios.get(
          'http://localhost:5000/api/mechanical'
        )

        const mechanical = totalMechnical.data.data || []

        const totalElectric = await axios.get(
          'http://localhost:5000/api/electrical'
        )

        const electrical = totalElectric.data.data || []

        const totalUtility = await axios.get(
          'http://localhost:5000/api/utility'
        )

        const utility = totalUtility.data.data || []

        const totalCalibration = await axios.get(
          'http://localhost:5000/api/calibration'
        )

        const calibration = totalCalibration.data.data || []

        // Calculate today's date
        const today = new Date().toISOString().split('T')[0]

        // Calculate statistics
        const totalReports = reports.length
        const allMechanical = mechanical.length
        const allElectrical = electrical.length
        const allUtility = utility.length
        const allCalibration = calibration.length

        const newReports = reports.filter(
          (r) => r.status === 'New' || !r.status
        ).length
        const inProgressReports = reports.filter(
          (r) => r.status === 'Proses'
        ).length
        const todayReports = reports.filter((r) => r.tanggal === today).length

        const totalRepairs = allRepairs.length
        const completedRepairs = allRepairs.filter(
          (r) => r.status === 'Selesai'
        ).length
        const pendingRepairs = allRepairs.filter(
          (r) => r.status === 'Pending'
        ).length
        const todayRepairs = allRepairs.filter(
          (r) => r.tanggal_selesai === today
        ).length

        const newMechanical = reports.filter(
          (r) => r.status === 'New' && r.jenis_perbaikan === 'Mekanik'
        ).length
        const newElectrical = reports.filter(
          (r) => r.status === 'New' && r.jenis_perbaikan === 'Elektrik'
        ).length
        const newUtility = reports.filter(
          (r) => r.status === 'New' && r.jenis_perbaikan === 'Utility'
        ).length
        const newCalibration = reports.filter(
          (r) => r.status === 'New' && r.jenis_perbaikan === 'Kalibrasi'
        ).length

        const recentActivity = todayReports + todayRepairs

        // Update stats
        stats.value = {
          totalReports,
          newReports,
          newMechanical,
          newElectrical,
          newUtility,
          newCalibration,
          inProgressReports,
          totalRepairs,
          completedRepairs,
          pendingRepairs,
          recentActivity,
          todayReports,
          todayRepairs,
          allUtility,
          allMechanical,
          allElectrical,
          allCalibration,
        }

        systemStatus.value = 'System Online'
        lastUpdated.value = new Date().toLocaleTimeString('id-ID')
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        systemStatus.value = 'Error loading data'
        window.$toast?.error('Error', 'Gagal memuat data dashboard')
      }
    }
    const interactWithParticle = (index) => {
      interactionCount.value++
      statusMessage.value = `Particle ${index + 1} clicked!`
      showNotification(`Particle ${index + 1} interacted!`)
      const particle = particles.value[index]
      particle.style.background = 'rgba(255, 255, 0, 0.6)'
      setTimeout(() => {
        particle.style.background = 'rgba(255, 255, 255, 0.2)'
      }, 1000)
    }
    const interactWithShape = (index) => {
      interactionCount.value++
      statusMessage.value = `Shape ${index + 1} clicked!`
      showNotification(`Shape ${index + 1} interacted!`)
      const shape = shapes.value[index]
      shape.class += ' animate-bounce'
      setTimeout(() => {
        shape.class = shape.class.replace(' animate-bounce', '')
      }, 1000)
    }
    const refreshDashboard = () => {
      fetchDashboardData()
      showNotification('Dashboard diperbarui!')
    }
    const showMessage = (message) => {
      interactionCount.value++
      statusMessage.value = message
      showNotification(message)
    }
    const toggleAnimation = () => {
      animationActive.value = !animationActive.value
      statusMessage.value = animationActive.value
        ? 'Animations enabled!'
        : 'Animations disabled!'
      showNotification(statusMessage.value)
    }
    const showNotification = (message) => {
      notification.value = { show: true, message }
      setTimeout(() => {
        notification.value.show = false
      }, 3000)
    }
    const handleMouseMove = (event) => {
      if (!animationActive.value) return
      const { clientX, clientY } = event
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      particles.value.forEach((particle, index) => {
        const speed = ((index % 3) + 1) * 0.02
        const x = (clientX - centerX) * speed
        const y = (clientY - centerY) * speed
        particle.style.transform = `translate(${x}px, ${y}px)`
      })
    }
    onMounted(() => {
      generateParticles()
      generateShapes()
      window.addEventListener('mousemove', handleMouseMove)
      fetchDashboardData()

      // Auto-refresh dashboard every 30 seconds
      const refreshInterval = setInterval(fetchDashboardData, 30000)

      onUnmounted(() => {
        clearInterval(refreshInterval)
      })
    })
    onUnmounted(() => {
      window.removeEventListener('mousemove', handleMouseMove)
    })
    return {
      particles,
      shapes,
      stats,
      systemStatus,
      lastUpdated,
      interactionCount,
      animationActive,
      notification,
      interactWithParticle,
      interactWithShape,
      refreshDashboard,
      showMessage,
      toggleAnimation,
    }
  },
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes wiggle {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 2s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.floating-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.interactive-element {
  cursor: pointer;
  transition: all 0.3s ease;
}

.interactive-element:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

/* Status indicator pulse animation */
@keyframes status-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

.status-indicator {
  animation: status-pulse 2s infinite;
}

/* Gradient text animation */
@keyframes gradient-text {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-text {
  background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
  background-size: 400% 400%;
  animation: gradient-text 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
