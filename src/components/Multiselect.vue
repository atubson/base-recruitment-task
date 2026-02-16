<template>
    <div :class="['multi-select', { 'multi-select_open': isOpen }]" ref="dropdown">
      <!-- Selected Display -->
        <div class="multi-select_select-box" @click="toggleDropdown">
            <span :class="['multi-select_value', { 'placeholder': !selectedOptions.length }]">
                {{ label }}
            </span>
            <span class="multi-select_arrow"><i class="fa-solid fa-angle-down"></i></span>
        </div>
        <!-- Dropdown -->
        <div v-if="isOpen" class="multi-select_dropdown">
            <label v-for="option in options" :key="option.value" class="multi-select_item">
                <input
                    type="checkbox"
                    :value="option.value"
                    v-model="internalValue"
                    class="multi-select_checkbox"
                />
                <span class="multi-select_label">
                    {{ option.label }}
                </span>
            </label>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
    options: {
        type: Array as PropType<{ label: string, value: string }[]>,
        required: true
    },
    modelValue: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    placeholder: {
        type: String,
        default: 'Select options'
    }
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
}>();

const isOpen = ref<boolean>(false)
const internalValue = ref<string[]>([...props.modelValue])
const dropdown = ref<HTMLElement | null>(null)

const selectedOptions = computed(() =>
    props.options.filter(option =>
        internalValue.value.includes(option.value)
    )
);

const label = computed(() => {
    if (selectedOptions.value.length) {
        return selectedOptions.value.map(o => o.label).join(', ')
    }
    return props.placeholder
});

watch(internalValue, (val) => {
    emit('update:modelValue', val)
});

watch(() => props.modelValue, (val) => {
    const current = internalValue.value;
    const same = current.length === val.length && current.every((v, i) => v === val[i]);
    if (!same) {
        internalValue.value = [...val];
    }
});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
};

const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        isOpen.value = false
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
});
</script>
  
<style lang="scss">
.multi-select {
    position: relative;
    &_open .multi-select_select-box {
        border-color: $main-blue;
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
        padding: $multiselect-padding-vertical;
        cursor: pointer;
        &:hover {
            background: #f5f5f5;
        }
    }
    &_checkbox {
        margin-right: 9px;
        border-width: 2px;
    }
    &_label {
        flex: 1;
    }
}
</style>
  