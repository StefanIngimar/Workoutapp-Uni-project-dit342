<template>
  <div>
    <!-- Display the user's name and email -->
    <!-- <user-info v-if="user" :user="user" /> -->
    <h1> User Profile </h1>
        <p><strong>Username:</strong>{{ user.userName }}</p>
        <p><strong>Email:</strong>{{ user.email }}</p>
    <!-- <user-fetched /> -->
    <!-- Handle the updateing of user profile -->
    <edit-profile :user="user" @profile-updated="handleProfileUpdated" />
    <!-- Diplsay numer of times attending the gym-->
     <!-- <gym-attendance :numOfTimesInGym="numOfTimesInGym" /> -->
    <!-- Display the user's achievements -->
    <!-- <achievement-list :userAchievements="userId" /> -->
     <button type="button" @click="deletAllUsers">Deleta all users</button>
    <div v-if="message" class="error">
      {{ message }}
    </div>
  </div>
</template>

<script>
// import Authentication from '@/Authentication.vue'
// import UserInfo from '@/components/UserInfo.vue'
import EditProfile from '@/components/EditProfile.vue'
// import GymAttendance from '@/components/GymAttendance.vue'
// import AchievementList from '@/components/AchievementList.vue'
import { Api } from '@/Api'

export default {
  name: 'Profile',
  components: {
    // UserInfo,
    EditProfile
    // GymAttendance,
    // AchievementList,
  },
  data() {
    return {
      user: {},
      userAchievements: [],
      numOfTimesInGym: 0,
      message: ''
    }
  },
  methods: {
    created() {
      this.getUserProfile()
    },
    getUserProfile() {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        this.user = user
      }
    },
    handleProfileUpdated(updatedUser) {
      this.user = updatedUser
    },
    deletAllUsers() {
      Api.delete('/v1/users')
        .then(() => {
          this.message = 'All users deleted'
        })
        .catch(error => {
          this.message = error.response ? error.response.data.message : error.message
        })
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
