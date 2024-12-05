<template>
  <div class="contacts-container">
    <header class="contacts-header">
      <button @click="logout" class="btn btn-logout">Logout</button>
      <h1 class="contacts-title">DAFTAR KONTAK</h1>
    </header>

    <!-- Tambahkan tombol Tambah Kontak di sini -->
    <div class="contacts-actions">
      <button @click="showAddPopup = true" class="btn btn-primary btn-add-contact">Tambah Kontak</button>
    </div>

    <!-- Tabel Kontak -->
    <table class="contacts-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Telepon</th>
          <th>Alamat</th>
          <th class="action-column">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact.id">
          <td>{{ contact.name }}</td>
          <td>{{ contact.phone }}</td>
          <td>{{ contact.address }}</td>
          <td class="action-buttons">
            <button @click="editContact(contact)" class="btn btn-edit">Edit</button>
            <button @click="deleteContact(contact.id)" class="btn btn-delete">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Popup Tambah / Edit Kontak -->
    <!-- Popup Tambah / Edit Kontak -->
<div v-if="showAddPopup || showEditPopup" class="popup-overlay">
  <div class="popup">
    <form @submit.prevent="saveContact">
      <h2 v-if="showAddPopup">Tambah Kontak</h2>
      <h2 v-else>Edit Kontak</h2>
      <div class="form-group">
        <label for="name">Nama:</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="phone">Telepon:</label>
        <input type="text" id="phone" v-model="form.phone" required />
      </div>
      <div class="form-group">
        <label for="address">Alamat:</label>
        <textarea id="address" v-model="form.address" required></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Simpan</button>
        <button type="button" @click="closePopup" class="btn btn-cancel">Batal</button>
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
  
  const logout = () => {
  localStorage.removeItem('token'); // Hapus token
  window.location.href = '/login'; // Arahkan ke halaman login
};

  onMounted(fetchContacts);
  </script>

<style scoped>

.contacts-container {
  max-width: 100%; /* Batas maksimum lebar */
  /* margin: 0 auto;  */
}

.contacts-header {
  max-width: 100%; 
  margin: 0 auto; 
  width: 100%; 
  padding: 0 1rem; 
  box-sizing: border-box; 
  width: 100%;
  background-color: #4caf50; 
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.contacts-title {
  flex-grow: 1;
  font-family: 'Dancing Script', cursive;
  font-size: 2.5rem;
  font-weight: 400; /* Gaya lebih ringan */
  color: white;
  text-align: center;
  margin: 0;
}


.btn-logout {
  background-color: #e74c3c; /* Merah untuk Logout */
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute;
  left: 1rem;
}


.btn-logout:hover {
  background-color: #c0392b;
}

/* Tombol Tambah Kontak */
.contacts-actions {
  margin: 1rem 0; /* Jarak dari elemen di atasnya */
  display: flex;
  justify-content: flex-end; /* Posisikan tombol di kanan */
}

.btn-add-contact {
  background-color: #FFC107;
  color: white;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease-in-out;
}

.btn-add-contact:hover {
  background-color: #FFC107;
  transform: scale(1.02);
}

.btn-edit {
  background-color: #3498db; /* Biru untuk Edit */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit:hover {
  background-color: #2980b9;
  transform: scale(1.02);
}

.btn-delete {
  background-color: #e74c3c; /* Merah untuk Hapus */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-delete:hover {
  background-color: #c0392b;
  transform: scale(1.02);
}

/* Tabel styling */
.contacts-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: #fff;
}

.contacts-table th, .contacts-table td {
  padding: 1rem;
  text-align: left;
  border: 1px solid #ddd;
}

.contacts-table th {
  background-color: #f9f9f9;
}

.contacts-table .action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.contacts-table .action-column {
  width: 150px;
  text-align: center;
}

/* Styling untuk overlay popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Warna semi-transparan */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Pastikan berada di atas elemen lain */
}

/* Styling untuk kotak popup */
.popup {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%; /* Lebar default */
  max-width: 500px; /* Batas maksimum lebar */
  animation: popup-fade-in 0.3s ease-in-out; /* Efek animasi */
}

/* Styling untuk form di dalam popup */
.popup .form-group {
  margin-bottom: 1rem;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
}

.popup label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.popup input,
.popup textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.popup textarea {
  resize: none; /* Nonaktifkan resize manual */
}

.popup .form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

/* Tombol dalam popup */
.popup .btn {
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup .btn-primary {
  background-color: #4caf50;
  color: white;
}

.popup .btn-primary:hover {
  background-color: #45a045;
}

.popup .btn-cancel {
  background-color: #e74c3c;
  color: white;
}

.popup .btn-cancel:hover {
  background-color: #c0392b;
}

/* Animasi popup */
@keyframes popup-fade-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

</style>