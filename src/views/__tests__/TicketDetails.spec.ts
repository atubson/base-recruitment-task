import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setActivePinia, createPinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';
import TicketDetails from '../TicketDetails.vue';
import type { ITicket } from '@/types';
import { TicketPriorityEnum } from '@/enum/TicketPriorityEnum';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';
import { fetchTicketDetails, updateTicketStatus } from '@/services/ticketService';

vi.mock('@/services/ticketService', () => ({
    fetchTicketDetails: vi.fn(),
    updateTicketStatus: vi.fn(),
}));

const mockTicket: ITicket = {
    id: 1,
    customerName: 'Jan Kowalski',
    subject: 'Problem z logowaniem',
    description: 'Nie mogę się zalogować do systemu.',
    priority: TicketPriorityEnum.HIGH,
    status: TicketStatusEnum.NEW,
    createdAt: '2024-01-15T10:00:00Z',
};

const routes = [
    { path: '/', name: 'tickets', component: { template: '<div>Tickets</div>' } },
    {
        path: '/ticket/:id',
        name: 'ticket-details',
        component: TicketDetails,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: { template: '<div>Not Found</div>' },
    },
];

const createTestRouter = () => {
    return createRouter({
        history: createMemoryHistory(),
        routes,
    });
}

const createWrapper = (options: {
    routeId?: string;
    router?: ReturnType<typeof createTestRouter>;
    pinia?: ReturnType<typeof createPinia>;
} = {}) => {
    const router = options.router ?? createTestRouter();
    const pinia = options.pinia ?? createPinia();

    return mount(TicketDetails, {
        global: {
            plugins: [router, pinia],
            stubs: {
                RouterLink: {
                    template: '<a :href="typeof to === \'string\' ? to : to?.path"><slot /></a>',
                    props: ['to'],
                },
                Select: {
                    template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>',
                    props: ['modelValue', 'options', 'placeholder', 'disabled'],
                },
            },
        },
    });
}

