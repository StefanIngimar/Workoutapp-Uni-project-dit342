<template>
  <div class="authentication-container">
    <div v-if="isLoginMode" class="login-form">
      <h1>Log in</h1>
      <p>Username:
        <input v-model="userName" placeholder="Enter username to login" />
      </p>
      <p>Password:
        <input type="password" v-model="password" placeholder="Enter password" />
      </p>
      <b-button class="login_btn" variant="primary" @click="handleLogin">Log In</b-button>
      <p>
        Don't have an account?
        <a href="#" @click.prevent="toggleSignup">Sign Up</a>
      </p>
    </div>
    <div v-else class="signup-form">
      <h1>Sign up</h1>
      <p>Username:
        <input v-model="userName" placeholder="Enter username to sign up" />
      </p>
      <p>Email:
        <input v-model="email" placeholder="Enter email" />
      </p>
      <p>Password:
        <input type="password" v-model="password" placeholder="Enter password" />
      </p>
      <p>Confirm Password:
        <input type="password" v-model="confirmPassword" placeholder="Confirm password" />

      </p>
      <p>Admin
        <input type="checkbox" v-model="isAdmin" />
      </p>
      <b-button class="signup_btn" variant="primary" @click="handleSignup">Sign Up</b-button>
      <p>
        Already have an account?
        <a href="#" @click.prevent="toggleLogin">Log In</a>
      </p>
    </div>
    <div v-if="message" class="error">{{ message }}</div>
  </div>
</template>

<script>
// import UserCreation from '@/components/UserCreation.vue'
import { Api } from '@/Api'

export default {
  name: 'Authentication',
  data() {
    return {
      isLoginMode: false,
      userName: '',
      password: '',
      userId: '',
      isAdmin: false,
      message: ''
    }
  },
  methods: {
    toggleSignup() {
      this.isLoginMode = false
    },
    toggleLogin() {
      this.isLoginMode = true
    },
    handleSignup() {
      const newUser = {
        userName: this.userName,
        email: this.email,
        password: this.password,
        isAdmin: this.isAdmin
      }
      Api.post('/v1/users', newUser)
        .then((response) => {
          const createdUser = response.data
          // Store user data in local storage, can be viewed in browser dev tools under appliocaton tab
          localStorage.setItem('user', JSON.stringify(createdUser))
          this.$emit('user-created', createdUser)
          this.$router.push('profile')
          this.message = 'User created successfully'
        })
        .catch((error) => {
          this.message = error.response.data.message
        })
    },
    handleLogin() {
      Api.get(`/v1/users/${this.user.userId}`)
        .then((response) => {
          if (!this.userName) {
            this.message = 'User not found'
          }
          const fetchedUser = response.data
          this.$emit('user-fetched', fetchedUser)
          localStorage.setItem('user', JSON.stringify(fetchedUser))
          this.$router.push('profile')
        })
        .catch((error) => {
          this.message = error.response.data.message
        })
    }
  }
}
</script>

<style scoped>
.authentication-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.error {
  color: red;
}
</style>
