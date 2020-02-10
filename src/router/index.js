import Vue from 'vue'
import VueRouter from 'vue-router'
import Launcher from '../views/Launcher.vue'
import ReportEditor from '../views/ReportEditor.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Carndinal Launcher',
    component: Launcher
  },
  {
    path: '/report',
    name: 'Cardinal Report Editor',
    component: ReportEditor
  }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
});



export default router
