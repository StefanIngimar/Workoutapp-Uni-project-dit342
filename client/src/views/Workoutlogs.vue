<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalConfirm from '../components/ModalConfirm.vue'
import EditWorkoutLog from '../components/EditWorkoutLog.vue'

// https://fullcalendar.io/docs/events-json-feed
export default {
  components: {
    FullCalendar,
    ModalsContainer,
    ModalConfirm,
    EditWorkoutLog
  },
  data() {
    return {
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
    async fetchWorkoutLogs() {
      try {
        const response = await axios.get('/api/v1/workoutlogs')
        const events = response.data
        console.log('Fetched events: ', events)

        if (Array.isArray(events) && events.length > 0) {
          this.calendarOptions.events = events
          this.$forceUpdate()
        } else {
          console.error('Invalid data format')
        }
      } catch (error) {
        console.error('Error fetching events', error)
      }
    },
    async handleEventClick(info) {
      info.jsEvent.preventDefault()
      const workoutLogId = info.event.id
      console.log('Event clicked, ID:', workoutLogId)

      try {
        const response = await axios.get(`/api/v1/workoutlogs/${workoutLogId}`)
        this.selectedWorkoutLog = response.data
        console.log('Selected workout log: ', this.selectedWorkoutLog)

        const openModal = useModal({
          component: ModalConfirm,
          attrs: {
            title: 'Workout Log Details',
            log: this.selectedWorkoutLog,
            onConfirm: () => {
              openModal.close()
            },
            onEdit: () => {
              openModal.close()
              this.openEditModal()
            }
          }
        })

        openModal.open()
      } catch (error) {
        console.error('Error fetching workout log', error)
      }
    },
    openEditModal() {
      const openEditModal = useModal({
        component: EditWorkoutLog,
        attrs: {
          title: 'Edit Workout Log',
          log: this.selectedWorkoutLog,
          onSave: this.updateWorkoutLog,
          onCancel: () => {
            openEditModal.close()
          }
        }
      })

      openEditModal.open()
    },
    async updateWorkoutLog(updatedLog) {
      try {
        const response = await axios.put(`/api/v1/workoutlogs/${workoutLogId}`, updatedLog)
        console.log('Workout log updated:', response.data)
        alert('Workout log updated successfully')
        this.fetchWorkoutLogs()
      } catch (error) {
        console.error('Error updating workout log:', error)
        alert('Failed to update workout log')
      }
    }
  },

  mounted() {
    this.fetchWorkoutLogs()
  }
}
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" />
    <ModalsContainer />
  </div>
</template>
