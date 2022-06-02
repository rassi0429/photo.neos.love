<template lang="pug">
  div#momentRoot
    | tag {{ $route.params.id }}
    grid-image(:images="images")
    photo-view-modal
</template>

<script>

import {mapState} from "vuex";
import  axios from "axios"
import PhotoViewModal from "@/components/modal";

export default {
  name: "MomentId",
  components: {PhotoViewModal},
  data() {
    return {
      images :[]
    }
  },
  computed: {
    ...mapState(["endpoint"])
  },
  methods: {
    async loadImage() {
      const {data} = await axios.get(`${this.endpoint}/v1/tag/${this.$route.params.id}`)
      this.images = data.photos
    }
  },
  mounted() {
    this.loadImage()
  }
}
</script>

<style scoped>
#momentRoot {
  background-color: #050505;
  min-height: 100vh;
}

#headImg {
  position: fixed;
  width: 5%;
  opacity: 50%;
  margin-top: 1em;
  z-index: 20;
  -webkit-user-drag: none;
}

#content {
  width: 80vw;
  margin: auto;
  padding-top: 5em;
}

</style>
