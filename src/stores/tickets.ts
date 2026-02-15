import { fetchTickets, updateTicketStatus } from '@/services/ticketService';
import type { ITicket } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';

export const useTicketsStore = defineStore('tickets', () => {
    // State
    const tickets = ref<ITicket[]>([]);

    // Getters
    const newTickets = computed(() => tickets.value.filter(ticket => ticket.status === TicketStatusEnum.NEW));
    const inProgressTickets = computed(() => tickets.value.filter(ticket => ticket.status === TicketStatusEnum.IN_PROGRESS));
    const closedTickets = computed(() => tickets.value.filter(ticket => ticket.status === TicketStatusEnum.CLOSED));

    // Actions
    const getTickets = async () => {
        try {
            const fetchedTickets = await fetchTickets();
            tickets.value = fetchedTickets;
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    const changeTicketStatus = async (ticketId: number, newStatus: TicketStatusEnum) => {
        try {
            const updated = await updateTicketStatus(ticketId, newStatus);
            if (updated) {
                const updatedTicket = tickets.value.find(ticket => ticket.id === ticketId);
                if (updatedTicket) {
                    updatedTicket.status = newStatus;
                }
            }

        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    }

    return {
        tickets,
        newTickets,
        inProgressTickets,
        closedTickets,
        getTickets,
        changeTicketStatus,
    };
});