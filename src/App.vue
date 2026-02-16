<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

</script>

<template>
    <div class="main-container">
        <Navbar />
        <div class="main-container_content">
            <main>
                <RouterView />
            </main>
        </div>
    </div>
</template>

<style lang="scss">
body {
    margin: 0;
    padding: 0;
}

.main-container {
    font-family: 'Roboto', sans-serif;
    &_content {
        padding: $main-content-padding-vertical $main-content-padding-horizontal;
        height: calc(100vh - $navbar-height - ($main-content-padding-vertical * 2));
        background-color: $background-color;
    }
    main {
        height: 100%;
    }
    @media (max-width: 992px) {
        &_content {
            padding-left: $main-content-padding-vertical;
            padding-right: $main-content-padding-vertical;
        }
    }
}
</style>

