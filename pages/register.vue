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
        </div>
      </div>

      <!-- Alert -->
      <div v-if="showAlert" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs">
          <!-- Animasi Centang -->
          <div class="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" class="h-12 w-12 mx-auto mb-4">
              <circle cx="26" cy="26" r="25" fill="none" class="checkmark-circle" />
              <path fill="none" d="M14 27l7 7 16-16" class="checkmark-check" />
            </svg>
          </div>
          <p class="text-gray-800 text-lg font-medium">{{ alertMessage }}</p>
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
const showAlert = ref(false);
const alertMessage = ref('');
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
    alertMessage.value = 'Berhasil mendaftar! Anda akan diarahkan ke halaman login.';
    showAlert.value = true;

    setTimeout(() => {
      showAlert.value = false;
      router.push('/login');
    }, 3000); 
  } catch (err) {
    error.value = err.message;
  }
};

const goToLogin = () => {

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

.checkmark-circle {
  stroke: #4caf50;
  stroke-width: 2;
  animation: draw-circle 0.5s ease-out forwards;
}

.checkmark-check {
  stroke: #4caf50;
  stroke-width: 2;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: draw-check 0.3s ease-out 0.5s forwards;
}

@keyframes draw-circle {
  from {
    stroke-dasharray: 0 157;
  }
  to {
    stroke-dasharray: 157 0;
  }
}

@keyframes draw-check {
  from {
    stroke-dashoffset: 48;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.fixed {
  z-index: 50;
}
</style>
