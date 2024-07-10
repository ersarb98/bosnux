<template>
  <div class="bg-gray-100 flex justify-center items-center h-screen">
    <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 class="text-2xl font-semibold mb-4">Login</h1>
      <div class="mb-4">
        <label for="username" class="block text-gray-600">Username</label>
        <input v-model="username" placeholder="Username"
          class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          autocomplete="off">
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-600">Password</label>
        <input v-model="password" type="password" placeholder="Password"
          class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          autocomplete="off">
      </div>
      <div class="mb-4 flex items-center">
        <input type="checkbox" id="remember" name="remember" class="text-blue-500">
        <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
      </div>
      <div class="mb-6 text-blue-500">
        <a href="#" class="hover:underline">Forgot Password?</a>
      </div>
      <button @click="login"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
      <div class="mt-6 text-blue-500 text-center">
        <a href="#" class="hover:underline">Sign up Here</a>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
const username = ref('ersarb');
const password = ref('12345678');
const router = useRouter();

const login = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USER_NAME: username.value,
        PASS: password.value,
      }),
    });

    const data = await response.json();
    console.log(data)

    if (response.ok && data && data.token) {
      if (process.client) {
        localStorage.setItem('auth_token', data.token); // Store auth token
        localStorage.setItem('user_data', JSON.stringify(data.user)); // Store user data
        checkAuth(); // Update the login state
      }
      router.push('/');
    } else {
      console.error('Login failed:', data);
    }
  } catch (error) {
    console.error('An error occurred during login:', error);
  }
};
</script>


<style scoped></style>