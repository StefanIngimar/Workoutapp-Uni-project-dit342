<template>
    <div class="form">
        <h2>Create user</h2>
        <p>Username: <input v-model="userName" placeholder="Enter Username" /></p>
        <p>Email: <input v-model="email" placeholder="Enter Email" /></p>
        <!-- <P>Admin: <inpu</P> -->
        <p>Password: <input type="password" input v-model="password" placeholder="Enter Password" /></p>
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
      message: ''
    }
  },
  methods: {
    createUser() {
      const newUser = {
        userName: this.userName,
        email: this.email,
        password: this.password
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
.form {
    margin: 20px auto;
    width: 20%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: aquamarine;
}
.error{
    color: red;
}
</style>
