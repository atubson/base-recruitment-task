<template>
    <div class="ticket-details">
        <div v-if="loading" class="ticket-details_loading">
            <i class="fa-solid fa-spinner"></i>Wczytywanie danych
        </div>
        <template v-else-if="ticket">
            <div class="ticket-details_header">
                <RouterLink to="/" class="ticket-details_back">
                    <i class="fa-solid fa-arrow-left"></i> Wróć do zgłoszeń
                </RouterLink>
                <h2 class="ticket-details_title">Szczegóły zgłoszenia #{{ ticket.id }}</h2>
            </div>
            <div class="ticket-details_card">
                <dl class="ticket-details_list">
                    <div class="ticket-details_row">
                        <dt>Klient</dt>
                        <dd>{{ ticket.customerName }}</dd>
                    </div>
                    <div class="ticket-details_row">
                        <dt>Temat</dt>
                        <dd>{{ ticket.subject }}</dd>
                    </div>
                    <div class="ticket-details_row">
                        <dt>Opis</dt>
                        <dd>{{ ticket.description }}</dd>
                    </div>
                    <div class="ticket-details_row">
                        <dt>Priorytet</dt>
                        <dd>{{ getReadablePriority(ticket.priority) }}</dd>
                    </div>
                    <div class="ticket-details_row">
                        <dt>Status</dt>
                        <dd>
                            <template v-if="isEditingStatus">
                                <div class="ticket-details_status-edit">
                                    <Select
                                        v-model="selectedStatus"
                                        :options="statusOptions"
                                        placeholder="Status"
                                        :disabled="saving"
                                    />
                                    <button
                                        type="button"
                                        class="ticket-details_save"
                                        :disabled="saving || !hasStatusChanged"
                                        @click="saveStatus"
                                    >
                                        <i v-if="saving" class="fa-solid fa-spinner"></i>
                                        <span v-else>Zapisz</span>
                                    </button>
                                    <i
                                        class="fa-solid fa-xmark"
                                        @click="closedEditStatus"
                                    ></i>
                                </div>
                            </template>
                            <template v-else>
                                <span class="ticket-details_status-display">
                                    <span
                                        :class="[
                                            'ticket-details_status',
                                            `ticket-details_status-text-${getStatusClass(ticket.status)}`,
                                        ]"
                                    >
                                        {{ getReadableStatus(ticket.status) }}
                                    </span>
                                    <button
                                        type="button"
                                        class="ticket-details_edit-icon"
                                        aria-label="Zmień status"
                                        @click="isEditingStatus = true"
                                    >
                                        <i class="fa-solid fa-pencil"></i>
                                    </button>
                                </span>
                            </template>
                        </dd>
                    </div>
                    <div class="ticket-details_row">
                        <dt>Data utworzenia</dt>
                        <dd>{{ formattedDate }}</dd>
                    </div>
                </dl>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import type { ITicket } from '@/types'
import { useTicketStatus } from '@/composables/useTicketStatus'
import { useTicketPriority } from '@/composables/useTicketPriority'
import { TicketStatusEnum } from '@/enum/TicketStatusEnum'
import Select from '@/components/Select.vue'
import { useTicketsStore } from '@/stores/tickets'

const route = useRoute();
const router = useRouter();
const { getReadableStatus, getStatusClass } = useTicketStatus();
const { getReadablePriority } = useTicketPriority();
const ticketsStore = useTicketsStore();

const statusOptions = [
    { value: TicketStatusEnum.NEW, label: getReadableStatus(TicketStatusEnum.NEW) },
    { value: TicketStatusEnum.IN_PROGRESS, label: getReadableStatus(TicketStatusEnum.IN_PROGRESS) },
    { value: TicketStatusEnum.CLOSED, label: getReadableStatus(TicketStatusEnum.CLOSED) },
];

const ticket = ref<ITicket | undefined>(undefined)
const loading = ref(true)
const selectedStatus = ref<TicketStatusEnum>(TicketStatusEnum.NEW)
const saving = ref(false)
const isEditingStatus = ref(false)

const hasStatusChanged = computed(
    () => ticket.value && selectedStatus.value !== ticket.value.status,
);

const setTicketAndStatus = (value: ITicket | undefined) => {
    ticket.value = value
    if (value) selectedStatus.value = value.status
};

const saveStatus = async () => {
    if (!ticket.value || !hasStatusChanged.value) {
        isEditingStatus.value = false
        return
    }

    saving.value = true
    try {
        await ticketsStore.changeTicketStatus(ticket.value.id, selectedStatus.value)
        isEditingStatus.value = false;
        setTicketAndStatus(ticketsStore.currentTicket);
    } catch (error) {
        // TODO: Handle error
        console.error('Error saving status:', error);
    }
    saving.value = false;
};

const closedEditStatus = () => {
    isEditingStatus.value = false;
    setTicketAndStatus(ticketsStore.currentTicket);
};

onMounted(async () => {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) {
        router.replace({ name: 'not-found' })
        return
    }

    // If the current ticket is the same as the one we are viewing, use the current ticket from the store
    if (ticketsStore.currentTicket?.id === id) {
        setTicketAndStatus(ticketsStore.currentTicket)
        loading.value = false
        return
    }

    // Otherwise, fetch the ticket from the API
    loading.value = true
    const result = await ticketsStore.getCurrentTicket(id)
    loading.value = false
    if (result === undefined) {
        router.replace({ name: 'not-found' })
        return
    }

    setTicketAndStatus(result)
})

const formattedDate = computed(() => {
    if (!ticket.value) return ''

    try {
        return new Date(ticket.value.createdAt).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return ticket.value.createdAt
    }
})
</script>

<style lang="scss" scoped>
.ticket-details {
    height: 100%;
    padding: 0;

    &_loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        color: $text-black;
        font-size: 2rem;
        .fa-spinner {
            animation: spin 1s linear infinite;
            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            margin-right: 10px;
        }
    }

    &_header {
        margin-bottom: $h2-margin-bottom;
    }

    &_back {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: $main-blue;
        text-decoration: none;
        font-size: 0.9375rem;
        transition: opacity 0.2s;

        &:hover {
            opacity: 0.9;
        }
    }

    &_title {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: $text-black;
    }

    &_card {
        position: relative;
        background-color: $white;
        border-radius: $tickets-table-radius;
        border: 1px solid $tickets-table-border-color;
        padding: $tickets-table-padding-vertical $tickets-table-padding-horizontal;
    }

    &_status-edit {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        .fa-xmark {
            color: $icon-gray;
        }
    }

    &_status-display {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    &_edit-icon {
        padding: 0.25rem;
        border: none;
        background: none;
        color: $icon-gray;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: $main-blue;
        }
    }

    &_save {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        background-color: $main-blue;
        color: $white;
        font-size: 0.9375rem;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;

        &:hover:not(:disabled) {
            opacity: 0.9;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .fa-spinner {
            animation: spin 1s linear infinite;
        }
    }

    &_list {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    &_row {
        margin: 0;
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 1rem;
        align-items: start;

        dt {
            margin: 0;
            font-weight: 500;
            color: $icon-gray;
            font-size: 0.9375rem;
        }

        dd {
            margin: 0;
            color: $text-black;
            font-size: 1rem;
            line-height: 1.5;
        }
    }

    &_status {
        display: inline-block;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;

        &-text-new {
            color: $status-new;
        }

        &-text-inprogress {
            color: $status-in-progress;
        }

        &-text-closed {
            color: $status-closed;
        }
    }
}
</style>
