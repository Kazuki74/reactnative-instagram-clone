import firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBc3AfQaZYofBf9SQjrMVkWwy1lj54mAAs",
    authDomain: "reactnetive-instagram-clone.firebaseapp.com",
    databaseURL: "https://reactnetive-instagram-clone.firebaseio.com",
    projectId: "reactnetive-instagram-clone",
    storageBucket: "reactnetive-instagram-clone.appspot.com",
    messagingSenderId: "821633729383"
};
firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
