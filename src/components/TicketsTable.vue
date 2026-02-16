<template>
    <div class="tickets-table">
        <!-- Desktop: table view -->
        <table v-if="!props.loading" class="tickets-table_head tickets-table_desktop">
            <thead>
                <tr>
                    <th class="tickets-table_col-id">ID</th>
                    <th class="tickets-table_col-client">Klient</th>
                    <th class="tickets-table_col-topic">Temat</th>
                    <th class="tickets-table_col-status">Status</th>
                    <th class="tickets-table_col-priority">Priorytet</th>
                </tr>
            </thead>
        </table>
        <div v-if="!props.loading" class="tickets-table_body-scroll tickets-table_desktop">
            <table class="tickets-table_body">
                <tbody class="tickets-table_tbody">
                    <tr
                        v-for="(ticket, index) in props.tickets"
                        :key="`${ticket.id}-${index}`"
                        @click="handleTicketClick(ticket)"
                    >
                        <td class="tickets-table_col-id">{{ ticket.id }}</td>
                        <td class="tickets-table_col-client">{{ ticket.customerName }}</td>
                        <td class="tickets-table_col-topic">{{ ticket.subject }}</td>
                        <td class="tickets-table_col-status">
                            <span
                                :class="`tickets-table_status-text-${getStatusClass(ticket.status)}`"
                                >{{ getReadableStatus(ticket.status) }}</span
                            >
                        </td>
                        <td class="tickets-table_col-priority">
                            {{ getReadablePriority(ticket.priority) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile: card view (768px and less) -->
        <div v-if="!props.loading" class="tickets-table_cards">
            <div
                v-for="(ticket, index) in props.tickets"
                :key="`card-${ticket.id}-${index}`"
                class="tickets-table_card"
                @click="handleTicketClick(ticket.id)"
            >
                <div class="tickets-table_card-row">
                    <span class="tickets-table_card-label">ID</span>
                    <span class="tickets-table_card-value">{{ ticket.id }}</span>
                </div>
                <div class="tickets-table_card-row">
                    <span class="tickets-table_card-label">Klient</span>
                    <span class="tickets-table_card-value">{{ ticket.customerName }}</span>
                </div>
                <div class="tickets-table_card-row">
                    <span class="tickets-table_card-label">Temat</span>
                    <span class="tickets-table_card-value tickets-table_card-value--topic">{{
                        ticket.subject
                    }}</span>
                </div>
                <div class="tickets-table_card-row">
                    <span class="tickets-table_card-label">Status</span>
                    <span
                        :class="[
                            'tickets-table_card-value',
                            `tickets-table_status-text-${getStatusClass(ticket.status)}`,
                        ]"
                        >{{ getReadableStatus(ticket.status) }}</span
                    >
                </div>
                <div class="tickets-table_card-row">
                    <span class="tickets-table_card-label">Priorytet</span>
                    <span class="tickets-table_card-value">{{
                        getReadablePriority(ticket.priority)
                    }}</span>
                </div>
            </div>
        </div>
        <div v-if="props.loading" class="tickets-table_loading">
            <div class="tickets-table_loading-spinner">
                <i class="fa-solid fa-spinner"></i>Wczytywanie danych
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTicketStatus } from '@/composables/useTicketStatus'
import { useTicketPriority } from '@/composables/useTicketPriority'
import type { ITicket } from '@/types'
import { useTicketsStore } from '@/stores/tickets'

const router = useRouter()
const { getReadableStatus, getStatusClass } = useTicketStatus()
const { getReadablePriority } = useTicketPriority()
const ticketsStore = useTicketsStore();

const props = withDefaults(
    defineProps<{
        tickets: ITicket[]
        loading: boolean
    }>(),
    {
        loading: false,
    },
)

const handleTicketClick = (ticket: ITicket) => {
    ticketsStore.currentTicket = ticket;
    router.push({ name: 'ticket-details', params: { id: ticket.id } })
}
</script>

<style lang="scss" scoped>
.tickets-table {
    height: 100%;
    &_col-id {
        padding-left: $tickets-table-padding-horizontal;
        width: 80px;
    }
    &_col-client {
        width: 20%;
    }
    &_col-topic {
        width: 40%;
    }
    &_col-status {
        width: 20%;
    }
    &_col-priority {
        width: 20%;
    }
    &_body-scroll {
        overflow-y: auto;
        max-height: calc(100% - 37px - 35px);
        scrollbar-gutter: stable;
        &::-webkit-scrollbar {
            width: $scrollbar-width;
        }
    }

    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        th,
        td {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    &_head {
        padding-right: 15px;
        box-sizing: border-box;
        thead {
            background-color: $tickets-table-grey-background;
            th {
                padding: 10px;
                text-align: left;
                box-sizing: border-box;
                &:last-child {
                    padding-right: $tickets-table-padding-horizontal;
                }
                &:first-child {
                    padding-left: $tickets-table-padding-horizontal;
                }
            }
        }
    }

    &_body {
        tbody tr {
            cursor: pointer;
            transition: background-color 0.3s ease;
            &:hover {
                background-color: $tickets-table-grey-background;
            }
            td {
                border-bottom: 1px solid $tickets-table-row-border-color;
                border-top: 1px solid $tickets-table-row-border-color;
                padding: 10px;
                box-sizing: border-box;
                &:last-child {
                    padding-right: $tickets-table-padding-horizontal;
                }
                &:first-child {
                    padding-left: $tickets-table-padding-horizontal;
                }
            }
            &:last-child td {
                border-bottom: none;
            }
        }
    }

    &_status-text {
        &-new {
            color: $status-new;
        }
        &-inprogress {
            color: $status-in-progress;
        }
        &-closed {
            color: $status-closed;
        }
    }
    &_loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
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
        &-spinner {
            font-size: 2rem;
        }
    }

    // Mobile: cards (768px and less)
    &_cards {
        display: none;
        overflow-y: auto;
        max-height: calc(100% - 35px);
        scrollbar-gutter: stable;
        padding: 0 4px;
        &::-webkit-scrollbar {
            width: $scrollbar-width;
        }
    }

    &_card {
        background: $white;
        border-bottom: 1px solid $tickets-table-row-border-color;

        padding: 14px 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:last-child {
            margin-bottom: 0;
            border-bottom: none;
        }
        &:hover {
            background-color: $tickets-table-grey-background;
        }
    }

    &_card-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 8px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    &_card-label {
        flex-shrink: 0;
        font-weight: 600;
        color: $icon-gray;
        font-size: 0.875rem;
        min-width: 70px;
    }

    &_card-value {
        flex: 1;
        font-size: 0.875rem;
        word-break: break-word;
        &--topic {
            font-weight: 500;
        }
    }

    @media (max-width: 768px) {
        &_desktop {
            display: none !important;
        }
        &_cards {
            display: block;
        }
    }
}
</style>
