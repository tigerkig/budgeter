import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAxX9svKx8lV-6gnnYJUd5MrwOp491G364",
  authDomain: "budgeter-c49ac.firebaseapp.com",
  projectId: "budgeter-c49ac",
  storageBucket: "budgeter-c49ac.appspot.com",
  messagingSenderId: "877891322621",
  appId: "1:877891322621:web:b32a0d3e057e879bd23494"
};

  
firebase.initializeApp(firebaseConfig);

export default firebase;