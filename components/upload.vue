<template lang="pug">
  div.upload-modal-wrap(v-if="isUploadModal" @mouseup="closeModal")
    div.columns.upload-modal(@mouseup.stop)
      input(type="file" ref="file_upload" style="display: none" @change="onFileChange" multiple)
      img#CloseBtn(@click="closeModal" src="/close.png")
      div.column.is-5(v-if="!isUploading")
        div#UploadBox
          img#UploadIcon(@dragenter="dragEnter" @dragleave="dragLeave" @dragover.prevent @drop.prevent="dropFile" @click="$refs.file_upload.click()" src="/upload.png")
          p#UploadInfo Click or Drop a Image(s)
        div.field.is-horizontal
          .is-normal
            label#label Title
          .field-body
            .field
              div.control
                input#textbox(placeholder="Title" v-model="title")
        div.field.is-horizontal
          .is-normal
            label#label Tags
          .field-body
            .field#TagBtnField
              div.control(v-for="(tag, ii) in tags" :key="ii")
                button.button.is-white.is-outlined#TagBtn(@click="deleteTag(ii)")
                  | {{tag}}
        div.control
          // input.input#textbox(placeholder="Tag" v-model="tag")
          input#textbox(v-model="tmpTag")
          img#AddTagBtn(@click="addTag(); tmpTag = ''" src="/plus.png")
        div.field
          div.control
            img#SubmitBtn(@click="submit" src="/upload_btn.png")
        img#SubmitBtn(@click="submit" src="/upload_btn.png")
      div.column.is-7(v-if="!isUploading")
        p.subtitle {{ uploadCount }} images
        div.upload-img
          div.columns.is-multiline(v-for="(file,index) in files" :key="index" )
            div.column.is-3()
              img(:src="getFileUrl(file)")
            div.column.is-9
              input(type="text" @change="(text) => changeComment({text,index})")
              button.button(@click="deleteFile(index)") 削除
      div.column.is-5(v-if="isUploading")
        | uploading...  {{ uploadCount }} / {{ files.length }}
</template>
<style>
.upload-img {
  max-height: 90%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.upload-modal-wrap {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 42;
}

.upload-modal {
  width: 90%;
  background-color: black;
  max-width: 900px;
  min-width: 300px;
  height: 100%;
  max-height: 550px;
  background-color: #050505;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 30;
  margin: auto;
}

p{
  color: #FFFFFF;
}

#UploadBox {
  opacity: 20%;
  min-height: 200px;
  max-height: 300px;
  -webkit-user-drag: none;
  text-align: center;
  padding-top: 3em;
  background-color: #202020;
  margin-bottom: 1em;
}
#UploadBox:hover {
  opacity: 50%;
}
#UploadIcon {
  width: 100px;
}

#UploadInfo {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

#label {
  text-align: left;
  margin-right: 2em;
}

#textbox {
  opacity: 50%;
  max-width: 500px;
  border-right:none;
  border-left:none;
  border-top:none;
  border-bottom:1px solid #ffffff;
  background-color: transparent;
  bottom: 0px;
  color: #FFFFFF;
}

#textbox:hover {
  opacity: 80%;
}

#textbox::placeholder {
  color: #202020;
}

#SubmitBtn {
  position: absolute;
  bottom: 0%;
  right: 0%;
  margin-bottom: 0.8em;
  margin-right: 0.8em;
  max-width: 30px;
  opacity: 20%
}

#SubmitBtn:hover {
  opacity: 80%;
}

#CloseBtn {
  position: absolute;
  bottom: 0%;
  right: 0%;
  margin-bottom: 0.8em;
  margin-right: 0.8em;
  max-width: 30px;
  opacity: 20%
}

#TagBtnField {
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-width: 100%;
}
#TagBtnField::-webkit-scrollbar {
  display:none;
}

#TagBtn {
  opacity: 20%;
  margin-right: 3px;
  margin-bottom: 3px;
  height: 1.2em;
  border-radius: 5px;
}
#TagBtn:hover {
  opacity: 50%;
}

#AddTagBtn {
  opacity: 20%;
  width: 1em;
  margin-left: 0.5em;
  top: 0.5em;
}
#TagBtn:hover {
  opacity: 50%;
}

#CloseBtn:hover {
  opacity: 50%;
}
</style>
<script>
import axios from "axios";
import {mapActions, mapState, mapMutations} from "vuex";
import auth from "@/plugins/auth";

export default {
  name: "UploadModal",
  data() {
    return {
      isEnter: false,
      files: [],
      title: new Date().toLocaleDateString(),
      tags: [],
      uid: "",
      tmpTag: "",
      uploadCount: 0,
      isUploading: false
    }
  },
  computed: {
    ...mapState(["endpoint"]),
    ...mapState("upload", ["isUploadModal"]),
  },
  async mounted() {
    this.uid = await this.getUserInfo()
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    ...mapMutations('upload', ['closeModal']),
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
    changeComment({index,text}) {
      console.log(text.target.value)
      this.files[index].comment = text.target.value
    },
    getFileUrl(file) {
      return URL.createObjectURL(file)
    },
    async submit() {
      if(!this.files.length) return
      const user = await auth()
      const token = await user.getIdToken(true)
      await axios.post(`${this.endpoint}/v1/user`, {}, {headers: {token}})
      this.isUploading = true
      Promise.all(this.files.map(f => this.uploadImage(f, token))).then(async (w) => {
        const photos = w.map(res => res.data.id)
        // this.$router.push("/")
        const {data} =  await axios.post(`${this.endpoint}/v1/moment`, {title: this.title, photos}, {headers: {token}})
        this.closeModal()
        this.uploadCount = 0
        this.$router.push("/moment/" + data.id)
      }).finally(() => {
        this.files = []
        this.isUploading = false
      })
    },
    uploadImage(file, token) {
      return new Promise((resolve) => {
        axios.get(`${this.endpoint}/v1/imageReq`, {headers: {token}}).then(data => {
          const params = new FormData();
          params.append('file', file);
          axios.post(data.data.result.uploadURL, params, {headers: {"content-type": 'multipart/form-data'}}).then(t => {
            axios.post(`${this.endpoint}/v1/photo?url=${t.data.result.variants[0]}&comment=${file.comment || this.title}&tags=${JSON.stringify(this.tags)}`, {}, {headers: {token}}).then(re => {
              resolve(re)
              this.uploadCount++
            })
          })
        })
      })
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.files.push(...files)
      console.log(files)
    },
    addTag(){
      if(this.tmpTag.trim() && !this.tags.includes(this.tmpTag)) {
        this.tags.push(this.tmpTag)
      }
    },
    deleteTag(index){
      this.tags.splice(index,1)
    }
  }
}
</script>
