<template lang="pug">
  div
    photo-view-modal
    upload-modal
    nuxt-link.headImg(to="/" tag="img" src="/head.png" :class="{'blur': isModalOpen || isUploadModal}")
    Nuxt(:class="{'blur': isModalOpen || isUploadModal}")
</template>

<script>
import {mapState} from "vuex";
import PhotoViewModal from "@/components/modal";
import UploadModal from "@/components/upload";

export default {
  name: "NormalLayout",
  components: {UploadModal, PhotoViewModal},
  computed: {
    ...mapState("modal", ["isModalOpen"]),
    ...mapState("upload", ["isUploadModal"])
  },
}
</script>

<style scoped>
.blur {
  -webkit-filter: blur(8px);
  -moz-filter: blur(8px);
  -ms-filter: blur(8px);
  filter: blur(8px);
}

.headImg {
  position: fixed;
  width: 5%;
  opacity: 0.5;
  margin-top: 1em;
  z-index: 20;
  -webkit-user-drag: none;
}
</style>
<style>
body {
  background-color: #050505;
  min-height: 100vh;
  padding-bottom: 100px;
}
</style>
