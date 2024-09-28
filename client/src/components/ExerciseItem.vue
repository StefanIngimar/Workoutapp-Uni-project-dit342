<template>
    <div class="exercise-list">
      <div class="exercise-container">
        <div v-if="isEditing">
          <p>Name: <input v-model="editExercise.name" /></p>
          <p>Bodypart: <input v-model="editExercise.bodyPart" /></p>
          <p>Bodyweight: <input type="checkbox" v-model="editExercise.hasWeight" /></p>
          <p>Weight: <input type="number" v-model="editExercise.weight" /></p>
          <p>Reps: <input type="number" v-model="editExercise.reps" /></p>
          <p>Sets: <input type="number" v-model="editExercise.sets" /></p>

          <b-button class="btn_message" variant="success" v-on:click="saveExercise">Save</b-button>
          <b-button class="btn_message" variant="danger" v-on:click="cancelEdit">Cancel</b-button>
        </div>
  
        <div v-else>

          <p>Name: {{ exercise.name }}</p>
          <p>Bodypart: {{ exercise.bodyPart }}</p>
          <p>Bodyweight: {{ exercise.hasWeight }}</p>
          <p>Weight: {{ exercise.weight }}</p>
          <p>Reps: {{ exercise.reps }}</p>
          <p>Sets: {{ exercise.sets }}</p>

          <b-button class="btn_message" variant="danger" v-on:click="$emit('exercise-deleted', exercise._id)">X</b-button>
          <b-button class="btn_message" variant="primary" v-on:click="toggleEdit">Edit</b-button>
        </div>
      </div>
    </div>
  </template>
  

<script>
import { Api } from '@/Api'

export default {
  name: 'exercise-item',
  props: ['exercise'],
  data() {
    return {
      isEditing: false, 
      editExercise: { ...this.exercise }
    };
  },
  methods: {
    toggleEdit() {
      this.isEditing = true;
      this.editExercise = { ...this.exercise }; 
    },
    cancelEdit() {
      this.isEditing = false;
      this.editExercise = { ...this.exercise };
    },
    saveExercise() {
      Api.patch(`/v1/exercises/${this.exercise._id}`, this.editExercise)
        .then((response) => {
          this.isEditing = false; 
          this.$emit('exercise-updated', response.data);
        })
        .catch((error) => {
          console.error('Error saving exercise:', error);
        });
    },
    deleteExercise(exerciseID) {
      Api.delete(`/v1/exercises/${exerciseID}`)
        .then((response) => {
          this.$emit('exercise-deleted', response.data);
        })
        .catch((error) => {
          console.error('Error deleting exercise:', error);
        });
    }
  }
};
</script>

<style scoped>
.exercise-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.exercise-container {
  background-color: bisque;
  padding: 10px;
  margin: 10px;
  width: 300px;
  border: 2px solid;
  border-color: rgb(0, 0, 0);
}

.exercise-container p {
  margin: 0;
  padding: 1px 0;
}
</style>