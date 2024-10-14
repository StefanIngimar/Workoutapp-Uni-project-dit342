<template>
  <div>
    <!-- Display the user's name and email -->
    <!-- <user-info v-if="user" :user="user" /> -->
    <h1> User Profile </h1>
        <p><strong>Username:</strong>{{ this.user.userName }}</p>
        <p><strong>Email:</strong>{{ this.user.email }}</p>
    <!-- <user-fetched /> -->
    <!-- Handle the updateing of user profile -->
    <edit-profile :user="user" @profile-updated="handleProfileUpdated" />
    <div class="completedAchievements">
      <h2>Your Completed Achievements</h2>
      <ul>
        <li v-for="achievement in completedAchievements" :key="achievement._id">
          <h3>{{ achievement.achievementID.name }}</h3>
          <p>{{ achievement.achievementID.description }}</p>
          <p>Completed on: {{ formatDate(achievement.dateCompleted) }}</p>
        </li>
      </ul>
    </div>

    <!-- Diplsay numer of times attending the gym-->
     <!-- <gym-attendance :numOfTimesInGym="numOfTimesInGym" /> -->
    <!-- Display the user's achievements -->
    <!-- <achievement-list :userAchievements="userId" /> -->
     <b-button class="logout_btn" variant="primary" @click="logout">Logout</b-button>
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
    // AchievementList
  },
  data() {
    return {
      user: '',
      userId: '',
      isAdmin: false,
      completedAchievements: [],
      numOfTimesInGym: 0,
      message: '',
      foobar: ''
    }
  },
  mounted() {
    this.getUserProfile()
  },
  methods: {
    getUserProfile() {
      this.user = JSON.parse(localStorage.getItem('user'))
      this.userId = this.user._id
      this.isAdmin = this.user.isAdmin
    },
    handleProfileUpdated(updatedUser) {
      this.user = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
    },
    logout() {
      localStorage.removeItem('user')
      // localStorage.removeItem('token')
      this.$router.push('/')
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
    getAllCompletedAchievements() {
      Api.get(`/v1/achievements?userID=${this.userId}&isAdmin=${this.isAdmin}&isCompleted=false`)
        .then((response) => {
          this.achievements = response.data
        })
        .catch((error) => {
          this.message = error
        })
    }
  }
}

</script>

<style>
.user-creation {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  background-color: black;
}

.completedAchievements {
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
