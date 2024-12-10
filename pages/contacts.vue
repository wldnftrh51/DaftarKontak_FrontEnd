<template>

  <div class="max-w-full min-h-screen bg-gray-100 flex flex-col">
    <!-- Alert Message -->
    <div v-if="alertMessage"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
      <p>{{ alertMessage }}</p>
    </div>

    <!-- Header -->
    <header class="w-full px-6 py-4 bg-green-600 flex items-center justify-between shadow-md sticky top-0 z-50">
      <h1 class="text-2xl lg:text-4xl font-bold text-white font-nunito">
        <i class="fa fa-address-book mr-2"></i>DAFTAR KONTAK
      </h1>
      <div class="relative" v-if="user">
        <button @click="showUserInfo = !showUserInfo"
          class="bg-white text-green-600 py-2 px-4 rounded shadow hover:bg-gray-100">
          <i class="fa fa-user mr-2"></i>{{ user?.name }}
          <i class="fa fa-caret-down ml-2"></i>
        </button>
        <div v-if="showUserInfo" class="absolute top-12 right-0 bg-white p-4 rounded shadow-lg w-64">
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
          <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            <i class="fa fa-sign-out-alt mr-2"></i>Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Tombol Kontak dan Tombol Export -->
    <div class="my-4 px-6 flex justify-between items-center">
      <!-- Tombol Tambah Kontak -->
      <div class="flex space-x-4">
        <button @click="showAddPopup = true"
          class="bg-yellow-500 text-white py-2 px-6 rounded shadow hover:bg-yellow-400 transform hover:scale-105">
          <i class="fa fa-plus mr-2"></i>Tambah Kontak
        </button>
        <!-- Tombol Export -->
        <button @click="exportContacts"
          class="bg-blue-500 text-white py-2 px-6 rounded shadow hover:bg-blue-400 transform hover:scale-105">
          <i class="fa fa-download mr-2"></i>Export to Excel
        </button>
      </div>

      <!-- Pencarian Kontak -->
      <div class="relative">
        <input type="text" v-model="searchQuery" placeholder="Cari Kontak..."
          class="w-64 p-3 border border-gray-300 rounded mb-4">
      </div>
    </div>

    <!-- Tombol Tambah Kontak -->
    <!-- <div class="my-4 px-6">
      <button @click="showAddPopup = true"
        class="bg-yellow-500 text-white py-2 px-6 rounded shadow hover:bg-yellow-400 transform hover:scale-105">
        <i class="fa fa-plus mr-2"></i>Tambah Kontak
      </button>
    </div> -->

    <!-- Pencarian Kontak -->
    <!-- <div class="my-4 px-6">
      <input type="text" v-model="searchQuery" placeholder="Cari Kontak..."
        class="w-full p-3 border border-gray-300 rounded mb-4">
    </div> -->

    <!-- Tabel Kontak -->
    <div class="flex-grow px-6">
      <table class="w-full table-auto bg-white rounded-lg shadow-md overflow-hidden">
        <thead class="bg-gray-300">
          <tr>
            <th class="p-4 text-left cursor-pointer w-1/5" @click="sortData('name')">
              Nama <i :class="sortIcon('name')"></i>
            </th>
            <th class="p-4 text-left cursor-pointer w-1/5" @click="sortData('phone')">
              Telepon <i :class="sortIcon('phone')"></i>
            </th>
            <th class="p-4 text-left cursor-pointer w-1/2" @click="sortData('address')">
              Alamat <i :class="sortIcon('address')"></i>
            </th>
            <th class="p-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Menampilkan pesan jika tidak ada kontak -->
          <tr v-if="filteredContacts.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-500">
              Tidak ada kontak
            </td>
          </tr>
          <tr v-for="contact in filteredContacts" :key="contact.id" class="border-t even:bg-gray-100 hover:bg-gray-200">
            <td class="p-4 ">{{ contact.name }}</td>
            <td class="p-4 ">{{ contact.phone }}</td>
            <td class="p-4 ">{{ contact.address }}</td>
            <td class="p-4 text-center">
              <div class="flex justify-center space-x-2">
                <button @click="editContact(contact)"
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transform hover:scale-105">
                  <i class="fa fa-pencil-alt mr-2"></i>
                </button>
                <button @click="deleteContact(contact.id)"
                  class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transform hover:scale-105">
                  <i class="fa fa-trash-alt mr-2"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Popup Tambah/Edit Kontak -->
    <div v-if="showAddPopup || showEditPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md animate-fade-in">
        <form @submit.prevent="saveContact">
          <h2 class="text-xl mb-4" v-if="showAddPopup">Tambah Kontak</h2>
          <h2 class="text-xl mb-4" v-else>Edit Kontak</h2>
          <div class="mb-4">
            <label for="name" class="block font-semibold mb-2">Nama:</label>
            <input type="text" id="name" v-model="form.name" required
              class="w-full p-3 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label for="phone" class="block font-semibold mb-2">Telepon:</label>
            <input type="text" id="phone" v-model="form.phone" required
              class="w-full p-3 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label for="address" class="block font-semibold mb-2">Alamat:</label>
            <textarea id="address" v-model="form.address" required
              class="w-full p-3 border border-gray-300 rounded"></textarea>
          </div>
          <div class="flex justify-between">
            <button type="submit" class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">Simpan</button>
            <button type="button" @click="closePopup"
              class="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <!-- <footer class="w-full bg-gray-800 text-white py-4 mt-4">
      <div class="flex justify-center">
        <p class="text-sm">© 2024 Daftar Kontak. All rights reserved.</p>
      </div>
    </footer> -->
    <footer class="w-full bg-gray-800 text-white py-6 mt-4">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Informasi Aplikasi -->
          <div class="mb-4 md:mb-0">
            <h2 class="text-lg font-semibold">Daftar Kontak</h2>
            <p class="text-sm">Kelola kontak Anda dengan mudah dan cepat.</p>
            <p class="text-sm mt-2">© 2024 Daftar Kontak. All rights reserved.</p>
          </div>

          <!-- Navigasi Cepat -->
          <div class="mb-4 md:mb-0">
            <h3 class="text-lg font-semibold mb-2">Navigasi Cepat</h3>
            <ul>
              <li><a href="/" class="text-sm hover:underline">Beranda</a></li>
              <li><a href="/about" class="text-sm hover:underline">Tentang Kami</a></li>
              <li><a href="/contact" class="text-sm hover:underline">Hubungi Kami</a></li>
            </ul>
          </div>

          <!-- Ikon Media Sosial -->
          <div>
            <h3 class="text-lg font-semibold mb-2">Ikuti Kami</h3>
            <div class="flex space-x-4">
              <a href="https://facebook.com" target="_blank" class="text-white hover:text-blue-500">
                <i class="fab fa-facebook-f"></i> <!-- Ikon Facebook -->
              </a>
              <a href="https://twitter.com" target="_blank" class="text-white hover:text-blue-400">
                <i class="fab fa-twitter"></i> <!-- Ikon Twitter -->
              </a>
              <a href="https://instagram.com" target="_blank" class="text-white hover:text-pink-500">
                <i class="fab fa-instagram"></i> <!-- Ikon Instagram -->
              </a>
              <a href="https://linkedin.com" target="_blank" class="text-white hover:text-blue-700">
                <i class="fab fa-linkedin"></i> <!-- Ikon LinkedIn -->
              </a>
            </div>
          </div>
        </div>
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
  alert('Anda telah berhasil logout');
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

  // if (!response.ok) {
  //   console.error('Error saving contact:', await response.json());
  //   return;
  // }

  // closePopup();
  // fetchContacts();

  if (!response.ok) {
    const errorMessage = await response.json();
    console.error('Error saving contact:', errorMessage);
    alertMessage.value = `Gagal menyimpan kontak: ${errorMessage.message || 'Unknown error'}`; // Menampilkan alert jika gagal
    return;
  }

  alertMessage.value = form.value.id ? 'Berhasil mengedit kontak' : 'Berhasil menambah kontak'; // Menampilkan alert jika berhasil
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

  // if (!response.ok) {
  //   console.error('Error deleting contact:', await response.json());
  //   return;
  // }

  // fetchContacts();
  if (!response.ok) {
    const errorMessage = await response.json();
    console.error('Error deleting contact:', errorMessage);
    alertMessage.value = `Gagal menghapus kontak: ${errorMessage.message || 'Unknown error'}`; // Menampilkan alert jika gagal
    return;
  }

  alertMessage.value = 'Kontak berhasil dihapus'; // Menampilkan alert jika berhasil
  fetchContacts();
};

