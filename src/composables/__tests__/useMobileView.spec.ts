import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useMobileView } from '../useMobileView';

function createTestComponent() {
    return defineComponent({
        setup() {
            const { isMobileView } = useMobileView();
            return { isMobileView };
        },
        render() {
            return h('div', { 'data-mobile': this.isMobileView });
        },
    });
}

describe('useMobileView', () => {
    let addEventListenerSpy: ReturnType<typeof vi.fn>;
    let removeEventListenerSpy: ReturnType<typeof vi.fn>;
    let changeCallback: ((e: MediaQueryListEvent) => void) | null = null;

    beforeEach(() => {
        changeCallback = null;
        addEventListenerSpy = vi.fn((_event: string, cb: (e: MediaQueryListEvent) => void) => {
            changeCallback = cb;
        });
        removeEventListenerSpy = vi.fn();

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn((query: string) => {
                expect(query).toBe('(max-width: 768px)');
                return {
                    matches: false,
                    addEventListener: addEventListenerSpy,
                    removeEventListener: removeEventListenerSpy,
                    dispatchEvent: vi.fn(),
                };
            }),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return isMobileView ref', () => {
        const wrapper = mount(createTestComponent());

        expect(wrapper.vm.isMobileView).toBe(false);
        expect(wrapper.get('[data-mobile]').attributes('data-mobile')).toBe('false');
    });

    it('should initially reflect matchMedia.matches when true', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn(() => ({
                matches: true,
                addEventListener: addEventListenerSpy,
                removeEventListener: removeEventListenerSpy,
                dispatchEvent: vi.fn(),
            })),
        });

        const wrapper = mount(createTestComponent());

        expect(wrapper.vm.isMobileView).toBe(true);
    });

    it('should register change listener on mount', () => {
        mount(createTestComponent());

        expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update isMobileView when media query change event fires', async () => {
        const wrapper = mount(createTestComponent());

        expect(wrapper.vm.isMobileView).toBe(false);

        expect(changeCallback).not.toBeNull();
        changeCallback!({ matches: true } as MediaQueryListEvent);

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.isMobileView).toBe(true);
    });

    it('should remove change listener on unmount', () => {
        const wrapper = mount(createTestComponent());

        wrapper.unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    });
});
