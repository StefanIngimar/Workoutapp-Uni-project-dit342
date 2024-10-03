<template>
    <div>
        <label>
            <h1>Exercises</h1>
        </label>
        <div class="form">
            <p>Exercise name:<input class="input" v-model="name" placeholder="Chest press" /></p>
            <p>Weighted: <input class="input" type="checkbox" v-model="hasWeights" /></p>
            <p>Bodypart:<input class="input" v-model="bodyPart" placeholder="Chest" /></p>
            <p>Weight:<input class="input" type="number" v-model="weight" placeholder="100" /></p>
            <p>Reps:<input class="input" type="number" v-model="reps" placeholder="2" /></p>
            <p>Sets:<input class="input" type="number" v-model="sets" placeholder="2" /></p>
            <b-button class="btn_message" variant="primary" v-on:click="postExercise()">Submit Exercise</b-button>
        </div>
        <b-button class="btn_message" variant="danger" v-on:click="deleteAllExercises()">Delete All Exercises</b-button>

        <div v-if="postMessage">
            <p>Created exercise: </p>
            <exercise-item v-bind:exercise="postMessage" @exercise-deleted="handleExerciseDeleted"
                @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated(exercise._id)" />
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
                    @delete-error="handleDeleteError" @exercise-updated="handleExerciseUpdated(exercise._id)" />
            </div>
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
        handleExerciseUpdated(exerciseID) {
            Api.get('/v1/dailysessions')
                .then((response) => {
                    Api.get(`/v1/exercises/${exerciseID}`)
                        .then((response) => this.updatedExercise = response.data).then(() => {
                            this.sessions = response.data;
                            const patchRequests = this.sessions.map((session) => {
                                return Api.put(`/v1/dailysessions/${session._id}/exercises/${exerciseID}`, this.updatedExercise);
                            });
                            return Promise.all(patchRequests);
                        })
                        .then(() => {
                            return Api.get('/v1/exercises');
                        })
                        .then((response) => {
                            this.exercises = response.data;
                            this.exerciseMessage = "Exercise updated!";
                        })
                })

                .catch((error) => {
                    console.error('Error deleting exercise:', error);
                    this.exerciseMessage = error;
                });
        },

        handleExerciseDeleted(exerciseID) {
            Api.get('/v1/dailysessions')
                .then((response) => {
                    this.sessions = response.data;
                    const patchRequests = this.sessions.map((session) => {
                        return Api.patch(`/v1/dailysessions/${session._id}`, { exerciseID: exerciseID });
                    });
                    return Promise.all(patchRequests);
                })
                .then(() => {
                    return Api.delete(`/v1/exercises/${exerciseID}`);
                })
                .then(() => {
                    return Api.get('/v1/exercises');
                })
                .then((response) => {
                    this.exercises = response.data;
                    this.exerciseMessage = "Exercise deleted!";
                })
                .catch((error) => {
                    console.error('Error deleting exercise:', error);
                    this.exerciseMessage = error;
                });
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
            exerciseMessage: '',
            sessions: '',
            updatedExercise: ''
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
