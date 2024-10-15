<template>
  <div>
    <h1 class="mb-4 text-center">Leaderboard</h1>
    <div class="searchForm mb-4">
        <!-- search bar to filter exercises -->
      <b-form-input v-on:input="filterByExercise" v-model="searchText" placeholder="Filter by exercise"></b-form-input>
    </div>
    <div class="row">
        <!-- for loop to loop through entries in the leaderboard -->
      <div class="col-12 col-md-4" v-for="(entry, index) in leaderboard" :key="entry.id">
        <!-- put entries in cards -->
        <div class="card mb-3">
          <div class="card-header text-center">
            Rank #{{ index + 1 }}
          </div>
          <div class="card-body">
            <h5 class="card-title text-center">{{ entry.userName }}</h5>
            <p class="card-text">
              <strong>Weights: </strong>{{ entry.weight }} kg<br>
              <strong>Exercise: </strong>{{ entry.exercise }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'leaderboard',

  data() {
      return {
          leaderboard: [],
          searchText: '',
          filteredLeaderboard: []
      }
  },

  methods: {
    fetchLeaderboard() {
      axios.get('/api/v1/leaderboard')
        .then((response) => {
            console.log('API response:', response.data);
          const leaderboard = response.data;
          this.leaderboard = leaderboard.map(entry => ({
            userName: entry.user,
            weight: entry.weight,
            exercise: entry.exercise
          }));
          this.filteredLeaderboard = this.leaderboard;
        })
        .catch((error) => {
          console.error('Error fetching leaderboard:', error);
        });
    },

  filterByExercise(){
    if (this.searchText.trim() === '') {
        this.fetchLeaderboard(); // reset to full leaderboard if search is empty or user wants to clear search
      } else {
        axios.get(`/api/v1/searchLeaderboard?exercise=${this.searchText}`)
          .then((response) => {
            if (response.data.message) {
              // handle cases where no entries are found
              this.leaderboard = [];
            } else {
              this.leaderboard = response.data;
            }
          })
          .catch((error) => {
            console.error('Error searching leaderboard:', error);
          });
      }
    }
},
  mounted() {
      this.fetchLeaderboard();
  }
}
</script>

<style scoped>
h1 {
  color: blueviolet;
}
</style>
