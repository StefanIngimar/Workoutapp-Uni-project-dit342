<template>
  <div v-if="this.user" class="profile-container container">
    <div class="row">
      <!-- User Info and Edit Profile -->
      <div class="col-md-6 user-section">
        <h1>User Profile</h1>
        <p><strong>Username:</strong> {{ user.userName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <!-- Edit Profile Component -->
        <edit-profile :user="user" @profile-updated="handleProfileUpdated" />
        <!-- Logout Button -->
        <b-button id="logout-button" class="logout-btn" variant="primary" @click="logout">
          Logout
        </b-button>
      </div>

      <!-- Completed Achievements -->
      <div class="col-md-6 achievements-section">
        <h2>Your Completed Achievements</h2>
        <ul class="achievement-list">
          <li
            v-for="achievement in completedAchievements"
            :key="achievement._id"
            class="achievement-item"
          >
            <h3>{{ achievement.name }}</h3>
            <p>{{ achievement.description }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="message" class="error-message">
      {{ message }}
    </div>
  </div>
  <div v-else>
    <p>Please log in to view profile</p>
  </div>
</template>

<script>
import EditProfile from '@/components/EditProfile.vue'
import { Api } from '@/Api'

export default {
  name: 'Profile',
  components: {
    EditProfile
  },
  data() {
    return {
      user: '',
      isAdmin: false,
      completedAchievements: [],
      numOfTimesInGym: 0,
      message: ''
    }
  },
  mounted() {
    // Fetch user from local storage
    this.getUserProfile()
    if (this.user) {
      this.getAllCompletedAchievements()
    }
  },
  methods: {
    getUserProfile() {
      // Fetch user from local storage
      this.user = JSON.parse(localStorage.getItem('user'))
    },
    handleProfileUpdated(updatedUser) {
      // Update user in local storage
      this.user = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
    },
    logout() {
      // Clear local storage
      localStorage.removeItem('user')
      // localStorage.removeItem('token')
      // redirect to home page
      this.$router.push('/')
    },
    getAllCompletedAchievements() {
      // Fetch all completed achievements for user, If user is admin, fetch all completed achievements
      Api.get(`/v1/achievements/completed?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.completedAchievements = response.data
        })
        .catch((error) => {
          this.message = error
        })
    }

  }
}

</script>

<style scoped>
.profile-container {
  padding-top: 50px;
  padding-bottom: 50px;
}

.user-section,
.achievements-section {
  background-color: rgb(63, 66, 62);
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.achievement-list {
  list-style-type: none;
  padding: 0;
}

.achievement-item {
  background-color: rgb(59, 116, 41);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border-left: 4px solid #28a745;
}

.logout-btn {
  width: 100%;
  margin-top: 15px;
}

.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}

h1,
h2 {
  text-align: center;
  margin-bottom: 25px;
}

p {
  margin-bottom: 10px;
}

#logout-button {
  background-color: #dc3545;
  border-color: #dc3545;
}

#delete-users-button {
  width: 100%;
}

@media (max-width: 767px) {
  .row {
    flex-direction: column;
  }

  .user-section,
  .achievements-section {
    margin-bottom: 20px;
  }
}
</style>
