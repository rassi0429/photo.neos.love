import axios from "axios";
import auth from "@/plugins/auth";

const CancelToken = axios.CancelToken;
let updateCancel;

export const state = () => ({
  isModalOpen: false,
  isDisablePagingBtn: true,
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
      updateCancel?.()
      const {data} = await axios.get(`${rootState.endpoint}/v1/photo/${state.modalData.id}`, {
        cancelToken: new CancelToken(function executor(c) { updateCancel = c }),
      })
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
  },
  async updateDataFromIdSearch({commit, state, rootState}, params) {
    const { isNext, id, maxTryCount = 30 } = params;
    let targetId = isNext ? id - 1 : id + 1;
    for (let tc = 0; tc < maxTryCount; tc++) {
      if (targetId <= 0) break;
      try {
        updateCancel?.()
        const {data} = await axios.get(`${rootState.endpoint}/v1/photo/${targetId}`, {
          cancelToken: new CancelToken(function executor(c) { updateCancel = c }),
        })
        commit('openModal', {...data, forceUpdate: true})
        break;
      } catch {}
      isNext ? targetId-- : targetId++;
    }
  },
}

export const mutations = {
  openModal(state, data) {
    if (state.isModalOpen && !data.forceUpdate) return
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
    const isUserPage = location.href.includes('/user/');
    const isMomentPage = location.href.includes('/moment/');
    const isTagPage = location.href.includes('/tag/');
    state.isDisablePagingBtn = isUserPage || isMomentPage || isTagPage;
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
