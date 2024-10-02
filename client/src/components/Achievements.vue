<template>
    <div>
        <h2>Achievements</h2>
        <div v-if="achievements.length > 0">
            <achievement-item v-for="achievement in achievements"
            :key="achievement._id"
            :achievement="achievement"
            />
        </div>
        <div v-else>
            <p>No achievements completed</p>
        </div>
    </div>
</template>

<script>
import AchievementItem from '@/components/AchievementItem.vue'
import { Api } from '@/Api'

export default {
  name: 'Achievements',
  components: {
    AchievementItem
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      achievements: [],
      error: ''
    }
  },
  methods: {
    getUserAchievements() {
      Api.get(`api/v1/users/${this.userId}/userAchievements`)
        .then(response => {
          this.achievements = response.data.filter(achievement => achievement.completed)
        })
        .catch(error => {
          this.error = error.response ? error.response.data.message : error.message
        })
    },
    created() {
      this.getUserAchievements()
    }
  }
}
</script>

<style scoped>

</style>
