import firebase from '../plugins/firebase'
import auth from '~/plugins/auth'

export const actions = {
  async getUserInfo({commit, rootState}) {
    const user = await auth()
    // let token = null
    if (user) {
      console.log('ログイン済み')
      // await user.getIdToken(true)
    } else {
      console.log('未ログイン')
    }
  },
  twitterLogin({commit, rootState}) {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }
}
