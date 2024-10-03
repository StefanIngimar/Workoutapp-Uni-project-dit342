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
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ebffe7;
  background-color: rgb(44, 46, 43);
}

.input {
  background-color: rgba(124, 128, 121, 0.662);
  border-radius: 5%;
  align-items: center;
}

::placeholder {
  color: rgba(242, 255, 237, 0.291);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-left: 800px;
  margin-right: 800px;
  padding: 50px;
  background-color: rgb(63, 66, 62);
  border: 2px solid;
  border-radius: 5%;
  border-color: rgb(124, 128, 121);
}

.searchForm {
  margin-left: 800px;
  margin-right: 800px;
  align-items: center;
}


#nav a {
  color: rgb(65, 165, 65);
  transition: color 0.3s;
}
</style>
