<!-- Achievements.vue -->
<template>
  <div class="achievements">
    <h1>Achievements</h1>
    <button @click="getUserAchievements">Fetch achievements</button>
    <!-- Button to create a new achievement -->
    <button @click="toggleCreateForm">Create New Achievement</button>

    <!-- Form to create a new achievement -->
    <div v-if="showCreateForm">
      <h3>Create Achievement</h3>
      <form @submit.prevent="createAchievement">
        <p>
          <label>Name:</label>
          <input v-model="newAchievement.name" required />
        </p>
        <p>
          <label>Description:</label>
          <input v-model="newAchievement.description" required />
        </p>
        <p>
          <label>Type:</label>
          <select v-model="newAchievement.typeOfAchievement">
            <option value="weightLiftedMilestone">Weight Lifted Milestone</option>
            <option value="attendanceMilestone">Attendance Milestone</option>
            <option value="repetitionMilestone">Repetition Milestone</option>
          </select>
        </p>
        <!-- Milestones based on type -->
        <div v-if="newAchievement.typeOfAchievement === 'weightLiftedMilestone'">
          <p>
            <label>Exercise:</label>
            <input v-model="newAchievement.milestones.exercise" required />
          </p>
          <p>
            <label>Weight:</label>
            <input type="number" v-model="newAchievement.milestones.weight" required />
          </p>
        </div>
        <div v-else-if="newAchievement.typeOfAchievement === 'attendanceMilestone'">
          <p>
            <label>Number of Times in Gym:</label>
            <input type="number" v-model="newAchievement.milestones.numOfTimesInGym" required />
          </p>
        </div>
        <div v-else-if="newAchievement.typeOfAchievement === 'repetitionMilestone'">
          <p>
            <label>Exercise:</label>
            <input v-model="newAchievement.milestones.exercise" required />
          </p>
          <p>
            <label>Reps:</label>
            <input type="number" v-model="newAchievement.milestones.reps" required />
          </p>
        </div>
        <button type="submit">Create Achievement</button>
        <button type="button" @click="toggleCreateForm">Cancel</button>
      </form>
    </div>

    <!-- Display achievements -->
    <achievement-list
      :achievements="achievements"
      :userAchievements="userAchievements"
    />
    <div v-if="message" class="error">{{ message }}</div>
  </div>
</template>

<script>
import AchievementList from '@/components/AchievementList.vue'
import { Api } from '@/Api'

export default {
  name: 'Achievements',
  components: {
    AchievementList
  },
  data() {
    return {
      userId: '',
      achievements: [],
      userAchievements: [],
      message: '',
      showCreateForm: false,
      newAchievement: {
        name: '',
        description: '',
        typeOfAchievement: 'weightLiftedMilestone',
        milestones: {}
      }
    }
  },
  methods: {
    getAllAchievements() {
      Api.get('/v1/achievements')
        .then((response) => {
          this.achievements = response.data
        })
        .catch((error) => {
          this.message = error.response ? error.response.data.message : error.message
        })
    },
    getUserAchievements() {
      Api.get(`/v1/users/${this.userId}/userAchievements`)
        .then((response) => {
          this.userAchievements = response.data
        })
        .catch((error) => {
          this.message = error.response ? error.response.data.message : error.message
        })
    },
    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm
      if (!this.showCreateForm) {
        // Reset the form when closing
        this.newAchievement = {
          name: '',
          description: '',
          typeOfAchievement: 'weightLiftedMilestone',
          milestones: {}
        }
      }
    },
    createAchievement() {
      const achievementData = {
        name: this.newAchievement.name,
        description: this.newAchievement.description,
        typeOfAchievement: this.newAchievement.typeOfAchievement,
        milestones: this.newAchievement.milestones
      }

      Api.post('/v1/achievements', achievementData)
        .then((response) => {
          const newAchievement = response.data
          // Add the new achievement to the list
          this.achievements.push(newAchievement)
          this.message = 'Achievement created successfully!'
          this.toggleCreateForm()

          if (!this.userId) {
            this.message = 'No user in local storage'
            return
          }

          // Create a user achievement for the current user
          const userAchievementData = {
            userID: this.userId,
            achievementID: newAchievement._id,
            achievementName: newAchievement.name,
            isCompleted: false,
            dateCompleted: null
          }

          return Api.post('/v1/userAchievements', userAchievementData)
        })
        .then((response) => {
          this.userAchievements.push(response.data)
        })
        .catch((error) => {
          this.message = error.response ? error.response.data.message : error.message
        })
    }

  },
  created() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.userId = user._id
    } else {
      this.message = 'User not logged in'
      return
    }

    this.getAllAchievements()
    // this.getUserAchievements()
  }

}
</script>

<style scoped>
h1 {
  color: blueviolet;
}
.error {
  color: red;
}
.achievements {
  padding: 20px;
}
form {
  margin-top: 20px;
}
form p {
  margin-bottom: 10px;
}
</style>
