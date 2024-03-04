<script setup>
import { onMounted, ref } from 'vue';
import CardMovies from "@/components/CardMovies.vue";

import router from "@/router";
let data = ref('');
let actors = ref('');

const apiUrl = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');
if (!token) {
  router.push('/login');
}
onMounted(async () => {
  fetch(apiUrl +'/actors?page=1', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
      .then(response => response.json())
      .then(data => {
        if (data.code === 401) {
          router.push('/login')
        } else {
          actors.value = data['hydra:member'];

        }
      });
  fetch(apiUrl+'/movies?page=1', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
      .then(response => response.json())
      .then(data => {
        if (data.code === 401) {
          router.push('/login')
        } else {
          data.value = data['hydra:member'];
        }
      });
  });
</script>

<template>
  <h1 style="font-size:45px;">HOME</h1>

<!--  <div class="card" style="display: flex; justify-content: space-around; flex-wrap: wrap;">-->
<!--    <CardMovies v-for="movie in data" :key="movie.id" :movie="movie" />-->
<!--  </div>-->
<!--  <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">-->
<!--    <ActorView v-for="actor in dataAll['hydra:member']" :key="actor.id" :actor="actor" />-->
<!--  </div>-->


</template>

<style>

h1 {
  color: red;
  display: flex;
  justify-content: center;
}

a {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
a:hover {
  background-color: #ddd;
  color: red;
}

.card {
  color: white;
  margin-bottom : 30px;
  margin-left : 30px;
  margin-right : 30px;
  border: 1px solid #2c3e50;
  border-radius: 5px;
  padding: 10px;
}


</style>
