<template>
    <div class="not-found">
        <h1 class="not-found_code">404</h1>
        <h2 class="not-found_title">Strona nie została znaleziona</h2>
        <p class="not-found_text">
            Adres, którego szukasz, nie istnieje lub został przeniesiony.
        </p>
        <RouterLink to="/" class="not-found_link">Wróć do zgłoszeń</RouterLink>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style lang="scss" scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    text-align: center;
    padding: 2rem;

    &_code {
        margin: 0 0 0.5rem;
        font-size: 4rem;
        font-weight: 700;
        color: $main-blue;
        line-height: 1;
    }

    &_title {
        margin: 0 0 1rem;
        font-size: 1.5rem;
        font-weight: 500;
        color: $text-black;
    }

    &_text {
        margin: 0 0 1.5rem;
        color: $icon-gray;
        max-width: 320px;
    }

    &_link {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: $main-blue;
        color: $white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 500;
        transition: opacity 0.2s;

        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
