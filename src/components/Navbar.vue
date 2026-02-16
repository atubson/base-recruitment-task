<template>
    <nav class="navbar">
        <div class="navbar_logo">
            <span class="navbar_logo-main-letter">T</span>ECH
        </div>
        <div class="navbar_links">
            <RouterLink to="/" :class="{ active: isActive('/') }">Zgłoszenia</RouterLink>
            <RouterLink to="/about" :class="{ active: isActive('/about') }">O nas</RouterLink>
        </div>
        <div class="navbar_user">
            <div class="navbar_user-avatar"><i class="fa-solid fa-circle-user"></i></div>
            <div class="navbar_user-name">John Doe</div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string): boolean => {
    return route.path === path
};
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $navbar-height;
    color: $white;
    background-color: $navbar-background;
    padding: 0 $navbar-padding-horizontal;
    &_logo {
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: 0;
        line-height: 150%;
    }
    &_logo-main-letter {
        color: $navbar-blue;
    }
    &_user {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 150%;
        &-avatar {
            font-size: 1.5rem;
        }
    }
    &_links {
        display: flex;
        align-items: center;
        gap: 24px;
        font-size: 1.1rem;
        font-weight: 700;
        color: $white;
        a {
            text-decoration: none;
            color: $white;
            &.active {
                color: $navbar-blue;
                position: relative;
                &.active::after {
                    content: '';
                    display: block;
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -6px;
                    height: 2px;
                    background: $navbar-blue;
                    border-radius: 10px;
                    width: 50%;
                    margin: 0 auto;
                }
            }
        }
    }
}
</style>