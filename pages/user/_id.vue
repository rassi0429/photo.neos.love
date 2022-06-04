<template lang="pug">
  div()
    photo-view-modal
    upload-modal
    div(:class="{'blur': isModalOpen || isUploadModal}")
      textarea#copytext(:value="'aaaa'")
      nuxt-link#headImg(to="/" tag="img" src="~/assets/head.png")
      img#uploadBtn_user(v-show="uid" @click="openModal" tag="img" src="~/assets/upload_btn.png")
      img#logoutBtn(v-show="uid" @click="LogOut" src="~/assets/logout.png")
      p#counter  {{userInfo.countInfo.photo}} pictures
      div#headerBackground
      img#GridGradation(src="~/assets/top_gradation.png")
      div#content
        div.user-header.is-flex
          img#avatar(:src="userInfo.user.twitterImage.replace('_normal', '')")
          a.has-text-white#UserName(:href="'https://twitter.com/intent/user?user_id='+ userInfo.user.twitterId") {{ userInfo.user.name }}
          div.ml-auto(:class="{'oa': !momentShow,'on': momentShow}")
            p#ViewToggleBtn(:class="{'notactive': momentShow}" @click="momentShow = !momentShow") Photos
            p#ViewToggleBtn(:class="{'notactive': !momentShow}" @click="momentShow =  !momentShow") Moments
        div#imageGrid
          grid-image(v-if="!momentShow" :images="photos")
          div#MomentBlock(v-if="momentShow" v-for="(moment,i) in moments" :key="i")
            a#MomentTitle(:href="'/moment/'+ moment.id") {{ moment.title || "NoTitle"  }}
            img#shareBtn(src="~/assets/link.png", alt="link" :ref="'m' + moment.id" @click="copyMomentUrl(moment.id)")
            grid-image#MomentPhotoGrid(:images="moment.photos")
</template>
<style scoped>
#copytext {
  display: none;
}
</style>
<style>
body {
  background-color: #050505;
  min-height: 100vh;
  padding-bottom: 100px;
}

.blur {
  -webkit-filter: blur(8px);
  -moz-filter: blur(8px);
  -ms-filter: blur(8px);
  filter: blur(8px);
}

.oa {
  margin: 0;
  transition: all 700ms;
}
.on {
  margin: 1.5em 0;
  transition: all 700ms;
}


.header {
  height: 60px;
}

.notactive {
  color: #494949;
}

.head-avatar {
  height: 120px;
  border-radius: 100%;
}

.user-header {
  position: fixed;
  width: 80vw;
  align-items: flex-end;
}

#headerBackground {
  background-color: #050505;
  position: fixed;
  width: 100vw;
  height: 15vh;
  min-height: 150px;
  max-height: 250px;
}

#GridGradation {
  position: fixed;
  width: 100vw;
  margin-top: max(150px, min(250px, 15vh));
  height: 5vh;
}

#content {
  width: 80vw;
  margin: auto;
  padding-top: 1em;
}

#headImg {
  position: fixed;
  width: 5%;
  opacity: 50%;
  margin-top: 1em;
  z-index: 20;
  -webkit-user-drag: none;
}

#avatar {
  border-radius: 100%;
  height: 10vh;
  min-height: 50px;
  max-height: 200px;
}

#UserName {
  white-space: nowrap;
  opacity: 50%;
  margin-left: 0.3em;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: min(50px, max(5vw,20px));
  line-height: min(50px, max(5vw,20px));
}

#ViewToggleBtn {
  opacity: 50%;
  font-size: 1em;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

#imageGrid {
  margin-top: max(10vh, 210px);
}

#MomentBlock {
  margin-bottom: 2em;
}

#MomentTitle {
  color: #ffffff;
  font-size: 2em;
  opacity: 20%;
}

#MomentTitle:hover {
  opacity: 50%;
}

#logoutBtn {
  position: fixed;
  right: 10px;
  bottom: 30px;
  max-width: 50px;
  opacity: 20%;
  border-radius: 100%;
}
#logoutBtn:hover {
  opacity: 50%;
}

#uploadBtn_user {
  position: fixed;
  right: 10px;
  bottom: 90px;
  max-width: 50px;
  opacity: 20%
}

#uploadBtn_user:hover {
  opacity: 50%
}

#shareBtn {
  margin-left: 1em;
  top: 0.2em;
  height: 1.5em;
  opacity: 20%;
}
#shareBtn:hover {
  opacity: 50%;
}

#counter {
  opacity: 20%;
  position: fixed;
  bottom: 0%;
  right: 0%;
  margin-bottom: 0.3em;
  margin-right: 1em;
}
</style>
<script>
import {mapActions, mapMutations, mapState} from "vuex";
import axios from "axios"
import PhotoViewModal from "@/components/modal";
import UploadModal from "@/components/upload";

export default {
  name: "UserPhotosPage",
  components: {UploadModal, PhotoViewModal },
  async asyncData({params}) {
    const {data} = await axios.get("https://photo-api.neos.love/v1/user/" + params.id)
    return {preData: data}
  },
  head() {
    return {
      title: this.preData.title,
      meta: [
        {hid: 'description', name: 'description', content: this.preData.user.name},
        {hid: 'og:type', property: 'og:type', content: 'website'},
        {hid: 'og:title', property: 'og:title', content: this.preData.user.name},
        {hid: 'og:url', property: 'og:url', content: `${this.endpoint}/user/${this.$route.params.id}`},
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.preData.user.twitterImage
        },
        {hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'},
        {hid: 'twitter:title', property: 'twitter:title', content: this.preData.user.name},
        {hid: 'twitter:description', property: 'twitter:description', content: this.preData.user.name},
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.preData.user.twitterImage
        },
      ]
    }
  },
  data() {
    return {
      uid: "",
      momentShow: false,
      photos: [],
      moments: [],
      userInfo: {
        user: {
          twitterImage: ""
        },
        countInfo: {}
      }
    }
  },
  computed: {
    ...mapState(["endpoint"]),
    ...mapState("modal",["isModalOpen"]),
    ...mapState("upload",["isUploadModal"]),
  },
  async mounted() {
    this.uid = await this.getUserInfo()
    await this.getUserTwitterInfo()
    this.photos = await this.getUserPhoto()
    this.moments = await this.getUserMoment()
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin", "LogOut"]),
    ...mapMutations('upload', ['openModal', "closeModal"]),
    async getUserPhoto() {
      const { data } = await axios.get(`${this.endpoint}/v1/user/${this.$route.params.id}/photos`)
      return data
    },
    async getUserMoment() {
      const { data } = await axios.get(`${this.endpoint}/v1/user/${this.$route.params.id}/moments`)
      return data
    },
    async getUserTwitterInfo() {
      const { data } = await axios.get(`${this.endpoint}/v1/user/${this.$route.params.id}`)
      this.userInfo = data
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
  }
}
</script>
