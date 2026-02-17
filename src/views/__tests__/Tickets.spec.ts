import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';
import Tickets from '../Tickets.vue';
import type { ITicket } from '@/types';
import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';
import { fetchTickets } from '@/services/ticketService';

vi.mock('@/services/ticketService', () => ({
    fetchTickets: vi.fn(),
}));

const mockTickets: ITicket[] = [
    {
        id: 1,
        customerName: 'Jan Kowalski',
        subject: 'Problem z logowaniem',
        description: 'Opis 1',
        priority: TicketPriorityEnum.HIGH,
        status: TicketStatusEnum.NEW,
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 2,
        customerName: 'Anna Nowak',
        subject: 'Błąd w formularzu',
        description: 'Opis 2',
        priority: TicketPriorityEnum.MEDIUM,
        status: TicketStatusEnum.IN_PROGRESS,
        createdAt: '2024-01-16T10:00:00Z',
    },
    {
        id: 3,
        customerName: 'Piotr Wiśniewski',
        subject: 'Zamknięta sprawa',
        description: 'Opis 3',
        priority: TicketPriorityEnum.LOW,
        status: TicketStatusEnum.CLOSED,
        createdAt: '2024-01-17T10:00:00Z',
    },
];

const createWrapper = (options: { pinia?: ReturnType<typeof createPinia> } = {}) => {
    const pinia = options.pinia ?? createPinia();

    return mount(Tickets, {
        global: {
            plugins: [pinia],
            stubs: {
                Multiselect: {
                    name: 'Multiselect',
                    template: `
                        <div class="multiselect-stub">
                            <select
                                multiple
                                :value="JSON.stringify(modelValue || [])"
                                data-testid="status-multiselect"
                                @change="onChange"
                            >
                                <option
                                    v-for="opt in options"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                        </div>
                    `,
                    props: ['modelValue', 'options', 'placeholder'],
                    emits: ['update:modelValue'],
                    setup(props, { emit }) {
                        return {
                            onChange(e: Event) {
                                const select = e.target as HTMLSelectElement;
                                const selected = Array.from(select.selectedOptions, (o) => o.value);
                                emit('update:modelValue', selected);
                            },
                        };
                    },
                },
                TicketsTable: {
                    name: 'TicketsTable',
                    template:
                        '<div class="tickets-table-stub" :data-loading="loading" :data-tickets-count="tickets.length"></div>',
                    props: ['tickets', 'loading'],
                },
            },
        },
    });
};

