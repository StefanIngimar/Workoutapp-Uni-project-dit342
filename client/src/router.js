import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Profile from './views/Profile.vue'
import Sessions from './views/Sessions.vue'
import Exercises from './views/Exercises.vue'
import Achievements from './views/Achievements.vue'
import Leaderboard from './views/Leaderboard.vue'
import Authentication from './views/Authentication.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import Workoutlogs from './views/Workoutlogs.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/sessions', name: 'sessions', component: Sessions },
  { path: '/exercises', name: 'exercises', component: Exercises },
  { path: '/achievements', name: 'achievements', component: Achievements },
  { path: '/leaderboard', name: 'leaderboard', component: Leaderboard },
  { path: '/auth', name: 'auth', component: Authentication },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
  { path: '/workoutlogs', name: 'workoutlogs', component: Workoutlogs }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
