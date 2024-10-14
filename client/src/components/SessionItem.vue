<template>
  <div class="session-list">
    <div class="session-container">
      <div v-if="isEditing">
        <div class="sub-form">
          <p>Name:</p><p><input class="input" v-model="editSession.sessionName" /></p> 
          <p>Duration:</p><p><input class="input" type="number" v-model="editSession.duration" /></p>
          <p>Completed: <input type="checkbox" v-model="editSession.isCompleted" /></p>
          <p>Notes:</p><p><input class="input" v-model="editSession.notes" /></p>
          <p>Exercises:
          <div v-for="exercise in session.exercises" v-bind:key="exercise._id">
            <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted(exercise._id)"
              @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated(exercise._id)" />
          </div>
          </p>
        </div>


        <div v-if="isAddingExercise">
          <div class="sub-form">
            <p>Name:</p><p><input class="input" v-model="name" /></p>
            <p>Bodypart:</p><p><input class="input" v-model="bodyPart" /></p>
            <p>Weighted: <input type="checkbox" v-model="hasWeights" /></p>
            <p>Weight:</p><p><input class="input" type="number" v-model="weight" /></p>
            <p>Reps:</p><p><input class="input" type="number" v-model="reps" /></p>
            <p>Sets:</p><p><input class="input" type="number" v-model="sets" /></p>
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
        <b-button class="btn_message" variant="danger" v-on:click="deleteSession(this.session._id)">X</b-button>
        <b-button class="btn_message" variant="primary" v-on:click="toggleEdit">Edit</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import ExerciseItem from './ExerciseItem.vue'

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
      Api.patch(`/v1/dailysessions/${this.session._id}`, this.editSession)
        .then((response) => {
          this.isEditing = false
          this.$emit('session-updated', response.data)
        })
        .catch((error) => {
          this.$emit('error-detected', error);
          console.error('Error saving session:', error)
        })
    },
    deleteSession(sessionID) {
      Api.delete(`/v1/dailysessions/${sessionID}`)
        .then((response) => {
          this.$emit('session-deleted', response.data)
        })
        .catch((error) => {
          this.$emit('error-detected', error);
          console.error('Error deleting session:', error)
        })
    },
    addNewExercise() {
  var user = JSON.parse(localStorage.getItem('user'));

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
    console.log("Response data:", response.data);
    Api.put(`/v1/workoutlogs/${response.data.session.workoutLogID}/dailysessions/${response.data.session._id}`);
    this.isAddingExercise = false;
    this.$emit('session-updated', response.data);})
    

    // PUT request to update the workout log with the new session
  .catch((error) => {
    this.$emit('error-detected', error);
    console.error('Error adding exercise or updating workout log:', error);
  });
},
    toggleNewExercise() {
      this.isAddingExercise = !this.isAddingExercise
    },
    handleExerciseUpdated(exID) {
      Api.get(`/v1/exercises/${exID}`)
        .then((response) => {
          this.updatedExercise = response.data
        })
        .then(() => {
          Api.put(`/v1/dailysessions/${this.session._id}/exercises/${exID}`, this.updatedExercise)
            .then(() => {
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
      Api.patch(`/v1/dailysessions/${this.session._id}`,
        {
          exerciseID: exerciseId
        }
      )
        .then((response) => {
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
