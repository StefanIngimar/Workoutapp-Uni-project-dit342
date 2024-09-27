<template>
    <div>
        <div class="form">
            <input v-model="name" placeholder="Exercise name" />
            <p>Weighted: <input type="checkbox" v-model="hasWeights" /></p>
            <input v-model="bodyPart" placeholder="Bodypart" />
            <input type="number" v-model="weight" placeholder="Weight" />
            <input type="number" v-model="reps" placeholder="Reps" />
            <input type="number" v-model="sets" placeholder="Sets" />
        </div>

        <b-button class="btn_message" variant="primary" v-on:click="postExercise()">Submit Exercise</b-button>
        <b-button class="btn_message" variant="danger" v-on:click="deleteAllExercises()">Delete All Exercises</b-button>

        <div v-if="postMessage">
            <p>Created exercise: </p>
            <exercise-item v-bind:exercise="postMessage" @exercise-deleted="handleExerciseDeleted"
                @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated" />
        </div>

        <div>
            <label>
                <h1>Exercises</h1>
            </label>
            <p>
                {{ exerciseMessage }}
            </p>
        </div>

        <div class="searchForm">
            <b-form-input v-on:input="searchExercise" v-model="searchText" placeholder="Search"> </b-form-input>
        </div>


        <div v-for="exercise in exercises" v-bind:key="exercise._id">
            <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted"
                @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated" />
        </div>

    </div>
    <my-footer />
</template>

<script>
import MyFooter from '@/components/MyFooter.vue'
import ExerciseItem from '@/components/ExerciseItem.vue'
import { Api } from '@/Api'
import { BFormGroup } from 'bootstrap-vue-next';

export default {
    name: 'exercises',
    components: {
        MyFooter,
        ExerciseItem
    },
    methods: {
        handleExerciseUpdated() {
            Api.get('/v1/exercises')
                .then((response) => {
                    this.exercises = response.data;
                    this.exerciseMessage = "Exercise updated!";
                })
                .catch((error) => {
                    this.exerciseMessage = error;
                })
        },

        handleExerciseDeleted() {
            Api.get('/v1/exercises')
                .then((response) => {
                    this.postMessage = '';
                    this.exercises = response.data;
                    this.exerciseMessage = "Exercise deleted!";
                })
                .catch((error) => {
                    this.exerciseMessage = error;
                })
        },
        handleDeleteError() {
            this.exerciseMessage = error;
        },
        postExercise() {
            Api.post('/v1/exercises',
                {
                    name: this.name,
                    hasWeights: this.hasWeights,
                    weight: this.weight,
                    bodyPart: this.bodyPart,
                    isCustom: this.isCustom,
                    reps: this.reps,
                    sets: this.sets
                }
            )
                .then((response) => {
                    this.postMessage = response.data
                    Api.get('/v1/exercises')
                        .then((response) => {
                            this.exercises = response.data
                        })
                        .catch((error) => {
                            this.exercises = error
                        })
                })
                .catch((error) => {
                    this.postMessage = error
                })
        },
        searchExercise() {
            console.log("Search text received: ", this.searchText);
            Api.get(`/v1/exercises/search?name=${this.searchText}`)
                .then((response) => {
                    this.exercises = response.data
                    if (this.searchText === '') {
                        Api.get('/v1/exercises')
                            .then((response) => {
                                this.exercises = response.data
                            })
                            .catch((error) => {
                                this.exercises = error
                            })
                    }
                })
                .catch((error) => {
                    this.exercises = error
                })
        },
        deleteAllExercises() {
            Api.delete('/v1/exercises')
                .then((response) => {
                    this.postMessage = '';
                    this.exercises = response.data;
                    this.exerciseMessage = "All Exercises deleted!";
                })
                .catch((error) => {
                    this.exerciseMessage = error;
                })
        }
    },

    mounted() { // Runs when page is loaded.
        Api.get('/v1/exercises')
            .then((response) => {
                this.exercises = response.data
            })
            .catch((error) => {
                this.exercises = error
            })
    },
    data() {
        return {
            exercises: '',
            message: 'none',
            postMessage: '',
            name: '',
            hasWeights: false,
            weight: '',
            bodyPart: '',
            isCustom: true,
            reps: '',
            sets: '',
            searchText: '',
            exerciseMessage: ''
        }
    }
}
</script>

<style scoped>
.form {
    margin-left: 800px;
    margin-right: 800px;
    padding: 50px;
    background-color: rgb(125, 190, 221);
}

.searchForm {
    margin-left: 800px;
    margin-right: 800px;
}
</style>