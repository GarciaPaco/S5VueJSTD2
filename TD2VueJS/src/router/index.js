import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FicheMovie from "../views/FicheMovie.vue";
import Movie from "../views/Movie.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/fiche-movie/:movieId',
      name: 'FicheMovie',
      component: FicheMovie
    },
    {
      path: '/movie',
      name: 'movie',
      component: Movie
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
        path: '/actors',
        name: 'actors',
        component: () => import('../views/ActorsView.vue')
    },
    // {
    //     path: '/fiche-actor/:actorId',
    //     name: 'FicheActor',
    //     component: () => import('../views/FicheActor.vue')
    // },
    {
        path: '/category',
        name: 'category',
        component: () => import('../views/CategoryView.vue')
    }
  ]
})

export default router
