<template>
    <div>
        <user-creation  @user-created="handleUserCreated" />
    </div>
</template>

<script>
import UserCreation from '@/components/UserCreation.vue'

export default {
  name: 'Signup',
  components: {
    UserCreation
  },
  data() {
    return {
      user: {},
      userId: ''
    }
  },
  methods: {
    handleUserCreated(newUser) {
      this.user = newUser
      this.userId = newUser._id
    }
  }
}
</script>

<!--Add a way where the user can display
the current goal their are working towards and in that way they can connect with other users-->
<style>
.user-creation {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  background-color: black;
}
.error {
  color: red;
}
</style>
