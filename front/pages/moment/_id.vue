<template lang="pug">
  div
    nuxt-link#loginBtn(v-show="uid" :to="'/user/'+uid" tag="img" :src="photoUrl")
    img#uploadBtn(v-show="uid" @click="openModal" tag="img" src="/upload_btn.png")
    img#TopGradation(src="/top_gradation.png")
    div#content
      p#date {{ formatDate(new Date(momentData.createDate)) }}
      div.is-flex#header
        p#MomentTitle {{ momentData.title || ""}}
        img#linkBtn(src="/link.png", alt="link" ref="tag" @click="copyMomentUrl($route.params.id)")
        img#twShareBtn(src="/tw.png", alt="share" @click="shareTwitter()")
      grid-image(:images="momentData.photos")
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
  layout: "normal",
  async asyncData({params, query}) {
    try {
      const {data} = await axios.get("https://photo-api.neos.love/v1/moment/" + params.id)
      const user = await axios.get(`https://photo-api.neos.love/v1/user/${data.author}`)
      if (query.modal) {
        const photo = await axios.get("https://photo-api.neos.love/v1/photo/" + query.modal)
        return {preData: data, prePhotoData: photo.data,preName: user.data.user.name}
      }
      return {preData: data, preName: user.data.user.name}
    } catch {}
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
  head() {
    if (this.$route.query.modal) {
      return {
        title: this.prePhotoData?.comment,
        meta: [
          {hid: 'description', name: 'description', content:  this.preData.title},
          {hid: 'og:type', property: 'og:type', content: 'website'},
          {hid: 'og:title', property: 'og:title', content: `${this.prePhotoData?.comment} - ${this.preData.title}`},
          {hid: 'og:url', property: 'og:url', content: `${this.endpoint}/moment/${this.$route.params.id}?modal=${this.$route.query.modal}`},
          {hid: 'og:description', property: 'og:description', content: this.preData.title},
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.prePhotoData?.url.replace("public","ogp")
          },
          {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
          {hid: 'twitter:title', property: 'twitter:title', content: `${this.prePhotoData?.comment} - ${this.preData.title}`},
          {hid: 'twitter:description', property: 'twitter:description', content: `${this.preName}'s Moment ${this.preData.title}`},
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: this.prePhotoData?.url.replace("public","ogp")
          },
        ]
      }
    }
    return {
      title: this.preData.title,
      meta: [
        {hid: 'description', name: 'description', content: this.preData.title},
        {hid: 'og:type', property: 'og:type', content: 'website'},
        {hid: 'og:title', property: 'og:title', content: this.preData.title},
        {hid: 'og:description', property: 'og:description', content: `${this.preName}'s Moment ${this.preData.title}`},
        {hid: 'og:url', property: 'og:url', content: `${this.endpoint}/moment/${this.$route.params.id}`},
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.preData.thumbnail
        },
        {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
        {hid: 'twitter:title', property: 'twitter:title', content: this.preData.title},
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: `${this.preName}'s Moment ${this.preData.title}`
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.preData.thumbnail
        },
      ]
    }
  },
  methods: {
    ...mapActions(`auth`, ["getUserInfo"]),
    ...mapMutations("upload", ["openModal"]),
    async getMomentData() {
      const {data} = await axios.get(`${this.endpoint}/v1/moment/${this.$route.params.id}?nsfw=${this.$route.query.nsfw || false}`)
      return data
    },
    formatDate(date) {
      return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    },
    copyMomentUrl(id) {
      const clipboardText = `https://photo.neos.love/moment/${id}`;
      try {
        navigator.clipboard.writeText(clipboardText);
        this.$refs.tag.src = '/check.png'
        setTimeout(() => {
          this.$refs.tag.src = '/link.png'
        }, 2000)
      } catch (e) {
        alert(`https ni site ne`)
      }
    },
    shareTwitter() {
      this.$openTwitterShare({
        type: 'moment',
        id: this.momentData?.id,
        pageUrl: location.href,
        name: this.preName,
        title: this.momentData?.title
      });
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

#linkBtn, #twShareBtn {
  margin-left: 1em;
  margin-top: 1em;
  height: 1.5em;
  opacity: 0.2;;
}

#linkBtn:hover, #twShareBtn:hover {
  opacity: 0.5;;
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
