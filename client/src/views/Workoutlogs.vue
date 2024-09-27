<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios';
//https://fullcalendar.io/docs/events-json-feed
export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: []
      }
    }
  },

  methods: {
    async fetchWorkoutLogs(){
      try{
        const response = await axios.get('/api/v1/workoutlogs');
        const events = response.data;
        console.log('Fetched events: ', events);

        if(Array.isArray(events) && events.length > 0){
          this.calendarOptions.events = events;
          this.$forceUpdate();
        }else{
          console.error('Invalid data format');
        }
      } catch (error){
        console.error('Error fetching event', error);
      }
    }
  },
//https://vuejs.org/api/options-lifecycle.html#mounted
//https://stackoverflow.com/questions/49137607/what-does-mount-mean-in-vue-js
  mounted() {
    this.fetchWorkoutLogs();
  }
  
}
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>