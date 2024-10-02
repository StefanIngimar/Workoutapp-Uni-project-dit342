<template>
    <div>
        <h1> User Profile </h1>
        <p><strong>Username:</strong>{{ user.userName }}</p>
        <p><strong>Email:</strong>{{ user.email }}</p>
    </div>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
h1 {
    color: blueviolet;
}
</style>
