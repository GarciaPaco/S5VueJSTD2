<script setup>
defineProps(['movie']);

</script>

<template>
  <div class="card">
  <h3>Titre du film : {{ movie.title }} </h3>
  <h3>Description : {{ movie.description }}</h3>
  <h3>Date de sortie : {{ movie.releaseDate }}</h3>
  <router-link :to="'/fiche-movie/'+movie.id">Accéder aux détails du film</router-link>
  </div>
</template>

<style>
.card {

  margin-bottom : 30px;
  margin-left : 30px;
  margin-right : 30px;
  border: 1px solid white;
  border-radius: 5px;
  padding: 10px;
}
</style>
