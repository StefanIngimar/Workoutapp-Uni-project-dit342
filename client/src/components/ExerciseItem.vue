<template>
<div>
<p>Name: {{ exercise.name }}</p>
<p>Bodypart: {{ exercise.bodyPart }}</p>
<p>Bodyweight: {{ exercise.hasWeight }}</p>
<p>Weight: {{ exercise.weight }}</p>
<p>Reps: {{ exercise.reps }}</p>
<p>Sets: {{ exercise.sets }}</p>
</div>

</template>

<script>
export default{
    name: 'exercise-item',
    props: ['exercise']
}
</script>

<style scoped>

</style>