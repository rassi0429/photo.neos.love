<template lang="pug">
  div.container
    div.columns
      input(type="file" ref="file_upload" style="display: none" @change="onFileChange" multiple)
      div.column.is-6(@dragenter="dragEnter" @dragleave="dragLeave" @dragover.prevent @drop.prevent="dropFile" @click="$refs.file_upload.click()")
        img#UploadBox(src="/upload.png")
      div.column.is-6.section
        div.field
          | userId: {{uid}}
        div.field
          div.control
            input.input#textbox(placeholder="Title" v-model="title")
        div.field
          div.control
            input.input#textbox(placeholder="Tag" v-model="tag")
        div.field
          | {{ title }} {{ tag }}
        div.field
          div.control
            button.button#SubmitBtn(@click="submit") Submit
    div.columns.is-multiline
      div.column.is-3(v-for="(file,index) in files" :key="index" @click="deleteFile(index)")
        img(:src="getFileUrl(file)")
</template>
<style>
body {
  background-color: #050505;
  min-height: 100vh;
}

#UploadBox {
  margin-top: 3em;
  opacity: 50%;
  max-height: 300px;
  -webkit-user-drag: none;
}

#textbox {
  opacity: 50%;
  max-width: 500px;
}

#textbox:hover {
  opacity: 80%;
}

#textbox::placeholder {
  color: #202020;
}

#SubmitBtn {
  opacity: 50%;
}

#SubmitBtn:hover {
  opacity: 80%;
}
</style>
<script>
import axios from "axios";
import {mapActions, mapState} from "vuex";
import auth from "@/plugins/auth";

export default {
  name: "UploadPage",
  data() {
    return {
      isEnter: false,
      files: [],
      title: "",
      tag: "",
      uid: ""
    }
  },
  computed: {
    ...mapState(["endpoint"])
  },
  async mounted() {
    this.uid = await this.getUserInfo()
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    dragEnter() {
      this.isEnter = true;
    },
    dragLeave() {
      this.isEnter = false;
    },
    dropFile() {
      this.files.push(...event.dataTransfer.files)
      this.isEnter = false;
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    },
    getFileUrl(file) {
      return URL.createObjectURL(file)
    },
    async submit() {
      const user = await auth()
      const token = await user.getIdToken(true)
      // await axios.post(`${this.endpoint}/v1/account`, {}, {headers: {token}})
      Promise.all(this.files.map(f => this.uploadImage(f, token))).then(async (w) => {
        this.files = []
        const photos = w.map(res => res.data.id)
        console.log(photos)
        // this.$router.push("/")
        await axios.post(`${this.endpoint}/v1/moment`, {title: this.title, photos}, {headers: {token}})
        console.log("finished!")
      })
    },
    uploadImage(file, token) {
      return new Promise((resolve) => {
        axios.get(`${this.endpoint}/v1/imageReq`, {headers: {token}}).then(data => {
          const params = new FormData();
          params.append('file', file);
          axios.post(data.data.result.uploadURL, params, {headers: {"content-type": 'multipart/form-data'}}).then(t => {
            axios.post(`${this.endpoint}/v1/photo?url=${t.data.result.variants[0]}&comment=${this.title}&tags=${JSON.stringify([this.tag])}`, {}, {headers: {token}}).then(re => {
              resolve(re)
            })
          })
        })
      })
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.files.push(...files)
      console.log(files)
    }
  }
}
</script>
