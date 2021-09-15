import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyD6iIKWkqkWG9zFdkff7FOvlg--Yu_DM7Y",
    authDomain: "e-library-84788.firebaseapp.com",
    projectId: "e-library-84788",
    storageBucket: "e-library-84788.appspot.com",
    messagingSenderId: "310817556584",
    appId: "1:310817556584:web:68c064735963ec2c9693dd"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();