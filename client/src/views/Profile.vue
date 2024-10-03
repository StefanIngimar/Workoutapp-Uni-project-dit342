<template>
  <div>
    <user-creation  @user-created="handleUserCreated" />
    <!-- Display the user's name and email -->
    <user-info v-if="user" :user="user" />
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
import UserInfo from '@/components/UserInfo.vue'
import EditProfile from '@/components/EditProfile.vue'
// import GymAttendance from '@/components/GymAttendance.vue'
// import AchievementList from '@/components/AchievementList.vue'
import UserCreation from '@/components/UserCreation.vue'
import { Api } from '@/Api'

export default {
  name: 'Profile',
  components: {
    UserInfo,
    EditProfile,
    // GymAttendance,
    // AchievementList,
    UserCreation
  },
  data() {
    return {
      user: {},
      userId: '',
      userAchievements: [],
      numOfTimesInGym: 0,
      message: ''
    }
  },
  methods: {
    handleUserCreated(newUser) {
      this.user = newUser
      this.userId = newUser._id
    },
    getUserProfile() {
      if (!this.userId) {
        this.message = 'User not found'
        return
      }
      Api.get(`/api/v1/users/${this.userId}`)
        .then(response => {
          this.user = response.data
        })
        .catch(error => {
          this.messsage = error.response ? error.response.data.message : error.message
        })
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
    },
    created() {
      this.getUserProfile()
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
