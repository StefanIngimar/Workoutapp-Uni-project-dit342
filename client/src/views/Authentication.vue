<template>
    <div class="authentication-contatiner">
        <div class="authentication-toggle">
            <form v-if="isSignUp" @submit.prevent="toggleLogin">
                <UserCreation />
            </form>
            <b-button class="btn_message" variant="primary" v-on:click="$router.push('signup')">
                Sign up </b-button>
            <b-button class="btn_message" variant="primary" v-on:click="$router.push('login')">
                Log in </b-button>
        </div>
    </div>
</template>

<script>
import UserCreation from '@/components/UserCreation.vue'

export default {
  name: 'Authentication',
  components: {
    UserCreation

  },
  data() {
    return {
      isSignUp: ''
    }
  },
  methods: {
    toggleSignup() {
      this.isSignUp = true
    },
    toggleLogin() {
      this.isSignUp = !this.isSignUp
    }
  }
}
</script>

<style>
.authentication-contatiner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

</style>
