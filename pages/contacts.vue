<template>
  <div class="max-w-full">

    <header class="max-w-full w-full px-4 py-4 bg-green-500 flex items-center justify-between relative">
      <h1 class="flex-grow text-center text-4xl font-bold text-white font-nunito">DAFTAR KONTAK</h1>

      <div class="flex items-center relative" v-if="user">
        <button @click="showUserInfo = !showUserInfo" class="bg-gray-800 text-white py-2 px-4 rounded cursor-pointer hover:bg-gray-800">
          {{ user.name }}
        </button>

        <!-- Popup untuk menampilkan detail pengguna -->
        <div v-if="showUserInfo" class="absolute top-full right-0 bg-white p-4 rounded shadow-md mt-2 mb-40 w-64">
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
          <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Tambahkan tombol Tambah Kontak di sini -->
    <div class="my-4 flex justify-start ml-2 mr-4">
      <button @click="showAddPopup = true" class="bg-yellow-500 text-white py-2 px-6 text-lg rounded hover:bg-yellow-400 transform hover:scale-105">
        Tambah Kontak
      </button>
    </div>


    <!-- Tabel Kontak -->
    <table class="w-full table-fixed mt-4 bg-white">
      <thead>
        <tr>
          <th class="p-4 border text-left w-1/4 bg-gray-300 text-black">Nama</th>
          <th class="p-4 border text-left w-1/4 bg-gray-300 text-black">Telepon</th>
          <th class="p-4 border text-left w-1/4 bg-gray-300 text-black">Alamat</th>
          <th class="p-4 border text-center w-1/6 bg-gray-300 text-black">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact.id">
          <td class="p-4 border">{{ contact.name }}</td>
          <td class="p-4 border">{{ contact.phone }}</td>
          <td class="p-4 border">{{ contact.address }}</td>
          <td class="p-4 border text-center">
            <div class="flex justify-center gap-2">
              <button @click="editContact(contact)" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transform hover:scale-105">
                Edit
              </button>
              <button @click="deleteContact(contact.id)" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transform hover:scale-105">
                Hapus
              </button>
            </div>
          </td>

        </tr>
      </tbody>
    </table>

    <!-- Popup Tambah / Edit Kontak -->
    <div v-if="showAddPopup || showEditPopup" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
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

  </div>
</template>

  <script setup>
  import { ref, onMounted } from 'vue';
  const config = useRuntimeConfig();
  
  const contacts = ref([]);
  const form = ref({ id: null, name: '', phone: '', address: '' });
  const showAddPopup = ref(false);
  const showEditPopup = ref(false);
  const showUserInfo = ref(false); // Menampilkan info pengguna
  const user = ref(null); // Menyimpan informasi pengguna
  
  const logout = () => {
  localStorage.removeItem('token'); // Hapus token
  window.location.href = '/login'; // Arahkan ke halaman login
};

const getUserInfo = async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const response = await fetch(`${config.public.apiBase}/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Mengirim token autentikasi
        },
      });

      if (!response.ok) {
        console.error('Error fetching user data:', await response.json());
        return;
      }

      const userData = await response.json(); // Menangkap data pengguna dari server
      user.value = userData; // Menyimpan data pengguna ke dalam variabel reactive
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};


  const fetchContacts = async () => {
  const token = localStorage.getItem('token');
  console.log('Fetching contacts...');

  const response = await fetch(`${config.public.apiBase}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error('Error fetching contacts:', await response.json());
    return;
  }

  const data = await response.json();
  console.log('Contacts fetched:', data); // Logging hasil data
  contacts.value = data;
};

const saveContact = async () => {
  const token = localStorage.getItem('token');
  const method = form.value.id ? 'PUT' : 'POST';
  const url = form.value.id ? `/posts/${form.value.id}` : '/posts';

  console.log('Saving contact:', form.value, 'Method:', method, 'URL:', url);

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

  console.log('Contact saved successfully');
  closePopup();
  fetchContacts(); // Refresh daftar kontak setelah menyimpan
};

  const editContact = (contact) => {
    form.value = { ...contact };
    showEditPopup.value = true;
  };
  
  const deleteContact = async (id) => {
  const token = localStorage.getItem('token');
  console.log('Deleting contact with ID:', id);

  const response = await fetch(`${config.public.apiBase}/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error('Error deleting contact:', await response.json());
    return;
  }

  console.log('Contact deleted successfully');
  fetchContacts(); // Refresh daftar kontak setelah menghapus
};

  const closePopup = () => {
    showAddPopup.value = false;
    showEditPopup.value = false;
    form.value = { id: null, name: '', phone: '', address: '' };
  };

  onMounted(() => {
    fetchContacts(); // Ambil kontak
    getUserInfo();   // Ambil informasi pengguna
  });

  definePageMeta({
    middleware: ['auth'], // Menambahkan middleware autentikasi
  });
  </script>

