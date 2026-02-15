import { mockedTickets } from '@/mockData/tickets';
import type { ITicket } from '@/types';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate API call to fetch tickets
/**
 * Send request to fetch tickets
 * @returns List of tickets
 */
export async function fetchTickets(): Promise<ITicket[]> {
    // Simulate Response Delay
    await delay(2000);
    return mockedTickets;
};

// Simulate API call to update ticket status
/**
 * Send request to update ticket status
 * @param ticketId - The ID of the ticket to update
 * @param newStatus - The new status of the ticket
 * @returns True if the ticket status was updated successfully, false otherwise
 */
export async function updateTicketStatus(ticketId: number, newStatus: TicketStatusEnum): Promise<boolean> {
    console.log(`Ticket ${ticketId} status updated to ${newStatus}`);
    // Simulate Response Delay
    await delay(1000);
    return true;
};