<template>
    <div class="tickets-table">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Klient</th>
                    <th>Temat</th>
                    <th>Status</th>
                    <th>Priorytet</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in props.tickets" :key="ticket.id">
                    <td>{{ ticket.id }}</td>
                    <td>{{ ticket.customerName }}</td>
                    <td>{{ ticket.subject }}</td>
                    <td><span :class="`tickets-table_status-text-${getStatusClass(ticket.status)}`">{{ getReadableStatus(ticket.status) }}</span></td>
                    <td>{{ getReadablePriority(ticket.priority) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { useTicketStatus } from '@/composables/useTicketStatus';
import { useTicketPriority } from '@/composables/useTicketPriority';
import type { ITicket } from '@/types';

const { getReadableStatus, getStatusClass } = useTicketStatus();
const { getReadablePriority } = useTicketPriority();

const props = defineProps<{
    tickets: ITicket[];
}>();
</script>

<style lang="scss" scoped>
.tickets-table {
    table {
        width: 100%;
        border-collapse: collapse;
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
}
</style>