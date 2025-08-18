<template>
  <div
    class="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-12 mb-8 text-center relative"
  >
    <router-link
      to="/"
      class="absolute top-6 left-6 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl text-gray-700 transition-all duration-200"
      title="Kembali ke Beranda"
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
    <h2 class="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
      <svg
        class="w-7 h-7 text-green-600"
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
      Download Data Excel
    </h2>
    <p class="mb-6 text-gray-600">
      Unduh seluruh data laporan dan perbaikan mesin dalam format Excel (.xlsx).
    </p>
    <div class="flex flex-wrap justify-center gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium mb-1">Bulan</label>
        <select v-model="selectedMonth" class="input">
          <option value="">Semua</option>
          <option v-for="(m, idx) in months" :key="idx" :value="idx + 1">
            {{ m }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Tahun</label>
        <select v-model="selectedYear" class="input">
          <option value="">Semua</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>
    <button
      @click="downloadExcel"
      class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center gap-2 mx-auto"
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
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
        />
      </svg>
      Download Excel
    </button>
  </div>
</template>

<script>
const now = new Date()
export default {
  name: 'ExportPage',
  data() {
    return {
      selectedMonth: String(now.getMonth() + 1),
      selectedYear: String(now.getFullYear()),
      months: [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ],
      years: Array.from({ length: 6 }, (_, i) => String(now.getFullYear() - i)),
    }
  },
  methods: {
    async downloadExcel() {
      try {
        let url = 'http://wo-mt.jembo.com:5000/api/export/excel'
        const params = []
        if (this.selectedMonth) params.push(`month=${this.selectedMonth}`)
        if (this.selectedYear) params.push(`year=${this.selectedYear}`)
        if (params.length) url += '?' + params.join('&')
        const response = await fetch(url, { method: 'GET' })
        if (!response.ok) throw new Error('Gagal mengunduh file')
        const blob = await response.blob()
        const urlObj = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = urlObj
        a.download = 'wo_export.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(urlObj)
        window.$toast?.success('Berhasil!', 'File Excel berhasil diunduh')
      } catch (error) {
        window.$toast?.error('Gagal!', 'Gagal mengunduh file Excel')
      }
    },
  },
}
</script>
