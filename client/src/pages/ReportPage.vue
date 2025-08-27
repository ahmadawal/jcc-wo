<template>
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 mb-8">
    <div class="flex items-center justify-between mb-6">
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
      <h2 class="text-2xl font-bold">Laporan Kerusakan Mesin</h2>
      <span class="flex items-center text-green-600 font-medium">
        <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
        Reporter Mode
      </span>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1"
            >Tanggal Laporan *</label
          >
          <input type="date" v-model="form.tanggal" class="input" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Waktu Laporan</label>
          <input type="time" v-model="form.waktu" class="input" required />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Shift Pelapor *</label>
          <input
            type="text"
            v-model="form.shift"
            class="input"
            readonly
            placeholder="Shift"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Nama Pelapor *</label>
          <input
            type="text"
            v-model="form.nama_pelapor"
            class="input"
            required
            placeholder="Masukkan nama pelapor"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Plant *</label>
          <select v-model="form.plant" class="input" required>
            <option value="">Pilih Plant</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="QA">QA</option>
            <option value="SS">SS</option>
            <option value="SC">SC</option>
            <option value="GA">GA</option>
            <option value="PE">PE</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Mesin</label>
          <input
            v-if="['QA', 'SS', 'GA', 'SC', 'PE'].includes(form.plant)"
            v-model="form.nama_mesin"
            type="text"
            placeholder="Masukkan nama mesin"
            class="input"
          />
          <select v-else v-model="form.nama_mesin" class="input">
            <option value="">Pilih Mesin</option>
            <option
              v-for="machine in machines"
              :key="machine.id"
              :value="machine.name"
            >
              {{ machine.name }}
            </option>
          </select>
        </div>

        <div>
          <label>Jenis Perbaikan *</label>
          <select v-model="form.jenis_perbaikan" class="input" required>
            <option value="">Pilih Jenis</option>
            <option value="Elektrik">Elektrik</option>
            <option value="Mekanik">Mekanik</option>
            <option value="Utility">Utility</option>
            <option value="Kalibrasi">Kalibrasi</option>
          </select>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Bagian yang Rusak</label>
        <input
          type="text"
          v-model="form.bagian_rusak"
          class="input"
          placeholder="Contoh: Motor Bearing, Hydraulic Pump, dll"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Detail Kerusakan</label>
        <textarea
          v-model="form.detail_kerusakan"
          class="input"
          rows="3"
          placeholder="Jelaskan detail kerusakan yang terjadi..."
        ></textarea>
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <button type="button" class="btn-secondary" @click="resetForm">
          Batal
        </button>
        <button type="submit" class="btn-primary">Kirim Laporan</button>
      </div>
    </form>
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-2">Daftar Laporan</h3>
      <!-- Search input -->
      <div class="mb-4 flex items-center">
        <input
          v-model="reportSearch"
          type="text"
          class="input w-72"
          placeholder="Cari mesin, plant, bagian rusak, pelapor, status..."
        />
      </div>
      <table class="w-full text-sm border">
        <thead>
          <tr class="bg-gray-100">
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('tanggal')"
            >
              Tanggal
              <span v-if="reportSortKey === 'tanggal'">{{
                reportSortOrder === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('waktu')"
            >
              Waktu
              <span v-if="reportSortKey === 'waktu'">{{
                reportSortOrder === "asc" ? "▲" : "▼"
              }}</span>
            </th>

            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('nama_mesin')"
            >
              Nama Mesin
              <span v-if="reportSortKey === 'nama_mesin'">{{
                reportSortOrder === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('plant')"
            >
              Plant
              <span v-if="reportSortKey === 'plant'">{{
                reportSortOrder === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('bagian_rusak')"
            >
              Bagian Rusak
              <span v-if="reportSortKey === 'bagian_rusak'">{{
                reportSortOrder === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('detail_kerusakan')"
            >
              Detail
              <span v-if="reportSortKey === 'detail_kerusakan'">{{
                reportSortOrder === "asc" ? "▲" : "▼"
              }}</span>
            </th>
            <th
              class="p-2 border cursor-pointer"
              @click="setReportSort('status')"
            >
              Status
              <span v-if="reportSortKey === 'status'">{{
                reportSortOrder === "asc" ? "▲" : "▼"
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
                {{ report.status || "New" }}
              </span>
            </td>
            <td class="p-2 border relative group">
              <div
                v-if="hoveredAction === 'edit-' + report.id"
                class="absolute -top-10 left-3 bg-gray-800 text-white text-xs rounded px-3 py-1 shadow-lg z-10 transition-opacity duration-200 opacity-100 pointer-events-none"
              >
                Edit
              </div>
              <div
                v-if="hoveredAction === 'hapus-' + report.id"
                class="absolute -top-10 right-3 bg-gray-800 text-white text-xs rounded px-3 py-1 shadow-lg z-10 transition-opacity duration-200 opacity-100 pointer-events-none"
              >
                Hapus
              </div>
              <button
                class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 mr-2 transition-all duration-200"
                @click="editReport(report)"
                @mouseenter="hoveredAction = 'edit-' + report.id"
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
                @click="deleteReport(report.id)"
                @mouseenter="hoveredAction = 'hapus-' + report.id"
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
                ? 'bg-blue-600 text-white'
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
    <ConfirmModal
      :show="showConfirm"
      title="Konfirmasi Hapus"
      message="Apakah Anda yakin ingin menghapus laporan ini?"
      @cancel="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from "vue";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal.vue";

export default {
  name: "ReportPage",
  components: { ConfirmModal },
  setup() {
    const machines = ref([]);
    const form = reactive({
      // id: null,
      tanggal: "",
      waktu: "",
      shift: "",
      nama_pelapor: "",
      nama_mesin: "",
      plant: "",
      jenis_perbaikan: "",
      bagian_rusak: "",
      detail_kerusakan: "",
      // status removed from form
    });
    const reports = ref([]);
    // Search and sort state for reports
    const reportSearch = ref("");
    const reportSortKey = ref("tanggal");
    const reportSortOrder = ref("desc");
    // Pagination state
    const reportPage = ref(1);
    const reportPageSize = ref(10);
    // Filtered reports by search
    const filteredReports = computed(() => {
      if (!reportSearch.value) return reports.value;
      const term = reportSearch.value.toLowerCase();
      return reports.value.filter(
        (r) =>
          (r.nama_mesin && r.nama_mesin.toLowerCase().includes(term)) ||
          (r.plant && r.plant.toLowerCase().includes(term)) ||
          (r.bagian_rusak && r.bagian_rusak.toLowerCase().includes(term)) ||
          (r.detail_kerusakan &&
            r.detail_kerusakan.toLowerCase().includes(term)) ||
          (r.nama_pelapor && r.nama_pelapor.toLowerCase().includes(term)) ||
          (r.status && r.status.toLowerCase().includes(term))
      );
    });
    // Sorted reports
    const sortedReports = computed(() => {
      if (!filteredReports.value.length || !reportSortKey.value)
        return filteredReports.value;
      return [...filteredReports.value].sort((a, b) => {
        let valA = a[reportSortKey.value];
        let valB = b[reportSortKey.value];
        if (valA == null) valA = "";
        if (valB == null) valB = "";
        if (reportSortKey.value.includes("tanggal")) {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        if (valA < valB) return reportSortOrder.value === "asc" ? -1 : 1;
        if (valA > valB) return reportSortOrder.value === "asc" ? 1 : -1;
        return 0;
      });
    });
    // Paginated reports (use sortedReports)
    const paginatedReports = computed(() => {
      const start = (reportPage.value - 1) * reportPageSize.value;
      return sortedReports.value.slice(start, start + reportPageSize.value);
    });
    const reportTotalPages = computed(() =>
      Math.ceil(sortedReports.value.length / reportPageSize.value)
    );
    const setReportSort = (key) => {
      if (reportSortKey.value === key) {
        reportSortOrder.value =
          reportSortOrder.value === "asc" ? "desc" : "asc";
      } else {
        reportSortKey.value = key;
        reportSortOrder.value = "asc";
      }
    };
    const goToReportPage = (page) => {
      if (page >= 1 && page <= reportTotalPages.value) reportPage.value = page;
    };
    const previewUrl = ref("");
    // Remove fileInput and openCamera

    const fetchReports = async () => {
      const { data } = await axios.get(
        "http://wo-backend.jembo.com:5000/api/reports"
      );
      reports.value = data.data;
    };

    // Remove handleFileChange

    const resetForm = () => {
      Object.assign(form, {
        id: null,
        tanggal: "",
        waktu: "",
        shift: "",
        nama_pelapor: "",
        nama_mesin: "",
        plant: "",
        jenis_perbaikan: "",
        bagian_rusak: "",
        detail_kerusakan: "",
        // status removed
      });
      previewUrl.value = "";
    };

    const handleSubmit = async () => {
      try {
        const cleanForm = { ...form };
        // Ensure 'tanggal' is formatted as YYYY-MM-DD or null
        if (cleanForm.tanggal) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanForm.tanggal)) {
            const d = new Date(cleanForm.tanggal);
            if (!isNaN(d)) {
              cleanForm.tanggal = d.toISOString().slice(0, 10);
            } else {
              cleanForm.tanggal = null;
            }
          }
        } else {
          cleanForm.tanggal = null;
        }

        // Ensure 'waktu' is formatted as HH:MM:SS or null
        if (cleanForm.waktu && /^\d{2}:\d{2}$/.test(cleanForm.waktu)) {
          cleanForm.waktu = cleanForm.waktu + ":00";
        }

        if (!cleanForm.waktu) cleanForm.waktu = null;
        // Set all undefined fields to null
        Object.keys(cleanForm).forEach((key) => {
          if (typeof cleanForm[key] === "undefined") cleanForm[key] = null;
        });

        if (form.id) {
          await axios.put(
            `http://wo-backend.jembo.com:5000/api/reports/${form.id}`,
            cleanForm
          );
          window.$toast.success("Berhasil!", "Laporan berhasil diperbarui");
        } else {
          await axios.post(
            "http://wo-backend.jembo.com:5000/api/reports",
            cleanForm
          );
          window.$toast.success(
            "Berhasil!",
            "Laporan kerusakan berhasil dikirim"
          );
        }
        await fetchReports();
        resetForm();
      } catch (error) {
        window.$toast.error(
          "Gagal!",
          "Gagal menyimpan laporan. Pastikan semua data sudah benar."
        );
        console.error(error);
      }
    };

    const editReport = (report) => {
      Object.assign(form, report);
      previewUrl.value = report.foto_url || "";
    };

    const showConfirm = ref(false);
    const reportIdToDelete = ref(null);

    const deleteReport = (id) => {
      showConfirm.value = true;
      reportIdToDelete.value = id;
    };
    const confirmDelete = async () => {
      showConfirm.value = false;
      try {
        await axios.delete(
          `http://wo-backend.jembo.com:5000/api/reports/${reportIdToDelete.value}`
        );
        await fetchReports();
        window.$toast.success("Berhasil!", "Laporan berhasil dihapus");
      } catch (error) {
        window.$toast.error("Gagal!", "Gagal menghapus laporan");
        console.error(error);
      }
    };

    const fetchMachines = async () => {
      try {
        const { data } = await axios.get(
          "http://wo-backend.jembo.com:5000/api/machines"
        );
        machines.value = data.data;
      } catch (error) {
        console.error("Failed to fetch machines:", error);
      }
    };

    watch(
      () => form.plant,
      async (newPlant) => {
        if (!newPlant) return;

        // Skip execution for QA, SS, and GA
        if (["QA", "SS", "GA", "SC", "PE"].includes(newPlant)) return;

        try {
          const { data } = await axios.get(
            `http://wo-backend.jembo.com:5000/api/machines/plant/${newPlant}`
          );
          machines.value = data.data;
        } catch (error) {
          console.error("Failed to fetch machines:", error);
          form.plant = "";
        }
      }
    );

    // Function to convert time string to minutes for easier comparison
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;

      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);

      let totalMinutes = hours * 60 + minutes;

      if (period === "PM" && hours !== 12) {
        totalMinutes += 12 * 60;
      } else if (period === "AM" && hours === 12) {
        totalMinutes = minutes;
      }

      return totalMinutes;
    };

    // Function to determine shift based on time
    const determineShift = (timeStr) => {
      if (!timeStr) return "";

      const minutes = timeToMinutes(timeStr);

      // Shift 1: 07:15 AM - 2:45 PM (435 - 855 minutes)
      // Shift 2: 2:46 PM - 10:45 PM (856 - 1425 minutes)
      // Shift 3: 10:46 PM - 07:14 AM (1426+ minutes or 0-434 minutes)

      if (minutes >= 435 && minutes <= 855) {
        // 07:15 AM - 2:45 PM
        return "1";
      } else if (minutes >= 856 && minutes <= 1425) {
        // 2:46 PM - 10:45 PM
        return "2";
      } else {
        // 10:46 PM - 07:14 AM
        return "3";
      }
    };

    // Watch for changes in form.waktu and automatically set shift
    watch(
      () => form.waktu,
      (newTime) => {
        form.shift = determineShift(newTime);
      }
    );

    onMounted(() => {
      fetchReports();
      // fetchMachines()
    });

    const formatDateUTC = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 10);
    };

    const statusClass = (status) => {
      if (status === "Selesai")
        return "bg-green-200 text-green-800 font-semibold px-2 py-1 rounded";
      if (status === "Proses")
        return "bg-yellow-200 text-yellow-800 font-semibold px-2 py-1 rounded";
      if (status === "Pending")
        return "bg-orange-200 text-orange-800 font-semibold px-2 py-1 rounded";
      if (status === "New")
        return "bg-blue-200 text-blue-800 font-semibold px-2 py-1 rounded";
      return "bg-gray-200 text-gray-800 font-semibold px-2 py-1 rounded";
    };

    const hoveredAction = ref(null);

    return {
      form,
      machines,
      fetchReports,
      fetchMachines,
      reports,
      previewUrl,
      resetForm,
      handleSubmit,
      editReport,
      deleteReport,
      formatDateUTC,
      statusClass,
      showConfirm,
      reportIdToDelete,
      confirmDelete,
      hoveredAction,
      paginatedReports,
      reportSearch,
      reportSortKey,
      reportSortOrder,
      reportPage,
      reportPageSize,
      reportTotalPages,
      setReportSort,
      goToReportPage,
      filteredReports,
      sortedReports,
    };
  },
};
</script>

<style scoped>
.input {
  @apply w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200;
}
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-all duration-200;
}
.material-icons {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
</style>
