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
      if (this.password !== this.confirmPassword) {
        this.message = 'Passwords do not match'
        return
      }
      const newUser = {
        userName: this.userName,
        email: this.email,
        password: this.password,
        isAdmin: this.isAdmin
      }
      Api.post('/v1/users', newUser)
        .then((response) => {
          const createdUser = response.data
          localStorage.setItem('user', JSON.stringify(createdUser))
          this.$emit('user-created', createdUser)
          this.$router.push('profile')
          this.message = 'User created successfully'
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              if (error.response.data.errors) {
                this.message = error.response.data.errors.map((error) => error.msg).join(', ')
              } else if (error.response.data.error) {
                this.message = error.response.data.error
              } else {
                this.message = 'An error occured during login'
              }
            } else {
              this.message = `Error: ${error.response.status} - ${error.response.statusText}`
            }
          } else if (error.request) {
            this.message = 'Server is not responding'
          } else {
            this.message = 'An unexpected error occured'
          }
        })
    },
    handleLogin() {
      const userInput = {
        userName: this.userName,
        password: this.password
      }
      Api.post('/v1/users/login', userInput)
        .then((response) => {
          const fetchedUser = response.data
          // const jwtToken = response.data.token
          if (!fetchedUser) {
            this.message = 'User not found' + JSON.stringify(fetchedUser)
          } else {
            localStorage.setItem('user', JSON.stringify(fetchedUser))
            // localStorage.setItem('token', jwtToken)
            this.$emit('user-fetched', fetchedUser)
            this.$router.push('profile')
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              if (error.response.data.error) {
                this.message = error.response.data.error
              } else {
                this.message = 'Invalid login credentials'
              }
            } else {
              this.message = `Error: ${error.response.status} - ${error.response.statusText}`
            }
          } else if (error.request) {
            this.message = 'Sever is not responding'
          } else {
            this.message = 'An unexpected error occured'
          }
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
