<template>
    <div>
        <h1> Sessions </h1>
        <b-button class="btn_message" variant="primary" v-on:click="getMessage()">Get DailySessions from Server</b-button>
        <p class="col-xl-9">
            DailySessions :<br />
            {{ message }}
        </p>
    </div>

</template>

<script>
import { Api } from '@/Api'


export default {
    name: 'sessions',
    data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/v1/dailysessions')
        .then((response) => {
          this.message = response.data
        })
        .catch((error) => {
          this.message = error
        })
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
</style>