<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue';
import axios from 'axios';

let data = ref('');
const route = useRoute();
const movieId = route.params.movieId;

onMounted(async () => {
  const response = await axios.get('http://localhost/my_project_directory/public/index.php/api/movies/'+movieId)
  data.value = response.data
});

</script>

<template>

  <div class="dataMovie" v-if="data">
    <h1>Nom du film : {{data.title}}</h1>
    <p>Description : {{data.description}}</p>
    <p>Date de sortie : {{data.releaseDate}}</p>
    <p>Genre : {{data.category}}</p>
    <p>Acteurs : {{data.actors}}</p>
    <p>Durée : {{data.duration}} minutes.</p>

  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
</template>



<style>
.dataMovie {
  margin-left : 30px;
}
</style>