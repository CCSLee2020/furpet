import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/auth';
import 'firebase/compat/storage';

const config = {
    apiKey: "AIzaSyDDdSly9TG350O54D_BvtElgHZ6oxJ_CbU",
    authDomain: "furpet-14eea.firebaseapp.com",
    projectId: "furpet-14eea",
    storageBucket: "furpet-14eea.appspot.com",
    messagingSenderId: "170672929681",
    appId: "1:170672929681:web:219bb7ade084ec11633830",
    measurementId: "G-F3DBNJSXJ2"
}

firebase.initializeApp(config)

var db = firebase.firestore();
var storage = firebase.storage();

export { storage }
export { db };

export async function loginUser(username: string, password: string) {
    const email = `${username}`

    try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password)
        const user = firebase.auth().currentUser;

        if (user) {
            // Fetch the document in collection "users" with the same ID as the user's UID
            const doc = await firebase.firestore().collection('users').doc(user.uid).get();
            const userData = doc.data();

            if (userData) {
                return userData.role; // Return the role of the user
            }
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function registerUser(username: string, password: string, role: string) {
    const email = `${username}`

    try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
        const user = firebase.auth().currentUser;

        if (user) {
            // Add a new document in collection "users" with the same ID as the user's UID
            firebase.firestore().collection('users').doc(user.uid).set({
                role: role,
                email: email,
            })
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

