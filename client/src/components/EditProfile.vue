<template>
    <div class="form">
        <h2>Edit Profile</h2>
        <p>Username: <input v-model="userName" placeholder="Enter new username"/></p>
        <p>Email: <input v-model="email" placeholder="Enter new email"/></p>
        <p>Password: <input type="password" v-model="password" placeholder="Enter new password"/></p>
        <b-button class="btn_message" variant="primary" @click="updateProfile()">Update profile</b-button>
        <div v-if="message" class="error">{{ message }}</div>
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
      userName: this.user.userName,
      email: this.user.email,
      password: '',
      message: ''
    }
  },
  methods: {
    updateProfile() {
      const updatedUser = {
        userName: this.userName,
        email: this.email,
        password: this.password
      }
      Api.patch(`/v1/users/${this.user._id}`, updatedUser)
        .then(response => {
          this.$emit('profile-updated', response.data)
          this.message = 'Profile updated successfully'
        })
        .catch(error => {
          this.message = error.response ? error.response.data.message : error.message
        })
    }
  }
}

</script>

<style scoped>
.form {
    margin: 20px auto;
    width: 20%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: aquamarine;
}

.error {
    color: red;
}
</style>
