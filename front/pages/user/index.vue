<template lang="pug">
  div.container
    | HI
</template>
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
    this.$router.push("/user/" + this.uid)
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
  }
}
</script>
