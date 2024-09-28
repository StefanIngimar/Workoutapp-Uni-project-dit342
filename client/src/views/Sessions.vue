<template>
  <div>
    <h1> Sessions </h1>
    <div v-if="sessionMessage">
      <session-item v-bind:session="sessionMessage" @session-deleted="handleSessionDeleted"
        @delete-error="handleDeleteError" @session-updated="handleSessionUpdated" />
    </div>


    <div class="form">
      <p>Name: <input v-model="sessionName" /></p>
      <p>Duration: <input type="number" v-model="duration" /></p>
      <p>Completed: <input type="checkbox" v-model="isCompleted" /></p>
      <p>Notes: <input v-model="notes" /></p>

      <b-button class="btn_message" variant="primary" v-on:click="postSession()">Submit session</b-button>
    </div>

    <div class="searchForm">
      <b-form-input v-on:input="searchExercise" v-model="searchText" placeholder="Search"> </b-form-input>
    </div>

    <div v-for="session in sessions" v-bind:key="session._id">
      <session-item v-bind:session="session" @session-deleted="handleSessionDeleted" @delete-error="handleDeleteError"
        @session-updated="handleSessionUpdated" />
    </div>
  </div>

</template>

<script>
import { Api } from '@/Api'
import MyFooter from '@/components/MyFooter.vue'
import SessionItem from '@/components/SessionItem.vue'


export default {
  name: 'sessions',
  components: {
    MyFooter,
    SessionItem
  },
  mounted() {
    Api.get('/v1/dailysessions')
      .then((response) => {
        this.sessions = response.data
        this.sessions.forEach(session => {
          Api.get(`/v1/dailysessions/${session._id}/exercises`)
            .then((response) => {
              this.session.exercises = response.data
            })
            .catch((error) => {
              this.session.exercises = error
            })
        });
      })
      .catch((error) => {
        this.sessions = error
      })

  },
  methods: {

    handleSessionUpdated() {
      Api.get('/v1/dailysessions')
        .then((response) => {
          this.sessions = response.data;
        })
        .catch((error) => {
          this.exerciseMessage = error;
        })
    },

    handleSessionDeleted() {
      Api.get('/v1/dailysessions')
        .then((response) => {
          this.sessions = response.data;
          this.sessionMessage = '';
        })
        .catch((error) => {
          this.sessionMessage = error;
        })
    },
    handleDeleteError() {
      this.sessionMessage = error;
    },
    postSession() {
      Api.post('/v1/dailysessions',
        {
          userID: this.userID,
          sessionName: this.sessionName,
          duration: this.duration,
          isCompleted: this.isCompleted,
          notes: this.notes,
          exercises: ''
        }
      )
        .then((response) => {
          this.sessionMessage = response.data;
          Api.get('/v1/dailysessions')
            .then((response) => {
              this.sessions = response.data
            })
            .catch((error) => {
              this.sessionsMessage = error
            })
        })
        .catch((error) => {
          this.sessionMessage = error;
        })
    },
    searchExercise() {
      Api.get(`/v1/dailysessions/search?sessionName=${this.searchText}`)
        .then((response) => {
          this.sessions = response.data
          if (this.searchText === '') {
            Api.get('/v1/dailysessions')
              .then((response) => {
                this.sessions = response.data
              })
              .catch((error) => {
                this.sessions = error
              })
          }
        })
        .catch((error) => {
          this.sessions = error
        })
    }
  },
  data() {
    return {
      sessions: '',
      message: 'none',
      postMessage: '',
      sessionMessage: '',
      userID: '',
      sessionName: '',
      duration: '',
      isCompleted: false,
      notes: '',
      searchText: ''
    }
  }
}
</script>

<style scoped>
.form {
  margin-left: 800px;
  margin-right: 800px;
  padding: 50px;
  background-color: rgb(125, 190, 221);
  border: 2px solid;
  border-color: black;
}

.searchForm {
  margin-left: 800px;
  margin-right: 800px;
}
</style>
