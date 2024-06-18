const user = ref(null);
console.log(user.value)

export function useAuthUser() {
  return {
    value: user
  };
}

export function setUser(newUser) {
  user.value = newUser;
}

export function logout() {
  user.value = null;
}