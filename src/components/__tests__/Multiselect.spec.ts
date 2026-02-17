import { describe, it, expect, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Multiselect from '../Multiselect.vue';

const defaultOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
];

function createWrapper(props: Record<string, unknown> = {}) {
    return mount(Multiselect, {
        props: {
            options: defaultOptions,
            modelValue: [],
            ...props,
        },
    });
}

describe('Multiselect', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('rendering', () => {
        it('renders with default placeholder when no value selected', () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.multi-select_value').text()).toBe('Select options');
        });

        it('renders custom placeholder when provided', () => {
            const wrapper = createWrapper({ placeholder: 'Choose options...' });

            expect(wrapper.find('.multi-select_value').text()).toBe('Choose options...');
        });

        it('renders single selected option label when one value selected', () => {
            const wrapper = createWrapper({ modelValue: ['b'] });

            expect(wrapper.find('.multi-select_value').text()).toBe('Option B');
        });

        it('renders comma-separated labels when multiple values selected', () => {
            const wrapper = createWrapper({ modelValue: ['a', 'c'] });

            expect(wrapper.find('.multi-select_value').text()).toBe('Option A, Option C');
        });

        it('renders all options as checkboxes in dropdown when open', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.multi-select_select-box').trigger('click');

            const items = wrapper.findAll('.multi-select_item');
            expect(items).toHaveLength(3);
            expect(items[0]!.text()).toContain('Option A');
            expect(items[1]!.text()).toContain('Option B');
            expect(items[2]!.text()).toContain('Option C');

            const checkboxes = wrapper.findAll('.multi-select_checkbox');
            expect(checkboxes).toHaveLength(3);
        });

        it('checks checkboxes for selected values when dropdown is open', async () => {
            const wrapper = createWrapper({ modelValue: ['a', 'c'] });
            await wrapper.find('.multi-select_select-box').trigger('click');

            const checkboxes = wrapper.findAll<HTMLInputElement>('input[type="checkbox"]');
            expect(checkboxes[0]!.element.checked).toBe(true);
            expect(checkboxes[1]!.element.checked).toBe(false);
            expect(checkboxes[2]!.element.checked).toBe(true);
        });

        it('applies placeholder class to value when nothing selected', () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.multi-select_value').classes()).toContain('placeholder');
        });

        it('does not apply placeholder class when options are selected', () => {
            const wrapper = createWrapper({ modelValue: ['a'] });

            expect(wrapper.find('.multi-select_value').classes()).not.toContain('placeholder');
        });
    });

    describe('dropdown toggle', () => {
        it('opens dropdown on select-box click', async () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(false);

            await wrapper.find('.multi-select_select-box').trigger('click');

            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(true);
        });

        it('closes dropdown when clicking select-box again', async () => {
            const wrapper = createWrapper();

            await wrapper.find('.multi-select_select-box').trigger('click');
            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(true);

            await wrapper.find('.multi-select_select-box').trigger('click');
            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(false);
        });

        it('applies multi-select_open class when dropdown is open', async () => {
            const wrapper = createWrapper();

            expect(wrapper.find('.multi-select').classes()).not.toContain('multi-select_open');

            await wrapper.find('.multi-select_select-box').trigger('click');
            expect(wrapper.find('.multi-select').classes()).toContain('multi-select_open');
        });

        it('keeps dropdown open when selecting an option', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.multi-select_select-box').trigger('click');

            await wrapper.findAll('.multi-select_item')[0]!.trigger('click');

            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(true);
        });
    });

    describe('option selection', () => {
        it('emits update:modelValue when first option is selected', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.multi-select_select-box').trigger('click');

            const checkbox = wrapper.find('input[value="a"]');
            await checkbox.setValue(true);

            expect(wrapper.emitted('update:modelValue')).toBeDefined();
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a']]);
        });

        it('emits update:modelValue with multiple values when multiple options selected', async () => {
            const wrapper = createWrapper({ modelValue: ['a'] });
            await wrapper.find('.multi-select_select-box').trigger('click');

            const checkboxB = wrapper.find('input[value="b"]');
            await checkboxB.setValue(true);

            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toBeDefined();
            const lastEmit = emitted!.at(-1)![0] as string[];
            expect(lastEmit).toContain('a');
            expect(lastEmit).toContain('b');
            expect(lastEmit).toHaveLength(2);
        });

        it('emits update:modelValue with reduced array when option is unchecked', async () => {
            const wrapper = createWrapper({ modelValue: ['a', 'b'] });
            await wrapper.find('.multi-select_select-box').trigger('click');

            const checkboxA = wrapper.find('input[value="a"]');
            await checkboxA.setValue(false);

            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toBeDefined();
            const lastEmit = emitted!.at(-1)![0] as string[];
            expect(lastEmit).toEqual(['b']);
        });
    });

    describe('modelValue sync', () => {
        it('updates displayed selection when modelValue prop changes', async () => {
            const wrapper = createWrapper({ modelValue: [] });

            expect(wrapper.find('.multi-select_value').text()).toBe('Select options');

            await wrapper.setProps({ modelValue: ['b'] });

            expect(wrapper.find('.multi-select_value').text()).toBe('Option B');
        });

        it('syncs internal state when modelValue is set from parent', async () => {
            const wrapper = createWrapper({ modelValue: ['a'] });
            await wrapper.find('.multi-select_select-box').trigger('click');

            expect((wrapper.find('input[value="a"]').element as HTMLInputElement).checked).toBe(true);

            await wrapper.setProps({ modelValue: [] });

            expect((wrapper.find('input[value="a"]').element as HTMLInputElement).checked).toBe(false);
        });
    });

    describe('click outside', () => {
        it('closes dropdown when clicking outside', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.multi-select_select-box').trigger('click');

            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(true);

            document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            await wrapper.vm.$nextTick();

            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(false);
        });

        it('keeps dropdown open when clicking inside the component', async () => {
            const wrapper = createWrapper();
            await wrapper.find('.multi-select_select-box').trigger('click');

            await wrapper.find('.multi-select_item').trigger('click');

            expect(wrapper.find('.multi-select_dropdown').exists()).toBe(true);
        });
    });
});
