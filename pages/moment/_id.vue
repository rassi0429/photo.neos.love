<template lang="pug">
  div
    div#momentRoot(:class="{'blur': isModalOpen || isUploadModal}")
      nuxt-link#loginBtn(v-show="uid" :to="'/user/'+uid" tag="img" :src="photoUrl")
      img#uploadBtn(v-show="uid" @click="openModal" tag="img" src="/upload_btn.png")
      img#TopGradation(src="/top_gradation.png")
      div#content
        p#date {{ formatDate(new Date(momentData.createDate)) }}
        div.is-flex#header
          p#MomentTitle {{ momentData.title || ""}}
          img#shareBtn(src="/link.png", alt="link" :ref="'m' + $route.params.id" @click="copyMomentUrl($route.params.id)")
        grid-image(:images="momentData.photos")
    photo-view-modal
    upload-modal
</template>

<script>
import axios from "axios";
import {mapActions, mapMutations, mapState} from "vuex";
import PhotoViewModal from "@/components/modal";
import auth from "@/plugins/auth";
import UploadModal from "@/components/upload";

export default {
  name: "MomentId",
  components: {UploadModal, PhotoViewModal},
  async asyncData({params}) {
    const {data} = await axios.get("https://photo-api.neos.love/v1/moment/" + params.id)
    return {preData: data}
  },
  head() {
    return {
      title: this.preData.title,
      meta: [
        {hid: 'description', name: 'description', content: this.preData.title},
        {hid: 'og:type', property: 'og:type', content: 'website'},
        {hid: 'og:title', property: 'og:title', content: this.preData.title},
        {hid: 'og:url', property: 'og:url', content: `${this.endpoint}/moment/${this.$route.params.id}`},
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.preData.photos[0].url
        },
        {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
        {hid: 'twitter:title', property: 'twitter:title', content: this.preData.title},
        {hid: 'twitter:description', property: 'twitter:description', content: this.preData.title},
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.preData.photos[0].url
        },
      ]
    }
  },
  data() {
    return {
      momentData: {
        id: 0,
        title: "",
        author: "",
        photos: []
      },
      uid: ``,
      photoUrl: ``
    }
  },
  methods: {
    ...mapActions(`auth`, ["getUserInfo"]),
    ...mapMutations("upload", ["openModal"]),
    async getMomentData() {
      const {data} = await axios.get(`${this.endpoint}/v1/moment/${this.$route.params.id}`)
      return data
    },
    formatDate(date) {
      return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    },
    copyMomentUrl(id) {
      const clipboardText = `https://photo.neos.love/moment/${id}`;
      try {
        navigator.clipboard.writeText(clipboardText);
        this.$refs['m' + id][0].src = '/check.png'
        setTimeout(() => {
          this.$refs['m' + id][0].src = '/link.png'
        }, 2000)
      } catch {
        alert(`https ni site ne`)
      }
    }
  },
  computed: {
    ...mapState(["endpoint"]),
    ...mapState("modal", ["isModalOpen"]),
    ...mapState("upload", ["isUploadModal"]),
  },
  async mounted() {
    this.momentData = await this.getMomentData()
    this.uid = (await this.getUserInfo())
    const user = await auth()
    this.photoUrl = user.photoURL
  }
}
</script>

<style scoped>
#momentRoot {
  background-color: #050505;
  min-height: 100vh;
}

.headImg {
  position: fixed;
  width: 5%;
  opacity: 0.5;;
  margin-top: 1em;
  z-index: 20;
  -webkit-user-drag: none;
}

#uploadBtn {
  position: fixed;
  right: 10px;
  bottom: 80px;
  max-width: 50px;
  opacity: 0.2;
}

#TopGradation {
  position: fixed;
  height: 5em;
  width: 100vw;
  z-index: 10;
}

#content {
  width: 80vw;
  margin: auto;
  padding-top: 5em;
}

#date {
  color: #FFFFFF;
  opacity: 0.2;;
}

#MomentTitle {
  color: #ffffff;
  font-size: 2em;
  opacity: 0.5;;
}

#shareBtn {
  margin-left: 1em;
  margin-top: 1em;
  height: 1.5em;
  opacity: 0.2;;
}

#shareBtn:hover {
  opacity: 0.5;;
}

.blur {
  -webkit-filter: blur(8px);
  -moz-filter: blur(8px);
  -ms-filter: blur(8px);
  filter: blur(8px);
}

#loginBtn {
  position: fixed;
  right: 10px;
  bottom: 30px;
  max-width: 50px;
  opacity: 0.5;;
  border-radius: 100%;
}

</style>
