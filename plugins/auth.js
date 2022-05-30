import firebase from '~/plugins/firebase'

const auth = () => {
  return new Promise((resolve) => {
    // console.log('plugins/auth')
    firebase.auth().onAuthStateChanged((user) => {
      // console.log(user.getIdToken())
      resolve(user || false)
    })
  })
}
export default auth
