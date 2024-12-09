export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return; // Hindari eksekusi di server

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigateTo('/login');
    }
  }
});

