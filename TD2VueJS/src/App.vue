<script setup>
import { RouterLink, RouterView } from 'vue-router'
const token = localStorage.getItem('token')
function logout() {
  localStorage.removeItem('token')
  location.reload()
}
</script>

<template>
  <header>
    <div class="wrapper">
         <nav>
        <RouterLink to="/">Home</RouterLink>
           <template v-if="token">
             <RouterLink to="/movie">Movie</RouterLink>
             <RouterLink to="/actors">Actors</RouterLink>
             <RouterLink to="/category">Category</RouterLink>
             <a @click="logout()">Logout</a>
           </template>
           <template v-else>
             <RouterLink to="/login">Login</RouterLink>
           </template>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>


nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
