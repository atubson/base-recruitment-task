<template>
    <div class="tickets">
        <h2>Zgłoszenia</h2>
        <div class="tickets_list-filters">
            <div class="tickets_list-filters-icon"><i class="fa-solid fa-filter"></i></div>
            <div class="tickets_list-filters-multiselect">
                <Multiselect
                    v-model="selectedStatus"
                    placeholder="Wybierz status"
                    :options="filterStatusOptions"
                />
            </div>
        </div>
        <TicketsTable :tickets="filteredTickets" />
    </div>
</template>

<script setup lang="ts">
import TicketsTable from '@/components/TicketsTable.vue';
import Multiselect from '@/components/Multiselect.vue';
import { useTicketsStore } from '@/stores/tickets';
import { onMounted, ref, computed } from 'vue';
import { TicketStatusEnum } from '@/enum/TicketStatusEnum';
import type { ITicket } from '@/types';

const ticketsStore = useTicketsStore();
const filterStatusOptions = [
    { label: 'Nowe', value: TicketStatusEnum.NEW },
    { label: 'W trakcie', value: TicketStatusEnum.IN_PROGRESS },
    { label: 'Zamknięte', value: TicketStatusEnum.CLOSED },
];

const selectedStatus = ref<TicketStatusEnum[]>([]);

onMounted(() => {
    ticketsStore.getTickets();
});

const filteredTickets = computed<ITicket[]>(() => {
    if (selectedStatus.value.length === 0) {
        return ticketsStore.tickets;
    }

    const tickets = [];
    if (selectedStatus.value.includes(TicketStatusEnum.NEW)) {
        tickets.push(...ticketsStore.newTickets);
    }
    if (selectedStatus.value.includes(TicketStatusEnum.IN_PROGRESS)) {
        tickets.push(...ticketsStore.inProgressTickets);
    }
    if (selectedStatus.value.includes(TicketStatusEnum.CLOSED)) {
        tickets.push(...ticketsStore.closedTickets);
    }

    return tickets.sort((a, b) => a.id - b.id);
});

</script>

<style lang="scss" scoped>
.tickets {
    h2 {
        margin-top: 0;
        margin-bottom: $h2-margin-bottom;
        font-size: 2rem;
        font-weight: 700;
        color: $text-black;
    }
    &_list-filters {
        display: flex;
        align-items: center;
        gap: $home-list-filters-gap;
        margin-bottom: $home-list-filters-margin-bottom;
        &-icon {
            font-size: 1.5rem;
            color: $icon-gray;
        }
    }
    .multi-select {
        width: 250px;
    }
}
</style>