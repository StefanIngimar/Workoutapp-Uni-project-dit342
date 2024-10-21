<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalConfirm from '../components/ModalConfirm.vue'
import EditWorkoutLog from '../components/EditWorkoutLog.vue'

// Used a 3rd party library for the calendar https://fullcalendar.io/docs/events-array
export default {
  components: {
    FullCalendar,
    ModalsContainer,
    ModalConfirm,
    EditWorkoutLog
  },
  data() {
    return {
      workoutLogIdd : '',
      errorMsg: '',
      user: '',
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [],
        eventClick: this.handleEventClick
      },
      selectedWorkoutLog: null
    }
  },
  methods: {
    getUserInfo() { //for the user state. if a user is not logged in they should not be able to see this screen
      this.user = JSON.parse(localStorage.getItem('user'))
    },
    async fetchWorkoutLogs() {
      try { // fetch the workoutlogs for the user who is logged in
        const response = await axios.get(`/api/v1/workoutlogs/${this.user._id}`);
        // Map the response data to the FullCalendar event format
        const events = response.data.map(log => ({
          id: log._id, // Use the MongoDB _id as the event ID
          title: log.title,
          start: log.date // Ensure the date is properly formatted
        }))
        console.log('Fetched events: ', events)

        if (Array.isArray(events) && events.length > 0) {
          // assign the event data from the api to the calendar events
          this.calendarOptions.events = events
          //force vue to render the calendar so new events are displayed
          this.$forceUpdate()
        } else {
          console.error('Invalid data format')
        }
      } catch (error) {
        this.errorMsg = error
        console.error('Error fetching events', error)
      }
    },
    //Here's where the modals come in. We first fetch the workout log by ID, then open the ModalConfirm modal
    //The user can then edit the workout log, and then edit it or delete it.
    async handleEventClick(info) {
      info.jsEvent.preventDefault()
      const workoutLogId = info.event.id
      this.workoutLogIdd = workoutLogId
      console.log('Event clicked, ID:', workoutLogId)


    try {
        const response = await axios.get(`/api/v1/workoutlogs/${this.user}/${workoutLogId}`);
        this.selectedWorkoutLog = response.data;
        console.log('Selected workout log: ', this.selectedWorkoutLog);
        // First, open the ModalConfirm modal
        const openModal = useModal({
          component: ModalConfirm,
          attrs: {
            title: 'Workout Log Details',
            log: this.selectedWorkoutLog,
            onClose: () => {
              openModal.close()
            }, // define modals within the same methods. couldnt get them to work otherwise
            onEdit: () => {
              openModal.close()
              const openEditModal = useModal({
                component: EditWorkoutLog,
                attrs: {
                  title: 'Edit Workout Log',
                  log: this.selectedWorkoutLog,
                  onSave: this.updateWorkoutLog,
                  onDelete: this.deleteWorkoutLog,
                  onCancel: () => {
                    openEditModal.close()
                  }
                }
              })
              openEditModal.open() // Open the edit modal
            }
          }
        })

        openModal.open() // Open the confirm modal
      } catch (error) {
        this.errorMsg = error
        console.error('Error fetching workout log', error)
      }
    },
    // update the workoutlog within the edit modal
    async updateWorkoutLog(updatedLog) {
      try {
        console.log('putworkoutlogid', this.workoutLogIdd)
        const response = await axios.put(`/api/v1/workoutlogs/${this.workoutLogIdd}`, updatedLog)
        console.log('Workout log updated:', response.data)
        alert('Workout log updated successfully')
        this.fetchWorkoutLogs()
      } catch (error) {
        this.errorMsg = error
        console.error('Error updating workout log:', error)
        alert('Failed to update workout log')
      }
    },
    //delete the log entierly in the edit modal
    async deleteWorkoutLog() {
      const workoutLogId = this.selectedWorkoutLog._id
      try {
        const response = await axios.delete(`/api/v1/workoutlogs/${workoutLogId}`)
        console.log('Workout log deleted:', response.data)
        alert('Workout log deleted successfully')
        this.fetchWorkoutLogs()
      } catch (error) {
        console.error('Error deleting workout log:', error)
        alert('Failed to delete workout log')
      }
    }
  },

  mounted() {
    this.getUserInfo();
    this.fetchWorkoutLogs();
  }
}
</script>

<template>
  <div v-if="this.user">
    <FullCalendar :options="calendarOptions" />
    <ModalsContainer />
    <!-- Error Message -->
    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
  </div>
  <div v-else>
    User not signed in.
  </div>
</template>
<style>
.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}
</style>