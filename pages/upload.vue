<template lang="pug">
  div.container
    div.columns
      input(type="file" ref="file_upload" style="display: none" @change="onFileChange" multiple)
      div.column.is-6(@dragenter="dragEnter" @dragleave="dragLeave" @dragover.prevent @drop.prevent="dropFile" @click="$refs.file_upload.click()")
        img(src="/upload.png")
      div.column.is-6.section
        div.field
          | userId: {{uid}}
        div.field
          div.control
            input.input(placeholder="title" v-model="title")
        div.field
          div.control
            input.input(placeholder="tag" v-model="tag")
        div.field
          | {{ title }} {{ tag }}
        div.field
          div.control
            button.button(@click="submit") Submit
    div.columns.is-multiline
      div.column.is-3(v-for="(file,index) in files" :key="index" @click="deleteFile(index)")
        img(:src="getFileUrl(file)")
</template>
<style>
body {
  background-color: black;
  min-height: 100vh;
}
</style>
<script>
import axios from "axios";
import {mapActions} from "vuex";
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
      Promise.all(this.files.map(f => this.uploadImage(f,token))).then(() => {
        this.files = []
        this.$router.push("/")
        console.log("finished!")
      })
    },
    uploadImage(file, token) {
      return new Promise((resolve) => {
        axios.get(`${this.endpoint}/v1/imageReq`, {headers: {token}}).then(data => {
          const params = new FormData();
          params.append('file', file);
          axios.post(data.data.result.uploadURL, params, {headers: {"content-type": 'multipart/form-data'}}).then(t => {
            axios.post(`${this.endpoint}/v1/photo?url=${t.data.result.variants[0]}&comment=${this.title}&tags=${JSON.stringify([this.tag])}`, {}, {headers: {token}})
            resolve()
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
