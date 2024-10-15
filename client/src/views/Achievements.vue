<!-- Achievements.vue -->
<template>
  <div class="achievements">
    <h1>Achievements</h1>
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
    <div v-if="achievements.length > 0">
      <h2>Your Achievements</h2>
      <ul>
        <li
          v-for="achievement in achievements"
          :key="achievement._id"
          :class="{ completed: achievement.isCompleted }"
        >
          <h3>{{ achievement.name }}</h3>
          <p>{{ achievement.description }}</p>
          <p>Status:
            <span v-if="achievement.isCompleted">Completed</span>
            <span v-else>In Progress</span>
          </p>
          <div>
            <button @click="deleteAchievement(achievement._id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No achievements found.</p>
    </div>
    <!-- <div v-if="isAdmin">
        <button @click="deleteAllAchievement(achievement._id)">Delete All achievements</button>
    </div> -->
    <div v-if="message" class="error">{{ message }}</div>
  </div>
</template>

<script>
// import AchievementList from '@/components/AchievementList.vue'
import { Api } from '@/Api'

export default {
  name: 'Achievements',
  components: {
    // AchievementList
  },
  data() {
    return {
      user: '',
      userId: '',
      isAdmin: false,
      achievements: [],
      achievementID: '',
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
        userID: this.userId,
        name: this.newAchievement.name,
        description: this.newAchievement.description,
        typeOfAchievement: this.newAchievement.typeOfAchievement,
        milestones: this.newAchievement.milestones,
        isCompleted: false,
        dateCompleted: null

      }

      Api.post('/v1/achievements', achievementData)
        .then((response) => {
          const newAchievement = response.data
          // Add the new achievement to the list
          this.achievements.push(newAchievement)
          this.message = 'Achievement created successfully!'
          this.toggleCreateForm()
        })
        .catch((error) => {
          this.message = error.response ? error.response.data.message : error.message
        })
    },
    handleAchievementCompleted(achievementID) {
      Api.patch(`/v1/achievements${achievementID}`)
        .then((response) => {
          this.achievements = response.data
          this.achievements = this.achievements.findIndex((achievement) => achievement._id === achievementID)
          this.message = 'Achievement completed!'
        })
        .catch((error) => {
          this.message = error
        })
    },
    deleteAchievement(achievementID) {
      Api.delete(`/v1/achievements/${achievementID}`)
        .then(() => {
          this.achievements = this.achievements.filter((achievement) => achievement._id !== achievementID)
          this.message = 'Achievement deleted!'
        })
        .catch((error) => {
          this.message = error
        })
    },
    getUserInfo() {
      this.user = JSON.parse(localStorage.getItem('user'))
      this.userId = this.user._id
      this.isAdmin = this.user.isAdmin
    },

    getAllAchievements() {
      Api.get(`/v1/achievements?userID=${this.userId}&isAdmin=${this.isAdmin}`)
        .then((response) => {
          this.achievements = response.data
        })
        .catch((error) => {
          this.message = error
        })
    }

  },
  mounted() {
    this.getUserInfo()
    this.getAllAchievements()
    // this.handleAchievementCompleted()
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
