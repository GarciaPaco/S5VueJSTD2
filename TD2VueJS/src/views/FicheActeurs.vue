<script setup>
import {useRoute} from 'vue-router'
import {onMounted, ref} from 'vue';
import axios from 'axios';
import moment from 'moment';
import { nextTick } from 'vue';


const apiUrl = import.meta.env.VITE_API_URL;

let data = ref('');
let editedMovieTitle = ref('');
let editedDateRelease = ref('');
let editedDuration = ref('');
let editedDescription = ref('');
let editedCategory = ref('');
let editedActors = ref([]);
let categories = ref('');
let actors = ref([]);
const route = useRoute();
let movieId = route.params.movieId;
movieId = movieId.split('/').pop();



async function checkToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      location.href = '/login'
    }
  } catch (error) {
    console.log('Error', error)
    console.log('Error', error.response.data.code)
    if (error.response.data.code === 401) {
      location.href = '/login'
    }
  }
}

async function refreshMovie() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(apiUrl +'/movies/' + movieId,
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

async function updateMovie() {
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
      actor: editedActors.value
    };
    const response = await fetch(apiUrl +`/movies/`+movieId, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify(updatedMovie),
    });

    if (response.status === 200) {
      formHide();
      await refreshMovie(movieId);
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}
function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}
function formHide(currentId) {
    editedMovieTitle.value = null
    editedDateRelease.value = null
    editedDuration.value = null
    editedDescription.value = null
    editedCategory.value = null
    editedActors.value = null
    document.querySelector('.form-container').style.display = 'none';
}
function convertDate(date, format = 'DD/MM/YYYY') {
  return moment(date).format(format);
}
function formShow() {

  let modal = document.getElementById("formulaire")
  modal.style.display = "block";
  editedMovieTitle.value = data.value.title
  editedDateRelease.value = convertDate(data.value.releaseDate, 'YYYY-MM-DD')
  editedDuration.value = data.value.duration
  editedDescription.value = data.value.description
  editedCategory.value = data.value.category['@id']
  editedActors.value = data.value.actor.map(actor => actor['@id']);
}

function deletMovie() {
  const token = localStorage.getItem('token')
  if (!token) {
    this.$router.push('/login')
    return;
  }
  // Ajout de la confirmation de suppression
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
    fetch(apiUrl +`/movies/`+movieId, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => {
      if (response.status === 204) {
        location.href = '/movies'
      }
    });
  }
}

  onMounted(async () => {

    await checkToken()
    const token = localStorage.getItem('token')
    const response = await axios.get(apiUrl +'/movies/' + movieId,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
    data.value = response.data
    await getCategories()
    await getActors()
  });

</script>

<template>
  <div class="dataMovie" v-if="data">
    <h1>Nom du film : {{ data.title }}</h1>
    <p>Description : {{ data.description }}</p>
    <p>Date de sortie : {{ formatDate(data.releaseDate) }}</p>
    <p>Catégorie : {{ data.category.name }}</p>
    <p>Acteur(s) : <span v-for="actor in data.actor"><br> {{ actor.firstName }} {{actor.lastName}}</span></p>
    <p>Durée : {{ data.duration }} minutes.</p>
    <a @click="formShow()">Editer le film<br></a>
    <a @click="deletMovie()">Supprimer le film</a>

    <div class="form-container" id="formulaire" style="display: none">
      <div class="modal-content">
        <div class="modal-header">
          <span @click="formHide()" class="close">&times;</span>
          <h2>Titre : {{ data.title }}</h2>
        </div>

        <div class="modal-body">
          <form action= "{{apiUrl}}+/movies/{{data.id}}" method="post"  @submit.prevent="updateMovie" >
            <label for="title">Nouveau titre : </label>
            <input type="text" id="editedMovieTitle" name="title" v-model="editedMovieTitle">
            <label for="releaseDate">Nouvelle date de sortie : </label>
            <input type="date" id="editedDateRelease" name="releaseDate" v-model="editedDateRelease">
            <label for="duration">Nouvelle durée : </label>
            <input type="number" id="editedDuration" name="duration" v-model="editedDuration">
            <label for="description">Nouvelle description : </label>
            <input type="text" id="editedDescription" name="description" v-model="editedDescription">
            <label for="category">Changer la catégorie catégorie : </label>
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
            <div class="modal-footer">
            <input type="submit" value="Valider la modification">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
</template>

<style>
.dataMovie {
  margin-left: 30px;
}

.form-container {
}

/* Modal Header */
.modal-header {
  padding: 2px 16px;
  color: black;
  display: flex;
}

.modal-header h2 {
  margin-left: 30%;
}

/* Modal Body */
.modal-body {
  padding: 2px 16px;
  color: black;
}

/* Modal Footer */
.modal-footer {
  padding: 2px 16px;
  color: black;
}

/* Modal Content */
.modal-content {
  border-radius: 0.75rem;
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  width: 550px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  animation-name: animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
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

</style>