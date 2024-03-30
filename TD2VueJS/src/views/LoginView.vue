<script setup>
import router from "@/router";
import {ref} from "vue";
const email = ref('')
const password = ref('')
const apiUrl = import.meta.env.VITE_API_URL;
const login = () => {
  fetch(apiUrl +'/login_check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },

    body: JSON.stringify({
      username: email.value,
      password: password.value
    })
  })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('token', data.token)
        let token = data.token
        if (token !== null) {
          let base64Url = token.split('.')[1];
          let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          let decodedToken = JSON.parse(jsonPayload);
          let username = decodedToken.username;
          localStorage.setItem('username', username);
        }
        router.push('/')
        location.reload()
        location.href = '/'
      })
}
</script>

<template>
  <h1>Connexion</h1>
  <div>
    <div>
      <label for="email">Email : </label>
      <input type="email" id="email" v-model="email" class="border-b">
    </div>
    <div>
      <label for="password">Mot de passe : </label>
      <input type="password" id="password" v-model="password" class="border-b">
    </div>
    <br>
    <button @click="login">Connexion</button>
  </div>
</template>

<style>

</style>