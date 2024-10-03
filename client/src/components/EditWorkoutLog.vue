<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title?: string,
  log?: {
    title: string,
    session: Array<{
      user: string,
      exercises: Array<{
        exercise: string,
        sets: number,
        reps: number,
        weight: number
      }>
    }>
  }
}>()

const editedLog = ref({...props.log});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'save', updatedLog: any): void
}>()

const saveLog = () => {
  emit('save', editedLog.value);
}
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <h1 class="text-xl">{{ title }}</h1>
    <div v-if="editedLog?.session && editedLog.session.length > 0">
      <ul>
        <li v-for="(session, sessionIndex) in editedLog.session" :key="sessionIndex" class="mt-2">
          <h2 class="font-bold mt-4">Session {{ sessionIndex + 1 }}</h2>
          <ul>
            <li v-for="(exercise, exerciseIndex) in session.exercises" :key="exerciseIndex">
              <p><strong>Exercise ID:</strong> {{ exercise.exercise }}</p>
              <label>
                Sets: 
                <input v-model="exercise.sets" type="number" min="1" />
              </label>
              <label>
                Reps: 
                <input v-model="exercise.reps" type="number" min="1" />
              </label>
              <label>
                Weight (kg): 
                <input v-model="exercise.weight" type="number" min="0" />
              </label>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg" @click="saveLog">
      Save Changes
    </button>
  </VueFinalModal>
</template>
