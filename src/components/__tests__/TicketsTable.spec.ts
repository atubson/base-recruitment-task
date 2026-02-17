import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setActivePinia, createPinia } from 'pinia';
import TicketsTable from '../TicketsTable.vue';
import type { ITicket } from '@/types';
import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';
import { useTicketsStore } from '@/stores/tickets';

const isMobileViewRef = ref(false);
vi.mock('@/composables/useMobileView', () => ({
    useMobileView: () => ({ isMobileView: isMobileViewRef }),
}));

const mockTickets: ITicket[] = [
    {
        id: 1,
        customerName: 'Jan Kowalski',
        subject: 'Problem z logowaniem',
        description: 'Nie mogę się zalogować.',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 2,
        customerName: 'Anna Nowak',
        subject: 'Błąd w raporcie',
        description: 'Raport nie generuje się poprawnie.',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-01-16T14:30:00Z',
    },
    {
        id: 3,
        customerName: 'Piotr Wiśniewski',
        subject: 'Zamknięte zgłoszenie',
        description: 'Sprawa zakończona.',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-14T09:00:00Z',
    },
];

const routes = [
    { path: '/', name: 'tickets', component: { template: '<div>Tickets</div>' } },
    { path: '/ticket/:id', name: 'ticket-details', component: { template: '<div>Ticket Details</div>' } },
];

function createTestRouter() {
    return createRouter({
        history: createMemoryHistory(),
        routes,
    });
}

function createWrapper(
    props: { tickets?: ITicket[]; loading?: boolean } = {},
    options: { router?: ReturnType<typeof createTestRouter>; pinia?: ReturnType<typeof createPinia> } = {},
) {
    const router = options.router ?? createTestRouter();
    const pinia = options.pinia ?? createPinia();
    return mount(TicketsTable, {
        props: {
            tickets: props.tickets ?? mockTickets,
            loading: props.loading ?? false,
        },
        global: {
            plugins: [router, pinia],
        },
    });
}

