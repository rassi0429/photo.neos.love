<template>
  <div id="drag_drop_app" class="file_uploader_module">
    <input type="file" ref="file_upload" style="display: none" @change="onFileChange" multiple>
    <div class="drop_area" @dragenter="dragEnter" @dragleave="dragLeave" @dragover.prevent @drop.prevent="dropFile"
         :class="{enter: isEnter}" type="button" @click="$refs.file_upload.click()">
      <i class="fas fa-arrow-circle-up text-6xl mb-3 fa-5x upload-icon"></i>
      <b>Drop files or Browse</b>
    </div>
    <ul class="flex">
      <li class="flex-col" v-for="(file,index) in files" :key="index" @click="deleteFile(index)">
        <div style="position: relative;">
        </div>
        <div class="file-box" style="display: block;">
                <span>
                    {{ file.name }}
                <i class="fa fa-times delete-mark"></i>
</span>
        </div>
      </li>
    </ul>
    <div v-show="files.length">
      <button class="button" @clikc="sendFile">Send</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "UploadPage",
  data() {
    return {
      isEnter: false,
      files: []

    }
  },
  methods: {
    dragEnter() {
      this.isEnter = true;
    },
    dragLeave() {
      this.isEnter = false;
    },
    dragOver() {
    },
    dropFile() {
      this.files.push(...event.dataTransfer.files)
      this.isEnter = false;
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    },
    // upload: function () {
    //   // FormData を利用して File を POST する
    //   let formData = new FormData();
    //   formData.append('files', this.uploadFile);
    //   let config = {
    //     headers: {
    //       'content-type': 'multipart/form-data'
    //     }
    //   };
    //   axios
    //     .post('yourUploadUrl', formData, config)
    //     .then(function (response) {
    //     })
    //     .catch(function (error) {
    //     })
    // },
    sendFile() {
      this.files.forEach(file => {
        const form = new FormData()
        form.append('file', file)
        axios.post('url', form).then(response => {
          console.log(response.data)
        }).catch(error => {
          console.log(error)
        })
      })
    },
    btnclick() {
      this.$refs.input.click();
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.files.push(...files)
      console.log(files)
    }
  }
}
</script>
