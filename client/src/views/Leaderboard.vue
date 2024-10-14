<template>
  <div>
    <h1 class="mb-4 text-center">Leaderboard</h1>
    <div class="row">
      <div class="col-md-4" v-for="(entry, index) in leaderboard" :key="entry.id">
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
          leaderboard: []
      }
  },

  methods: {
  async fetchLeaderboard(){
      try{
          const response = await axios.get('/api/v1/leaderboard');
          const leaderboard = response.data;
          console.log('Fetched leaderboard: ', leaderboard);

          if(Array.isArray(leaderboard) && leaderboard.length > 0){
              this.leaderboard = leaderboard.map(entry => ({
                      userName: entry.user,
                      weight: entry.weight,
                      exercise: entry.exercise
              }));
          } else {
              console.error('Invalid data format');
          }
      } catch (error){
          console.error('Error fetching leaderboard', error);
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

table {
  font-family: Arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  content: center;
  border: 2px solid rgb(140 140 140);
}
</style>
