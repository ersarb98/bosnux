<template>
    <div>
      <Navbar @toggleSidenav="toggleSidenav" />
      <Sidenav :isOpen="isSidenavOpen" @toggleSidenav="toggleSidenav" />
      <div :class="isSidenavOpen ? 'ml-64' : 'ml-0'" class="transition-all duration-300 p-4">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const isSidenavOpen = ref(true)
  
  function toggleSidenav() {
    isSidenavOpen.value = !isSidenavOpen.value
  }
  </script>
  
  <style>
  /* Add any global styles if necessary */
  </style>
  