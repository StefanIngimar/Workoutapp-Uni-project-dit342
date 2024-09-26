<template>
    <div>
        <BFrom>
            <BFormGroup>
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
            </BFormGroup>
        </BFrom>

        <b-button class="btn_message" variant="primary" v-on:click="postExercise()">Submit Exercise</b-button>
        <p class="col-xl-9">
            {{ postMessage }}
        </p>

        <label> Exercises </label>
        <b-form-input v-model="searchText" placeholder="Search"> </b-form-input>
        <b-button class="btn_message" variant="primary" v-on:click="searchExercise()">Submit Search</b-button>
        
        <div v-for="exercise in exercises" v-bind:key="exercise._id">
            <exercise-item v-bind:exercise="exercise"/> 
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
            searchText: ''
        }
    }
}
</script>
