<template>
    <div>
        <h2>Registered Achievements</h2>
        <div v-if="achievements.length > 0">
            <achievement-item v-for="achievement in achievements"
            :key="achievement._id"
            :achievement="achievement"
            :userAchievement="findUserAchievement(achievement._id)"
            />
        </div>
        <div v-else>
            <p>No achievements completed</p>
        </div>
    </div>
</template>

<script>
import AchievementItem from '@/components/AchievementItem.vue'

export default {
  name: 'AchievementList',
  components: {
    AchievementItem
  },
  props: {
    achievements: {
      type: Array,
      required: true
    },
    userAchievements: {
      type: Array,
      required: true
    }
  },
  methods: {
    findUserAchievement(achievementId) {
      return this.userAchievements.find(achievement => achievement.achievementId === achievementId)
    }
  }
}
</script>

<style scoped>

</style>
