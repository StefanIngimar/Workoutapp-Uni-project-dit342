<template>
  <div v-if="this.user">
    <h1> Sessions </h1>

    <div class="form">
      <p>Name:</p>
      <p><input class="input" v-model="sessionName" /></p>
      <p>Duration:</p>
      <p><input class="input" type="number" v-model="duration" /></p>
      <p>Completed: <input type="checkbox" v-model="isCompleted" /></p>
      <p>Notes:</p>
      <p><input class="input" v-model="notes" /></p>

      <b-button class="btn_message" variant="primary" v-on:click="postSession()">Submit session</b-button>
    </div>

    <h2>Previous sessions:</h2>
    <p>
      {{ errorMessage }}
    </p>
    <div v-if="sessionMessage">
      <session-item v-bind:session="sessionMessage" @session-deleted="handleSessionDeleted"
        @error-detected="handleError" @session-updated="handleSessionUpdated(sessionMessage._id)" />
    </div>

    <div class="searchForm">
      <b-form-input v-on:input="searchSession" v-model="searchText" placeholder="Search"> </b-form-input>
    </div>

    <div class="sessions-list">
      <div v-for="session in sessions" v-bind:key="session._id">
        <session-item v-bind:session="session" @session-deleted="handleSessionDeleted" @error-detected="handleError"
          @session-updated="handleSessionUpdated(session._id)" />
      </div>
    </div>
  </div>
  <div v-else>
    User not signed in.
  </div>

</template>

<script>
import { Api } from '@/Api'
import SessionItem from '@/components/SessionItem.vue'

export default {
  name: 'sessions',
  components: {
    SessionItem
  },
  mounted() {
    this.getUserInfo()
    if (this.user) {
      Api.get(`/v1/dailysessions?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.sessions = response.data
        })
        .catch((error) => {
          this.errorMessage = error
        })
    }

  },
  methods: {
    getUserInfo() {
      this.user = JSON.parse(localStorage.getItem('user'))
    },
    // Updates session and displays. On changes with session data and exercises data within session.
    handleSessionUpdated(sessionID) {
      Api.get(`/v1/dailysessions?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.sessions = response.data
          if (this.sessionMessage) {
            Api.get(`/v1/dailysessions/${sessionID}`)
              .then((response) => {
                this.sessionMessage = response.data
              })
              .catch((error) => {
                this.errorMessage = error
              })
          }
        })
        .catch((error) => {
          this.errorMessage = error
        })
    },

    // Updates displayed sessions upon deleted session.
    handleSessionDeleted() {
      Api.get(`/v1/dailysessions?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.sessions = response.data
          this.sessionMessage = ''
        })
        .catch((error) => {
          this.errorMessage = error
        })
    },
    handleError() {
      this.errorMessage = error
    },
    //Posts a session and updates the view of sessions.
    postSession() {
      Api.post('/v1/dailysessions',
        {
          userID: this.user._id,
          sessionName: this.sessionName,
          duration: this.duration,
          isCompleted: this.isCompleted,
          notes: this.notes,
          exercises: ''
        }
      )
        .then((response) => {
          this.sessionMessage = response.data
          Api.get(`/v1/dailysessions?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
            .then((response) => {
              this.sessions = response.data
            })
            .catch((error) => {
              this.errorMessage = error
            })
        })
        .catch((error) => {
          this.errorMessage = error
        })
    },

    // Searches for session based on user + query parameters. Returns whole collection for user if searchtext is empty.
    searchSession() {
      Api.get(`/v1/dailysessions/search?sessionName=${this.searchText}&userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
        .then((response) => {
          this.sessions = response.data
          if (this.searchText === '') {
            Api.get(`/v1/dailysessions?userID=${this.user._id}&isAdmin=${this.user.isAdmin}`)
              .then((response) => {
                this.sessions = response.data
              })
              .catch((error) => {
                this.errorMessage = error
              })
          }
        })
        .catch((error) => {
          this.errorMessage = error
        })
    }
  },
  data() {
    return {
      sessions: '',
      message: 'none',
      errorMessage: '',
      sessionMessage: '',
      userID: '',
      sessionName: '',
      duration: '',
      isCompleted: false,
      notes: '',
      searchText: '',
      user: ''
    }
  }
}
</script>

<style scoped>
.sessions-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}
</style>
