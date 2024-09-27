<template>
  <div>
    <h1> Sessions </h1>
    <session-item v-bind:exercise="message" />

    <div v-for="session in sessions" v-bind:key="session._id">
      <session-item v-bind:session="session" />
    </div>
  </div>

</template>

<script>
import { Api } from '@/Api'
import MyFooter from '@/components/MyFooter.vue'
import SessionItem from '@/components/SessionItem.vue'


export default {
  name: 'sessions',
  components: {
    MyFooter,
    SessionItem
  },
  data() {
    return {
      message: 'none'
    }
  },
  mounted() {
    Api.get('/v1/dailysessions')
      .then((response) => {
        this.sessions = response.data
      })
      .catch((error) => {
        this.sessions = error
      })
  },
  methods: {

  },
  data() {
    return {
      sessions: ''
    }
  }
}
</script>

<style></style>