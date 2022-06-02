<template lang="pug">
  div#momentRoot
    nuxt-link#headImg(to="/" tag="img" src="/head.png")
    img#TopGradation(src="/top_gradation.png")
    div#content
      p#date {{ formatDate(new Date(momentData.createDate)) }}
      div.is-flex#header
        p#MomentTitle {{ momentData.title || ""}}
        img#shareBtn(src="/link.png", alt="link" :ref="'m' + $route.params.id" @click="copyMomentUrl($route.params.id)")
      photo-view-modal
      grid-image(:images="momentData.photos")
</template>

<script>
import axios from "axios";
import {mapState} from "vuex";
import PhotoViewModal from "@/components/modal";

export default {
  name: "MomentId",
  components: {PhotoViewModal},
  head() {
    return {
      title: "hogehage",
      meta: [
        {hid: 'description', name: 'description', content: "OGP siteru wane"},
        {hid: 'og:type', property: 'og:type', content: 'website'},
        // {hid: 'og:title', property: 'og:title', content: this.$route.params.id},
        {hid: 'og:description', property: 'og:description', content: "OGP siteru wayo"},
        {hid: 'og:url', property: 'og:url', content: "http://localhost"},
        {
          hid: 'og:image',
          property: 'og:image',
          content: "https://media.discordapp.net/attachments/765809256129495062/980938539732705330/PXL_20220530_205913740.jpg?width=363&height=484"
        },
        {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
        {hid: 'twitter:title', property: 'twitter:title', content: 'OGP'},
        {hid: 'twitter:description', property: 'twitter:description', content: 'description'},
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: "https://media.discordapp.net/attachments/765809256129495062/980938539732705330/PXL_20220530_205913740.jpg?width=363&height=484"
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
      }
    }
  },
  methods: {
    async getMomentData() {
      const {data} = await axios.get(`${this.endpoint}/v1/moment/${this.$route.params.id}`)
      this.momentData = data
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
        },2000)
      } catch {
        alert(`https ni site ne`)
      }
    }
  },
  computed: {
    ...mapState(["endpoint"])
  },
  mounted() {
    this.getMomentData()
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
  opacity: 20%;
}

#MomentTitle {
  color: #ffffff;
  font-size: 2em;
  opacity: 50%;
}

#shareBtn {
  margin-left: 1em;
  margin-top: 1em;
  height: 1.5em;
  opacity: 20%;
}
#shareBtn:hover {
  opacity: 50%;
}


</style>
