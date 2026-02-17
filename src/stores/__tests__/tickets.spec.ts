import { useTicketsStore } from '@/stores/tickets';
import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';
import { fetchTickets, fetchTicketDetails, updateTicketStatus } from '@/services/ticketService';

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
        fetchTicketDetails: vi.fn(async (id: number) => structuredClone(mockedTickets.find(t => t.id === id))),
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
        it('should update ticket status in list when API returns true and tickets are loaded', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            await ticketsStore.getTickets();

            // WHEN
            await ticketsStore.changeTicketStatus(1, TicketStatusEnum.IN_PROGRESS);

            // THEN
            expect(updateTicketStatus).toHaveBeenCalledWith(1, TicketStatusEnum.IN_PROGRESS);
            expect(ticketsStore.tickets[0]?.status).toBe(TicketStatusEnum.IN_PROGRESS);
            expect(ticketsStore.tickets[1]?.status).toBe(TicketStatusEnum.NEW);
        });

        it('should not update tickets list when API returns false', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            await ticketsStore.getTickets();
            vi.mocked(updateTicketStatus).mockResolvedValueOnce(false);

            // WHEN
            await ticketsStore.changeTicketStatus(1, TicketStatusEnum.IN_PROGRESS);

            // THEN
            expect(ticketsStore.tickets).toEqual(mockedTickets);
            expect(ticketsStore.tickets[0]?.status).toBe(TicketStatusEnum.NEW);
        });

        it('should not update tickets list when no tickets are loaded', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            // getTickets() not called - tickets list is empty

            // WHEN
            await ticketsStore.changeTicketStatus(1, TicketStatusEnum.IN_PROGRESS);

            // THEN
            expect(updateTicketStatus).toHaveBeenCalledWith(1, TicketStatusEnum.IN_PROGRESS);
            expect(ticketsStore.tickets).toEqual([]);
        });

        it('should update currentTicket when it is the ticket being updated', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            await ticketsStore.getCurrentTicket(1);

            // WHEN
            await ticketsStore.changeTicketStatus(1, TicketStatusEnum.IN_PROGRESS);

            // THEN
            expect(ticketsStore.currentTicket?.status).toBe(TicketStatusEnum.IN_PROGRESS);
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

    describe('getCurrentTicket', () => {
        it('should fetch ticket details and set currentTicket', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            const ticketId = 1;

            // WHEN
            const result = await ticketsStore.getCurrentTicket(ticketId);

            // THEN
            expect(fetchTicketDetails).toHaveBeenCalledWith(ticketId);
            expect(ticketsStore.currentTicket).toEqual(mockedTickets[0]);
            expect(result).toEqual(mockedTickets[0]);
        });

        it('should set currentTicket to undefined when ticket is not found', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            vi.mocked(fetchTicketDetails).mockResolvedValueOnce(undefined);

            // WHEN
            const result = await ticketsStore.getCurrentTicket(999);

            // THEN
            expect(ticketsStore.currentTicket).toBeUndefined();
            expect(result).toBeUndefined();
        });

        it('should log error and return undefined when fetching ticket details fails', async () => {
            // GIVEN
            const ticketsStore = useTicketsStore();
            const error = new Error('Error fetching ticket');
            vi.mocked(fetchTicketDetails).mockRejectedValueOnce(error);

            // WHEN
            const result = await ticketsStore.getCurrentTicket(1);

            // THEN
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching ticket:', error);
            expect(ticketsStore.currentTicket).toBeUndefined();
            expect(result).toBeUndefined();
        });
    });
});