<template>
  <div>
    <div class="mb-8 flex gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-500">Start Date</label>
        <input
          type="date"
          v-model="visualizationStartDate"
          class="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-500">End Date</label>
        <input
          type="date"
          v-model="visualizationEndDate"
          class="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-500">Floor</label>
        <select
          v-model="currentFloor"
          class="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        >
          <option v-for="floor in mapData?.floors" :key="floor.name" :value="floor">
            {{ floor.name }}
          </option>
        </select>
      </div>
    </div>


    <!-- Floor selector -->


    <div class="relative" :style="mapStyle">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center h-[400px]">
        <p class="text-gray-500">Loading office map...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex items-center justify-center h-[400px]">
        <p class="text-red-500">Failed to load office map</p>
      </div>

      <!-- Map container -->
      <div v-else class="relative border border-8 border-gray-300 bg-white" :style="floorStyle">
        <!-- Rooms -->
        <div v-for="room in currentFloor?.rooms" :key="room.name"
             :style="getRoomStyle(room)"
             class="absolute border border-gray-400">
          <!-- Room label -->
          <span :style="getRoomLabelStyle(room)" class="absolute text-sm font-medium">
            {{ room.name }}
          </span>
          <!-- Room desks -->
          <template v-if="room.type === 'meeting'">
            <div v-for="desk in room.desks" :key="desk.id"
                 @click="handleDeskClick(desk)"
                 :style="getDeskStyle(desk, room)"
                 :class="getDeskClass(desk.id)"
                 class="absolute cursor-pointer transition-colors duration-200">
              <div class="w-full h-full flex items-center justify-center">
                {{ desk.id }}
              </div>
            </div>
          </template>
        </div>

        <!-- Floor desks -->
        <div v-for="desk in currentFloor?.desks" :key="desk.id"
             @click="handleDeskClick(desk)"
             :style="getDeskStyle(desk)"
             :class="getDeskClass(desk.id)"
             class="absolute cursor-pointer transition-colors duration-200">
          <div class="w-full h-full flex items-center justify-center">
            {{ desk.id }}
          </div>
        </div>
      </div>

      <!-- Reservation modal -->
      <div v-if="selectedDesk"
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
        <div class="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 class="text-lg font-semibold mb-4">
            Desk {{ selectedDesk.id }}
          </h3>

          <template v-if="getDeskStatus(selectedDesk.id) === 'free'">
            <form @submit.prevent="handleReservation" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" v-model="reservationData.startDate" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" v-model="reservationData.endDate" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              </div>

              <!-- New group reservation section -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Group Reservation
                  <button type="button" @click="addGroupMember"
                          class="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                    Add Member
                  </button>
                </label>
                <div v-for="(member, index) in reservationData.groupMembers"
                     :key="index"
                     class="flex gap-2 mb-2">
                  <input type="text"
                         v-model="member.username"
                         placeholder="Username"
                         class="flex-1 rounded-md border-gray-300 shadow-sm">
                  <button type="button"
                          @click="removeGroupMember(index)"
                          class="px-2 py-1 text-red-500 hover:text-red-600">
                    ✕
                  </button>
                </div>
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" @click="closeModal"
                        class="px-4 py-2 border rounded hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit"
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Reserve
                </button>
              </div>
            </form>
          </template>

          <template v-else>
            <div class="space-y-2">
              <p class="font-medium">Current Reservations:</p>
              <div v-for="reservation in getDeskReservations(selectedDesk.id)"
                   :key="reservation.id"
                   class="p-2 bg-gray-50 rounded">
                <p>{{ reservation.username }}</p>
                <p class="text-sm text-gray-600">
                  {{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}
                </p>
              </div>
              <button @click="closeModal"
                      class="mt-4 px-4 py-2 border rounded hover:bg-gray-100 w-full">
                Close
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const mapData = ref(null);
const currentFloor = ref(null);
const selectedDesk = ref(null);
const deskStatus = ref([]);
const loading = ref(false);
const error = ref(null);
const visualizationStartDate = ref(new Date().toISOString().split('T')[0]);
const visualizationEndDate = ref(new Date().toISOString().split('T')[0]);
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);
const user = useState('user');

const reservationData = ref({
  startDate: startDate.value,
  endDate: endDate.value,
  groupMembers: []
});

// Map dimensions
const MAP_WIDTH = 800;
const mapStyle = computed(() => ({
  width: `${MAP_WIDTH}px`,
  margin: '0 auto'
}));

const floorStyle = computed(() => {
  if (!currentFloor.value) return {};
  return {
    width: '100%',
    height: `${MAP_WIDTH / currentFloor.value.width_height_ratio}px`
  };
});

