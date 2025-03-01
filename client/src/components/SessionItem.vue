<template>
  <div class="session-list">
    <div class="session-container">
      <div v-if="isEditing">
        <div class="sub-form">
          <p>Name:</p>
          <p><input class="input" v-model="editSession.sessionName" /></p>
          <p>Duration:</p>
          <p><input class="input" type="number" v-model="editSession.duration" /></p>
          <p>Completed: <input type="checkbox" v-model="editSession.isCompleted" /></p>
          <p>Notes:</p>
          <p><input class="input" v-model="editSession.notes" /></p>
          <p>Exercises:
          <div v-for="exercise in session.exercises" v-bind:key="exercise._id">
            <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted(exercise._id)"
              @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated(exercise._id)" />
          </div>
          </p>
        </div>

        <div v-if="isAddingExercise">
          <div class="sub-form">
            <p>Name:</p>
            <p><input class="input" v-model="name" /></p>
            <p>Bodypart:</p>
            <p><input class="input" v-model="bodyPart" /></p>
            <p>Weighted: <input type="checkbox" v-model="hasWeights" /></p>
            <p>Weight:</p>
            <p><input class="input" type="number" v-model="weight" /></p>
            <p>Reps:</p>
            <p><input class="input" type="number" v-model="reps" /></p>
            <p>Sets:</p>
            <p><input class="input" type="number" v-model="sets" /></p>
          </div>

          <b-button class="btn_message" variant="success" v-on:click="addNewExercise">Submit</b-button>
          <b-button class="btn_message" variant="danger" v-on:click="toggleNewExercise">Cancel</b-button>
        </div>

        <b-button class="btn_message" variant="primary" v-on:click="toggleNewExercise">Add Exercise</b-button>

        <b-button class="btn_message" variant="success" v-on:click="saveSession">Save</b-button>
        <b-button class="btn_message" variant="danger" v-on:click="cancelEdit">Cancel</b-button>
      </div>

      <div v-else>

        <p>Name: {{ session.sessionName }}</p>
        <p>Completed: {{ session.isCompleted }}</p>
        <p>Duration: {{ session.duration }}</p>
        <p>Notes: {{ session.notes }}</p>
        <p>Exercises:
        <div v-for="exercise in session.exercises" v-bind:key="exercise._id">
          <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted(exercise._id)"
            @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated(exercise._id)" />
        </div>
        </p>
        <p> {{ exerciseMessage }}</p>
        <b-button class="btn_message" variant="danger" v-on:click="deleteSession(this.session._id, this.session.workoutLogID)">X</b-button>
        <b-button class="btn_message" variant="primary" v-on:click="toggleEdit">Edit</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import ExerciseItem from './ExerciseItem.vue'
import { EventBus } from '@/Eventbus'

