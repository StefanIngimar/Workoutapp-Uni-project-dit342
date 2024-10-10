<script setup lang="ts">

import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string,
  log?: {
    title: string,
    session: Array<{
      user: string,
      exercises: Array<{
        exercise: {
          name: string,
          _id: string,
          hasWeights: boolean,
          weight: number,
          bodyPart: string
        },
        sets: number,
        reps: number,
        weight: number
      }>
    }>
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'close'): void
  (e: 'edit'): void
}>()
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <h1 class="text-xl">
        {{ log?.title || 'No Title Available' }}
    </h1>
    <div v-if="log?.session && log.session.length > 0">
      <ul>
        <li v-for="(workoutlogs, sessionIndex) in log.session" :key="sessionIndex" class="mt-2">
          <h2 class="font-bold mt-4">Session {{ sessionIndex + 1 }}</h2>
          <ul>
            <li v-for="(exercise, exerciseIndex) in workoutlogs.exercises" :key="exerciseIndex">
              <p><strong>Exercise:</strong> {{ exercise.exercise.name }}</p> 
              <p><strong>Sets:</strong> {{ exercise.sets }}</p>
              <p><strong>Reps:</strong> {{ exercise.reps }}</p>
              <p><strong>Weight:</strong> {{ exercise.weight }} kg</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
      <div v-else>
        <p>No exercises found in this workout log.</p>
      </div>

    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('close')">
      Close
    </button>

    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('edit')">
      Edit Workout Log
    </button>
  </VueFinalModal>
</template>