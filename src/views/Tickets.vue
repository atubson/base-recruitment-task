<template>
    <div class="tickets">
        <h2>Zgłoszenia</h2>
        <div class="tickets_table-container">
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
            <TicketsTable :tickets="filteredTickets" :loading="loading" />
        </div>
    </div>
</template>

<script setup lang="ts">
import TicketsTable from '@/components/TicketsTable.vue'
import Multiselect from '@/components/Multiselect.vue'
import { useTicketsStore } from '@/stores/tickets'
import { onMounted, ref, computed } from 'vue'
import { TicketStatusEnum } from '@/enum/TicketStatusEnum'
import type { ITicket } from '@/types'

const ticketsStore = useTicketsStore()
const filterStatusOptions = [
    { label: 'Nowe', value: TicketStatusEnum.NEW },
    { label: 'W trakcie', value: TicketStatusEnum.IN_PROGRESS },
    { label: 'Zamknięte', value: TicketStatusEnum.CLOSED },
]

const selectedStatus = ref<TicketStatusEnum[]>([])
const loading = ref<boolean>(false)

onMounted(async () => {
    if (ticketsStore.tickets.length > 0) {
        return
    }

    loading.value = true
    try {
        await ticketsStore.getTickets()
    } catch (error) {
        // TODO: Add error handling
        console.error('Error fetching tickets:', error);
    }
    loading.value = false;
})

const filteredTickets = computed<ITicket[]>(() => {
    if (selectedStatus.value.length === 0) {
        return ticketsStore.tickets
    }

    const tickets: ITicket[] = []
    if (selectedStatus.value.includes(TicketStatusEnum.NEW)) {
        tickets.push(...ticketsStore.newTickets)
    }
    if (selectedStatus.value.includes(TicketStatusEnum.IN_PROGRESS)) {
        tickets.push(...ticketsStore.inProgressTickets)
    }
    if (selectedStatus.value.includes(TicketStatusEnum.CLOSED)) {
        tickets.push(...ticketsStore.closedTickets)
    }

    return tickets.sort((a, b) => a.id - b.id)
})
</script>

<style lang="scss" scoped>
.tickets {
    height: 100%;
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
        padding: 0 $tickets-table-padding-horizontal;
        &-icon {
            font-size: 1.5rem;
            color: $icon-gray;
        }
        &-multiselect {
            @media (max-width: 480px) {
                flex-grow: 1;
            }
        }
    }
    .multi-select {
        width: 250px;
        @media (max-width: 480px) {
            width: 100%;
        }
    }
    &_table-container {
        height: calc(100% - 30px - 38px - $main-content-padding-vertical);
        background-color: $white;
        border-radius: $tickets-table-radius;
        border: 1px solid $tickets-table-border-color;
        padding: $tickets-table-padding-vertical 0;
        overflow: hidden;
    }
}
</style>
