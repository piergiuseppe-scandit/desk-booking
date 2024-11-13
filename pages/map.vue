<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Office Map</h1>
    <OfficeMap />
  </div>
</template>

<script setup>
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);
</script>