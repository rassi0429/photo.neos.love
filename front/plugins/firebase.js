import firebase from 'firebase/app'

import 'firebase/auth'

// ** 本番環境
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDXykK8y4smDE8d19ozk3caN685vhT2vh8",
    authDomain: "auth.photo.neos.love",
    projectId: "photo-neos-love",
    storageBucket: "photo-neos-love.appspot.com",
    messagingSenderId: "871699453882",
    appId: "1:871699453882:web:1eedd757d605b91e0a2f83"
  })
}

export default firebase
