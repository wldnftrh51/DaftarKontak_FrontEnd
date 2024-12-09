<template>
  <div class="flex justify-center items-center h-screen bg-gray-100 p-4">
    <div class="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md max-w-md w-full min-h-[400px] text-center">
      <h1 class="mb-6 text-2xl font-bold text-gray-800">REGISTRASI</h1>
      <form @submit.prevent="register" class="flex flex-col gap-4 w-full max-w-xs">
        <div class="flex flex-col items-start w-full">
          <label for="name" class="text-sm text-gray-600 mb-2">Nama:</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="w-full px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div class="flex flex-col items-start w-full">
          <label for="email" class="text-sm text-gray-600 mb-2">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div class="flex flex-col items-start w-full">
          <label for="password" class="text-sm text-gray-600 mb-2">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div class="flex flex-col items-start w-full">
          <label for="password_confirmation" class="text-sm text-gray-600 mb-2">Konfirmasi Password:</label>
          <input
            type="password"
            id="password_confirmation"
            v-model="password_confirmation"
            class="w-full px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full max-w-sm px-4 py-2 bg-green-500 text-white rounded transition duration-300 hover:bg-green-600 transform hover:scale-105"
        >
          Daftar
        </button>
      </form>
      <p v-if="error" class="mt-4 text-red-500 text-sm">{{ error }}</p>
      <p class="mt-6 text-sm text-gray-600">
        Sudah punya akun?
        <button @click="goToLogin" class="text-green-500 underline hover:text-green-600">
          Login
        </button>
      </p>
    </div>
  </div>
</template>

  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const config = useRuntimeConfig();
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const password_confirmation = ref('');
  const error = ref('');
  const router = useRouter();
  
  const register = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value,
        }),
      });
  
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Register failed');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/login'); // Redirect to Daftar Kontak
    } catch (err) {
      error.value = err.message;
    }
  };

  const goToLogin = () => {
  router.push('/login'); // Mengarahkan ke halaman login
};
  </script>