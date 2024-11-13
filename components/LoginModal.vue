<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Login</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="username">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              maxlength="50"
              class="w-full p-2 border rounded"
              required
            >
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full p-2 border rounded"
              required
            >
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="$emit('update:modelValue', false)"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue', 'login']);
const props = defineProps({
  modelValue: Boolean
});

const username = ref('');
const password = ref('');

const handleSubmit = () => {
  emit('login', {
    username: username.value,
    password: password.value
  });
  username.value = '';
  password.value = '';
};
</script>