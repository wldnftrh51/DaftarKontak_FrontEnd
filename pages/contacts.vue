<template>
  <div class="max-w-full min-h-screen bg-gray-100 flex flex-col">

    <!-- Header -->
    <header class="w-full px-6 py-4 bg-green-600 flex items-center justify-between shadow-md">
      <h1 class="text-2xl lg:text-4xl font-bold text-white font-nunito">DAFTAR KONTAK</h1>
      <div class="relative" v-if="user">
        <button 
          @click="showUserInfo = !showUserInfo" 
          class="bg-white text-green-600 py-2 px-4 rounded shadow hover:bg-gray-100"
        >
          {{ user?.name }}
        </button>
        <div 
          v-if="showUserInfo" 
          class="absolute top-12 right-0 bg-white p-4 rounded shadow-lg w-64"
        >
          <div class="mb-4">
            <div class="flex">
              <p class="font-semibold mr-2">Nama:</p>
              <p>{{ user.name }}</p>
            </div>
            <div class="flex">
              <p class="font-semibold mr-2">Email:</p>
              <p>{{ user.email }}</p>
            </div>
          </div>
          <button 
            @click="logout" 
            class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Tombol Tambah Kontak -->
    <div class="my-4 px-6">
      <button 
        @click="showAddPopup = true" 
        class="bg-yellow-500 text-white py-2 px-6 rounded shadow hover:bg-yellow-400 transform hover:scale-105"
      >
        Tambah Kontak
      </button>
    </div>

    <!-- Tabel Kontak -->
    <div class="flex-grow px-6">
      <table class="w-full table-auto bg-white rounded-lg shadow-md overflow-hidden">
        <thead class="bg-gray-300">
          <tr>
            <th class="p-4 text-left">Nama</th>
            <th class="p-4 text-left">Telepon</th>
            <th class="p-4 text-left">Alamat</th>
            <th class="p-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="contact in contacts" 
            :key="contact.id" 
            class="border-t even:bg-gray-100 hover:bg-gray-200"
          >
            <td class="p-4">{{ contact.name }}</td>
            <td class="p-4">{{ contact.phone }}</td>
            <td class="p-4">{{ contact.address }}</td>
            <td class="p-4 text-center">
              <div class="flex justify-center space-x-2">
                <button 
                  @click="editContact(contact)" 
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transform hover:scale-105"
                >
                  Edit
                </button>
                <button 
                  @click="deleteContact(contact.id)" 
                  class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transform hover:scale-105"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Tambah/Edit Kontak -->
    <div 
      v-if="showAddPopup || showEditPopup" 
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md animate-fade-in">
        <form @submit.prevent="saveContact">
          <h2 class="text-xl mb-4" v-if="showAddPopup">Tambah Kontak</h2>
          <h2 class="text-xl mb-4" v-else>Edit Kontak</h2>
          <div class="mb-4">
            <label for="name" class="block font-semibold mb-2">Nama:</label>
            <input type="text" id="name" v-model="form.name" required class="w-full p-3 border border-gray-300 rounded"/>
          </div>
          <div class="mb-4">
            <label for="phone" class="block font-semibold mb-2">Telepon:</label>
            <input type="text" id="phone" v-model="form.phone" required class="w-full p-3 border border-gray-300 rounded"/>
          </div>
          <div class="mb-4">
            <label for="address" class="block font-semibold mb-2">Alamat:</label>
            <textarea id="address" v-model="form.address" required class="w-full p-3 border border-gray-300 rounded"></textarea>
          </div>
          <div class="flex justify-between">
            <button type="submit" class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">Simpan</button>
            <button type="button" @click="closePopup" class="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <footer class="w-full bg-gray-800 text-white py-4 mt-4">
      <div class="flex justify-center">
        <p class="text-sm">© 2024 Daftar Kontak. All rights reserved.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const config = useRuntimeConfig();

const contacts = ref([]);
const form = ref({ id: null, name: '', phone: '', address: '' });
const showAddPopup = ref(false);
const showEditPopup = ref(false);
const showUserInfo = ref(false); 
const user = ref(null);

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; // Redirect ke halaman login setelah logout
};

const getUserInfo = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await fetch(`${config.public.apiBase}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching user data:', await response.json());
        return;
      }

      const userData = await response.json();
      user.value = userData; // Simpan data pengguna
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

const fetchContacts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${config.public.apiBase}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error('Error fetching contacts:', await response.json());
    return;
  }

  const data = await response.json();
  contacts.value = data; 
};

const saveContact = async () => {
  const token = localStorage.getItem('token');
  const method = form.value.id ? 'PUT' : 'POST';
  const url = form.value.id ? `/posts/${form.value.id}` : '/posts';

  const response = await fetch(`${config.public.apiBase}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form.value),
  });

  if (!response.ok) {
    console.error('Error saving contact:', await response.json());
    return;
  }

  closePopup();
  fetchContacts();
};

const editContact = (contact) => {
  form.value = { ...contact };
  showEditPopup.value = true;
};

const deleteContact = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${config.public.apiBase}/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error('Error deleting contact:', await response.json());
    return;
  }

  fetchContacts();
};

const closePopup = () => {
  showAddPopup.value = false;
  showEditPopup.value = false;
  form.value = { id: null, name: '', phone: '', address: '' };
};

onMounted(() => {
  getUserInfo();  // Ambil data user saat halaman dimuat
  fetchContacts(); // Ambil data kontak saat halaman dimuat
});
</script>

<style scoped>
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Optional additional footer styles */
footer {
  background-color: #2d3748;
  color: #edf2f7;
}
</style>
