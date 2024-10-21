<template>
  <div v-if="!this.user" class="authentication-container container">
    <div class="row justify-content-center">
      <!-- Display different forms depending on if a user wants to log in or sign up -->
      <div v-if="isLoginMode" class="login-form col-12 col-md-8 col-lg-6">
        <h1>Log in</h1>
        <div class="form-group">
          <label>Username:</label>
          <input
            v-model="userName"
            placeholder="Enter username to login"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter password"
            class="form-control"
          />
        </div>
        <b-button
          id="login-button"
          class="login_btn"
          variant="primary"
          @click="handleLogin"
        >
          Log In
        </b-button>
        <p>
          Don't have an account?
          <a href="#" @click.prevent="toggleSignup">Sign Up</a>
        </p>
      </div>
      <div v-else class="signup-form col-12 col-md-8 col-lg-6">
        <h1>Sign up</h1>
        <div class="form-group">
          <label>Username:</label>
          <input
            v-model="userName"
            placeholder="Enter username to sign up"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input
            v-model="email"
            placeholder="Enter email"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter password"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm password"
            class="form-control"
          />
        </div>
        <div class="form-group form-check">
          <input
            type="checkbox"
            class="form-check-input"
            v-model="isAdmin"
            id="adminCheck"
          />
          <label class="form-check-label" for="adminCheck">Admin</label>
        </div>
        <b-button
          id="signup-button"
          class="signup_btn"
          variant="primary"
          @click="handleSignup"
        >
          Sign Up
        </b-button>
        <p>
          Already have an account?
          <a href="#" @click.prevent="toggleLogin">Log In</a>
        </p>
      </div>
    </div>
    <div v-if="message" class="error">{{ message }}</div>
  </div>
  <div v-else>
      router.push('profile')
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'Authentication',
  data() {
    return {
      isLoginMode: false,
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
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
      // Call the API to create a new user with newUser as the request body
      Api.post('/v1/users', newUser)
        .then((response) => {
          const createdUser = response.data
          // Store user in local storage
          localStorage.setItem('user', JSON.stringify(createdUser))
          this.$emit('user-created', createdUser)
          this.$router.push('profile')
          this.message = 'User created successfully'
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              if (error.response.data.errors) {
                this.message = error.response.data.errors
                  .map((error) => error.msg)
                  .join(', ')
              } else if (error.response.data.error) {
                this.message = error.response.data.error
              } else {
                this.message = 'An error occurred during signup'
              }
            } else {
              this.message = `Error: ${error.response.status} - ${error.response.statusText}`
            }
          } else if (error.request) {
            this.message = 'Server is not responding'
          } else {
            this.message = 'An unexpected error occurred'
          }
        })
    },
    handleLogin() {
      const userInput = {
        userName: this.userName,
        password: this.password
      }
      // Call the API to log in the user with userInput as the request body
      Api.post('/v1/users/login', userInput)
        .then((response) => {
          const fetchedUser = response.data
          if (!fetchedUser) {
            this.message = 'User not found'
          } else {
            localStorage.setItem('user', JSON.stringify(fetchedUser))
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
            this.message = 'Server is not responding'
          } else {
            this.message = 'An unexpected error occurred'
          }
        })
    }
  }
}
</script>

<style scoped>
/* CSS Class Selectors */
.authentication-container {
  min-height: 100vh;
  padding-top: 50px;
  padding-bottom: 50px;
}

.login-form,
.signup-form {
  background-color: rgb(63, 66, 62);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login_btn,
.signup_btn {
  width: 100%;
  margin-top: 15px;
}

.error {
  color: red;
  margin-top: 15px;
  text-align: center;
}

/* CSS Element Selectors */
h1 {
  text-align: center;
  margin-bottom: 25px;
}

p {
  margin-top: 15px;
  text-align: center;
}

/* CSS ID Selectors */
#login-button {
  background-color: #007bff;
  border-color: #007bff;
}

#signup-button {
  background-color: #28a745;
  border-color: #28a745;
}

input:focus {
  border-color: red;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
/* Responsive Design */
@media (max-width: 767px) {
  .authentication-container {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .login-form,
  .signup-form {
    padding: 20px;
  }
}
</style>
