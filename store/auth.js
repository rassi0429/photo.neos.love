import axios from "axios";
import firebase from '../plugins/firebase'
import auth from '~/plugins/auth'

export const state = () => ({
  uid: ""
})

export const mutations = {
  setUid(state,uid) {
    state.uid = uid
  }
}

export const actions = {
  async getUserInfo({ commit, rootState }) {
    const user = await auth()
    if (user) {
      console.log('ログイン済み')
      const token = await user.getIdToken(true)
      await axios.post(`${rootState.endpoint}/v1/user/`,{},{headers: {token}})
      commit('setUid', user.uid)
      return user.uid
    } else {
      console.log('未ログイン')
      commit('setUid', "")
      return null
    }
  },
  twitterLogin({ commit, rootState }) {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  },
  LogOut({ commit, rootState }) {
    firebase.auth().signOut().then(() => {
      commit('setUid', "")
      location.href = `/`
    })
  }
}
