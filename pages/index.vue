<template lang="pug">
  div
    img#TopGradation(src="/top_gradation.png")
    img#uploadBtn(v-show="uid" @click="openModal" tag="img" src="/upload_btn.png")
    nuxt-link#loginBtn(v-show="uid" :to="'/user/'+uid" tag="img" :src="photoUrl")
    img#uploadBtn(v-show="!uid" @click="twitterLogin" src="/login_btn.png")
    a#CodeBtn(href="https://github.com/rassi0429/photo.neos.love")
      img(src="/code.png")
    div#imageroot
      grid-image(:images="images" replace="thumbnail")

</template>
<script>
import {mapActions, mapState, mapMutations} from "vuex";
import axios from "axios";
import auth from "@/plugins/auth";
import PhotoViewModal from "@/components/modal";
import UploadModal from "@/components/upload";

export default {
  name: 'IndexPage',
  components: {PhotoViewModal, UploadModal},
  layout: "normal",
  async asyncData({params, query}) {
    if (query.modal) {
      const photo = await axios.get("https://photo-api.neos.love/v1/photo/" + query.modal)
      return {prePhotoData: photo.data}
    }
  },
  head() {
    if (this.$route.query.modal) {
      return {
        title: null,
        meta: [
          {hid: 'description', name: 'description', content: this.prePhotoData?.comment},
          {hid: 'og:type', property: 'og:type', content: 'website'},
          {hid: 'og:title', property: 'og:title', content: `${this.prePhotoData?.comment} - NeosFrames`},
          {hid: 'og:url', property: 'og:url', content: `${this.endpoint}/?modal=${this.$route.query.modal}`},
          {hid: 'og:description', property: 'og:description', content: this.prePhotoData?.comment},
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.prePhotoData?.url.replace("public","ogp")
          },
          {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
          {hid: 'twitter:title', property: 'twitter:title', content: `${this.prePhotoData.comment} - NeosFrames`},
          {hid: 'twitter:description', property: 'twitter:description', content: this.prePhotoData.comment},
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: this.prePhotoData?.url.replace("public","ogp")
          },
        ]
      }
    } else {
      return {
        titleTemplate : null
      }
    }
  },
  data() {
    return {
      hoge: "hage",
      images: [],
      rows: 4,
      isLoggedin: false,
      uid: "",
      photoUrl: "",
      tmpScrollState: false,
      page: 0
    }
  },
  computed: {
    ...mapState(["endpoint"]),
    ...mapState("modal", ["isModalOpen"]),
    ...mapState("upload", ["isUploadModal"])
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin", "LogOut"]),
    ...mapMutations('upload', ['openModal', "closeModal"]),
    async getImage() {
      const {data} = await axios.get(`${this.endpoint}/v1/photos?page=${this.page}`)
      this.images = data
    },
    async addImage() {
      this.page += 1
      const {data} = await axios.get(`${this.endpoint}/v1/photos?page=${this.page}`)
      if (data.length === 0) {
        this.page -= 1
      }
      this.images.push(...data)
    },
    shuffle(array) {
      let currentIndex = array.length
      let randomIndex = 0;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    },
    async handleScroll(e) {
      const lasts = document.getElementsByClassName("last")
      let min = lasts[0].offsetTop
      for(let i = 0; i < lasts.length; i++) {
         min = Math.min(min, lasts[i].offsetTop)
      }
      const currentHeight = window.pageYOffset
      if ((currentHeight + window.innerHeight) > min && !this.tmpScrollState) {
        console.log(this.tmpScrollState)
        this.tmpScrollState = true
        await this.addImage()
      }
      if (Math.abs((currentHeight + window.innerHeight) -  min) > 300) {
        this.tmpScrollState = false
      }
    }
  },
  async mounted() {
    this.uid = (await this.getUserInfo())
    const user = await auth()
    this.photoUrl = user.photoURL
    await this.getImage()
    window.addEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>

#TopGradation {
  position: fixed;
  height: 5em;
  width: 100vw;
  z-index: 10;
}

#loginBtn {
  position: fixed;
  right: 10px;
  bottom: 60px;
  max-width: 50px;
  opacity: 0.5;;
  border-radius: 100%;
}

#loginBtn:hover {
  opacity: 90%
}

#uploadBtn {
  position: fixed;
  right: 10px;
  bottom: 110px;
  max-width: 50px;
  opacity: 0.2;
}

#uploadBtn:hover {
  opacity: 0.5;
}

#CodeBtn {
  position: fixed;
  right: 10px;
  bottom: 0;
  max-width: 50px;
  opacity: 0.2;;
  border-radius: 100%;
}

#CodeBtn:hover {
  opacity: 0.5;;
}

#imageroot {
  width: 80vw;
  margin: auto;
  padding-top: 5em;
}

</style>
