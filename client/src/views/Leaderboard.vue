<template>
  <div>
  <h1> Leaderboard </h1>
  <table>
      <thead>
      <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Weights</th>
          <th>Exercise</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(entry, index) in leaderboard" :key="entry.id">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.userName }}</td>
          <td>{{ entry.weight }}</td>
          <td>{{ entry.exercise }}</td>
      </tr>
      </tbody>
  </table>
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
              // parse the comma separated strings into structured data
              this.leaderboard = leaderboard.map(entry => {
                  const [userName, weight, exercise] = entry.split(', '); // Split the string into parts
                  return {
                      userName,
                      weight,
                      exercise
                  };
              });
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
