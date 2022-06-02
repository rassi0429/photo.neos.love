<template lang="pug">
  div.md(v-show="isModalOpen" @click="closeModal()")
    div.image-modal(@click.stop)
      img#editBtn(v-if="!isEditing && (uid === modalData.author)" @click="updateEditState(true)" src="/pen.png")
      // button.button(v-if="!isEditing && (uid === modalData.author)" @click="deletePhoto") 削除
      img#CloseBtn(@click="closeModal()" src="/close.png")
      div.columns.h100.m0
        div.column.is-9.h100.p0.center
          img#ImageInModal(:src="modalData.url")
        div.column.is-3
          button.button(v-if="isEditing" @click="updatePhoto();updateEditState(false)") 保存
          button.button(v-if="isEditing" @click="updateEditState(false)") キャンセル
          p#comment(v-if="!isEditing") {{ modalData.comment }}
            div(v-if="isEditing")
              textarea.w100(:value="modalData.comment" @change="(e) => updateComment(e.target.value)")
              button(v-for="(tag, ii) in editingTag" :key="ii" @click="deleteTag(ii)") {{ tag }}
              input.input(v-model="tmpTag")
              button.button(:disabled="!tmpTag" @click="updateTags([...editingTag,tmpTag])") tag tuika
          div#tags(v-for="(t,i) in modalData.tags" :key="i")
            a(:href="'/tag/' + t.name ") {{ "#" + t.name}}
          div#UploadUser.is-flex
            | Uploaded by&nbsp;
            p#UserLink(@click="toUser(modalData.author)") {{ name }}
          p#date {{ modalData.createDate ? new Date(modalData.createDate).toLocaleDateString().replaceAll("/","-"): "" }}
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

#CloseBtn {
  position: absolute;
  bottom: 0%;
  right: 0%;
  margin-bottom: 0.8em;
  margin-right: 0.8em;
  max-width: 30px;
  opacity: 20%
}

#CloseBtn:hover {
  opacity: 50%;
}

#comment {
  max-height: 300px;
  margin-bottom: 1em;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  opacity: 50%;
}

#comment::-webkit-scrollbar {
  display: none;
}

#editBtn {
  position: absolute;
  top: 0%;
  right: 0%;
  margin-top: 0.8em;
  margin-right: 0.8em;
  max-width: 30px;
  opacity: 20%
}

#editBtn:hover {
  opacity: 50%;
}

#tags {
  max-height: 100px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  opacity: 50%;
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
  opacity: 50%;
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

#date {
  position: absolute;
  bottom: 0%;
  margin-bottom: 1.5em;
  opacity: 50%;
}
</style>