const closePopup = () => {
  showAddPopup.value = false;
  showEditPopup.value = false;
  form.value = { id: null, name: '', phone: '', address: '' };
};

const searchQuery = ref('');
const sortOrder = ref({ column: 'name', direction: 'asc' });

const filteredContacts = computed(() => {
  return contacts.value.filter(contact => {
    return contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      contact.phone.includes(searchQuery.value) ||
      contact.address.toLowerCase().includes(searchQuery.value.toLowerCase());
  }).sort((a, b) => {
    const compare = (a[sortOrder.value.column] > b[sortOrder.value.column]) ? 1 : -1;
    return sortOrder.value.direction === 'asc' ? compare : -compare;
  });
});

const sortData = (column) => {
  if (sortOrder.value.column === column) {
    sortOrder.value.direction = sortOrder.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortOrder.value.column = column;
    sortOrder.value.direction = 'asc';
  }
};

const sortIcon = (column) => {
  if (sortOrder.value.column === column) {
    return sortOrder.value.direction === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
  }
  return 'fa fa-sort';
};

const exportContacts = () => {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Nama,Telepon,Alamat\n"
    + contacts.value.map(contact => `${contact.name},${contact.phone},${contact.address}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "contacts.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const alertMessage = ref('');



onMounted(() => {
  getUserInfo();  // Ambil data user saat halaman dimuat
  fetchContacts(); // Ambil data kontak saat halaman dimuat
});
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
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
