import axios from "axios";
import auth from "@/plugins/auth";

export const state = () => ({
  isModalOpen: false,
  modalData: {
    author: "",
    url: "",
    comment: "",
    tags: [],
    id: 0
  },
  username: "",
  isEditing: false,
  editingTag: [],
  width: 0
})

export const getters = {}

export const actions = {
  async updatePhoto({commit, state, rootState}) {
    const user = await auth()
    if (user) {
      const token = await user.getIdToken(true)
      await axios.post(`${rootState.endpoint}/v1/photo/${state.modalData.id}`, {
        comment: state.modalData.comment,
        tags: state.editingTag
      }, {headers: {token}})
      const {data} = await axios.get(`${rootState.endpoint}/v1/photo/${state.modalData.id}`)
      commit('openModal', data)
    }
  },
  async updateData({commit, state, rootState}) {
    try {
      const {data} = await axios.get(`${rootState.endpoint}/v1/photo/${state.modalData.id}`)
      commit('openModal', data)
    } catch {
    }
  },
  async deletePhoto({commit, state, rootState}) {
    const res = confirm("削除してもいいですか");
    if (res) {
      const user = await auth()
      if (user) {
        const token = await user.getIdToken(true)
        await axios.delete(`${rootState.endpoint}/v1/photo/${state.modalData.id}`, {headers: {token}})
        await this.$router.replace({'query': null});
        location.reload()
      }
    }
  }
}

export const mutations = {
  openModal(state, data) {
    if (state.isModalOpen) return

    const nsfwTags = ['nsfw', 'r18'];
    const name = data.tags.map(t => t.name)
    if (name.includes(nsfwTags[0]) || name.includes(nsfwTags[1])) {
      const useraction = window.confirm("エッチな画像が含まれます。あなたは18歳以上ですか？")
      if (!useraction) {
        window.location = "https://kids.yahoo.co.jp/"
      } else {
        state.isModalOpen = true
        state.modalData = data
        this.$router.replace({'query': {modal: data.id}});
      }
    } else {
      state.isModalOpen = true
      state.modalData = data
      this.$router.replace({'query': {modal: data.id}});
    }
  },

  closeModal(state) {
    state.isModalOpen = false
    state.modalData = {
      author: "",
      url: "",
      comment: "",
      tags: []
    }
    this.$router.replace({'query': null});
    state.isEditing = false
    state.editingTag = []
  },
  updateComment(state, data) {
    state.modalData.comment = data
  },
  updateTags(state, data) {
    state.editingTag = data
  },
  updateEditState(state, data) {
    state.isEditing = data
    if (data) {
      state.editingTag = state.modalData.tags.map(t => t.name)
    }
  },
  deleteTag(state, data) {
    state.editingTag.splice(data, 1)
  },
  setWidth(state, data) {
    state.width = data
  }
}
