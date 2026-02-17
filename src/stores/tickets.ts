import { fetchTicketDetails, fetchTickets, updateTicketStatus } from '@/services/ticketService';
import type { ITicket } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';

export const useTicketsStore = defineStore('tickets', () => {
    // State
    const tickets = ref<ITicket[]>([]);
    const currentTicket = ref<ITicket | undefined>(undefined);

    // Getters
    const newTickets = computed(() => tickets.value.filter(ticket => ticket.status === TicketStatusEnum.NEW));
    const inProgressTickets = computed(() => tickets.value.filter(ticket => ticket.status === TicketStatusEnum.IN_PROGRESS));
    const closedTickets = computed(() => tickets.value.filter(ticket => ticket.status === TicketStatusEnum.CLOSED));

    // Actions
    /** Load tickets from API and set them as tickets. */
    const getTickets = async () => {
        try {
            const fetchedTickets = await fetchTickets();
            tickets.value = fetchedTickets;
        } catch (error) {
            // TODO: Handle error
            console.error('Error fetching tickets:', error);
        }
    }

    /** Update the status of a ticket and update the currentTicket if it was the one updated. */
    const changeTicketStatus = async (ticketId: number, newStatus: TicketStatusEnum) => {
        try {
            const updated = await updateTicketStatus(ticketId, newStatus);
            // If tickets are loaded, update the status of the ticket in the store
            if (updated && tickets.value.length > 0) {
                tickets.value = tickets.value.map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, status: newStatus }
                        : ticket
                );
            }
            
            // If the current ticket is the one we updated
            if (currentTicket.value?.id === ticketId) {
                currentTicket.value.status = newStatus;
            }
        } catch (error) {
            // TODO: Handle error
            console.error('Error updating ticket status:', error);
        }
    }

    /** Load a ticket by id (from API or from cache) and set it as currentTicket. */
    const getCurrentTicket = async (ticketId: number) => {
        try {
            const ticket = await fetchTicketDetails(ticketId);
            currentTicket.value = ticket ?? undefined;

            return currentTicket.value;
        } catch (error) {
            // TODO: Handle error
            console.error('Error fetching ticket:', error);
            return undefined;
        }
    };
    return {
        tickets,
        currentTicket,
        newTickets,
        inProgressTickets,
        closedTickets,
        getTickets,
        changeTicketStatus,
        getCurrentTicket,
    };
});
