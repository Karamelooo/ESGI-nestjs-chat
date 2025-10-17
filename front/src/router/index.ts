import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import NotFound from '@/pages/NotFound.vue'
import Wip from '@/pages/Wip.vue'
import Chat from '@/pages/Chat.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/app', name: 'app', component: Chat },
    { path: '/privacy', name: 'privacy', component: Wip },
    { path: '/terms', name: 'terms', component: Wip },
    { path: '/features', name: 'features', component: Wip },
    { path: '/preview', name: 'preview', component: Wip },
    { path: '/faq', name: 'faq', component: Wip },
    { path: '/404', name: 'not-found', component: NotFound },
    { path: '/wip', name: 'wip', component: Wip },
    { path: '/:pathMatch(.*)*', redirect: '/404' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