export default {
  name: 'session-item',
  props: ['session'],
  components: {
    ExerciseItem
  },
  data() {
    return {
      isAddingExercise: false,
      isEditing: false,
      exercise: '',
      editSession: { ...this.session },
      exerciseMessage: '',
      name: '',
      hasWeights: false,
      weight: '',
      bodyPart: '',
      isCustom: true,
      reps: '',
      sets: '',
      updatedExercise: ''
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = true
      this.editSession = { ...this.session }
    },
    cancelEdit() {
      this.isEditing = false
      this.editSession = { ...this.session }
    },
    saveSession() {
      // PATCH request to api with the edited copy. 
      Api.patch(`/v1/dailysessions/${this.session._id}`, this.editSession)
        .then((response) => {
          this.isEditing = false
          // Emit to other views of session updated.
          this.$emit('session-updated', response.data)
  
          if (response.data.isCompleted) {
            // If the return data for session keeps a true isCompleted boolean then emit to listnener that session is completed. 
            EventBus.emit('session-completed', response.data)
            console.log('Session completed event emitted')
          }
        })
        .catch((error) => {
          // Emit to other views of session struck an error.
          this.$emit('error-detected', error)
          console.error('Error saving session:', error)
        })
    },
    deleteSession(sessionID, workoutLogID) {
      // DELETE request to api with session id.
      Api.delete(`/v1/dailysessions/${sessionID}`)
        .then((response) => {
          console.log('Response data:', response.data)
          console.log('Workout log ID:', workoutLogID)
          Api.delete(`/v1/workoutlogs/${workoutLogID}`) //delete workoutlog when session is deleted
          .then(() => {
            // Emit session deleted to other views.
            this.$emit('session-deleted')
          })
        })
        .catch((error) => {
          // Emit to other views of session struck an error.
          this.$emit('error-detected', error)
          console.error('Error deleting session:', error)
        })
    },
    addNewExercise() {
      // Retrive userdata from local storage. 
      const user = JSON.parse(localStorage.getItem('user'))

      // POST request to add a new exercise to the daily session
      Api.post(`/v1/dailysessions/${this.session._id}/exercises`, {
        name: this.name,
        hasWeights: this.hasWeights,
        weight: this.weight,
        bodyPart: this.bodyPart,
        isCustom: this.isCustom,
        reps: this.reps,
        sets: this.sets,
        userID: user._id
      })
        .then((response) => {
          console.log('Response data:', response.data)
          // Add the new session to the workout log. 
          Api.put(`/v1/workoutlogs/${response.data.session.workoutLogID}/dailysessions/${response.data.session._id}`)
          this.isAddingExercise = false
          // Emit session updated to other views
          this.$emit('session-updated', response.data)
          if (response.data.isCompleted) {
            // If the return data for session keeps a true isCompleted boolean then emit to listnener that session is completed. 
            EventBus.emit('session-completed')
            console.log('Session completed event emitted')
          }
        })
        .catch((error) => {
          // Emit to other views of session struck an error.
          this.$emit('error-detected', error)
          console.error('Error adding exercise or updating workout log:', error)
        })
    },
    toggleNewExercise() {
      this.isAddingExercise = !this.isAddingExercise
    },
    handleExerciseUpdated(exID) {
      // GET request to exercise/:id to update the exercise within the session item. 
      Api.get(`/v1/exercises/${exID}`)
        .then((response) => {
          this.updatedExercise = response.data
        })
        .then(() => {
          // Update the exercise within the session item.
          Api.patch(`/v1/dailysessions/${this.session._id}/exercises/${exID}`, this.updatedExercise)
            .then(() => {
              // GET request with newly updated list of exercises within session item. 
              Api.get(`/v1/dailysessions/${this.session._id}/exercises`)
                .then((response) => {
                  this.session.exercises = response.data
                })
            })
        })
        .catch((error) => {
          this.exerciseMessage = error
        })
    },

    handleExerciseDeleted(exerciseId) {
      // Removes an exercise within session item.
      Api.patch(`/v1/dailysessions/${this.session._id}`,
        {
          exerciseID: exerciseId
        }
      )
        .then((response) => {
          this.$emit('session-updated', response.data)
          // GET updated the exercises list within the session item.
          Api.get(`/v1/dailysessions/${this.session._id}/exercises`)
            .then((response) => {
              this.session.exercises = response.data
            })
    
            .catch((error) => {
              this.exerciseMessage = error
            })
          this.exerciseMessage = 'Exercise deleted!'
          
        })
        .catch((error) => {
          this.exerciseMessage = error
        })
    },
    handleDeleteError() {
      this.exerciseMessage = error
    }
  }
}
</script>

<style scoped>
.session-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.session-container {
  background-color: rgb(80, 85, 79);
  padding: 10px;
  margin: 10px;
  width: 300px;
  border: 2px solid;
  border-radius: 5%;
  border-color: rgb(122, 125, 121);
}

.session-container p {
  margin: 0;
  padding: 1px 0;
}
</style>
