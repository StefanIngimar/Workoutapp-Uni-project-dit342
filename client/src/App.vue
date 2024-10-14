<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Workout tracker</a>
        <button 
          class="navbar-toggler" 
          type="button" 
          @click="toggleDropdown"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" :class="{ show: isOpen }" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/exercises">Exercises</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/sessions">Sessions</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/workoutlogs">Workout Logs</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/achievements">Achievements</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/leaderboard">Leaderboard</router-link>
            </li>
      </ul>
      </div>
    </div>
    </nav>
    <!-- Render the content of the current page view -->
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style>

/* some of the navbar styling is from the bootstrap documentation
https://getbootstrap.com/docs/5.3/components/navbar/ */

html, body {
  background-color: rgb(44, 46, 43);
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ebffe7;
  background-color: rgb(44, 46, 43);
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.input {
  background-color: rgba(124, 128, 121, 0.662);
  border-radius: 5%;
  align-items: center;
}

::placeholder {
  color: rgba(242, 255, 237, 0.291);
}

.navbar-brand{
  color: #ffffff;
  padding: 10px 10px;
  background-color: #7b46c2;
  border-radius: 5px;
  text-decoration: none;
}

.navbar {
  background-color: rgb(60, 62, 59);
  padding: 10px 0;
}

.nav-item {
  margin: 0 25px;
  text-decoration: none;
  color: #ffffff;
  padding: 5px 15px;
  background-color: #7b46c2;
  border-radius: 5px;
}

.nav-item:hover {
  background-color: #7f57b3;
}

.nav-item:active {
  background-color: #5f16be;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 80%;
  max-width: 350px;
  padding: 2vw;
  background-color: rgb(63, 66, 62);
  border: 3px solid;
  border-radius: 5%;
  border-color: rgb(124, 128, 121);
}

@media (max-width: 768px) {
  .form {
    width: 90%;
  }

  .searchForm {
    width: 90%;
  }
}

@media (max-width: 576px) {
  .form {
    width: 95%;
    padding: 1vw;
  }
  .searchForm {
    width: 95%;
  }
}

.searchForm {
  margin: 0 auto;
  align-items: center;
  max-width: 350px;
  width: 80%;
}


#nav a {
  color: rgb(65, 165, 65);
  transition: color 0.3s;
}
</style>
