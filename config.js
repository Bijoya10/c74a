import * as firebase from "firebase";
require("@firebase/firestore")
var firebaseConfig = {
    apiKey: "AIzaSyDVneVYJx_N3k23taLBI0ekozUxKR8JqfA",
    authDomain: "wily1-962c8.firebaseapp.com",
    databaseURL: "https://wily1-962c8.firebaseio.com",
    projectId: "wily1-962c8",
    storageBucket: "wily1-962c8.appspot.com",
    messagingSenderId: "237317752802",
    appId: "1:237317752802:web:e41173b5f1848a72fd1bbb"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();