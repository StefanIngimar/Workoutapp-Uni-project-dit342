<template>
    <div class="achievement-item">
        <h3>{{ achievement.achievementName }}</h3>
        <p>Completed at: {{achievement.dateCompleted}}</p>
    </div>
</template>

<script>
export default {
  name: 'AchievementItem',
  props: {
    achievement: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.achievement-item {
    margin: 20px auto;
    width: 50%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: aquamarine;
}
</style>
