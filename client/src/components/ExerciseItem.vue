<template>
  <div class="exercise-list">
    <div class="exercise-container">
      <div v-if="isEditing">
        <p>Name:</p>
        <p><input class="input" v-model="editExercise.name" /></p>
        <p>Bodypart:</p>
        <p><input class="input" v-model="editExercise.bodyPart" /></p>
        <p>Weighted: <input type="checkbox" v-model="editExercise.hasWeight" /></p>
        <p>Weight:</p>
        <p><input class="input" type="number" v-model="editExercise.weight" /></p>
        <p>Reps:</p>
        <p><input class="input" type="number" v-model="editExercise.reps" /></p>
        <p>Sets:</p>
        <p><input class="input" type="number" v-model="editExercise.sets" /></p>

        <b-button class="btn_message" variant="success" v-on:click="saveExercise">Save</b-button>
        <b-button class="btn_message" variant="danger" v-on:click="cancelEdit">Cancel</b-button>
      </div>

      <div v-else>

        <p>Name: {{ exercise.name }}</p>
        <p>Bodypart: {{ exercise.bodyPart }}</p>
        <p>Weighted: {{ exercise.hasWeight }}</p>
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
      // Copy of this exercise item for editing.
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
      // Send patch to exercises api with the edited copy.
      Api.patch(`/v1/exercises/${this.exercise._id}`, this.editExercise)
        .then((response) => {
          this.isEditing = false;
          // Notify other views of update.
          this.$emit('exercise-updated', response.data);
        })
        .catch((error) => {
          // Notify other views of error with saving exercise.
          this.$emit('error-detected', error);
          console.error('Error saving exercise:', error);
        });
    },
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(63, 66, 62);
  padding: 10px;
  margin: 10px;
  width: 300px;
  border: 2px solid;
  border-radius: 5%;
  border-color: rgb(124, 128, 121);
}

.exercise-container p {
  margin: 0;
  padding: 1px 0;
}
</style>
