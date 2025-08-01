import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ReportPage from '../pages/ReportPage.vue'
import RepairPage from '../pages/RepairPage.vue'
import ExportPage from '../pages/ExportPage.vue'
import TechnicianPage from '../pages/TechnicianPage.vue'
import ElectricalPage from '../pages/repair/ElectricalPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/report', component: ReportPage },
  { path: '/repair', component: RepairPage },
  { path: '/export', component: ExportPage },
  { path: '/technician', component: TechnicianPage },
  { path: '/repair/electrical', component: ElectricalPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 

