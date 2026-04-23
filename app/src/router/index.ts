import { createRouter, createWebHistory } from 'vue-router'
import CandidatureDetailView from '../views/CandidatureDetailView.vue'
import CandidatureListView from '../views/CandidatureListView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'candidatures',
      component: CandidatureListView,
    },
    {
      path: '/candidatures/:id',
      name: 'candidature-detail',
      component: CandidatureDetailView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
