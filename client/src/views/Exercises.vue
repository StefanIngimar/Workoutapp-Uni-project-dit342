<template>
  <div v-if="this.user">
    <label>
      <h1>Exercises</h1>
    </label>
    <div class="col-md-12">
      <div class="form">
        <p>Exercise name:</p>
        <p><input class="input" v-model="name" placeholder="Chest press" /></p>
        <p>Weighted: <input class="input" type="checkbox" v-model="hasWeights" /></p>
        <p>Bodypart:</p>
        <p><input class="input" v-model="bodyPart" placeholder="Chest" /></p>
        <p>Weight:</p>
        <p><input class="input" type="number" v-model="weight" placeholder="100" /></p>
        <p>Reps:</p>
        <p><input class="input" type="number" v-model="reps" placeholder="2" /></p>
        <p>Sets:</p>
        <p><input class="input" type="number" v-model="sets" placeholder="2" /></p>
        <b-button class="btn_message" variant="primary" v-on:click="postExercise()">Submit Exercise</b-button>
      </div>
    </div>

    <div v-if="this.user.isAdmin">
      <b-button class="btn_message" variant="danger" v-on:click="deleteAllExercises()">Delete All Exercises</b-button>
    </div>

    <div v-if="postMessage">
      <p>Created/Last edited exercise: </p>
      <exercise-item v-bind:exercise="postMessage" @exercise-deleted="handleExerciseDeleted" @delete-error="handleError"
        @exercise-updated="handleExerciseUpdated(postMessage._id)" />
    </div>

    <div>
      <h2>Previous exercises:</h2>
      <p>
        {{ exerciseMessage }}
      </p>
    </div>

    <div class="searchForm">
      <b-form-input v-on:input="searchExercise" v-model="searchText" placeholder="Search"> </b-form-input>
    </div>

    <div class="exercise-list">
      <div v-for="exercise in exercises" v-bind:key="exercise._id">
        <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted"
          @error-detected="handleError" @exercise-updated="handleExerciseUpdated(exercise._id)" />
      </div>
    </div>
  </div>
  <div v-else>
    User not signed in.
  </div>
</template>

<script>
import ExerciseItem from '@/components/ExerciseItem.vue'
import { Api } from '@/Api'

export default {
  name: 'exercises',
  components: {
    ExerciseItem
  },
  methods: {
    handleExerciseUpdated(exerciseID) {
      // GET request to daily session api with query parameters to display the appropirate data for that user.
      Api.get(`/v1/dailysessions?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.sessions = response.data
          Api.get(`/v1/exercises/${exerciseID}`)
            .then((response) => {
              this.updatedExercise = response.data
              // Update display card if any.
              if (this.postMessage) {
                this.postMessage = response.data
              }
            })
            .then(() => {
              // Iterate over all sessions to update the session containing the perticular exercise.
              const patchRequests = this.sessions.map((session) => {
                return Api.patch(`/v1/dailysessions/${session._id}/exercises/${exerciseID}`, this.updatedExercise)
              })
              return Promise.all(patchRequests)
            })
        })
        .catch((error) => {
          console.error('Error deleting exercise:', error)
          this.exerciseMessage = error
        })
      // GET list of new exercises.
      Api.get(`/v1/exercises?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.exercises = response.data
          this.exerciseMessage = 'Exercise updated!'
        })
        .catch((error) => {
          console.error('Error deleting exercise:', error)
          this.exerciseMessage = error
        })
    },

    // Deletes an exercise also removes exercise from session.
    handleExerciseDeleted(exerciseID) {
      Api.get(`/v1/dailysessions?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.sessions = response.data
          const patchRequests = this.sessions.map((session) => {
            return Api.patch(`/v1/dailysessions/${session._id}`, { exerciseID })
          })
          return Promise.all(patchRequests)
        })
        .then(() => {
          return Api.delete(`/v1/exercises/${exerciseID}`)
        })
        .then(() => {
          return Api.get(`/v1/exercises?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        })
        .then((response) => {
          this.exercises = response.data
          this.exerciseMessage = 'Exercise deleted!'
          this.postMessage = ''
        })
        .catch((error) => {
          console.error('Error deleting exercise:', error)
          this.exerciseMessage = error
        })
    },

    handleError() {
      this.exerciseMessage = error
    },

    // Post new exercise and update the displayed collection.
    postExercise() {
      Api.post('/v1/exercises',
        {
          name: this.name,
          hasWeights: this.hasWeights,
          weight: this.weight,
          bodyPart: this.bodyPart,
          isCustom: this.isCustom,
          reps: this.reps,
          sets: this.sets,
          userID: this.user._id
        }
      )
        .then((response) => {
          this.postMessage = response.data
          Api.get(`/v1/exercises?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
            .then((response) => {
              this.exercises = response.data
            })
            .catch((error) => {
              this.exerciseMessage = error
            })
        })
        .catch((error) => {
          this.exerciseMessage = error
        })
    },

    // Search by get request containing querys. If search text is empty diplay whole collection associated with that user. Whole collection if admin.
    searchExercise() {
      Api.get(`/v1/exercises/search?name=${this.searchText}&userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.exercises = response.data
          if (this.searchText === '') {
            Api.get(`/v1/exercises?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
              .then((response) => {
                this.exercises = response.data
              })
              .catch((error) => {
                this.exercises = error
              })
          }
        })
        .catch((error) => {
          this.exerciseMessage = error
        })
    },
    //Deletes whole exercises collection.
    deleteAllExercises() {
      Api.delete('/v1/exercises', { isAdmin: this.user.isAdmin })
        .then((response) => {
          this.postMessage = ''
          this.exercises = response.data
          this.exerciseMessage = 'All Exercises deleted!' + this.user.isAdmin
        })
        .catch((error) => {
          this.exerciseMessage = error
        })
    },
    getUserInfo() {
      this.user = JSON.parse(localStorage.getItem('user'))
    }
  },

  mounted() { // Runs when page is loaded.
    this.getUserInfo()
    if (this.user) {
      Api.get(`/v1/exercises?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.exercises = response.data
        })
        .catch((error) => {
          this.exerciseMessage = error
        })
    }

  },
  data() {
    return {
      exercises: '',
      postMessage: '',
      name: '',
      hasWeights: false,
      weight: '',
      bodyPart: '',
      isCustom: true,
      reps: '',
      sets: '',
      searchText: '',
      exerciseMessage: '',
      sessions: '',
      updatedExercise: '',
      user: '',
      userID: ''
    }
  }
}
</script>

<style scoped>
.exercise-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}
</style>
