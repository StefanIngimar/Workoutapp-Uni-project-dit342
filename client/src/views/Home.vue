<template>
  <div class="fullscreen-wrapper">
    <b-container fluid>

      <h1 class="display-5 fw-bold">Gym-Tracker Pro</h1>
      <p class="fs-4">The best gym-tracking app on the market! (Agruably)</p>
      <br> <br>
      <b-button class="btn_message" variant="primary" v-on:click="$router.push('login')">
        Get Started ! </b-button>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then((response) => {
          this.message = response.data.message
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

.fullscreen-wrapper {
  height: 97.5vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: url("/gymtrackerbg2.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
