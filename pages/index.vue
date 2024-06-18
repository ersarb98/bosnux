<template>
  <div>
    Selamat Datang di aplikasi bos baru
    <NuxtLink to="/gatepass/spjm">ke spjm</NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});
</script>

<style lang="scss" scoped></style>