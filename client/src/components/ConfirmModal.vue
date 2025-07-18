<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fade-in">
      <h3 class="text-lg font-semibold mb-2 text-gray-800">{{ title }}</h3>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-2">
        <button @click="$emit('cancel')" class="btn-secondary">Batal</button>
        <button @click="$emit('confirm')" class="btn-primary bg-red-600 hover:bg-red-700">Ya, Hapus</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: Boolean,
    title: {
      type: String,
      default: 'Konfirmasi Hapus'
    },
    message: {
      type: String,
      default: 'Apakah Anda yakin ingin menghapus item ini?'
    }
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200;
}
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-all duration-200;
}
</style> 