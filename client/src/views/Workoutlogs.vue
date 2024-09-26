<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios';
//code is not working, just trying to fetch data properly
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
        eventSources: [
          {
            url: '/api/v1/workoutlogs',
            method: 'GET',
            extraParams: {
              custom_param1: 'something',
              custom_param2: 'somethingelse'
            },
            failure: function() {
              alert('There was an error while fetching workout logs!');
            },
            color: 'yellow',
            textColor: 'black'
          }
        ]
      }
    }
  }
}
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>