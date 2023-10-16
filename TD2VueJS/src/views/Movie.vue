<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import CardMovies from "@/components/CardMovies.vue";
let data = ref('');
let nextPage = ref('');
let previousPage = ref('');
const dataAll = ref();

onMounted(async () => {
  const response = await axios.get('http://localhost/my_project_directory/public/index.php/api/movies?page=1')
  data.value = response.data['hydra:member'];
  dataAll.value = response.data
  nextPage = response.data['hydra:view']['hydra:next'];
  previousPage = response.data['hydra:view']['hydra:previous'];
});
</script>

<template>
<!--    <pre>{{dataAll}}</pre>-->
  <h1 style="font-size:45px;">MOVIE LISTING</h1>
  <label class='recherche' for="recherche">Rechercher un film : </label>
  <input class="search" v-model="recherche" @keydown="filter" type="text">
  <div class='movieFlex' v-for="movie in data.slice(0,10)">
    <CardMovies :movie="movie" ></CardMovies>
  </div>

  <!--  TODO : add pagination logic & filterSearch-->

  <div class="pagination">
    <a v-if="previousPage" :href="previousPage">Précédent</a>
    <a v-if="nextPage" :href="nextPage">Suivant</a>

  </div>

</template>

<style>
.pagination a {
  padding: 8px 16px;
}
.search {
  margin-left:5px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.recherche {
  margin-left:31px;
  color: white;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-left: 30px;
  margin-bottom: 50px;
  font-size: 25px;
}

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
