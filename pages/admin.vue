<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Desk Reservation Status</h1>

    <div class="mb-4 flex gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          v-model="startDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          v-model="endDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        />
      </div>
      <div class="flex items-end">
        <button
          @click="fetchStatus"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check Status
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="desk in deskStatus"
        :key="desk.id"
        class="border rounded-lg p-4"
        :class="{
          'bg-green-50': desk.status === 'free',
          'bg-red-50': desk.status === 'reserved'
        }"
      >
        <h3 class="font-semibold text-lg">{{ desk.label }}</h3>
        <div class="mt-2">
          <span
            v-for="tag in desk.tags"
            :key="tag"
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {{ tag }}
          </span>
        </div>
        <div class="mt-2">
          <span
            class="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2"
            :class="{
              'bg-green-200 text-green-800': desk.status === 'free',
              'bg-red-200 text-red-800': desk.status === 'reserved',
              'bg-gray-200 text-gray-800': desk.status === 'partial'
            }"
          >
            {{ desk.status }}
          </span>
        </div>
        <div v-if="desk.status !== 'free'" class="mt-2">
          <div v-for="reservation in desk.reservations" :key="reservation.id">
            <p class="text-sm text-gray-600">
              Reserved by: {{ reservation.username }}<br>
              {{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);
const deskStatus = ref([]);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};

const fetchStatus = async () => {
  try {
    const response = await $fetch(`/api/desks/status?startDate=${startDate.value}&endDate=${endDate.value}`);
    deskStatus.value = response;
  } catch (error) {
    console.error('Error fetching desk status:', error);
  }
};

// Fetch initial status
onMounted(() => {
  fetchStatus();
});
</script>