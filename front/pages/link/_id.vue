<template lang="pug">
  div
    div {{ $route.params.id }}
    div {{ uid }}
    button.button(@click="link") 連携する！
</template>

<script>
import {mapActions, mapState} from "vuex";
import axios from "axios";
import auth from "@/plugins/auth";

export default {
  name: "LinkPage",
  data() {
    return {
      uid: ""
    }
  },
  computed: {
    ...mapState(["endpoint"]),
  },
  async mounted() {
    this.uid = await this.getUserInfo()
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    async link() {
      const user = await auth()
      const token = await user.getIdToken(true)
      await axios.post(`${this.endpoint}/v1/neoslink/${this.$route.params.id}`,null,{headers:{token}})
    }
  }
}
</script>

<style scoped>

</style>
