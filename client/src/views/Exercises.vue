<template>
    <div>
        <BFrom>
            <BFormGroup>
                <div class="form">
                    <b-form-input v-model="name" placeholder="Exercise name"> </b-form-input>
                    <!-- <BFormSelect v-model="hasWeights" :options="hasWeightsForm"/> -->
                    <div>
                        <label>Is this a bodyweight exercise?</label>
                        <BFormRadio v-model="hasWeights" name="some-radios" value=true>Yes </BFormRadio>
                        <BFormRadio v-model="hasWeights" name="some-radios" value=false>No </BFormRadio>
                    </div>

                    <b-form-input v-model="weight" placeholder="Weight"> </b-form-input>
                    <b-form-input v-model="bodyPart" placeholder="Body Part"> </b-form-input>
                    <b-form-input v-model="reps" placeholder="Reps"> </b-form-input>
                    <b-form-input v-model="sets" placeholder="Sets"> </b-form-input>
                </div>

            </BFormGroup>
        </BFrom>

        <b-button class="btn_message" variant="primary" v-on:click="postExercise()">Submit Exercise</b-button>
        <p class="col-xl-9">
            {{ postMessage }}
        </p>

        <label> Exercises </label>
        <p>
            {{ exerciseMessage }}
        </p>
        <div class="searchForm">
            <b-form-input v-model="searchText" placeholder="Search"> </b-form-input>
            <b-button class="btn_message" variant="primary" v-on:click="searchExercise()">Submit Search</b-button>
        </div>


        <div v-for="exercise in exercises" v-bind:key="exercise._id">
            <exercise-item v-bind:exercise="exercise" @exercise-deleted="handleExerciseDeleted"
                @delete-error="handleDeleteError" />
        </div>

    </div>
    <my-footer />
</template>

<script>
import MyFooter from '@/components/MyFooter.vue'
import ExerciseItem from '@/components/ExerciseItem.vue'
import { Api } from '@/Api'
import { BFormGroup } from 'bootstrap-vue-next';

const hasWeightsForm = [
    { value: null, text: "Bodyweight exercises?" },
    { value: 'true', text: "Yes" },
    { value: 'false', text: "No" }
]

export default {
    name: 'exercises',
    components: {
        MyFooter,
        ExerciseItem
    },
    methods: {
        handleExerciseDeleted() {
            Api.get('/v1/exercises')
                .then((response) => {
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
                })
                .catch((error) => {
                    this.exercises = error
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
            hasWeights: '',
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