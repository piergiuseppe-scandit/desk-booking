<template>
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold">Scandit Desks</NuxtLink>
      <div class="flex items-center gap-4">
        <NuxtLink to="/map" class="hover:text-gray-300">Office Map</NuxtLink>
        <NuxtLink to="/admin" class="hover:text-gray-300">Admin</NuxtLink>
        <button
          v-if="!currentUser"
          @click="showLoginModal = true"
          class="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          Login
        </button>
        <div v-else class="flex items-center gap-2">
          <img :src="currentUser.avatar" class="w-8 h-8 rounded-full" :alt="currentUser.name">
          <span>{{ currentUser.name }}</span>
          <button
            @click="logout"
            class="text-sm text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <LoginModal
      v-model="showLoginModal"
      @login="handleLogin"
    />
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const user = useState('user', () => null);
const showLoginModal = ref(false);
const currentUser = ref(null);

onMounted(() => {
  if (process.client) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      user.value = parsedUser;
      currentUser.value = parsedUser;
    }
  }
});

watch(user, (newValue) => {
  currentUser.value = newValue;
  if (process.client) {
    if (newValue) {
      localStorage.setItem('user', JSON.stringify(newValue));
    } else {
      localStorage.removeItem('user');
    }
  }
}, { deep: true });

const handleLogin = ({ username }) => {
  const newUser = {
    name: username,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username.charAt(0))}&size=32`
  };
  user.value = newUser;
  showLoginModal.value = false;
};

const logout = () => {
  user.value = null;
};
</script>