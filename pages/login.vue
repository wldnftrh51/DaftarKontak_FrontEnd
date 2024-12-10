<template>
  <transition name="fade" mode="out-in">
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="flex flex-col md:flex-row bg-white w-full h-full md:h-5/6 md:max-w-4xl rounded-lg shadow-lg">
        <!-- Bagian Kiri: Login -->
        <div class="w-full md:w-7/10 p-8 flex flex-col justify-center items-center">
          <h1 class="text-2xl font-semibold text-gray-800 mb-6">Sign In</h1>
          <form @submit.prevent="login" class="space-y-4 w-full max-w-xs">
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
            <button type="submit"
              class="w-full py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition">
              Sign In
            </button>
          </form>
          <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
          <!-- <p class="text-sm text-gray-600 mt-4">
            <a href="#" class="text-green-500 hover:underline">Forgot your password?</a>
          </p> -->
        </div>

        <!-- Bagian Kanan: Sign Up -->
        <div class="hidden md:flex md:w-3/10 bg-green-100 flex-col justify-center items-center p-8">
          <h2 class="text-2xl font-semibold text-green-600 mb-4">Hello, Friend!</h2>
          <p class="text-gray-600 text-sm mb-6">
            Enter your personal details and start your journey with us
          </p>
          <button @click="goToRegister"
            class="px-6 py-2 bg-white border border-green-500 text-green-500 font-medium rounded-md hover:bg-green-500 hover:text-white transition">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </transition>
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
    // alert('localhost says: Anda berhasil login');
    router.push('/contacts'); 
    // setTimeout(() => {
    //   router.push('/contacts');
    // }, 500);
  } catch (err) {
    error.value = err.message;
  }
};

const goToRegister = () => {
  // isLogin.value = false;
  router.push('/register'); 
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