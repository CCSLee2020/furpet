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


export async function registerUser(username: string, password: string, role: string) {
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
                role: role,
            });

            // Create a "pets" subcollection within the user document
            const petRef = userRef.collection('pets').doc();
            await petRef.set({
                id: petRef.id,
                index: 0,
                name: '',
                type: '',
                gender: '',
                age: 0,
                breed: '',
                neutered: '',
                about: '',
                caretakerInfo: '',
                caretakerNumber: '',
                imageUrl: '',
                location: '',
                address: ''
            });

            // Create an "appointments" subcollection within the user document
            const appointmentRef = userRef.collection('appointments').doc();
            await appointmentRef.set({
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: '',
                q6: '',
                q7: '',
                q8: '',
                q9: '',
                q10: '',
                q11: '',
                q12: '',
                q13: '',
                q14: '',
                q15: '',
                q16: '',
                q17: '',
                q18: '',
                q19: '',
                pet_index: '',
                appoint_name: '',
                appoint_number: '',
                appoint_email: '',
                appoint_address: '',
                appoint_date: '',
                pet_name: '',
                pet_caretaker: '',
                pet_number: '',
                pet_location: '',
                index: '',
                status: '',
                imageUrl: ''
            });
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

