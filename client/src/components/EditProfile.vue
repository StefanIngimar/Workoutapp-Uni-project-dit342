<template>
    <div class="form">
        <h2>Edit Profile</h2>
        <p>
          Username: <input v-model="userName" placeholder="Enter new username (optional)"/>
          <span class="error" v-if="validationErrors.userName">{{ validationErrors.userName }}</span>
        </p>

        <p>
          Email: <input v-model="email" placeholder="Enter new email (optional)"/>
          <span class="error" v-if="validationErrors.email">{{ validationErrors.email }}</span>
        </p>
        <p>
          Password: <input type="password" v-model="password" placeholder="Enter new password (optional)"/>
          <span class="error" v-if="validationErrors.password">{{ validationErrors.password }}</span>
        </p>
        <div v-if="password" >
            <p>
              Confirm Password: <input type="password" v-model="confirmPassword" placeholder="Confirm password"/>
              <span class="error" v-if="validationErrors.confirmPassword">{{ validationErrors.confirmPassword }}</span>
            </p>
        </div>
        <b-button class="btn_message" variant="primary" @click="updateProfile()">Update profile</b-button>
        <div v-if="message" :class="{ error: isError, success: !isError }">{{ message }}</div>
    </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'EditProfile',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: '',
      isError: false,
      validationErrors: {}
    }
  },
  mounted() {
    this.resetUpdate()
  },
  // watch: {
  //   user(newUser) {
  //     this.userName = newUser.userName || ''
  //     this.email = newUser.email || ''
  //   }
  // },
  methods: {
    updateProfile() {
      // Reset messages and validation errors
      this.resetUpdate()

      const updatedUser = {}

      if (this.userName) {
        if (this.userName === this.user.userName) {
          this.validationErrors.userName = 'Username already in user, enter a different uisername'
        } else {
          updatedUser.userName = this.userName
        }
      }

      if (this.email && this.email !== this.user.email) {
        if (!this.isValidEmail(this.email)) {
          this.validationErrors.email = 'Enter a valid email address'
        } else {
          updatedUser.email = this.email
        }
      }

      if (this.password) {
        if (this.password.length < 8) {
          this.validationErrors.password = 'Password must be at least 8 characters long'
        } else if (this.password !== this.confirmPassword) {
          this.validationErrors.confirmPassword = 'Passwords do not match'
        } else {
          updatedUser.password = this.password
        }
      }

      if (Object.keys(this.validationErrors).length > 0) {
        return
      }

      if (Object.keys(updatedUser).length === 0) {
        this.message = 'No changes to update'
        this.isError = true
        return
      }

      Api.patch(`/v1/users/${this.user._id}`, updatedUser)
        .then((response) => {
          const updatedUserData = response.data
          this.$emit('profile-updated', updatedUserData)
          // localStorage.setItem('user', JSON.stringify(updatedUserData)); // Moved to parent component
          this.message = 'Profile updated successfully'
          this.isError = false
          this.resetUpdate()
          // Do not modify the prop directly
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((err) => {
                  this.validationErrors[err.param] = err.msg
                })
              } else if (error.response.data.error) {
                this.message = error.response.data.error
                this.isError = true
              } else {
                this.message = 'An error occurred during update'
                this.isError = true
              }
            } else {
              this.message = `Error: ${error.response.status} - ${error.response.statusText}`
              this.isError = true
            }
          } else if (error.request) {
            this.message = 'Server is not responding'
            this.isError = true
          } else {
            this.message = 'An unexpected error occurred'
            this.isError = true
          }
        })
    },
    resetUpdate() {
      this.message = ''
      this.isError = false
      this.validationErrors = {}
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
  }
}
</script>

<style scoped>
.form {
  margin: 20px auto;
  width: 80%;
  max-width: 500px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #130f0f61;
}

.form h2 {
  text-align: center;
}

.form p {
  margin-bottom: 15px;
}

.form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.error {
  color: red;
  font-size: 0.9em;
}

.success {
  color: green;
  font-size: 1em;
}

.btn_message {
  display: block;
  width: 100%;
  margin-top: 10px;
}

.message {
  margin-top: 15px;
  text-align: center;
}
</style>
