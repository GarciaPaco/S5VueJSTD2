<script setup>
import router from "@/router";
import {ref} from "vue";
const email = ref('')
const password = ref('')
const login = () => {
  fetch('http://localhost/public/api/login_check', {
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
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" class="border-b">
    </div>
    <div>
      <label for="password">Mot de passe</label>
      <input type="password" id="password" v-model="password" class="border-b">
    </div>
    <button @click="login">Connexion</button>
  </div>
</template>

<style>

</style>