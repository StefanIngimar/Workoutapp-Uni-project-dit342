<template>
  <div class="session-list">
    <div class="session-container">
      <div v-if="isEditing">
        <p>Name: <input v-model="editSession.name" /></p>
        <p>Duration: <input type="number" v-model="editSession.duration" /></p>
        <p>Completed: <input type="checkbox" v-model="editSession.isCompleted" /></p>
        <p>Notes: <input v-model="editSession.notes" /></p>
        <p>Exercises:
        <div v-for="exercise in session.exercises" v-bind:key="exercise._id">
          <exercise-item v-bind:exercise="exercise" />
        </div>
        </p>

        <div v-if="isAddingExercise">
          <p>Name: <input v-model="exercise.name" /></p>
          <p>Bodypart: <input v-model="exercise.bodyPart" /></p>
          <p>Bodyweight: <input type="checkbox" v-model="exercise.hasWeight" /></p>
          <p>Weight: <input type="number" v-model="exercise.weight" /></p>
          <p>Reps: <input type="number" v-model="exercise.reps" /></p>
          <p>Sets: <input type="number" v-model="exercise.sets" /></p>

          <b-button class="btn_message" variant="success" v-on:click="addNewExercise">Save</b-button>
          <b-button class="btn_message" variant="danger" v-on:click="toggleNewExercise">Cancel</b-button>
        </div>

        <b-button class="btn_message" variant="primary" v-on:click="toggleNewExercise">Add Exercise</b-button>

        <b-button class="btn_message" variant="success" v-on:click="saveSession">Save</b-button>
        <b-button class="btn_message" variant="danger" v-on:click="cancelEdit">Cancel</b-button>
      </div>

      <div v-else>

        <p>Name: {{ session.name }}</p>
        <p>Completed: {{ session.isCompleted }}</p>
        <p>Duration: {{ session.duration }}</p>
        <p>Notes: {{ session.notes }}</p>
        <p>Exercises:
        <div v-for="exercise in session.exercises" v-bind:key="exercise._id">
          <exercise-item v-bind:exercise="exercise" />
        </div>
        </p>

        <b-button class="btn_message" variant="danger" v-on:click="deleteSession(session._id)">X</b-button>
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
      editSession: { ...this.session }
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
      Api.patch(`/v1/session/${this.session._id}`, this.editSession)
        .then((response) => {
          this.isEditing = false;
          this.$emit('session-updated', response.data);
        })
        .catch((error) => {
          console.error('Error saving session:', error);
        });
    },
    deleteSession(exerciseID) {
      Api.delete(`/v1/session/${exerciseID}`)
        .then((response) => {
          this.$emit('session-deleted', response.data);
        })
        .catch((error) => {
          console.error('Error deleting session:', error);
        });
    },
    addNewExercise() {
      Api.post(`/v1/session/${this.session._id}/exercise`, this.exercise)
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
    }
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