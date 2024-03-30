<script setup>
import {onMounted, ref} from 'vue'
import router from "@/router";

const categories = ref('')
const pageNext = ref('')
const pagePrevious = ref('')
const recherche = ref('');
const apiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token')
const shortApiUrl = import.meta.env.VITE_API_SHORT_URL;
onMounted(async () => {
  fetch(apiUrl +'/categories?page=1', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
      .then(response => response.json())
      .then(data => {
        if (data.code === 401) {
          router.push('/login')
        } else {
          categories.value = data['hydra:member'];
          pageNext.value = data['hydra:view']['hydra:next'];
          pagePrevious.value = data['hydra:view']['hydra:previous'];
        }
      });

});

async function nextPage() {
  try {
    const response = await fetch(shortApiUrl + pagePrevious.value, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json();
    categories.value = data['hydra:member'];
    pageNext.value = data['hydra:view']['hydra:next'];
    pagePrevious.value = data['hydra:view']['hydra:previous'];
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function previousPage() {
  try {
    const response = await fetch(shortApiUrl + pageNext.value, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await response.json();
    categories.value = data['hydra:member'];
    pageNext.value = data['hydra:view']['hydra:next'];
    pagePrevious.value = data['hydra:view']['hydra:previous'];
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}


  // 'actor': movieActors.value.map(actor => `/api/actors/${actor}`),


async function filter() {
  try {
    const response = await fetch(apiUrl +`/categories?page=1&name=${recherche.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {

  }
}
</script>
<template>


  <h1>Category</h1>
  <template v-if="pagePrevious">
    <a class="pagination" @click="previousPage()">Previous</a>
  </template>
  <template v-if="pageNext">
    <a class="pagination" @click="nextPage()">Next</a>
  </template>

  <div class="recherche">
    <label for="recherche">Rechercher une catégorie</label>
    <input class="search" v-model="recherche" type="text">
    <button class="recherche" @click="filter">Rechercher</button>
  </div>

  <div v-if="categories" class="flex">
    <template class="card" v-for="category in categories">
      <div class="card">
        <p>Categorie : {{ category.name }}</p>
      </div>
    </template>
  </div>
  <div v-else>
    <h1>Chargement des données...</h1>
  </div>
</template>
<style scoped>
.pagination a {
  padding: 8px 16px;
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