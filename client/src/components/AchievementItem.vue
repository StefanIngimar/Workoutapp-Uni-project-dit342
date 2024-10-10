<!-- AchievementItem.vue -->
<template>
  <div class="achievement-item" :class="{ unlocked: isUnlocked }">
    <h3>{{ achievement.name }}</h3>
    <p>{{ achievement.description }}</p>
    <!-- <p v-if="isUnlocked">
      Completed at: {{ formatDate(userAchievement.dateCompleted) }}
    </p>
    <p v-else>
      Not yet unlocked
    </p> -->
  </div>
</template>

<script>
export default {
  name: 'AchievementItem',
  props: {
    achievement: {
      type: Object,
      required: true
    },
    userAchievement: {
      type: Object,
      default: null
    }
  },
  computed: {
    isUnlocked() {
      return this.userAchievement && this.userAchievement.isCompleted
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }
  }
}
</script>

<style scoped>
.achievement-item {
  margin: 20px auto;
  width: 80%;
  max-width: 400px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color:  rgb(63, 66, 62);
  transition: background-color 0.3s;
}
.achievement-item.unlocked {
  background-color:  rgb(63, 66, 62);
}
h3 {
  margin-bottom: 10px;
}
</style>
