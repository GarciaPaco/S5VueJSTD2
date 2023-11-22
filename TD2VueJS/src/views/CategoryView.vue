<script setup>
import {onMounted, ref} from 'vue'
import router from "@/router";

const categories = ref('')
const pageNext = ref('')
const pagePrevious = ref('')


const token = localStorage.getItem('token')
onMounted(async () => {
  fetch('http://localhost/public/api/categories?page=1', {
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
    const response = await fetch(`http://localhost${pageNext.value}`);
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
    const response = await fetch(`http://localhost${pagePrevious.value}`);
    const data = await response.json();
    categories.value = data['hydra:member'];
    pageNext.value = data['hydra:view']['hydra:next'];
    pagePrevious.value = data['hydra:view']['hydra:previous'];
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
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
  <div v-if="categories" class="flex">
    <template class="card" v-for="category in categories">
      <p>Categorie : {{ category.name }}</p>
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

.search {
  margin-left: 5px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.recherche {
  margin-left: 31px;
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