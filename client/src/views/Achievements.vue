<!-- Achievements.vue -->
<template>
  <div v-if="user" class="achievements-container container">
    <div class="row">
      <!-- Left Column: Achievements List -->
      <div class="col-md-7 achievements-list-section">
        <h1>Achievements</h1>
        <!-- Button to create a new achievement -->
        <b-button id="create-achievement-button" variant="primary" @click="toggleCreateForm">
          Create New Achievement
        </b-button>

        <!-- Display achievements -->
        <div v-if="achievements.length > 0" class="mt-4">
          <h2>Your Achievements</h2>
          <ul class="list-group">
            <li
              v-for="achievement in achievements"
              :key="achievement._id"
              :class="['list-group-item', 'achievement-item', { completed: achievement.isCompleted }]"
            >
              <h3>{{ achievement.name }}</h3>
              <p>{{ achievement.description }}</p>
              <p>
                Status:
                <span v-if="achievement.isCompleted" class="text-success">Completed</span>
                <span v-else class="text-warning">In Progress</span>
              </p>
              <div>
                <b-button
                  variant="danger"
                  size="sm"
                  @click="deleteAchievement(achievement._id)"
                  class="delete-achievement-button"
                >
                  Delete
                </b-button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="mt-4">
          <p>No achievements found.</p>
        </div>
      </div>

      <!-- Right Column: Create Achievement Form -->
      <div
        class="col-md-5 create-achievement-section"
        v-if="showCreateForm"
      >
        <h3>Create Achievement</h3>
        <form @submit.prevent="createAchievement">
          <div class="form-group">
            <label for="achievement-name">Name:</label>
            <input
              id="achievement-name"
              v-model="newAchievement.name"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="achievement-description">Description:</label>
            <input
              id="achievement-description"
              v-model="newAchievement.description"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="achievement-type">Type:</label>
            <select
              id="achievement-type"
              v-model="newAchievement.typeOfAchievement"
              class="form-control"
            >
              <option value="weightLiftedMilestone">Weight Lifted Milestone</option>
              <option value="repetitionMilestone">Repetition Milestone</option>
            </select>
          </div>
          <!-- Milestones based on type -->
          <div v-if="newAchievement.typeOfAchievement === 'weightLiftedMilestone'">
            <div class="form-group">
              <label for="achievement-exercise">Exercise:</label>
              <input
                id="achievement-exercise"
                v-model="newAchievement.exerciseName"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="achievement-weight">Weight:</label>
              <input
                id="achievement-weight"
                type="number"
                v-model="newAchievement.milestones.weight"
                required
                class="form-control"
              />
            </div>
          </div>
          <div v-else-if="newAchievement.typeOfAchievement === 'repetitionMilestone'">
            <div class="form-group">
              <label for="achievement-exercise">Exercise:</label>
              <input
                id="achievement-exercise"
                v-model="newAchievement.exerciseName"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="achievement-reps">Reps:</label>
              <input
                id="achievement-reps"
                type="number"
                v-model="newAchievement.milestones.reps"
                required
                class="form-control"
              />
            </div>
          </div>
          <b-button type="submit" variant="success" class="mt-2" id="submit-achievement-button">
            Create Achievement
          </b-button>
          <b-button
            type="button"
            variant="secondary"
            class="mt-2 ml-2"
            @click="toggleCreateForm"
            id="cancel-achievement-button"
          >
            Cancel
          </b-button>
        </form>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="message" class="error-message">
      {{ message }}
    </div>

    <!-- Sessions Component -->
    <sessions @session-completed="handleSessionCompleted"></sessions>
  </div>
  <div v-else class="no-user-message">
    <p>Please log in to view achievements</p>
  </div>
</template>

<script>
// import AchievementList from '@/components/AchievementList.vue'
import { Api } from '@/Api'
import { EventBus } from '@/Eventbus'

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
        exerciseName: '',
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
        exercisename: this.newAchievement.exerciseName,
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
      Api.patch(`/v1/achievements/${achievementID}`)
        .then((response) => {
          Api.get(`/v1/achievements?userID=${this.userId}&isAdmin=${this.isAdmin}`)
            .then((response) => {
              this.achievements = response.data
            })
            .catch((error) => {
              this.message = error
            })

          // this.achievements = this.achievements.filter((achievement) => achievement._id !== achievementID)
          // this.message = 'Achievement completed!'
        })
        .catch((error) => {
          this.message = error
        })
    },
    handleSessionCompleted() {
      console.log('event received')
      this.updateAllAchievements()
    },
    updateAllAchievements() {
      console.log('updating all achievements')
      this.achievements.forEach((achievement) => {
        this.handleAchievementCompleted(achievement._id)
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
    if (this.user) {
      this.getAllAchievements()
      EventBus.on('session-completed', this.handleSessionCompleted)
    }
  }
  // beforeDestroy() {
  //   EventBus.off('session-completed', this.handleSessionCompleted)
  // }
}
</script>

<style scoped>
.achievements-container {
  padding-top: 50px;
  padding-bottom: 50px;
}

.achievements-list-section {
  background-color: rgb(63, 66, 62);
  padding: 20px;
  border-radius: 8px;
}

.create-achievement-section {
  background-color: rgb(63, 66, 62);
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
}

.achievement-item {
  margin-bottom: 15px;
  border-left: 5px solid #ff001e;
}

.completed {
  background-color: #d4edda;
  border-left-color: #28a745;
}

.error-message {
  color: red;
  margin-top: 20px;
  text-align: center;
}

.no-user-message {
  text-align: center;
  margin-top: 50px;
}

h1,
h2,
h3 {
  text-align: center;
  margin-bottom: 25px;
}

p {
  margin-bottom: 10px;
}

#create-achievement-button {
  width: 100%;
  margin-top: 15px;
}

#submit-achievement-button,
#cancel-achievement-button {
  width: 48%;
}

#submit-achievement-button {
  margin-right: 4%;
}

@media (max-width: 767px) {
  .row {
    flex-direction: column-reverse;
  }

  .create-achievement-section {
    margin-top: 20px;
  }

  #create-achievement-button {
    width: 100%;
  }
}
</style>