describe('Tickets', () => {
    let pinia: ReturnType<typeof createPinia>;

    beforeEach(() => {
        vi.mocked(fetchTickets).mockResolvedValue(mockTickets);
        pinia = createPinia();
        setActivePinia(pinia);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders the heading "Zgłoszenia"', () => {
            const wrapper = createWrapper({ pinia });

            expect(wrapper.find('h2').text()).toBe('Zgłoszenia');
        });

        it('renders the tickets container and filter section', () => {
            const wrapper = createWrapper({ pinia });

            expect(wrapper.find('.tickets').exists()).toBe(true);
            expect(wrapper.find('.tickets_table-container').exists()).toBe(true);
            expect(wrapper.find('.tickets_list-filters').exists()).toBe(true);
            expect(wrapper.find('.tickets_list-filters-icon').exists()).toBe(true);
        });

        it('renders Multiselect with status filter placeholder', () => {
            const wrapper = createWrapper({ pinia });
            const multiselect = wrapper.findComponent({ name: 'Multiselect' });

            expect(multiselect.exists()).toBe(true);
            expect(multiselect.props('placeholder')).toBe('Wybierz status');
        });

        it('renders TicketsTable', () => {
            const wrapper = createWrapper({ pinia });

            expect(wrapper.find('.tickets-table-stub').exists()).toBe(true);
        });
    });

    describe('onMounted', () => {
        it('fetches tickets when store is empty', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            expect(store.tickets).toEqual([]);

            createWrapper({ pinia });
            await flushPromises();

            expect(fetchTickets).toHaveBeenCalledTimes(1);
        });

        it('does not fetch tickets when store already has tickets', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.tickets = [...mockTickets];

            createWrapper({ pinia });
            await flushPromises();

            expect(fetchTickets).not.toHaveBeenCalled();
        });

        it('passes loading state to TicketsTable while fetching', async () => {
            let resolveFetch: (value: ITicket[]) => void;
            vi.mocked(fetchTickets).mockImplementation(
                () =>
                    new Promise((resolve) => {
                        resolveFetch = resolve;
                    })
            );

            const wrapper = createWrapper({ pinia });
            await wrapper.vm.$nextTick();

            const tableStub = wrapper.find('.tickets-table-stub');
            expect(tableStub.attributes('data-loading')).toBe('true');

            resolveFetch!(mockTickets);
            await flushPromises();

            expect(wrapper.find('.tickets-table-stub').attributes('data-loading')).toBe('false');
        });
    });

    describe('filtering', () => {
        it('passes all tickets to TicketsTable when no status filter is selected', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.tickets = [...mockTickets];

            const wrapper = createWrapper({ pinia });
            await flushPromises();

            const tableStub = wrapper.findComponent({ name: 'TicketsTable' });
            expect(tableStub.props('tickets')).toEqual(mockTickets);
            expect(tableStub.props('tickets')).toHaveLength(3);
        });

        it('passes only new tickets when NEW status is selected', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.tickets = [...mockTickets];

            const wrapper = createWrapper({ pinia });
            await flushPromises();

            const multiselect = wrapper.findComponent({ name: 'Multiselect' });
            await multiselect.vm.$emit('update:modelValue', [TicketStatusEnum.NEW]);

            await wrapper.vm.$nextTick();

            const tableStub = wrapper.findComponent({ name: 'TicketsTable' });
            const passedTickets = tableStub.props('tickets') as ITicket[];
            expect(passedTickets).toHaveLength(1);
            expect(passedTickets[0]!.status).toBe(TicketStatusEnum.NEW);
            expect(passedTickets[0]!.id).toBe(1);
        });

        it('passes only in-progress tickets when IN_PROGRESS status is selected', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.tickets = [...mockTickets];

            const wrapper = createWrapper({ pinia });
            await flushPromises();

            const multiselect = wrapper.findComponent({ name: 'Multiselect' });
            await multiselect.vm.$emit('update:modelValue', [TicketStatusEnum.IN_PROGRESS]);

            await wrapper.vm.$nextTick();

            const tableStub = wrapper.findComponent({ name: 'TicketsTable' });
            const passedTickets = tableStub.props('tickets') as ITicket[];
            expect(passedTickets).toHaveLength(1);
            expect(passedTickets[0]!.status).toBe(TicketStatusEnum.IN_PROGRESS);
            expect(passedTickets[0]!.id).toBe(2);
        });

        it('passes only closed tickets when CLOSED status is selected', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.tickets = [...mockTickets];

            const wrapper = createWrapper({ pinia });
            await flushPromises();

            const multiselect = wrapper.findComponent({ name: 'Multiselect' });
            await multiselect.vm.$emit('update:modelValue', [TicketStatusEnum.CLOSED]);

            await wrapper.vm.$nextTick();

            const tableStub = wrapper.findComponent({ name: 'TicketsTable' });
            const passedTickets = tableStub.props('tickets') as ITicket[];
            expect(passedTickets).toHaveLength(1);
            expect(passedTickets[0]!.status).toBe(TicketStatusEnum.CLOSED);
            expect(passedTickets[0]!.id).toBe(3);
        });

        it('passes multiple statuses and sorts filtered tickets by id', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.tickets = [...mockTickets];

            const wrapper = createWrapper({ pinia });
            await flushPromises();

            const multiselect = wrapper.findComponent({ name: 'Multiselect' });
            await multiselect.vm.$emit('update:modelValue', [
                TicketStatusEnum.CLOSED,
                TicketStatusEnum.NEW,
            ]);

            await wrapper.vm.$nextTick();

            const tableStub = wrapper.findComponent({ name: 'TicketsTable' });
            const passedTickets = tableStub.props('tickets') as ITicket[];
            expect(passedTickets).toHaveLength(2);
            expect(passedTickets[0]!.id).toBe(1);
            expect(passedTickets[1]!.id).toBe(3);
        });
    });
});
