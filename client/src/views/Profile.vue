<template>
    <div>
        <h1> User profile </h1>
        <b-button class="btn_message" variant="primary" v-on:click="getUser()">Get Profile from Server</b-button>
        <p class="col-xl-9">
            User profile :<br />
            {{ message }}
        </p>
    </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'profile',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getUserId() {
      return this.$route.params.id
    },
    getUser(userId) {
      // const userId = this.getUserId()
      Api.get('/v1/users/users/$(userId)')
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

<style scoped>
h1 {
    color: blueviolet;
}
</style>
