<script setup>
defineProps(['movie', 'description', 'releaseDate']);
</script>

<template>

  <p>Titre du film : {{ movie }} </p>
  <p>Description : {{ description }}</p>
  <p>Date de sortie : {{ releaseDate }}</p>
  <router-link :to="'/fiche-movie/'+movie">Accéder aux détails du film</router-link>
  <hr>

</template>

<style>

</style>
