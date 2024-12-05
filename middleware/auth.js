export default defineNuxtRouteMiddleware((to, from) => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  if (!token) {
    // Jika token tidak ada, arahkan pengguna ke halaman login
    return navigateTo('/login');
  }
});