// Load map data
onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch('/api/office-map');
    mapData.value = response;
    currentFloor.value = response.floors[0];
    await fetchDeskStatus();
  } catch (err) {
    console.error('Error loading office map:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});

// Fetch desk status
const fetchDeskStatus = async () => {
  try {
    const response = await $fetch(`/api/desks/status?startDate=${visualizationStartDate.value}&endDate=${visualizationEndDate.value}`);
    deskStatus.value = response;
  } catch (error) {
    console.error('Error fetching desk status:', error);
  }
};

// Style computations
const getRoomStyle = (room) => ({
  left: `${room.bounding_box.x_min * 100}%`,
  top: `${room.bounding_box.y_min * 100}%`,
  width: `${(room.bounding_box.x_max - room.bounding_box.x_min) * 100}%`,
  height: `${(room.bounding_box.y_max - room.bounding_box.y_min) * 100}%`,
  backgroundColor: room.color || 'transparent'
});

const getRoomLabelStyle = (room) => {
  if (room.type === 'meeting') {
    return {
      left: '4px',
      top: '4px'
    };
  }
  return {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  };
};

const getDeskStyle = (desk, room=null) => {
  if(room) {
    const scale_width = 1 / (room.bounding_box.x_max - room.bounding_box.x_min);
    const scale_height = 1 / (room.bounding_box.y_max - room.bounding_box.y_min);
    return {
      left: `${(desk.bounding_box.x_min - room.bounding_box.x_min) * scale_width * 100}%`,
      top: `${(desk.bounding_box.y_min - room.bounding_box.y_min) * scale_height * 100}%`,
      width: `${(desk.bounding_box.x_max - desk.bounding_box.x_min) * scale_width * 100}%`,
      height: `${(desk.bounding_box.y_max - desk.bounding_box.y_min) * scale_height * 100}%`
    };
  }
  return {
    left: `${desk.bounding_box.x_min * 100}%`,
    top: `${desk.bounding_box.y_min * 100}%`,
    width: `${(desk.bounding_box.x_max - desk.bounding_box.x_min) * 100}%`,
    height: `${(desk.bounding_box.y_max - desk.bounding_box.y_min) * 100}%`
  }};

const getDeskClass = (deskId) => {
  const status = getDeskStatus(deskId);
  return {
    'bg-green-200 hover:bg-green-300': status === 'free',
    'bg-red-200 hover:bg-red-300': status === 'reserved',
    'bg-gray-200 hover:bg-gray-300': status === 'partial'
  };
};

// Desk status helpers
const getDeskStatus = (deskId) => {
  const desk = deskStatus.value.find(d => d.id === deskId);
  if (!desk) return 'free';
  return desk.status;
};

const getDeskReservations = (deskId) => {
  const desk = deskStatus.value.find(d => d.id === deskId);
  return desk?.reservations || [];
};

// Event handlers
const handleDeskClick = (desk) => {
  if (!user.value) {
    alert('Please login to make reservations');
    return;
  }
  selectedDesk.value = desk;
};

const closeModal = () => {
  selectedDesk.value = null;
  reservationData.value = {
    startDate: startDate.value,
    endDate: endDate.value,
    groupMembers: []
  };
};

const handleReservation = async () => {
  if (!user.value) return;

  try {
    // Create main user reservation
    const reservations = [{
      username: user.value.name,
      deskId: selectedDesk.value.id,
      startDate: reservationData.value.startDate,
      endDate: reservationData.value.endDate
    }];

    // Add group member reservations with subsequent desk IDs
    reservationData.value.groupMembers.forEach((member, index) => {
      if (member.username.trim()) {
        reservations.push({
          username: member.username,
          deskId: selectedDesk.value.id + index + 1, // Increment desk ID for each member
          startDate: reservationData.value.startDate,
          endDate: reservationData.value.endDate
        });
      }
    });

    // Create all reservations
    await Promise.all(reservations.map(reservation =>
      $fetch('/api/reservations', {
        method: 'POST',
        body: reservation
      })
    ));

    await fetchDeskStatus();
    closeModal();
  } catch (error) {
    console.error('Error creating reservations:', error);
    alert('Failed to create reservations');
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};

// Watch for date changes
watch([visualizationStartDate, visualizationEndDate], async (newValues, oldValues) => {
  if (newValues !== oldValues) {
    await fetchDeskStatus();
  }
}, { immediate: true });

// Add new methods for group management
const addGroupMember = () => {
  reservationData.value.groupMembers.push({ username: '' });
};

const removeGroupMember = (index) => {
  reservationData.value.groupMembers.splice(index, 1);
};
</script>