import firebase from "firebase";

var firebaseApp = firebase.initializeApp({
  // Your firebase credentials
    apiKey: "AIzaSyAO7jNyZV-4GSBuWcZ1i-sA1SSp0IAEjn8",
    authDomain: "resume-website-4f62c.firebaseapp.com",
    databaseURL: "https://resume-website-4f62c-default-rtdb.firebaseio.com",
    projectId: "resume-website-4f62c",
    storageBucket: "resume-website-4f62c.appspot.com",
    messagingSenderId: "645910221309",
    appId: "1:645910221309:web:4d1d828520a03ea2468994",
    measurementId: "G-BP57HMKYX1"
});

var db = firebaseApp.firestore();

export { db };