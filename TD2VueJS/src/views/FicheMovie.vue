<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue';
import axios from 'axios';

let data = ref('');
const route = useRoute();
const movie = route.params.movie;

onMounted(async () => {
  const response = await axios.get('http://localhost/my_project_directory/public/index.php/api/movies?page=1/')
  data.value = response.data
});

</script>
<template>
  <div class="dataMovie" v-if="data">
    <h1>Nom du film : </h1>

  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
</template>



<style>
.datMovie {
  margin-left : 30px;
}
</style>