<template>
    <div>
        <NuxtLink to="/gatepass/spjm">ke spjm</NuxtLink>
        <h1>Counter: {{ counter }}</h1>
        <button @click="increment">Increment</button>
        <button @click="decrement">Decrement</button>
    </div>
</template>

<script setup>

const { counter, increment, decrement } = useCounter();
</script>