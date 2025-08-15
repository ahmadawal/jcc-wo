<template>
  <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-12 mt-8 mb-8">
    <div class="flex items-center justify-between mb-6">
      <router-link
        to="/technician"
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
      <h2 class="text-2xl font-bold">Detail Perbaikan Mesin</h2>
      <span class="flex items-center text-orange-600 font-medium">
        <span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
        Utility Page
      </span>
    </div>
    <div v-if="!selectedReportId">
      <h3 class="text-lg font-semibold mb-4">
        Pilih Laporan Kerusakan untuk Diperbaiki
      </h3>
      <!-- Search input -->
      <div class="mb-4 flex items-center">
        <input
          v-model="reportSearch"
          type="text"
          class="input w-72"
          placeholder="Cari mesin, plant, bagian rusak, pelapor, status..."
        />
      </div>
      <table class="w-full text-sm border mb-8">
        <thead>
          <tr class="bg-gray-100">
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('tanggal')"
            >
              Tanggal
              <span v-if="reportSortKey === 'tanggal'">{{
                reportSortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('waktu')"
            >
              Waktu
              <span v-if="reportSortKey === 'waktu'">{{
                reportSortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('nama_mesin')"
            >
              Mesin
              <span v-if="reportSortKey === 'nama_mesin'">{{
                reportSortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('plant')"
            >
              Plant
              <span v-if="reportSortKey === 'plant'">{{
                reportSortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('bagian_rusak')"
            >
              Bagian Rusak
              <span v-if="reportSortKey === 'bagian_rusak'">{{
                reportSortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('detail_kerusakan')"
            >
              Detail Kerusakan
              <span v-if="reportSortKey === 'detail_kerusakan'">{{
                reportSortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('status')"
            >
              Status
              <span v-if="reportSortKey === 'status'">{{
                reportSortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th class="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in paginatedReports" :key="report.id">
            <td class="p-2 border">{{ formatDateUTC(report.tanggal) }}</td>
            <td class="p-2 border">{{ report.waktu }}</td>
            <td class="p-2 border">{{ report.nama_mesin }}</td>
            <td class="p-2 border">{{ report.plant }}</td>
            <td class="p-2 border">{{ report.bagian_rusak }}</td>
            <td class="p-2 border">{{ report.detail_kerusakan }}</td>
            <td class="p-2 border">
              <span :class="statusClass(report.status)">
                {{ report.status || '-' }}
              </span>
            </td>
            <td class="p-2 border">
              <button class="btn-primary" @click="selectReport(report.id)">
                Perbaiki
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination Controls for Reports -->
      <div
        v-if="reportTotalPages > 1"
        class="flex justify-between items-center mt-2 mb-6"
      >
        <div class="flex gap-2">
          <button
            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            :disabled="reportPage === 1"
            @click="goToReportPage(reportPage - 1)"
          >
            &laquo;
          </button>
          <button
            v-for="page in reportTotalPages"
            :key="page"
            class="px-3 py-1 rounded"
            :class="
              reportPage === page
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            "
            @click="goToReportPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            :disabled="reportPage === reportTotalPages"
            @click="goToReportPage(reportPage + 1)"
          >
            &raquo;
          </button>
        </div>
        <div>
          <label class="mr-2">Tampil</label>
          <select v-model="reportPageSize" class="border rounded px-2 py-1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
          <span class="ml-2">per halaman</span>
        </div>
      </div>
    </div>
    <div v-else>
      <h3 class="text-lg font-semibold mb-4">
        Daftar Perbaikan untuk Laporan Ini
      </h3>
      <table class="w-full text-sm border mb-8">
        <thead>
          <tr class="bg-gray-100">
            <th
              class="p-2 border cursor-pointer"
              @click="setSort('nama_teknisi')"
            >
              Teknisi
              <span v-if="sortKey === 'nama_teknisi'">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setSort('detail_perbaikan')"
            >
              Detail Perbaikan
              <span v-if="sortKey === 'detail_perbaikan'">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setSort('tanggal_selesai')"
            >
              Tanggal Selesai
              <span v-if="sortKey === 'tanggal_selesai'">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th class="p-2 border cursor-pointer" @click="setSort('status')">
              Status
              <span v-if="sortKey === 'status'">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th class="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repair in paginatedRepairs" :key="repair.id">
            <td class="p-2 border">{{ repair.nama_teknisi }}</td>
            <td class="p-2 border">{{ repair.detail_perbaikan }}</td>
            <td class="p-2 border">
              {{ formatDateUTC(repair.tanggal_selesai) }}
            </td>
            <td class="p-2 border">
              <span :class="statusClass(repair.status)">{{
                repair.status || '-'
              }}</span>
            </td>
            <td class="p-2 border relative group">
              <div
                v-if="hoveredAction === 'edit-' + repair.id"
                class="absolute -top-10 left-3 bg-gray-800 text-white text-xs rounded px-3 py-1 shadow-lg z-10 transition-opacity duration-200 opacity-100 pointer-events-none"
              >
                Edit
              </div>
              <div
                v-if="hoveredAction === 'hapus-' + repair.id"
                class="absolute -top-10 right-3 bg-gray-800 text-white text-xs rounded px-3 py-1 shadow-lg z-10 transition-opacity duration-200 opacity-100 pointer-events-none"
              >
                Hapus
              </div>
              <button
                class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 mr-2 transition-all duration-200"
                @click="editRepair(repair)"
                @mouseenter="hoveredAction = 'edit-' + repair.id"
                @mouseleave="hoveredAction = null"
                title="Edit"
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
              </button>
              <button
                class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200"
                @click="deleteRepair(repair.id)"
                @mouseenter="hoveredAction = 'hapus-' + repair.id"
                @mouseleave="hoveredAction = null"
                title="Hapus"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination Controls -->
      <div
        v-if="selectedReportId && totalPages > 1"
        class="flex justify-between items-center mt-2 mb-6"
      >
        <div class="flex gap-2">
          <button
            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            &laquo;
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="px-3 py-1 rounded"
            :class="
              currentPage === page
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            &raquo;
          </button>
        </div>
        <div>
          <label class="mr-2">Tampil</label>
          <select v-model="pageSize" class="border rounded px-2 py-1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
          <span class="ml-2">per halaman</span>
        </div>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1"
            >Detail Perbaikan *</label
          >
          <textarea
            v-model="form.detail_perbaikan"
            class="input"
            rows="3"
            required
            placeholder="Jelaskan detail perbaikan yang dilakukan..."
          ></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1"
              >Waktu Perbaikan Mulai</label
            >
            <input
              type="time"
              v-model="form.waktu_perbaikan_mulai"
              class="input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Waktu Perbaikan Selesai</label
            >
            <input
              type="time"
              v-model="form.waktu_perbaikan_selesai"
              class="input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Tanggal Selesai</label
            >
            <input type="date" v-model="form.tanggal_selesai" class="input" />
          </div>
        </div>
        <div class="mb-4">
          <div>
            <label class="block text-sm font-medium mb-1"
              >Pemakaian Spare Part</label
            >
            <input
              type="text"
              v-model="form.spare_part"
              class="input"
              placeholder="Masukkan nama spare part yang digunakan"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nama Teknisi *</label>
            <div
              class="flex flex-wrap gap-2 max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50"
            >
              <label
                v-for="teknisi in teknisiList"
                :key="teknisi"
                class="inline-flex items-center mr-4 mb-2"
              >
                <input
                  type="checkbox"
                  :value="teknisi"
                  v-model="form.nama_teknisi"
                  class="form-checkbox h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span class="ml-2 text-sm">{{ teknisi }}</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status *</label>
            <select v-model="form.status" class="input" required>
              <option value="">Pilih Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Proses">Proses</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div class="">
            <label class="block text-sm font-medium mb-1"
              >Keterangan Tambahan</label
            >
            <select v-model="form.keterangan_tambahan" class="input">
              <option value="">Pilih Keterangan</option>
              <option value="TM">TM</option>
              <option value="TE">TE</option>
              <option value="TU">TU</option>
              <option value="LM">LM</option>
              <option value="LE">LE</option>
              <option value="LU">LU</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button type="button" class="btn-secondary" @click="resetForm">
            Batal
          </button>
          <button type="submit" class="btn-primary">
            {{ form.id ? 'Update' : 'Tambah' }} Perbaikan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'RepairPage',
  setup() {
    const teknisiList = ref([])
    const spareParts = [
      'Bearing',
      'Hydraulic Pump',
      'Seal',
      'Belt',
      'Motor',
      'Lainnya',
    ]
    const reports = ref([])
    const repairs = ref([])
    const selectedReportId = ref(null)
    const form = reactive({
      id: null,
      detail_perbaikan: '',
      waktu_perbaikan_mulai: '',
      waktu_perbaikan_selesai: '',
      tanggal_selesai: '',
      spare_part: '',
      nama_teknisi: [],
      status: '',
      keterangan_tambahan: '',
    })
    const hoveredAction = ref(null)

    // Pagination & Sorting state
    const currentPage = ref(1)
    const pageSize = ref(10)
    const sortKey = ref('tanggal_selesai')
    const sortOrder = ref('desc') // 'asc' or 'desc'

    // Search and sort state for reports
    const reportSearch = ref('')
    const reportSortKey = ref('tanggal')
    const reportSortOrder = ref('desc')
    // Filtered reports by search
    const filteredReports = computed(() => {
      if (!reportSearch.value) return reports.value
      const term = reportSearch.value.toLowerCase()
      return reports.value.filter(
        (r) =>
          (r.nama_mesin && r.nama_mesin.toLowerCase().includes(term)) ||
          (r.plant && r.plant.toLowerCase().includes(term)) ||
          (r.bagian_rusak && r.bagian_rusak.toLowerCase().includes(term)) ||
          (r.detail_kerusakan &&
            r.detail_kerusakan.toLowerCase().includes(term)) ||
          (r.pelapor && r.pelapor.toLowerCase().includes(term)) ||
          (r.status && r.status.toLowerCase().includes(term))
      )
    })
    // Sorted reports
    const sortedReports = computed(() => {
      if (!filteredReports.value.length || !reportSortKey.value)
        return filteredReports.value
      return [...filteredReports.value].sort((a, b) => {
        let valA = a[reportSortKey.value]
        let valB = b[reportSortKey.value]
        if (valA == null) valA = ''
        if (valB == null) valB = ''
        if (reportSortKey.value.includes('tanggal')) {
          valA = new Date(valA)
          valB = new Date(valB)
        }
        if (valA < valB) return reportSortOrder.value === 'asc' ? -1 : 1
        if (valA > valB) return reportSortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    })
    // Paginated reports (use sortedReports)
    const paginatedReports = computed(() => {
      const start = (reportPage.value - 1) * reportPageSize.value
      return sortedReports.value.slice(start, start + reportPageSize.value)
    })
    const reportTotalPages = computed(() =>
      Math.ceil(sortedReports.value.length / reportPageSize.value)
    )
    const setReportSort = (key) => {
      if (reportSortKey.value === key) {
        reportSortOrder.value = reportSortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        reportSortKey.value = key
        reportSortOrder.value = 'asc'
      }
    }

    // Pagination for laporan kerusakan (reports)
    const reportPage = ref(1)
    const reportPageSize = ref(10)
    const goToReportPage = (page) => {
      if (page >= 1 && page <= reportTotalPages.value) reportPage.value = page
    }

    // Sorting logic
    const sortedRepairs = computed(() => {
      if (!repairs.value.length || !sortKey.value) return repairs.value
      return [...repairs.value].sort((a, b) => {
        let valA = a[sortKey.value]
        let valB = b[sortKey.value]
        // Handle null/undefined
        if (valA == null) valA = ''
        if (valB == null) valB = ''
        // Date sort
        if (sortKey.value.includes('tanggal')) {
          valA = new Date(valA)
          valB = new Date(valB)
        }
        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    })
    // Pagination logic
    const paginatedRepairs = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return sortedRepairs.value.slice(start, start + pageSize.value)
    })
    const totalPages = computed(() =>
      Math.ceil(repairs.value.length / pageSize.value)
    )
    const setSort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) currentPage.value = page
    }

    const fetchReports = async () => {
      const { data } = await axios.get('http://localhost:5000/api/utility')
      reports.value = data.data // No filter, show all reports
      reportPage.value = 1 // Reset to first page on new data
    }

    const fetchRepairs = async (reportId) => {
      const { data } = await axios.get(
        `http://localhost:5000/api/repairs?report_id=${reportId}`
      )
      repairs.value = data.data
      currentPage.value = 1 // Reset to first page on new data
    }

    const selectReport = async (id) => {
      selectedReportId.value = id
      await fetchRepairs(id)
      resetForm()
    }

    const editRepair = (repair) => {
      Object.assign(form, repair)
      if (typeof repair.nama_teknisi === 'string') {
        form.nama_teknisi = repair.nama_teknisi
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }
    }

    const deleteRepair = async (id) => {
      if (confirm('Yakin ingin menghapus perbaikan ini?')) {
        try {
          await axios.delete(`http://localhost:5000/api/repairs/${id}`)
          await fetchRepairs(selectedReportId.value)
          await fetchReports() // Refresh reports to show updated status
          resetForm()
          window.$toast.success('Berhasil!', 'Perbaikan berhasil dihapus')
        } catch (error) {
          window.$toast.error('Gagal!', 'Gagal menghapus perbaikan')
          console.error(error)
        }
      }
    }

    const resetForm = () => {
      Object.assign(form, {
        id: null,
        detail_perbaikan: '',
        waktu_perbaikan_mulai: '',
        waktu_perbaikan_selesai: '',
        tanggal_selesai: '',
        spare_part: '',
        nama_teknisi: [],
        status: '',
        keterangan_tambahan: '',
      })
    }

    const handleSubmit = async () => {
      try {
        const cleanForm = { ...form }

        // Format date fields
        if (cleanForm.tanggal_selesai) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanForm.tanggal_selesai)) {
            const d = new Date(cleanForm.tanggal_selesai)
            if (!isNaN(d)) {
              cleanForm.tanggal_selesai = d.toISOString().slice(0, 10)
            } else {
              cleanForm.tanggal_selesai = null
            }
          }
        } else {
          cleanForm.tanggal_selesai = null
        }

        // Format time fields
        if (!cleanForm.waktu_perbaikan_mulai)
          cleanForm.waktu_perbaikan_mulai = null
        if (!cleanForm.waktu_perbaikan_selesai)
          cleanForm.waktu_perbaikan_selesai = null

        cleanForm.report_id = selectedReportId.value

        // Serialize nama_teknisi array to string
        cleanForm.nama_teknisi = Array.isArray(cleanForm.nama_teknisi)
          ? cleanForm.nama_teknisi.join(',')
          : cleanForm.nama_teknisi

        if (form.id) {
          await axios.put(
            `http://localhost:5000/api/repairs/${form.id}`,
            cleanForm
          )
          window.$toast.success('Berhasil!', 'Perbaikan berhasil diperbarui')
        } else {
          await axios.post('http://localhost:5000/api/repairs', cleanForm)
          window.$toast.success('Berhasil!', 'Perbaikan berhasil ditambahkan')
        }
        await fetchRepairs(selectedReportId.value)
        await fetchReports() // Refresh reports to show updated status
        resetForm()
      } catch (error) {
        window.$toast.error(
          'Gagal!',
          'Gagal menyimpan perbaikan. Pastikan data sudah benar.'
        )
        console.error(error)
      }
    }

    const formatDateUTC = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toISOString().slice(0, 10)
    }

    const statusClass = (status) => {
      if (status === 'Selesai')
        return 'bg-green-200 text-green-800 font-semibold px-2 py-1 rounded'
      if (status === 'Proses')
        return 'bg-yellow-200 text-yellow-800 font-semibold px-2 py-1 rounded'
      if (status === 'Pending')
        return 'bg-orange-200 text-orange-800 font-semibold px-2 py-1 rounded'
      return 'bg-red-200 text-red-800 font-semibold px-2 py-1 rounded'
    }

    onMounted(async () => {
      await fetchReports()
      // Fetch technicians from backend
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/technicians'
        )
        teknisiList.value = data.data.map((t) => t.nama)
      } catch (e) {
        teknisiList.value = []
      }
    })

    return {
      reports,
      repairs,
      selectedReportId,
      form,
      teknisiList,
      spareParts,
      selectReport,
      editRepair,
      deleteRepair,
      resetForm,
      handleSubmit,
      formatDateUTC,
      statusClass,
      hoveredAction,
      paginatedRepairs,
      currentPage,
      pageSize,
      totalPages,
      sortKey,
      sortOrder,
      setSort,
      goToPage,
      paginatedReports,
      reportPage,
      reportPageSize,
      reportTotalPages,
      goToReportPage,
      reportSearch,
      reportSortKey,
      reportSortOrder,
      filteredReports,
      sortedReports,
      setReportSort,
    }
  },
}
</script>

<style scoped>
.input {
  @apply w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50;
}
.btn-primary {
  @apply bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200;
}
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-all duration-200;
}
</style>
