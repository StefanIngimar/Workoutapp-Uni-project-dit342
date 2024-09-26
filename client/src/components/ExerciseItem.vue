<template>
    <div class="exercise-list">
        <div class="exercise-container">
            <p>Name: {{ exercise.name }}</p>
            <p>Bodypart: {{ exercise.bodyPart }}</p>
            <p>Bodyweight: {{ exercise.hasWeight }}</p>
            <p>Weight: {{ exercise.weight }}</p>
            <p>Reps: {{ exercise.reps }}</p>
            <p>Sets: {{ exercise.sets }}</p>
            <b-button class="btn_message" variant="danger" v-on:click="deleteExercise(exercise._id)">X</b-button>
        </div>
    </div>


</template>

<script>
import Exercises from '@/views/Exercises.vue';
import { Api } from '@/Api'

export default {
    name: 'exercise-item',
    props: ['exercise'],
    methods: {
        deleteExercise(exerciseID) {
            Api.delete(`/v1/exercises/${exerciseID}`)
                .then((response) => {
                    this.$emit('exercise-deleted', response.data);
                })
                .catch((error) => {
                    this.$emit('exercise-deleted', response.data);
                });


        }
    },
}

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