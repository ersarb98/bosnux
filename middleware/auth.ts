export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const isLoggedIn = checkAuth();

    if (!isLoggedIn && to.path !== '/login') {
      return navigateTo('/login');
    }
  }
});