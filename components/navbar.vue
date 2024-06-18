<template>
  <nav class="bg-gray-800 p-4 flex justify-between items-center">
    <div class="text-white font-bold">My App Bruh</div>

    <div class="md:flex space-x-4">
      <button @click="$emit('toggleSidenav')" class="text-white">
        ☰
      </button>
      <nuxt-link to="/" class="text-white">Home</nuxt-link>
      <button @click="logout()" class="text-white">Logout</button>
    </div>
  </nav>
</template>

<script setup>
const logout = async () => {
  console.log('logged out')
}
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
