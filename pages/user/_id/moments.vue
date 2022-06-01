<template lang="pug">
  div.container 
    div(v-for="(moment,i) in moments" :key="i")
        | {{moment.title}}
        img(v-for="(photo,ii) in moment.photos" :key="ii" :src="photo.url")
</template>
<style>
body {
  background-color: black;
  min-height: 100vh;
}
</style>
<script>
import { mapActions, mapState } from "vuex";
import axios from "axios"

export default {
  name: "UserPage",
  data() {
    return {
      uid: "",
      moments: []
    }
  },
  computed: {
    ...mapState(["endpoint"])
  },
  async mounted() {
    this.uid = await this.getUserInfo()
    this.moments = await this.getUserPhoto()
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    async getUserPhoto() {
        const {data} = await axios.get(`${this.endpoint}/v1/user/${this.uid}/moments`)
        return data
    }
  }
}
</script>
