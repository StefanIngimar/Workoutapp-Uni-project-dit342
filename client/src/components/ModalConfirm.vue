<script setup lang="js">
import { VueFinalModal } from 'vue-final-modal';
import { computed } from 'vue';

// Define the props and emit events
const props = defineProps({
  log: {
    type: Array,  // Expecting an array of logs
    default: () => ([
      {
        _id: '',
        title: '',
        date: new Date(),
        session: [
          {
            _id: '',
            userID: '',
            sessionName: '',
            duration: 0,
            isCompleted: false,
            notes: '',
            exercises: [
              {
                name: '',
                _id: '',
                hasWeights: false,
                weight: 0,
                bodyPart: '',
                isCustom: false,
                reps: 0,
                sets: 0,
                userID: '',
              },
            ],
          },
        ],
      }
    ]),
  },
});

// Use a plain copy of the log (remove reactivity)
const plainLog = JSON.parse(JSON.stringify(props.log));

// Define emit events
const emit = defineEmits([
  'update:modelValue',
  'close',
  'edit'
]);

// Create a computed property to handle sessions
const sessions = computed(() => {
  return plainLog && plainLog.length > 0 && plainLog[0].session ? plainLog[0].session : [];
});

// Log the incoming props to check if log data exists
console.log('Props received:', { log: props.log, plainLog });

</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <!-- Loop over the logs array -->
    <div v-if="plainLog.length > 0">
      <div v-for="logItem in plainLog" :key="logItem._id">
        <h1 class="text-xl">
          <!-- Display the title from each log -->
          {{ logItem.title || 'No Title Available' }}
        </h1>
        <p><strong>Date:</strong> {{ new Date(logItem.date).toLocaleDateString() }}</p>

        <!-- Loop through the sessions and exercises for each log -->
        <div v-if="logItem.session.length > 0">
          <ul>
            <li v-for="(session) in logItem.session" :key="session._id">
              <p>{{ session.sessionName || 'No Session Name' }}</p>
              <p><strong>Duration:</strong> {{ session.duration }} mins</p>
              <p><strong>Notes:</strong> {{ session.notes || 'No Notes Available' }}</p>

              <!-- Exercises -->
              <div v-if="session.exercises.length > 0">
                <h3 class="mt-2 font-medium">Exercises:</h3>
                <div v-for="(exercise) in session.exercises" :key="exercise._id">
                  <p><strong>Exercise:</strong> {{ exercise.name }}</p>
                  <p><strong>Sets:</strong> {{ exercise.sets }}</p>
                  <p><strong>Reps:</strong> {{ exercise.reps }}</p>
                  <p><strong>Weight:</strong> {{ exercise.hasWeights ? exercise.weight + ' kg' : 'No Weights' }}</p>
                </div>
              </div>

              <!-- No exercises available -->
              <div v-else>
                <p>No exercises available for this session.</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- No sessions available -->
        <div v-else>
          <p>No sessions available for this workout log.</p>
        </div>
      </div>
    </div>

    <!-- No logs available -->
    <div v-else>
      <p>No logs available.</p>
    </div>

    <!-- Modal Buttons -->
    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('close')">
      Close
    </button>

    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('edit')">
      Edit Workout Log
    </button>
  </VueFinalModal>
</template>
