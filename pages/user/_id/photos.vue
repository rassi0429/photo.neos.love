<template lang="pug">
  div
    div.header.is-flex
      p.title Neos Frame
    div.user-header
      div.container
        img.head-avatar(:src="userInfo.twitterImage")
    div.container
      photo-view-modal
      grid-image(:images="photos")
</template>
<style>
body {
  background-color: black;
  min-height: 100vh;
}

.header {
  height: 60px;
}

.head-avatar {
  height: 120px;
  border-radius: 100%;
}

.user-header {
  height: 180px;
}
</style>
<script>
import {mapActions, mapState} from "vuex";
import axios from "axios"
import PhotoViewModal from "@/components/modal";

export default {
  name: "UserPhotosPage",
  components: {PhotoViewModal},
  data() {
    return {
      uid: "",
      photos: [],
      userInfo: {}
    }
  },
  computed: {
    ...mapState(["endpoint"])
  },
  async mounted() {
    this.uid = await this.getUserInfo()
    this.photos = await this.getUserPhoto()
    this.getUserInfo()
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    async getUserPhoto() {
      const {data} = await axios.get(`${this.endpoint}/v1/user/${this.$route.params.id}/photos`)
      return data
    },
    async getUserInfo() {
      const {data} = await axios.get(`${this.endpoint}/v1/user/${this.$route.params.id}`)
      this.userInfo = data
    }
  }
}
</script>
