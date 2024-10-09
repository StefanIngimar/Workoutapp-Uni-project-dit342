<template>
    <div class="UserCreationform">
        <h2>Create user</h2>
        <p>Username: <input v-model="userName" placeholder="Enter Username" /></p>
        <p>Email: <input v-model="email" placeholder="Enter Email" /></p>
        <p>Password: <input type="password" input v-model="password" placeholder="Enter Password" /></p>
        <p>Confirm Password: <input type="password" input v-model="confirmPassword" placeholder="Confirm Password" /></p>
        <p>
          <label>
            <input type="checkbox" v-model="isAdmin" />
            Admin
          </label>
        </p>
        <button @click="createUser">Create User</button>
        <div v-if="message" class="error">{{ message }}</div>
    </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'UserCreation',
  data() {
    return {
      userName: '',
      email: '',
      password: '',
      isAdmin: false,
      message: ''
    }
  },
  methods: {
    createUser() {
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
          this.message = 'User created successfully'
        })
        .catch((error) => {
          this.message = error.response.data.message
        })
    }
  }
}
</script>

<style scoped>
.UserCreationForm {
    margin: 20px auto;
    width: 20%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: rgb(14, 239, 164);
}
.error{
    color: red;
}
</style>
