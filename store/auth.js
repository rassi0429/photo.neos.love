import firebase from '../plugins/firebase'
import auth from '~/plugins/auth'

export const actions = {
  async getUserInfo({ commit, rootState }) {
    const user = await auth()
    console.log(user)
    // let token = null
    if (user) {
      console.log('ログイン済み')
      return user.uid
      // await user.getIdToken(true)
    } else {
      console.log('未ログイン')
      return null
    }
  },
  twitterLogin({ commit, rootState }) {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  },
  LogOut({ commit, rootState }) {
    firebase.auth().signOut().then(() => {
      location.reload()
    })
  }
}
