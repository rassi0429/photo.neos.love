<template lang="pug">
  div
    img#uploadBtn(v-show="uid" @click="openModal" tag="img" src="/upload_btn.png")
    nuxt-link#loginBtn(v-show="uid" :to="'/user/'+uid" tag="img" :src="photoUrl")
    div#headerBackground
    img#GridGradation(src="/top_gradation.png")
    div#content
      div.user-header.is-flex
        p#MomentTitle \#{{ $route.params.id }}
      div#imageGrid
        grid-image(:images="images")
</template>

<script>

import {mapActions, mapMutations, mapState} from "vuex";
import axios from "axios"
import PhotoViewModal from "@/components/modal";
import UploadModal from "@/components/upload";
import auth from "@/plugins/auth";

export default {
  name: "MomentId",
  components: {UploadModal, PhotoViewModal},
  layout: "normal",
  async asyncData({params,query}) {
    const {data} = await axios.get("https://photo-api.neos.love/v1/tag/" + encodeURIComponent(params.id))
    if (query.modal) {
      const photo = await axios.get("https://photo-api.neos.love/v1/photo/" + query.modal)
      return {preData: data, prePhotoData: photo.data}
    }
    return {preData: data}
  },
  data() {
    return {
      uid: "",
      images: [],
      photoUrl: ""
    }
  },
  head() {
    if (this.$route.query.modal) {
      return {
        title: this.prePhotoData?.comment,
        meta: [
          {hid: 'description', name: 'description', content:  this.preData?.name},
          {hid: 'og:type', property: 'og:type', content: 'website'},
          {hid: 'og:title', property: 'og:title', content: `${this.prePhotoData?.comment} - ${this.preData?.name}`},
          {hid: 'og:url', property: 'og:url', content: `${this.endpoint}/tag/${this.$route.params.id}?modal=${this.$route.query.modal}`},
          {hid: 'og:description', property: 'og:description', content: this.preData?.name},
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.prePhotoData?.url.replace("public","ogp")
          },
          {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
          {hid: 'twitter:title', property: 'twitter:title', content: `${this.prePhotoData?.comment} - ${this.preData?.name}`},
          {hid: 'twitter:description', property: 'twitter:description', content: "'" + this.preData?.name + "' tags Photo"},
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: this.prePhotoData?.url.replace("public","ogp")
          },
        ]
      }
    }
     return {
       title: this.preData.name,
       meta: [
         {hid: 'description', name: 'description', content: this.preData?.name},
         {hid: 'og:type', property: 'og:type', content: 'website'},
         {hid: 'og:title', property: 'og:title', content: "Tag: " + this.preData?.name},
         {hid: 'og:description', property: 'og:description', content: "Tag: " + this.preData?.name},
         {hid: 'og:url', property: 'og:url', content: `${this.endpoint}/tag/${this.$route.params.id}`},
         {
           hid: 'og:image',
           property: 'og:image',
           content: this.preData?.thumbnail || "https://imagedelivery.net/n_TCh9IYDQry4G-U7jzPdQ/66d52fd1-26a8-4b4f-ad5f-c6d59da6f100/thumbnail"
         },
         {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
         {hid: 'twitter:title', property: 'twitter:title', content: "Tag: " + this.preData?.name},
         {hid: 'twitter:description', property: 'twitter:description', content: "Tag: " + this.preData?.name},
         {
           hid: 'twitter:image',
           property: 'twitter:image',
           content: this.preData?.thumbnail || "https://imagedelivery.net/n_TCh9IYDQry4G-U7jzPdQ/66d52fd1-26a8-4b4f-ad5f-c6d59da6f100/thumbnail"
         },
       ]
     }
  },
  computed: {
    ...mapState(["endpoint"]),
    ...mapState(`upload`, ["isUploadModal"])
  },
  async mounted() {
    this.loadImage()
    this.uid = (await this.getUserInfo())
    const user = await auth()
    this.photoUrl = user.photoURL
  },
  methods: {
    ...mapMutations(`upload`, ["openModal"]),
    ...mapActions(`auth`, ["getUserInfo"]),
    async loadImage() {
      const {data} = await axios.get(`${this.endpoint}/v1/tag/${this.$route.params.id}`)
      this.images = data.photos
    }
  }
}
</script>

<style scoped>
.user-header {
  position: fixed;
  width: 80vw;
  align-items: flex-end;
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


#MomentTitle {
  white-space: nowrap;
  color: #fff;
  opacity: 0.5;
  margin-left: 0.3em;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: min(25px, max(3vw, 10px));
  line-height: min(50px, max(5vw, 20px));
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

</style>
