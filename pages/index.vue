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
  head() {
    return {
      titleTemplate: null
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
      if (((document.body.clientHeight - window.innerHeight) - window.scrollY) < 100 && !this.tmpScrollState) {
        console.log(this.tmpScrollState)
        this.tmpScrollState = true
        await this.addImage()
      }
      if (((document.body.clientHeight - window.innerHeight) - window.scrollY) > 100) {
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
