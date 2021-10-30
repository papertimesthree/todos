import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDR2s1x2l8iorhFKDGsqe50nUFQaD2Tkpw",
  authDomain: "wk-32f79.firebaseapp.com",
  projectId: "wk-32f79",
  storageBucket: "wk-32f79.appspot.com",
  messagingSenderId: "581581806558",
  appId: "1:581581806558:web:dc950ef22ce812f27a1b4f"
};

firebase.initializeApp(firebaseConfig);
let fstore = firebase.firestore();

let increment = firebase.firestore.FieldValue.increment;

export { fstore, increment };
