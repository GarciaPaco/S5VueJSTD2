<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import CardMovies from "@/components/CardMovies.vue";
let data = ref('');
const dataAll = ref();

onMounted(async () => {
  const response = await axios.get('http://localhost/my_project_directory/public/index.php/api/movies?page=1')
  data.value = response.data['hydra:member'];
  dataAll.value = response.data
});
</script>

<template>
  <h1 style="font-size:45px;">HOME</h1>

  <div class='movieFlex' v-for="movie in data.slice(0,4)">
    <CardMovies :movie="movie" ></CardMovies>
  </div>


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


</style>
