<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center">
      <h1 class="text-2xl font-semibold text-gray-800 mb-6">LOGIN</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 mb-1 text-left">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-green-300 focus:outline-none"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-600 mb-1 text-left">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-green-300 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition"
        >
          Login
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
      <p class="text-sm text-gray-600 mt-4">
        Belum punya akun? 
        <button @click="goToRegister" class="text-green-500 underline hover:text-green-600">
          Daftar
        </button>
      </p>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const config = useRuntimeConfig();
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();
  
  const login = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });
  
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Login failed');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/contacts'); // Redirect to Daftar Kontak
    } catch (err) {
      error.value = err.message;
    }
  };

  const goToRegister = () => {
  router.push('/register'); // Ganti dengan rute halaman Register Anda
};

  </script>

