<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue';
import axios from 'axios';
let data = ref('');
let editedMovieTitle = ref('');

const route = useRoute();
const movieId = route.params.movieId;
try {
  const token = localStorage.getItem('token')
  onMounted(async () => {
    const response = await axios.get('http://localhost/public/api/movies/' + movieId,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
    data.value = response.data
  });
}  catch (error) {
  console.log('Error', error)
  console.log('Error', error.response.data.code)
  if (error.response.data.code === 401) {
    location.href = '/login'
  }
}

function toggleDetails()
{
  let modal = document.getElementById("formulaire")
  modal.style.display = "block";
  editedMovieTitle = data.value.title
}

function formShow(currentId) {


  if (document.querySelector('.form-container').style.display == 'none') {
  } else {
    document.querySelector('.form-container').style.display = 'none';
  }
}

async function updateMovieTitle() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push('/login')
      return;
    }
    const updatedMovie = {
      title: this.editedMovieTitle.value
    };


  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

</script>

<template>
  <div class="dataMovie" v-if="data">

    <h1>Nom du film : {{data.title}}</h1>
    <p>Description : {{data.description}}</p>
    <p>Date de sortie : {{data.releaseDate}}</p>
    <p>Genre : {{data.category}}</p>
    <p>Acteurs : {{data.actors}}</p>
    <p>Durée : {{data.duration}} minutes.</p>
    <a @click="toggleDetails()">Edition du titre</a>

  <div class="form-container" id="formulaire" style="display: none">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <span @click="formShow()" class="close">&times;</span>
        <h2>Modification du titre</h2>
      </div>
      <div class="modal-body">
        <form action="http://localhost/public/api/movies/{{data.id}}" method="post">
          <label for="title">Titre du film : </label>
          <input type="text" id="editedMovieTitle" name="title" v-model="editedMovieTitle">
        </form>
      </div>
      <div class="modal-footer">
        <input type="submit" value="Valider la modification">
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
  margin-left : 30px;
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
.modal-body {padding: 2px 16px;
color: black;
}
/* Modal Footer */
.modal-footer {
  padding: 2px 16px;
  color: black;
}

/* Modal Content */
.modal-content {
  border-radius:0.75rem;
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  width: 550px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  animation-name: animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}

@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
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