describe('TicketsTable', () => {
    let router: ReturnType<typeof createTestRouter>;
    let pinia: ReturnType<typeof createPinia>;

    beforeEach(async () => {
        isMobileViewRef.value = false; // Default: desktop view
        pinia = createPinia();
        setActivePinia(pinia);
        router = createTestRouter();
        await router.push('/');
        await router.isReady();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('rendering', () => {
        it('renders the table container', () => {
            const wrapper = createWrapper({}, { router, pinia });

            expect(wrapper.find('.tickets-table').exists()).toBe(true);
        });

        it('shows loading state when loading is true', () => {
            const wrapper = createWrapper({ tickets: [], loading: true }, { router, pinia });

            expect(wrapper.find('.tickets-table_loading').exists()).toBe(true);
            expect(wrapper.find('.tickets-table_loading-spinner').text()).toContain('Wczytywanie danych');
            expect(wrapper.find('.tickets-table_head').exists()).toBe(false);
            expect(wrapper.find('.tickets-table_body-scroll').exists()).toBe(false);
            expect(wrapper.find('.tickets-table_cards').exists()).toBe(false);
        });

        it('shows desktop table when loading is false and not mobile view', () => {
            isMobileViewRef.value = false;
            const wrapper = createWrapper({}, { router, pinia });

            expect(wrapper.find('.tickets-table_loading').exists()).toBe(false);
            expect(wrapper.find('.tickets-table_head').exists()).toBe(true);
            expect(wrapper.find('.tickets-table_body-scroll').exists()).toBe(true);
            expect(wrapper.find('.tickets-table_cards').exists()).toBe(false);
        });

        it('shows mobile cards when loading is false and mobile view', () => {
            isMobileViewRef.value = true;
            const wrapper = createWrapper({}, { router, pinia });

            expect(wrapper.find('.tickets-table_loading').exists()).toBe(false);
            expect(wrapper.find('.tickets-table_head').exists()).toBe(false);
            expect(wrapper.find('.tickets-table_body-scroll').exists()).toBe(false);
            expect(wrapper.find('.tickets-table_cards').exists()).toBe(true);
        });

        it('renders table header columns', () => {
            const wrapper = createWrapper({}, { router, pinia });

            const headers = wrapper.findAll('.tickets-table_head th');
            expect(headers).toHaveLength(5);
            expect(headers[0]!.text()).toBe('ID');
            expect(headers[1]!.text()).toBe('Klient');
            expect(headers[2]!.text()).toBe('Temat');
            expect(headers[3]!.text()).toBe('Status');
            expect(headers[4]!.text()).toBe('Priorytet');
        });

        it('renders a row for each ticket in desktop table', () => {
            const wrapper = createWrapper({}, { router, pinia });

            const rows = wrapper.find('.tickets-table_tbody').findAll('tr');
            expect(rows).toHaveLength(3);
        });

        it('renders ticket data in desktop table rows', () => {
            const wrapper = createWrapper({}, { router, pinia });

            const rows = wrapper.find('.tickets-table_tbody').findAll('tr');
            const firstRowCells = rows[0]!.findAll('td');

            expect(firstRowCells[0]!.text()).toBe('1');
            expect(firstRowCells[1]!.text()).toBe('Jan Kowalski');
            expect(firstRowCells[2]!.text()).toBe('Problem z logowaniem');
            expect(firstRowCells[3]!.text()).toBe('Nowe');
            expect(firstRowCells[4]!.text()).toBe('Wysoki');
        });

        it('renders correct status labels for all statuses', () => {
            const wrapper = createWrapper({}, { router, pinia });

            const rows = wrapper.find('.tickets-table_tbody').findAll('tr');
            expect(rows[0]!.findAll('td')[3]!.text()).toBe('Nowe');
            expect(rows[1]!.findAll('td')[3]!.text()).toBe('W trakcie');
            expect(rows[2]!.findAll('td')[3]!.text()).toBe('Zamknięte');
        });

        it('renders correct priority labels for all priorities', () => {
            const wrapper = createWrapper({}, { router, pinia });

            const rows = wrapper.find('.tickets-table_tbody').findAll('tr');
            expect(rows[0]!.findAll('td')[4]!.text()).toBe('Wysoki');
            expect(rows[1]!.findAll('td')[4]!.text()).toBe('Średni');
            expect(rows[2]!.findAll('td')[4]!.text()).toBe('Niski');
        });

        it('applies status class for styling', () => {
            const wrapper = createWrapper({}, { router, pinia });

            const rows = wrapper.find('.tickets-table_tbody').findAll('tr');
            const statusCell1 = rows[0]!.find('.tickets-table_status-text-new');
            const statusCell2 = rows[1]!.find('.tickets-table_status-text-inprogress');
            const statusCell3 = rows[2]!.find('.tickets-table_status-text-closed');

            expect(statusCell1.exists()).toBe(true);
            expect(statusCell2.exists()).toBe(true);
            expect(statusCell3.exists()).toBe(true);
        });

        it('renders empty table when tickets array is empty', () => {
            const wrapper = createWrapper({ tickets: [] }, { router, pinia });

            const rows = wrapper.find('.tickets-table_tbody').findAll('tr');
            expect(rows).toHaveLength(0);
        });

        it('renders card for each ticket in mobile cards section', () => {
            isMobileViewRef.value = true;
            const wrapper = createWrapper({}, { router, pinia });

            const cards = wrapper.findAll('.tickets-table_card');
            expect(cards).toHaveLength(3);
        });

        it('renders ticket data in card view', () => {
            isMobileViewRef.value = true;
            const wrapper = createWrapper({}, { router, pinia });

            const firstCard = wrapper.find('.tickets-table_card');
            const rows = firstCard.findAll('.tickets-table_card-row');

            expect(rows[0]!.find('.tickets-table_card-value').text()).toBe('1');
            expect(rows[1]!.find('.tickets-table_card-value').text()).toBe('Jan Kowalski');
            expect(rows[2]!.find('.tickets-table_card-value').text()).toBe('Problem z logowaniem');
            expect(rows[3]!.find('.tickets-table_card-value').text()).toBe('Nowe');
            expect(rows[4]!.find('.tickets-table_card-value').text()).toBe('Wysoki');
        });
    });

    describe('default props', () => {
        it('defaults loading to false when not provided', () => {
            const wrapper = createWrapper({ tickets: mockTickets }, { router, pinia });

            expect(wrapper.find('.tickets-table_loading').exists()).toBe(false);
            expect(wrapper.find('.tickets-table_head').exists()).toBe(true);
        });
    });

    describe('ticket click', () => {
        it('navigates to ticket-details and sets currentTicket when table row is clicked', async () => {
            const pushSpy = vi.spyOn(router, 'push');
            const wrapper = createWrapper({}, { router, pinia });
            const ticketsStore = useTicketsStore();

            const firstRow = wrapper.find('.tickets-table_tbody tr');
            await firstRow.trigger('click');

            expect(pushSpy).toHaveBeenCalledWith({ name: 'ticket-details', params: { id: 1 } });
            expect(ticketsStore.currentTicket).toEqual(mockTickets[0]);
        });

        it('navigates with correct id when second row is clicked', async () => {
            const pushSpy = vi.spyOn(router, 'push');
            const wrapper = createWrapper({}, { router, pinia });
            const ticketsStore = useTicketsStore();

            const rows = wrapper.find('.tickets-table_tbody').findAll('tr');
            await rows[1]!.trigger('click');

            expect(pushSpy).toHaveBeenCalledWith({ name: 'ticket-details', params: { id: 2 } });
            expect(ticketsStore.currentTicket).toEqual(mockTickets[1]);
        });

        it('navigates and sets currentTicket when card is clicked', async () => {
            isMobileViewRef.value = true;
            const pushSpy = vi.spyOn(router, 'push');
            const wrapper = createWrapper({}, { router, pinia });
            const ticketsStore = useTicketsStore();

            const cards = wrapper.findAll('.tickets-table_card');
            await cards[2]!.trigger('click');

            expect(pushSpy).toHaveBeenCalledWith({ name: 'ticket-details', params: { id: 3 } });
            expect(ticketsStore.currentTicket).toEqual(mockTickets[2]);
        });
    });
});
