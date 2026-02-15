<script setup lang="ts">
import TicketsTable from '@/components/TicketsTable.vue';
import { useTicketsStore } from '@/stores/tickets';
import { onMounted } from 'vue';

const ticketsStore = useTicketsStore();

onMounted(() => {
    ticketsStore.getTickets();
});

</script>

<template>
    <main>
        <TicketsTable :tickets="ticketsStore.tickets" />
    </main>
</template>
