<template>
  <div
    :class="['fixed top-0 left-0 h-full bg-gray-800 text-white z-50 transition-transform transform', isOpen ? 'translate-x-0' : '-translate-x-full']"
    style="width: 250px;">
    <div class="flex items-center justify-center h-16">
      <h1 class="text-xl font-semibold">My App!</h1>
    </div>
    <div>
      <button @click="$emit('toggleSidenav')" class="text-white">
        ☰
      </button>
    </div>
    <nav class="flex-1">
      <ul>
        <li class="my-2">
          <nuxt-link to="/" class="block py-2 px-4 rounded hover:bg-gray-700">Home</nuxt-link>
        </li>
        <li class="my-2">
          <nuxt-link to="/about" class="block py-2 px-4 rounded hover:bg-gray-700">About</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>