<template>
  <transition name="fade" mode="out-in">
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <!-- Container Utama -->
      <div class="flex flex-col md:flex-row bg-white w-full h-full md:h-5/6 md:max-w-4xl rounded-lg shadow-lg">
        <!-- Bagian Kiri: Welcome -->
        <div class="hidden md:flex md:w-3/10 bg-green-100 flex-col justify-center items-center p-8">
          <h2 class="text-2xl font-semibold text-green-600 mb-4">Welcome Back!</h2>
          <p class="text-gray-600 text-sm mb-6">
            To keep connected with us, please login with your personal info.
          </p>
          <button @click="goToLogin"
            class="px-6 py-2 bg-white border border-green-500 text-green-500 font-medium rounded-md hover:bg-green-500 hover:text-white transition">
            Sign In
          </button>
        </div>

        <!-- Bagian Kanan: Register Form -->
        <div class="w-full md:w-7/10 p-8 flex flex-col justify-center items-center">
          <h1 class="text-2xl font-semibold text-gray-800 mb-6">Create Account</h1>
          <form @submit.prevent="register" class="space-y-4 w-full max-w-xs">
            <div>
              <input type="text" v-model="name" placeholder="Name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-green-300 focus:outline-none"
                required />
            </div>
            <div>
              <input type="email" v-model="email" placeholder="Email"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-green-300 focus:outline-none"
                required />
            </div>
            <div>
              <input type="password" v-model="password" placeholder="Password"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-green-300 focus:outline-none"
                required />
            </div>
            <div>
              <input type="password" v-model="password_confirmation" placeholder="Confirm Password"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-green-300 focus:outline-none"
                required />
            </div>
            <button type="submit"
              class="w-full py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition">
              Sign Up
            </button>
          </form>
          <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
          <!-- <p class="text-sm text-gray-600 mt-6">
            Already have an account?
            <button @click="goToLogin" class="text-green-500 hover:underline">
              Sign In
            </button>
          </p> -->
        </div>
      </div>
    </div>
  </transition>
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
  // isLogin.value = true;
  router.push('/login'); // Mengarahkan ke halaman login
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, background-color 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  background-color: #f9f9f9; /* Warna halaman sebelumnya */
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  background-color: #ffffff; /* Warna halaman baru */
}

</style>
