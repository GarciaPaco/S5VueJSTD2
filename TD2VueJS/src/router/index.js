import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FicheMovie from "../views/FicheMovie.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/fiche-movie/:movie',
      component: FicheMovie,
      name: 'fichemovie'
    },
  ]
})

export default router
