<template>
    <div>
        <h1> Exercises </h1>
        <p>
            {{ message }}
        </p>

        <b-form-input v-model="name" placeholder = "Exercise name"> </b-form-input>
        <b-form-input v-model="hasWeights" placeholder = "hasWeights?"> </b-form-input>
        <b-form-input v-model="weight" placeholder = "Weight"> </b-form-input>
        <b-form-input v-model="bodyPart" placeholder = "Body Part"> </b-form-input>
        <b-form-input v-model="reps" placeholder = "Reps"> </b-form-input>
        <b-form-input v-model="sets" placeholder = "Sets"> </b-form-input>

        <b-button class="btn_message" variant="primary" v-on:click="postExercise()">Submit Exercise</b-button>
        <p class="col-xl-9">
            {{ postMessage }}
        </p>
    </div>



    <my-footer />
</template>

<script>
import MyFooter from '@/components/MyFooter.vue'
import { Api } from '@/Api'

export default {
    name: 'exercises',
    components: {
        MyFooter
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
        }
    },

    mounted() { // Runs when page is loaded.
        Api.get('/v1/exercises')
            .then((response) => {
                this.message = response.data
            })
            .catch((error) => {
                this.message = error
            })
    },
    data() {
        return {
            message: 'none',
            postMessage: '',
            name: '',
            hasWeights: '',
            weight: '',
            bodyPart: '',
            isCustom: true,
            reps: '',
            sets: ''
        }
    }
}
</script>
