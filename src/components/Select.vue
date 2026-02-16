<template>
    <div :class="['select', { 'select_open': isOpen, 'select_disabled': disabled }]" ref="dropdown">
        <div class="select_select-box" @click="toggleDropdown">
            <span :class="['select_value', { 'placeholder': !selectedLabel }]">
                {{ selectedLabel || placeholder }}
            </span>
            <span class="select_arrow"><i class="fa-solid fa-angle-down"></i></span>
        </div>
        <div v-if="isOpen" class="select_dropdown">
            <button
                v-for="option in options"
                :key="option.value"
                type="button"
                :class="['select_item', { 'select_item-selected': modelValue === option.value }]"
                @click="selectOption(option.value)"
            >
                {{ option.label }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
const props = withDefaults(
    defineProps<{
        options: { label: string; value: string }[];
        modelValue: string;
        placeholder?: string;
        disabled?: boolean;
    }>(),
    {
        placeholder: 'Wybierz...',
        disabled: false,
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const dropdown = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
    const option = props.options.find(o => o.value === props.modelValue);
    return option?.label ?? '';
});

function toggleDropdown() {
    if (props.disabled) return;
    isOpen.value = !isOpen.value;
}

function selectOption(value: string) {
    emit('update:modelValue', value);
    isOpen.value = false;
}

const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

watch(() => props.disabled, (disabled) => {
    if (disabled) isOpen.value = false;
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.select {
    position: relative;
    min-width: 140px;

    &_open &_select-box {
        border-color: $main-blue;
    }

    &_disabled &_select-box {
        opacity: 0.7;
        cursor: not-allowed;
    }

    &_select-box {
        border: $dropdown-border-width solid $icon-gray;
        border-radius: $dropdown-border-radius;
        padding: $multiselect-padding-vertical $multiselect-padding-horizontal;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: $white;
        gap: 8px;
    }

    &_value {
        color: $selected-text-color;
        font-size: 1rem;
        font-weight: 400;
        letter-spacing: 0.15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.placeholder {
            color: $placeholder-text-color;
        }
    }

    &_arrow {
        font-size: 1rem;
        color: $icon-gray;
    }

    &_dropdown {
        position: absolute;
        width: 100%;
        border: $dropdown-border-width solid $icon-gray;
        border-radius: $dropdown-overlay-border-radius;
        background: $white;
        max-height: $dropdown-overlay-max-height;
        overflow-y: auto;
        top: calc(100% + $dropdown-overlay-offset);
        left: 0;
        z-index: 10;
        padding: $multiselect-padding-vertical 0;
    }

    &_item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: $multiselect-padding-vertical $multiselect-padding-horizontal;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 400;
        color: $selected-text-color;
        text-align: left;

        &:hover {
            background: #f5f5f5;
        }

        &-selected {
            color: $main-blue;
            font-weight: 500;
        }
    }
}
</style>
