
const isLoggedIn = ref(false);

export function checkAuth() {
  if (typeof window !== 'undefined') {
    // Replace with your actual authentication logic
    const token = localStorage.getItem('auth_token');
    if (token) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  }
  return isLoggedIn.value;
}

export function useAuthStatus() {
  return isLoggedIn;
}