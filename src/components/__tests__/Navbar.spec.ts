import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import Navbar from '../Navbar.vue';

const routes = [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
    { path: '/ticket/:id', name: 'ticket', component: { template: '<div>Ticket</div>' } },
];

const createTestRouter = () => {
    return createRouter({
        history: createMemoryHistory(),
        routes,
    });
}

const createWrapper = (router = createTestRouter()) => {
    return mount(Navbar, {
        global: {
            plugins: [router],
        },
    });
}

describe('Navbar', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders the navbar element', async () => {
            const router = createTestRouter();
            await router.push('/');
            await router.isReady();
            const wrapper = createWrapper(router);

            expect(wrapper.find('.navbar').exists()).toBe(true);
        });

        it('renders the logo with main letter T and TECH text', async () => {
            const router = createTestRouter();
            await router.push('/');
            await router.isReady();
            const wrapper = createWrapper(router);

            const logo = wrapper.find('.navbar_logo');
            expect(logo.exists()).toBe(true);
            expect(logo.find('.navbar_logo-main-letter').text()).toBe('T');
            expect(logo.text()).toContain('ECH');
        });

        it('renders navigation links', async () => {
            const router = createTestRouter();
            await router.push('/');
            await router.isReady();
            const wrapper = createWrapper(router);

            const links = wrapper.find('.navbar_links');
            expect(links.exists()).toBe(true);

            const linkElements = links.findAll('a');
            expect(linkElements).toHaveLength(2);
            expect(linkElements[0]!.text()).toBe('Zgłoszenia');
            expect(linkElements[1]!.text()).toBe('O nas');
        });

        it('renders user section with avatar and name', async () => {
            const router = createTestRouter();
            await router.push('/');
            await router.isReady();
            const wrapper = createWrapper(router);

            const userSection = wrapper.find('.navbar_user');
            expect(userSection.exists()).toBe(true);
            expect(userSection.find('.navbar_user-avatar').exists()).toBe(true);
            expect(userSection.find('.navbar_user-name').text()).toBe('John Doe');
        });
    });

    describe('active link state', () => {
        it('applies active class to Zgłoszenia link when route is /', async () => {
            const router = createTestRouter();
            await router.push('/');
            await router.isReady();
            const wrapper = createWrapper(router);

            const links = wrapper.find('.navbar_links').findAll('a');
            const zgłoszeniaLink = links.find((el) => el.text() === 'Zgłoszenia')!;

            expect(zgłoszeniaLink.classes()).toContain('active');
        });

        it('does not apply active class to O nas link when route is /', async () => {
            const router = createTestRouter();
            await router.push('/');
            await router.isReady();
            const wrapper = createWrapper(router);

            const links = wrapper.find('.navbar_links').findAll('a');
            const oNasLink = links.find((el) => el.text() === 'O nas')!;

            expect(oNasLink.classes()).not.toContain('active');
        });

        it('applies active class to O nas link when route is /about', async () => {
            const router = createTestRouter();
            await router.push('/about');
            await router.isReady();
            const wrapper = createWrapper(router);

            const links = wrapper.find('.navbar_links').findAll('a');
            const oNasLink = links.find((el) => el.text() === 'O nas')!;

            expect(oNasLink.classes()).toContain('active');
        });

        it('does not apply active class to Zgłoszenia link when route is /about', async () => {
            const router = createTestRouter();
            await router.push('/about');
            await router.isReady();
            const wrapper = createWrapper(router);

            const links = wrapper.find('.navbar_links').findAll('a');
            const zgłoszeniaLink = links.find((el) => el.text() === 'Zgłoszenia')!;

            expect(zgłoszeniaLink.classes()).not.toContain('active');
        });

        it('applies no active class when route does not match any link', async () => {
            const router = createTestRouter();
            await router.push('/ticket/123');
            await router.isReady();
            const wrapper = createWrapper(router);

            const links = wrapper.find('.navbar_links').findAll('a');

            expect(links[0]!.classes()).not.toContain('active');
            expect(links[1]!.classes()).not.toContain('active');
        });
    });
});
