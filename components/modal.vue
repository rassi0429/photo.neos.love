<template lang="pug">
  div.md(v-show="isModalOpen" @click="closeModal()")
    div.image-modal(@click.stop)
      img#editBtn(v-if="!isEditing && (uid === modalData.author)" @click="updateEditState(true)" src="/pen.png")
      img#deleteBtn(v-if="!isEditing && (uid === modalData.author)" @click="deletePhoto" src="delete.png")
      img#CloseBtn(@click="closeModal()" src="/close.png")
      div.columns.h100.m0
        div.column.is-9.h100.p0.center
          img#ImageInModal(:src="modalData.url")
        div.column.is-3#InfoField
          p#comment(v-if="!isEditing") {{ modalData.comment }}
            div(v-if="isEditing")
              textarea.w100.is-flex-grow-1#commentField(:value="modalData.comment" @change="(e) => updateComment(e.target.value)")
              div#TagBtnField
                button.button.is-white.is-outlined#TagBtn(v-for="(tag, ii) in editingTag" :key="ii" @click="deleteTag(ii)") {{ tag }}
              input#textbox(v-model="tmpTag")
              img#AddTagBtn(:disabled="!tmpTag" @click="addTag" src="/plus.png")
          div#tags(v-for="(t,i) in modalData.tags" :key="i")
            a(:href="'/tag/' + t.name ") {{ "#" + t.name}}
          div.is-flex#editUI(v-if="isEditing")
            div#saveBtn
              img#saveBtnIcon(@click="updatePhoto();updateEditState(false)" src="/save.png")
              p#BtnLabel Save
            div#cancelBtn
              img#cancelBtnIcon(@click="updateEditState(false)" src="/cancel.png")
              p#BtnLabel Cancel
          div#UploadUser.is-flex
            | Uploaded by&nbsp;
            p#UserLink(@click="toUser(modalData.author)") {{ name }}
          p#date {{ modalData.createDate ? new Date(modalData.createDate).toLocaleDateString() + ` ` + new Date(modalData.createDate).toLocaleTimeString(): "" }}
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import axios from "axios"

export default {
  name: "PhotoViewModal",
  computed: {
    ...mapState("modal", ["isModalOpen", "modalData", "username","isEditing","editingTag"]),
    ...mapState(["endpoint"]),
    ...mapState("auth",["uid"]),
  },
  data() {
    return {
      name: "",
      tmpTag: "",
    }
  },
  methods: {
    ...mapMutations('modal', ["updateTags",'openModal', "closeModal", "openModalWithQuery","updateComment","updateEditState","deleteTag"]),
    ...mapActions(`modal`,["updatePhoto","updateData","deletePhoto"]),
    toUser(userId) {
      this.closeModal()
      this.$router.push('/user/' + userId)
    },
    addTag() {
      if(this.tmpTag.trim() && !this.editingTag.includes(this.tmpTag)) {
        this.updateTags([...this.editingTag,this.tmpTag])
        this.tmpTag = ""
      }
    }
  },
  watch: {
    isModalOpen(val, old) {
      if (!val || this.modalData.id === 0) return
      axios.get(`${this.endpoint}/v1/user/${this.modalData?.author}`).then((res) => {
        this.name = res.data.user.name
      })
      this.updateData()
    }
  },
  async mounted() {
    if (this.$route.query.modal) {
      console.log(this.modalData)
      try {
        const {data} = await axios.get(`${this.endpoint}/v1/photo/${this.$route.query.modal}`)
        this.openModal(data)
      } catch {
        console.log("fetch error")
        this.$router.replace({'query': null});
      }
    }
  }
}
</script>

<style scoped>
.md {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 40;
}


.image-modal {
  width: 100%;
  max-width: 1200px;
  min-width: 300px;
  height: 100%;
  max-height: 550px;
  background-color: #050505;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 30;
}

.h100 {
  height: 100%;
}

.w100 {
  width: 100%;
}

.p0 {
  padding: 0;
}

.m0 {
  margin: 0;
}

p {
  color: #FFFFFF;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

#ImageInModal {
  max-height: 100%;
  padding: 0px 1em 0px 0px;
}

#InfoField {
  position: relative;
}

#CloseBtn {
  position: absolute;
  bottom: 0%;
  right: 0%;
  margin-bottom: 0.8em;
  margin-right: 0.8em;
  max-width: 30px;
  opacity: 0.2;;
  z-index: 10;
}

#CloseBtn:hover {
  opacity: 0.5;;
}

#comment {
  max-height: 300px;
  margin-bottom: 1em;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  opacity: 0.5;;
}

#comment::-webkit-scrollbar {
  display: none;
}

#deleteBtn {
  position: absolute;
  top: 0%;
  right: 0%;
  margin-top: 4em;
  margin-right: 1em;
  max-width: 30px;
  opacity: 0.2;;
  z-index: 10;
}

#deleteBtn:hover {
  opacity: 0.5;;
}

#editBtn {
  position: absolute;
  top: 0%;
  right: 0%;
  margin-top: 0.8em;
  margin-right: 0.8em;
  max-width: 30px;
  opacity: 0.2;;
  z-index: 10;
}

#editBtn:hover {
  opacity: 0.5;;
}

#tags {
  max-height: 100px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  opacity: 0.5;;
}
#tags > a {
  color: lightskyblue;
}

#tags::-webkit-scrollbar {
  display: none;
}

#UploadUser {
  color: #ffffff;
  position: absolute;
  bottom: 0%;
  margin-bottom: 3em;
  opacity: 0.5;;
}

#UserLink {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8em;
  color: lightskyblue;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

#editUI {
  position: absolute;
  opacity: 0.5;;
  width: 100px;
  right: 1em;
  bottom: 5em;
  margin-bottom: 0.3em;
  z-index: 10;
}

#saveBtn {
  opacity: 0.5;;
}
#saveBtn:hover {
  opacity: 0.8;;
}
#saveBtnIcon {
  width: 50px;
}

#cancelBtn {
  opacity: 0.5;;
  width: 50px;
}
#cancelBtn:hover {
  opacity: 0.8;;
}
#cancelBtnIcon {
  width: 50px;
}

#BtnLabel {
  margin-top: -0.7em;
}

#date {
  position: absolute;
  bottom: 0%;
  margin-bottom: 1.5em;
  opacity: 0.5;;
}

#AddTagBtn {
  opacity: 0.2;;
  width: 1em;
  margin-left: 0.5em;
  margin-top: 0.5em;
}
#AddTagBtn:hover {
  opacity: 0.5;;
}

#commentField {
  margin-top: 3em;
  margin-bottom: 1em;
  width: 100%;
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
  opacity: 0.2;;
  margin-right: 3px;
  margin-bottom: 3px;
  height: 1.2em;
  border-radius: 5px;
}
#TagBtn:hover {
  opacity: 0.5;;
}
</style>
