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
    const email = `${username}`;

    try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = firebase.auth().currentUser;

        if (user) {
            // Fetch the document in the "users" collection with the same ID as the user's UID
            const doc = await firebase.firestore().collection('users').doc(user.uid).get();
            const userData = doc.data();

            if (userData) {
                return { role: userData.role, userId: user.uid }; // Return both role and user ID
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function registerUser(
    username: string,
    name: string,
    password: string,
    firstname: string,
    lastname: string,
    address: string,
    contactNumber: string,
    q1: string,
    q2: string,
    q3: string,
    q4: string,
    q5: string,
    q6: string,
    q7: string,
    q8: string,
    q9: string,
    q10: string,
    q11: string,
    q12: string,
    q13: string,
    q14: string,
    q15: string,
    q16: string,
    q17: string,
    q18: string,
    q19: string,
) {
    const email = `${username}`

    try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
        const user = firebase.auth().currentUser;

        if (user) {
            // Add a new document in collection "users" with the same ID as the user's UID
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            await userRef.set({
                UserID: user.uid,
                email: email,
                role: 'user',
                name: name,
                firstname: firstname,
                lastname: lastname,
                address: address,
                contactNumber: contactNumber,
                q1: q1,
                q2: q2,
                q3: q3,
                q4: q4,
                q5: q5,
                q6: q6,
                q7: q7,
                q8: q8,
                q9: q9,
                q10: q10,
                q11: q11,
                q12: q12,
                q13: q13,
                q14: q14,
                q15: q15,
                q16: q16,
                q17: q17,
                q18: q18,
                q19: q19
            });
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

