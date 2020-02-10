<template lang="pug">
  b-navbar.is-dark
    template(slot="brand")
    template(slot="start")
    template(slot="end")
      b-navbar-item(tag="router-link" :to="{ path: '/' }") Cancel Record
      b-navbar-item(tag="div")
        b-button(@click="" icon-left="content-save") Save Record
</template>

<script>

export default {
  data() {
    return {};
  },
  computed: {
    api() {
      return {
        active: this.$store.state.api.username && this.$store.state.api.key,
        username() {
          return this.$store.state.api.username
        },
        key() {
          return this.$store.state.api.key
        }
      }
    }
  },
  methods: {
    closeWindow() {
      console.log('Figure out how to close the window!');
    }
  }
}
</script>