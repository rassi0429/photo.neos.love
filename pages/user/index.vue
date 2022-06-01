<template lang="pug">
  div.container 
    | HI
</template>
<style>
body {
  background-color: black;
  min-height: 100vh;
}
</style>
<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "UserIndex",
  data() {
      return {
        uid: ""
      }
  },
  computed: {
    ...mapState(["endpoint"])
  },
  async mounted() {
    this.uid = await this.getUserInfo()
    console.log(this.uid)
    this.$router.push("/user/"+this.uid+"/photos")
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
  }
}
</script>
