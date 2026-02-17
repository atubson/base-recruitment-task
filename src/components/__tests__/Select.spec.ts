import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Select from '../Select.vue';

const defaultOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
];

function createWrapper(props = {}) {
    return mount(Select, {
        props: {
            options: defaultOptions,
            modelValue: '',
            ...props,
        },
    });
}

describe('Select', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('rendering', () => {
        it('renders with placeholder when no value selected', () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.select_value').text()).toBe('Wybierz...');
        });

        it('renders custom placeholder when provided', () => {
            const wrapper = createWrapper({ placeholder: 'Choose...' });

            expect(wrapper.find('.select_value').text()).toBe('Choose...');
        });

        it('renders selected option label when modelValue matches', () => {
            const wrapper = createWrapper({ modelValue: 'b' });

            expect(wrapper.find('.select_value').text()).toBe('Option B');
        });

        it('renders all options in dropdown when open', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.select_select-box').trigger('click');

            const items = wrapper.findAll('.select_item');
            expect(items).toHaveLength(3);
            expect(items[0]!.text()).toBe('Option A');
            expect(items[1]!.text()).toBe('Option B');
            expect(items[2]!.text()).toBe('Option C');
        });

        it('applies selected class to current modelValue option', async () => {
            const wrapper = createWrapper({ modelValue: 'b' });
            await wrapper.find('.select_select-box').trigger('click');

            const items = wrapper.findAll('.select_item');
            expect(items[1]!.classes()).toContain('select_item-selected');
        });
    });

    describe('dropdown toggle', () => {
        it('opens dropdown on select-box click', async () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.select_dropdown').exists()).toBe(false);

            await wrapper.find('.select_select-box').trigger('click');

            expect(wrapper.find('.select_dropdown').exists()).toBe(true);
        });

        it('closes dropdown when clicking select-box again', async () => {
            const wrapper = createWrapper();

            await wrapper.find('.select_select-box').trigger('click');
            expect(wrapper.find('.select_dropdown').exists()).toBe(true);

            await wrapper.find('.select_select-box').trigger('click');
            expect(wrapper.find('.select_dropdown').exists()).toBe(false);
        });

        it('does not open dropdown when disabled', async () => {
            const wrapper = createWrapper({ disabled: true });

            await wrapper.find('.select_select-box').trigger('click');

            expect(wrapper.find('.select_dropdown').exists()).toBe(false);
        });

        it('applies select_open class when dropdown is open', async () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.select').classes()).not.toContain('select_open');

            await wrapper.find('.select_select-box').trigger('click');
            expect(wrapper.find('.select').classes()).toContain('select_open');
        });

        it('applies select_disabled class when disabled', () => {
            const wrapper = createWrapper({ disabled: true });

            expect(wrapper.find('.select').classes()).toContain('select_disabled');
        });
    });

    describe('option selection', () => {
        it('emits update:modelValue when option is clicked', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.select_select-box').trigger('click');

            await wrapper.findAll('.select_item')[1]!.trigger('click');

            expect(wrapper.emitted('update:modelValue')).toEqual([['b']]);
        });

        it('closes dropdown after selecting option', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.select_select-box').trigger('click');

            await wrapper.findAll('.select_item')[0]!.trigger('click');

            expect(wrapper.find('.select_dropdown').exists()).toBe(false);
        });
    });

    describe('click outside', () => {
        it('closes dropdown when clicking outside', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.select_select-box').trigger('click');

            expect(wrapper.find('.select_dropdown').exists()).toBe(true);

            document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            await wrapper.vm.$nextTick();

            expect(wrapper.find('.select_dropdown').exists()).toBe(false);
        });

        it('keeps dropdown open when clicking inside', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.select_select-box').trigger('click');

            await wrapper.find('.select_item').trigger('click');

            expect(wrapper.find('.select_dropdown').exists()).toBe(false);
        });
    });

    describe('disabled state', () => {
        it('closes dropdown when disabled prop becomes true', async () => {
            const wrapper = createWrapper({ disabled: false });
            await wrapper.find('.select_select-box').trigger('click');

            expect(wrapper.find('.select_dropdown').exists()).toBe(true);

            await wrapper.setProps({ disabled: true });

            expect(wrapper.find('.select_dropdown').exists()).toBe(false);
        });
    });
});
