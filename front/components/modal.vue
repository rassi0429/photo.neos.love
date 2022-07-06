<template lang="pug">
  div.md(v-show="isModalOpen" @click="close()")
    div.image-modal(@click.stop)
      img#editBtn(v-if="!isEditing && (uid === modalData.author) && width > 768" @click="updateEditState(true)" src="/pen.png")
      img#deleteBtn(v-if="!isEditing && (uid === modalData.author)&& width > 768" @click="deletePhoto" src="/delete.png")
      div#bottomCTA
        img#twShareBtn(@click="shareTwitter()" src="/tw.png")
        img#closeBtn(@click="close()" src="/close.png")
      div.columns.h100.m0.is-flex(:class="{'is-flex is-flex-direction-column': width < 768}")
        div.column.is-9.p0.center#RelativeField(:class="{'mh70': width < 768}")
          img.ImageInModal(v-show="!loading" :src="modalData.url" v-on:load="load")
          img.ImageInModal.mh100.w100.of(v-if="loading" :src="modalData.url.replace(`public`,`thumbnail`)")
          div.pagingBase#pLeft(v-if="!isDisablePagingBtn" @click="pagingImg(false)")
            img#pagingLeftBtn(src="/pagingL.png")
          div.pagingBase#pRight(v-if="!isDisablePagingBtn" @click="pagingImg(true)")
            img#pagingRightBtn(src="/pagingR.png")
        div.column.is-3#RelativeField(:class="{'h30': width < 768}")
          div.userField
            p#comment(v-if="!isEditing") {{ modalData.comment.replace(/(<([^>]+)>)/gi, '') }}
              div(v-if="isEditing")
                textarea.w100.is-flex-grow-1#commentField(:value="modalData.comment" @change="(e) => updateComment(e.target.value)")
                div#TagBtnField
                  button.button.is-white.is-outlined#TagBtn(v-for="(tag, ii) in editingTag" :key="ii" @click="deleteTag(ii)") {{ tag }}
                input#textbox(v-model="tmpTag")
                img#AddTagBtn(:disabled="!tmpTag" @click="addTag" src="/plus.png")
              div#tags(v-for="(t,i) in modalData.tags" :key="i")
                a(:href="'/tag/' + encodeURIComponent(t.name) ") {{ "#" + t.name}}
          div.is-flex#editUI(v-if="isEditing")
            div#saveBtn
              img#saveBtnIcon(@click="updatePhoto();updateEditState(false)" src="/save.png")
              p#BtnLabel Save
            div#cancelBtn
              img#cancelBtnIcon(@click="updateEditState(false)" src="/cancel.png")
              p#BtnLabel Cancel
          div.UploadUser
            | Uploaded by&nbsp;
            p#UserLink(@click="toUser(modalData.author)") {{ name }}
          p#date {{ modalData.createDate ? new Date(modalData.createDate).toLocaleDateString() + ` ` + new Date(modalData.createDate).toLocaleTimeString(): "" }}
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import axios from "axios"

export default {
  name: "PhotoViewModal",
  data() {
    return {
      name: "",
      tmpTag: "",
      url: "",
      loading: true
    }
  },
  head() {
    return {
      title: this.modalData.comment
    }
  },
  computed: {
    ...mapState("modal", ["isModalOpen", "modalData", "username", "isEditing", "isDisablePagingBtn", "editingTag", "width"]),
    ...mapState(["endpoint"]),
    ...mapState("auth", ["uid"]),
  },
  watch: {
    isModalOpen(val, old) {
      if (!val || this.modalData.id === 0) {
        this.url = "/load.png"
        return
      }
      this.updateUserName()
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
  },
  methods: {
    ...mapMutations('modal', ["updateTags", 'openModal', "closeModal", "openModalWithQuery", "updateComment", "updateEditState", "deleteTag"]),
    ...mapActions(`modal`, ["updatePhoto", "updateData", "deletePhoto", "updateDataFromIdSearch"]),
    toUser(userId) {
      this.closeModal()
      this.$router.push('/user/' + userId)
    },
    addTag() {
      if (this.tmpTag.trim() && !this.editingTag.includes(this.tmpTag)) {
        this.updateTags([...this.editingTag, this.tmpTag])
        this.tmpTag = ""
      }
    },
    load() {
      console.log("LOAD!!")
      this.loading = false
    },
    close() {
      this.loading = true
      this.closeModal()
    },
    updateUserName() {
      axios.get(`${this.endpoint}/v1/user/${this.modalData?.author}`).then((res) => {
        this.name = res.data.user.name
      })
    },
    shareTwitter() {
      this.$openTwitterShare({
        type: 'modal',
        id: this.modalData?.id,
        pageUrl: location.href,
        title: this.modalData?.comment,
        name: this.name,
      });
    },
    async pagingImg(isNext) {
      this.loading = true
      await this.updateDataFromIdSearch({ isNext, id: this.modalData.id })
      this.updateUserName()
    },
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

.hide {
  opacity: 0;
}

.abs {
  position: absolute;
  left: 0;
}

.of {
  object-fit: contain;
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

.h30 {
  height: 30%;
}

.mh100 {
  max-height: 100%;
}

.mh70 {
  max-height: 70%;
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

.userField {
  max-height: calc(100% - 6em);
  overflow-y: auto;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ImageInModal {
  max-height: 100%;

}

#RelativeField {
  position: relative;
}

#twShareBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 4em;
  margin-right: 0.6em;
  max-width: 35px;
  opacity: 0.2;;
  z-index: 10;
}

#twShareBtn:hover {
  opacity: 0.5;;
}

#closeBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 0.8em;
  margin-right: 0.8em;
  max-width: 30px;
  opacity: 0.2;;
  z-index: 10;
}

#closeBtn:hover {
  opacity: 0.5;;
}

#comment {
  max-height: 300px;
  margin-bottom: 1em;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  opacity: 0.5;
  white-space: pre-line;
}

#comment::-webkit-scrollbar {
  display: none;
}

#deleteBtn {
  position: absolute;
  top: 0;
  right: 0;
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
  top: 0;
  right: 0;
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

.UploadUser {
  color: #ffffff;
  position: absolute;
  bottom: 0;
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
  bottom: 0;
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
  display: none;
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

.pagingBase {
  position: absolute;
  user-select: none;
  top: 0;
  opacity: 0;
  width: 20%;
  height: 100%;
}

#pLeft {
  left: 0;
}

#pRight {
  right: 0;
}

#pLeft:hover, #pRight:hover {
  opacity: 0.9;
}

#pagingLeftBtn {
  position: absolute;
  top: 50%;
  left: 15%;
  transform: translate(-15%, -50%);
  max-width: 35px;
}

#pagingRightBtn {
  position: absolute;
  top: 50%;
  right: 15%;
  transform: translate(15%, -50%);
  max-width: 35px;
}

#bottomCTA {
  user-select: none;
}

</style>