describe('TicketDetails', () => {
    let router: ReturnType<typeof createTestRouter>;
    let pinia: ReturnType<typeof createPinia>;

    beforeEach(async () => {
        vi.mocked(fetchTicketDetails).mockResolvedValue(mockTicket);
        vi.mocked(updateTicketStatus).mockResolvedValue(true);
        pinia = createPinia();
        setActivePinia(pinia);
        router = createTestRouter();
        await router.push('/ticket/1');
        await router.isReady();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders loading state initially', () => {
            const wrapper = createWrapper({ router, pinia });

            expect(wrapper.find('.ticket-details_loading').exists()).toBe(true);
            expect(wrapper.text()).toContain('Wczytywanie danych');
        });

        it('renders ticket details after data is loaded', async () => {
            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            expect(wrapper.find('.ticket-details_loading').exists()).toBe(false);
            expect(wrapper.find('.ticket-details_header').exists()).toBe(true);
            expect(wrapper.find('.ticket-details_title').text()).toBe(
                'Szczegóły zgłoszenia #1'
            );
            expect(wrapper.find('.ticket-details_card').exists()).toBe(true);

            expect(wrapper.text()).toContain('Jan Kowalski');
            expect(wrapper.text()).toContain('Problem z logowaniem');
            expect(wrapper.text()).toContain('Nie mogę się zalogować do systemu.');
        });

        it('renders the back link to tickets list', async () => {
            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            const backLink = wrapper.find('.ticket-details_back');
            expect(backLink.exists()).toBe(true);
            expect(backLink.text()).toContain('Wróć do zgłoszeń');
            expect(backLink.attributes('href')).toBe('/');
        });

        it('renders formatted creation date', async () => {
            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            expect(wrapper.text()).toMatch(/\d{1,2}\s+\w+\s+\d{4}/);
        });
    });

    describe('navigation', () => {
        it('redirects to not-found when ticket id is invalid (NaN: non-numeric or missing route.params.id)', async () => {
            await router.push('/ticket/abc');
            await router.isReady();
            const replaceSpy = vi.spyOn(router, 'replace');

            createWrapper({ router, pinia });
            await flushPromises();

            expect(replaceSpy).toHaveBeenCalledWith({ name: 'not-found' });
        });

        it('redirects to not-found when ticket is not found', async () => {
            vi.mocked(fetchTicketDetails).mockResolvedValueOnce(undefined);
            await router.push('/ticket/999');
            await router.isReady();
            const replaceSpy = vi.spyOn(router, 'replace');

            createWrapper({ router, pinia });
            await flushPromises();

            expect(replaceSpy).toHaveBeenCalledWith({ name: 'not-found' });
        });
    });

    describe('onMounted', () => {
        it('uses currentTicket from store when it matches route id and skips getCurrentTicket', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.currentTicket = mockTicket;

            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            expect(fetchTicketDetails).not.toHaveBeenCalled();
            expect(wrapper.find('.ticket-details_title').text()).toBe(
                'Szczegóły zgłoszenia #1'
            );
        });

        it('fetches ticket via getCurrentTicket when store has no current ticket', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.currentTicket = undefined;

            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            expect(fetchTicketDetails).toHaveBeenCalledWith(1);
            expect(wrapper.find('.ticket-details_title').text()).toBe(
                'Szczegóły zgłoszenia #1'
            );
        });
    });

    describe('status editing', () => {
        it('shows status display by default', async () => {
            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            expect(wrapper.find('.ticket-details_status-display').exists()).toBe(
                true
            );
            expect(wrapper.find('.ticket-details_status-edit').exists()).toBe(
                false
            );
        });

        it('shows status edit form when edit icon is clicked', async () => {
            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            await wrapper.find('.ticket-details_edit-icon').trigger('click');

            expect(wrapper.find('.ticket-details_status-edit').exists()).toBe(
                true
            );
            expect(wrapper.find('.ticket-details_save').exists()).toBe(true);
        });

        it('calls changeTicketStatus and closes edit when Save is clicked', async () => {
            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            await wrapper.find('.ticket-details_edit-icon').trigger('click');
            await wrapper.vm.$nextTick();

            const select = wrapper.find('.ticket-details_status-edit select');
            await select.setValue(TicketStatusEnum.IN_PROGRESS);

            await wrapper.find('.ticket-details_save').trigger('click');
            await flushPromises();

            expect(updateTicketStatus).toHaveBeenCalledWith(
                1,
                TicketStatusEnum.IN_PROGRESS
            );
            expect(wrapper.find('.ticket-details_status-edit').exists()).toBe(
                false
            );
        });

        it('closes edit form when cancel icon is clicked', async () => {
            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            await wrapper.find('.ticket-details_edit-icon').trigger('click');
            expect(wrapper.find('.ticket-details_status-edit').exists()).toBe(
                true
            );

            await wrapper.find('.fa-xmark').trigger('click');

            expect(wrapper.find('.ticket-details_status-edit').exists()).toBe(
                false
            );
        });

        it('updates selectedStatus after changing and saving status with select', async () => {
            const { useTicketsStore } = await import('@/stores/tickets');
            const store = useTicketsStore();
            store.currentTicket = undefined;

            const wrapper = createWrapper({ router, pinia });
            await flushPromises();

            // Open edit, change status via select and save
            await wrapper.find('.ticket-details_edit-icon').trigger('click');
            await wrapper.vm.$nextTick();
            const select = wrapper.find('.ticket-details_status-edit select');
            await select.setValue(TicketStatusEnum.CLOSED);
            await wrapper.find('.ticket-details_save').trigger('click');
            await flushPromises();

            // Re-open edit and verify selectedStatus reflects the saved status
            await wrapper.find('.ticket-details_edit-icon').trigger('click');
            await wrapper.vm.$nextTick();
            const selectAfterSave = wrapper.find(
                '.ticket-details_status-edit select'
            );
            expect(
                (selectAfterSave.element as HTMLSelectElement).value
            ).toBe(TicketStatusEnum.CLOSED);
        });
    });

});
