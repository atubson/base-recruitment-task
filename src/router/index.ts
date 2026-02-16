import { createRouter, createWebHistory } from 'vue-router'
import TicketsView from '../views/Tickets.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'tickets',
            component: TicketsView,
        },
    ],
})

export default router
