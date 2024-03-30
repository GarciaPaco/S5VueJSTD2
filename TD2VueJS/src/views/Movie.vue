<script setup>
  import {onMounted, ref} from 'vue'
  import router from "@/router";
  import axios from "axios";
  import {useRoute} from "vue-router";
  import moment from 'moment';
  import { computed } from 'vue';


  const shortApiUrl = import.meta.env.VITE_API_SHORT_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  const reversedMovies = computed(() => [...movies.value].reverse());
  const pageNext = ref('')
  const pagePrevious = ref('')
  const token = localStorage.getItem('token')

  let recherche = ref('');
  let movies = ref('')
  let data = ref('');
  let editedMovieTitle = ref('');
  let editedDateRelease = ref('');
  let editedDuration = ref('');
  let editedDescription = ref('');
  let editedCategory = ref('');
  let editedActors = ref([]);
  let categories = ref('');
  let actors = ref([]);
  let fileInput = ref(null);
  const route = useRoute();

  onMounted(async () => {
    // Récupérer le nombre total d'éléments
    let response = await fetch(apiUrl+'/movies', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    let data = await response.json();
    let totalItems = data['hydra:totalItems'];

    // Calculer le nombre total de pages
    let itemsPerPage = data['hydra:member'].length;
    let totalPages = Math.ceil(totalItems / itemsPerPage);

    // Récupérer les films de la dernière page
    response = await fetch(apiUrl+`/movies?page=${totalPages}&order[id]=desc`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    data = await response.json();
    if (data.code === 401) {
      router.push('/login')
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
    await getCategories()
    await getActors()
  });

  async function nextPage() {
  try {
  const response = await fetch(shortApiUrl + pageNext.value, {
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
  const response = await fetch(shortApiUrl + pagePrevious.value, {
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
  function uploadFile(event) {
    fileInput.value = event.target.files[0];
  }

  async function uploadImage() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push('/login')
        return;
      }
      let file = fileInput.value;
      if (!file) {
        console.warn('No file selected. Proceeding without image upload.');
        return null;
      }
      const fileType = file.type;

      if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
        console.error('Invalid file type. Please upload a PNG or JPEG image.');
        return;
      }
      if (!file) {
        console.error('No file selected.');
        return;
      }

      let formData = new FormData();
      formData.append('file', file);
      const response = await fetch(apiUrl +`/media_objects`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return await response.json()

    } catch (error) {
      console.error('An error occurred while uploading the image.', error);
    }
  }
  function formShow() {
    let modal = document.getElementById("formulaire")
    modal.style.display = "block";

  }

  function formHide(currentId) {
    editedMovieTitle.value = null
    editedDateRelease.value = null
    editedDuration.value = null
    editedDescription.value = null
    editedCategory.value = null
    editedActors.value = null
    document.querySelector('.form-container').style.display = 'none';
    location.reload();
  }
  async function getCategories() {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(apiUrl +'/categories', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      categories.value = response.data['hydra:member']
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données.', error);
    }
  }

  async function getActors() {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(apiUrl +'/actors?pagination=false', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      actors.value = response.data['hydra:member']
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données.', error);
    }
  }
  async function createMovie() {
    let media = await uploadImage()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push('/login')
        return;
      }
      let updatedMovie = {
        title: editedMovieTitle.value,
        description: editedDescription.value,
        releaseDate: editedDateRelease.value,
        duration: parseInt(editedDuration.value),
        category: editedCategory.value,
        actor: editedActors.value,
      };
      if (media !== null) {
        updatedMovie.media = media['@id']; // seulement ajouter la propriété media si media n'est pas null
      }
      const response = await fetch(apiUrl +`/movies`,{
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMovie),
      });

      if (response.status === 201) {
        formHide();
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données.', error);
    }
  }

  async function refreshMovie() {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(apiUrl +'/movies/',
          {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
      data.value = response.data
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération des données.', error);
    }
  }


  function convertDate(date, format = 'DD/MM/YYYY') {
    return moment(date).format(format);
  }
</script>

<template>
  <h1>MOVIE LISTING</h1>
  <template v-if="pagePrevious">
    <a class="pagination" @click="previousPage()">Next</a> <!--Astuce où l'on inverse le nom des boutons pour paginer depuis la fin -->
  </template>
  <template v-if="pageNext">
    <a class="pagination" @click="nextPage()">Previous</a>
  </template>
  <div class="recherche">
    <label for="recherche">Rechercher film</label>
    <input class="search" v-model="recherche" type="text">
    <button class="recherche" @click="filter">Rechercher</button>
  </div>
  <div class="recherche">
    <button class="recherche" @click="formShow">Ajouter un film</button>
  </div>
  <div v-if="movies" class="flex">
    <template v-for="movie in reversedMovies">
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


  <div class="form-container" id="formulaire" style="display: none">
    <div class="modal-content">
      <div class="modal-header">
        <span @click="formHide()" class="close">&times;</span>
        <h2>Nouveau film</h2>
      </div>
      <div class="modal-body">
        <form action= "{{apiUrl}}+/movies" method="post"  @submit.prevent="createMovie" >
          <label for="title">Titre : (obligatoire) </label>
          <input type="text" id="editedMovieTitle" name="title" v-model="editedMovieTitle">
          <label for="releaseDate">Date de sortie : (obligatoire)</label>
          <input type="date" id="editedDateRelease" name="releaseDate" v-model="editedDateRelease">
          <label for="duration">Description (obligatoire)</label>
          <input type="text" id="editedDescription" name="description" v-model="editedDescription">
          <label for="duration">Durée : (obligatoire)</label>
          <input type="number" id="editedDuration" name="duration" v-model="editedDuration">
          <label for="category">Catégorie : (obligatoire)</label>
          <select id="editedCategory" name="category" v-model="editedCategory">
            <option v-for="category in categories" :value="category['@id']">{{ category.name }}</option>
          </select>
          <label for="editMovieActors">Acteurs <span class="required">*</span></label>
          <a-select v-model="editedActors" multiple :placeholder="'Sélectionnez les acteurs'">
            <a-option
                v-for="actor in actors"
                :key="actor['@id']"
                :value="actor['@id']">
              {{ actor.firstName }} {{ actor.lastName }}
            </a-option>
          </a-select>
          <label for="poster">Affiche du film : </label>
          <input type="file" id="poster" name="poster" accept="image/*" @change="uploadFile">
          <div class="modal-footer">
            <input type="submit" value="Valider la création">
          </div>
        </form>
      </div>
    </div>
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


.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 20%;
  left: 0;
  width: 100%;
  height: 60vh;
}
.modal-header {
  padding: 2px 16px;
  color: black;
  display: flex;
}

.modal-header h2 {
  margin-left: 30%;
}

.modal-body {
  padding: 2px 16px;
  color: black;
}

.modal-footer {
  padding: 2px 16px;
  color: black;
}

.modal-content {
  border-radius: 0.75rem;
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  width: 550px;
  animation-name: animatetop;
  animation-duration: 0.4s
}

@-webkit-keyframes animatetop {
  from {
    top: -300px;
    opacity: 0
  }
  to {
    top: 0;
    opacity: 1
  }
}

@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0
  }
  to {
    top: 0;
    opacity: 1
  }
}

/* The Close Button */
.close {
  color: #000000;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #ff00e9;
  text-decoration: none;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.modal-body form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.modal-body label,
.modal-body input {
  width: 100%;
  margin-bottom: 10px;
}

</style>
