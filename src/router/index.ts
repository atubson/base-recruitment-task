import { createRouter, createWebHistory } from 'vue-router'
import TicketsView from '../views/Tickets.vue'
import TicketDetailsView from '../views/TicketDetails.vue'
import NotFoundView from '../views/NotFound.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'tickets',
            component: TicketsView,
        },
        {
            path: '/ticket/:id',
            name: 'ticket-details',
            component: TicketDetailsView,
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundView,
        },
    ],
})

export default router
