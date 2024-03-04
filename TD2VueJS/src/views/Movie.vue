<script setup>
  import {onMounted, ref} from 'vue'
  import router from "@/router";
  const movies = ref('')
  const actors = ref('')
  const pageNext = ref('')
  const pagePrevious = ref('')
  const token = localStorage.getItem('token')
  const recherche = ref('');
  const apiUrl = import.meta.env.VITE_API_URL;


  onMounted(async () => {
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
          movies.value = data['hydra:member'];
          pageNext.value = data['hydra:view']['hydra:next'];
          pagePrevious.value = data['hydra:view']['hydra:previous'];
        }
      });
});

  async function nextPage() {
  try {
  const response = await fetch(`http://localhost${pageNext.value}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  const data = await response.json();
  movies.value = data['hydra:member'];
  pageNext.value = data['hydra:view']['hydra:next'];
  pagePrevious.value = data['hydra:view']['hydra:previous'];
} catch (error) {
  console.error('Une erreur s\'est produite lors de la récupération des données.', error);
}
}

  async function previousPage() {
  try {
  const response = await fetch(`http://localhost${pagePrevious.value}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  const data = await response.json();
  movies.value = data['hydra:member'];
  pageNext.value = data['hydra:view']['hydra:next'];
  pagePrevious.value = data['hydra:view']['hydra:previous'];
} catch (error) {
  console.error('Une erreur s\'est produite lors de la récupération des données.', error);
}
}

async function filter() {
try {
  const response = await fetch(apiUrl+`/movies?page=1&title=${recherche.value}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  if (data.code === 401) {
    return router.push('/login')
  } else {
    movies.value = data['hydra:member'];
    pageNext.value = data['hydra:view']['hydra:next'];
    pagePrevious.value = data['hydra:view']['hydra:previous'];
  }
} catch(error) {

}
    }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }


</script>

<template>
  <h1>MOVIE LISTING</h1>
  <template v-if="pagePrevious">
    <a class="pagination" @click="previousPage()">Previous</a>
  </template>
  <template v-if="pageNext">
    <a class="pagination" @click="nextPage()">Next</a>
  </template>
  <div class="recherche">
    <label for="recherche">Rechercher film</label>
    <input class="search" v-model="recherche" type="text">
    <button class="recherche" @click="filter">Rechercher</button>
  </div>
  <div v-if="movies" class="flex">
    <template v-for="movie in movies">
      <div class="card">
        <p>
          {{ movie.title }} <br>
          {{ movie.description }} <br>
          Durée : {{ movie.duration }} minutes.<br>
          Sortie : {{ formatDate(movie.releaseDate) }} <br>
          Catégorie : {{ movie.category.name }} <br>
          <router-link :to="{name: 'FicheMovie', params : {movieId : movie['@id']}} ">Accéder aux détails du film</router-link>
        </p>
      </div>
    </template>
  </div>
  <div v-else>Chargement des données...</div>
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
  width: 50px;
  border-radius: 5px;
  padding: 5px;
  margin-left: 30px;
  font-size: 25px;
}

h1 {
  color: red;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

a {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
a:hover {
  background-color: #ddd;
  color: red;
  cursor: pointer;
}
.card {
  margin-top: 15px;
}

</style>
