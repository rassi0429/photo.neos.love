<template lang="pug">
  div#momentRoot
    div(:class="{'blur': isModalOpen || isUploadModal}")
      nuxt-link#headImg(to="/" tag="img" src="/head.png")
      img#uploadBtn(v-show="uid" @click="openModal" tag="img" src="~/assets/upload_btn.png")
      nuxt-link#loginBtn(v-show="uid" :to="'/user/'+uid" tag="img" :src="photoUrl")
      div#headerBackground
      img#GridGradation(src="~/assets/top_gradation.png")
      div#content
        div.user-header.is-flex
          p#MomentTitle Tag : {{ $route.params.id }}
        div#imageGrid
          grid-image(:images="images")
    photo-view-modal
    upload-modal
</template>

<script>

import {mapActions, mapMutations, mapState} from "vuex";
import  axios from "axios"
import PhotoViewModal from "@/components/modal";
import UploadModal from "@/components/upload";
import auth from "@/plugins/auth";

export default {
  name: "MomentId",
  components: {UploadModal, PhotoViewModal},
  data() {
    return {
      uid: "",
      images :[],
      photoUrl: ""
    }
  },
  computed: {
    ...mapState(["endpoint"]),
    ...mapState(`upload`,["isUploadModal"])
  },
  methods: {
    ...mapMutations(`upload`,["openModal"]),
    ...mapActions(`auth`,["getUserInfo"]),
    async loadImage() {
      const {data} = await axios.get(`${this.endpoint}/v1/tag/${this.$route.params.id}`)
      this.images = data.photos
    }
  },
  async mounted() {
    this.loadImage()
    this.uid = (await this.getUserInfo())
    const user = await auth()
    this.photoUrl = user.photoURL
  }
}
</script>

<style scoped>
.user-header {
  position: fixed;
  width: 80vw;
  align-items: flex-end;
}

.headImg {
  position: fixed;
  width: 5%;
  opacity: 0.5;;
  margin-top: 1em;
  z-index: 20;
  -webkit-user-drag: none;
}

#headerBackground {
  background-color: #050505;
  position: fixed;
  width: 100vw;
  height: 10vh;
  min-height: 100px;
  max-height: 200px;
}

#GridGradation {
  position: fixed;
  width: 100vw;
  margin-top: max(100px, min(200px, 10vh));
  height: 5vh;
}

#momentRoot {
  background-color: #050505;
  min-height: 100vh;
}

#MomentTitle {
  white-space: nowrap;
  opacity: 0.5;;
  margin-left: 0.3em;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: min(25px, max(3vw,10px));
  line-height: min(50px, max(5vw,20px));
}

.headImg {
  position: fixed;
  width: 5%;
  opacity: 0.5;;
  margin-top: 1em;
  z-index: 20;
  -webkit-user-drag: none;
}

#content {
  width: 80vw;
  margin: auto;
  padding-top: 2em;
}

#imageGrid {
  margin-top: 10vh;
}

#uploadBtn {
  position: fixed;
  right: 10px;
  bottom: 90px;
  max-width: 50px;
  opacity: 0.2;
}

#uploadBtn:hover {
  opacity: 0.5;
}

#loginBtn {
  position: fixed;
  right: 10px;
  bottom: 30px;
  max-width: 50px;
  opacity: 0.5;;
  border-radius: 100%;
}

#loginBtn:hover {
  opacity: 0.9
}

.blur {
  -webkit-filter: blur(8px);
  -moz-filter: blur(8px);
  -ms-filter: blur(8px);
  filter: blur(8px);
}

</style>
