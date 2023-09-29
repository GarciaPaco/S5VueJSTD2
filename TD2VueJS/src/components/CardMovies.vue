<script setup>
defineProps(['movie']);

</script>

<template>

  <p>Titre du film : {{ movie.title }} </p>
  <p>Description : {{ movie.description }}</p>
  <p>Date de sortie : {{ movie.releaseDate }}</p>
  <router-link :to="'/fiche-movie/'+movie.id">Accéder aux détails du film</router-link>
  <hr>

</template>

<style>

</style>
