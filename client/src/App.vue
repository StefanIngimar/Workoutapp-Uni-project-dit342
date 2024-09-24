<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="profile">Profile</router-link>
      |
      <router-link to="exercises">Exercises</router-link>
      |
      <router-link to="sessions">Sessions</router-link>
      |
      <router-link to="workoutlogs">Workoutlogs</router-link>
      |
      <router-link to="achievements">Achievements</router-link>
      |
      <router-link to="leaderboard">Leaderboard</router-link>
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
