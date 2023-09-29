<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import CardMovies from "@/components/CardMovies.vue";
let data = ref('');
const dataAll = ref();

onMounted(async () => {
  const response = await axios.get('http://localhost/my_project_directory/public/index.php/api/movies?page=1')
  data.value = response.data['hydra:member'];

  dataAll.value = data.value
});
</script>

<template>

<h1>Movie listing : </h1>
  <label for="recherche">Rechercher un film</label>
  <input class="search" v-model="recherche" @keydown="filter" type="text">
  <div class='movieFlex' v-for="movie in data.slice(0,4)">
    <CardMovies :movie="movie" ></CardMovies>
  </div>
</template>

<style>
h1 {
  color: red;
}
.search {
  margin-bottom: 20px;
  margin-top: 20px;
}
a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

</style>