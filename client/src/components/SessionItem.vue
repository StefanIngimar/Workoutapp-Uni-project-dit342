<template>
  <div class="session-list">
    <div class="session-container">
      <div v-if="isEditing">
        <p>Name: <input v-model="editSession.sessionName" /></p>
        <p>Duration: <input type="number" v-model="editSession.duration" /></p>
        <p>Completed: <input type="checkbox" v-model="editSession.isCompleted" /></p>
        <p>Notes: <input v-model="editSession.notes" /></p>
        <p>Exercises:
        <div v-for="exercise in session.exercises" v-bind:key="exercise._id">
          <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted"
            @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated" />
        </div>
        </p>

        <div v-if="isAddingExercise">
          <p>Name: <input v-model="name" /></p>
          <p>Bodypart: <input v-model="bodyPart" /></p>
          <p>Bodyweight: <input type="checkbox" v-model="hasWeight" /></p>
          <p>Weight: <input type="number" v-model="weight" /></p>
          <p>Reps: <input type="number" v-model="reps" /></p>
          <p>Sets: <input type="number" v-model="sets" /></p>

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
          <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted"
            @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated" />
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
import ExerciseItem from './ExerciseItem.vue';

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
    };
  },
  methods: {
    toggleEdit() {
      this.isEditing = true;
      this.editSession = { ...this.session };
    },
    cancelEdit() {
      this.isEditing = false;
      this.editSession = { ...this.session };
    },
    saveSession() {
      Api.patch(`/v1/dailysessions/${this.session._id}`, this.editSession)
        .then((response) => {
          this.isEditing = false;
          this.$emit('session-updated', response.data);
        })
        .catch((error) => {
          console.error('Error saving session:', error);
        });
    },
    deleteSession(sessionID) {
      Api.delete(`/v1/dailysessions/${sessionID}`)
        .then((response) => {
          this.$emit('session-deleted', response.data);
        })
        .catch((error) => {
          console.error('Error deleting session:', error);
        });
    },
    addNewExercise() {
      Api.post(`/v1/dailysessions/${this.session._id}/exercises`,
        {
          name: this.name,
          hasWeights: this.hasWeights,
          weight: this.weight,
          bodyPart: this.bodyPart,
          isCustom: this.isCustom,
          reps: this.reps,
          sets: this.sets
        })
        .then((response) => {
          this.isAddingExercise = false;
          this.$emit('session-updated', response.data);
        })
        .catch((error) => {
          console.error('Error adding exercise to session:', error);
        });
    },
    toggleNewExercise() {
      this.isAddingExercise = !this.isAddingExercise;
    },
    handleExerciseUpdated() {
      Api.get(`/v1/dailysessions/${this.session._id}/exercises`)
        .then((response) => {
          this.session.exercises = response.data;
        })
        .catch((error) => {
          this.exerciseMessage = error;
        })
    },

    handleExerciseDeleted() {
      Api.get(`/v1/dailysessions/${this.session._id}/exercises`)
        .then((response) => {
          this.session.exercises = response.data;
          this.exerciseMessage = "Exercise deleted!";
        })
        .catch((error) => {
          this.exerciseMessage = error;
        })
    },
    handleDeleteError() {
      this.exerciseMessage = error;
    },
  }
};
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
  background-color: gray;
  padding: 10px;
  margin: 10px;
  width: 300px;
  border: 2px solid;
  border-color: rgb(0, 0, 0);
}

.session-container p {
  margin: 0;
  padding: 1px 0;
}
</style>