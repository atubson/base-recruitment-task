import { useTicketsStore } from '@/stores/tickets';
import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';
import { fetchTickets, updateTicketStatus } from '@/services/ticketService';

const mockedTickets = [
    {
        id: 1,
        customerName: 'John Doe',
        subject: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        customerName: 'Jane Doe',
        subject: 'Test Ticket 2',
        description: 'Test Description 2',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 3,
        customerName: 'John Doe',
        subject: 'Test Ticket 3',
        description: 'Test Description 3',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-01T00:00:00Z',
    },
];

describe('Tickets Store', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mock('@/services/ticketService', () => ({
        fetchTickets: vi.fn(async () => structuredClone(mockedTickets)),
        updateTicketStatus: vi.fn(async () => true),
    }));

    beforeEach(() => {
        vi.clearAllMocks();
        setActivePinia(createPinia());
    });

    afterAll(() => {
        consoleErrorSpy.mockReset();
    });

    describe('getTickets', () => {
        it('should fetch tickets', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
    
            // WHEN
            await ticketsStore.getTickets();
    
            // THEN
            expect(ticketsStore.tickets.length).toBe(mockedTickets.length);
            expect(ticketsStore.tickets).toEqual(mockedTickets);
            expect(fetchTickets).toHaveBeenCalled();
        });

        it('should log error when fetching tickets fails', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            vi.mocked(fetchTickets).mockRejectedValueOnce(new Error('Error fetching tickets'));

            // WHEN
            await ticketsStore.getTickets();
    
            // THEN
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching tickets:', new Error('Error fetching tickets'));
        });
    });

    describe('getters', () => {
        it('should return new tickets', () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            ticketsStore.tickets = mockedTickets;

            // WHEN
            const newTickets = ticketsStore.newTickets;

            // THEN
            expect(newTickets.length).toBe(2);
            expect(newTickets).toEqual([mockedTickets[0], mockedTickets[1]]);
        });

        it('should return in progress tickets', () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            ticketsStore.tickets = mockedTickets;

            // WHEN
            const inProgressTickets = ticketsStore.inProgressTickets;

            // THEN
            expect(inProgressTickets.length).toBe(0);
            expect(inProgressTickets).toEqual([]);
        });

        it('should return closed tickets', () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            ticketsStore.tickets = mockedTickets;
            
            // WHEN
            const closedTickets = ticketsStore.closedTickets;

            // THEN
            expect(closedTickets.length).toBe(1);
            expect(closedTickets).toEqual([mockedTickets[2]]);
        });
    });

    describe('changeTicketStatus', () => {
        it('should update ticket status', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            await ticketsStore.getTickets();
    
            // WHEN
            await ticketsStore.changeTicketStatus(1, TicketStatusEnum.IN_PROGRESS);
    
            // THEN
            expect(ticketsStore.tickets[0]?.status).toBe(TicketStatusEnum.IN_PROGRESS);
            expect(updateTicketStatus).toHaveBeenCalledWith(1, TicketStatusEnum.IN_PROGRESS);
        });

        it('should not update ticket status if ticket is not found', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            await ticketsStore.getTickets();
            
            // WHEN
            await ticketsStore.changeTicketStatus(100, TicketStatusEnum.IN_PROGRESS);
            
            // THEN
            expect(ticketsStore.tickets).toEqual(mockedTickets);
            expect(updateTicketStatus).toHaveBeenCalledWith(100, TicketStatusEnum.IN_PROGRESS);
        });

        it('should log error when updating ticket status fails', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            vi.mocked(updateTicketStatus).mockRejectedValueOnce(new Error('Error updating ticket status'));

            // WHEN
            await ticketsStore.changeTicketStatus(1, TicketStatusEnum.IN_PROGRESS);
    
            // THEN
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating ticket status:', new Error('Error updating ticket status'));
        });
    });
});