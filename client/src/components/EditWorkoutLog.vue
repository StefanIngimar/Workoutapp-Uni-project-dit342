<script setup lang="js">
import { ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
//used a 3rd party library for the modal https://vue-final-modal.org/use-cases/confirm-modal
// the values we are trying to access are pretty nested, so we define a default value at first
const props = defineProps({
  title: String,
  log: {
    type: Object,
    default: () => ({
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
              _id: '',
              name: '',
              hasWeights: false,
              weight: 0,
              bodyPart: '',
              reps: 0,
              sets: 0,
              userID: '',
            },
          ],
        },
      ],
    }),
  },
});

// access the nested info and copy the log for editing
const editedLog = ref({ ...props.log });

// Define emit events
const emit = defineEmits([
  'update:modelValue',
  'save',
  'delete',
  'cancel'
]);

// Save function
const saveLog = () => {
  emit('save', editedLog.value);
};
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <h1 class="text-xl">{{ props.title || 'Edit Workout Log' }}</h1>

    <!-- Title input field -->
    <label class="block">
      <span class="text-gray-700">Title:</span>
      <input
        v-model="editedLog.title"
        type="text"
        class="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
        placeholder="Enter title"
      />
    </label>

    <!-- Date input field -->
    <label class="block mt-4">
      <span class="text-gray-700">Date:</span>
      <input
        v-model="editedLog.date"
        type="date"
        class="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
      />
    </label>

    <!-- Display session information but make it non-editable -->
    <div v-if="editedLog?.session && editedLog.session.length > 0">
      <ul>
        <li v-for="(session, sessionIndex) in editedLog.session" :key="sessionIndex" class="mt-2">
          <h2 class="font-bold mt-4">Session {{ sessionIndex + 1 }} - {{ session.sessionName || 'No Session Name' }}</h2>
          <p><strong>Duration:</strong> {{ session.duration }} mins</p>
          <p><strong>Notes:</strong> {{ session.notes || 'No Notes Available' }}</p>

          <!-- Display exercises (non-editable) -->
          <ul>
            <li v-for="(exercise, exerciseIndex) in session.exercises" :key="exercise._id">
              <p><strong>Exercise:</strong> {{ exercise.name }}</p>
              <p><strong>Sets:</strong> {{ exercise.sets }}</p>
              <p><strong>Reps:</strong> {{ exercise.reps }}</p>
              <p><strong>Weight:</strong> {{ exercise.weight }} kg</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Save, Delete, Cancel Buttons -->
    <button type="button" class="btn btn-primary" @click="saveLog">
      Save Changes
    </button>
    <button type="button" class="btn btn-primary" @click="emit('delete')">
      Delete Workout Log
    </button>
    <button type="button" class="btn btn-secondary" @click="emit('cancel')">
      Close
    </button>
  </VueFinalModal>
</template>
