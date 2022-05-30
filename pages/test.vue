<template lang="pug">
  div
    a(href="/") aaaa
    button(@click="getUploadUrl") getUploadLink
    input(type="file" id="myFile" name="file" @change="onFileChange")
</template>

<script>
import {mapActions} from "vuex";
import axios from "axios";
import auth from "@/plugins/auth";

export default {
  name: 'TestPage',
  data() {
    return {
      hoge: "hage",
      image: '',
      imgName: '',
      uploadFile: ''
    }
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    async getUploadUrl() {
      const user = await auth()
      const token = await user.getIdToken(true)
      const {data} = await axios.get("http://localhost:3001/imageReq", {headers: {token}})
      console.log(data.result.uploadURL)

      const params = new FormData();
      params.append('file', this.uploadFile);
      const r = await axios.post(data.result.uploadURL, params, {headers: {"content-type": 'multipart/form-data'}})
      console.log(r.data)
      const x = await axios.post(`http://localhost:3001/photo?url=${r.data.result.variants[0]}`, {}, {headers: {token}})
      console.log(x.data)
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      if (!files[0].type.match('image.*')) {
        return;
      }
      this.uploadFile = files[0];
    },
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>
