import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NotFound from '../NotFound.vue';

const createWrapper = () => {
    return mount(NotFound, {
        global: {
            stubs: {
                RouterLink: {
                    template: '<a :href="to"><slot /></a>',
                    props: ['to'],
                },
            },
        },
    });
};

describe('NotFound', () => {
    describe('rendering', () => {
        it('renders the not-found container', () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.not-found').exists()).toBe(true);
        });

        it('renders 404 code', () => {
            const wrapper = createWrapper();

            const code = wrapper.find('.not-found_code');
            expect(code.exists()).toBe(true);
            expect(code.text()).toBe('404');
        });

        it('renders the title "Strona nie została znaleziona"', () => {
            const wrapper = createWrapper();

            const title = wrapper.find('.not-found_title');
            expect(title.exists()).toBe(true);
            expect(title.text()).toBe('Strona nie została znaleziona');
        });

        it('renders the description text', () => {
            const wrapper = createWrapper();

            const text = wrapper.find('.not-found_text');
            expect(text.exists()).toBe(true);
            expect(text.text()).toBe(
                'Adres, którego szukasz, nie istnieje lub został przeniesiony.'
            );
        });

        it('renders the back link with correct text', () => {
            const wrapper = createWrapper();

            const link = wrapper.find('.not-found_link');
            expect(link.exists()).toBe(true);
            expect(link.text()).toBe('Wróć do zgłoszeń');
        });
    });

    describe('RouterLink', () => {
        it('links to home route (/)', () => {
            const wrapper = createWrapper();

            const link = wrapper.find('.not-found_link');
            expect(link.exists()).toBe(true);
            expect(link.attributes('href')).toBe('/');
        });
    });
});
