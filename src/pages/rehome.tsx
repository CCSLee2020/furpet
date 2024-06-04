import React, { useEffect, useState } from 'react';
import './rehome.css';
import { IonContent, IonPage, } from '@ionic/react';
import edit from '../assets/Vector.png';
import Delete from '../assets/material-symbols_delete-outline.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Link } from 'react-router-dom';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';


type Pet = {
    id: string;
    index: string,
    name: string;
    age: number;
    gender: 'male' | 'female';
    neutered: 'yes' | 'no';
    type: 'cat' | 'dog';
    breed: string;
    location: string;
    about: string;
    caretakerInfo: string;
    imageUrl: string;
    status: string;
};

const LandingPage: React.FC = () => {

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();

    useEffect(() => {
        const fetchImages = async () => {
            const result = await storageRef.child('images').listAll();
            const urlPromises = result.items.map(imageRef => imageRef.getDownloadURL());
            return Promise.all(urlPromises);
        };

        const loadImages = async () => {
            const urls = await fetchImages();
            setImageUrls(urls);
        };

        loadImages();
    }, []);

    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
        const fetchPets = async () => {
            const db = firebase.firestore();
            const petCollection = db.collection('pets').orderBy('index');
            const petSnapshot = await petCollection.get();
            const petList: Pet[] = petSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Pet);
            setPets(petList);
        };

        fetchPets();
    }, []);

    const deletePet = async (id: string, index: string ) => {
        const db = firebase.firestore();
        const petRef = db.collection('pets').doc(id);
        const storage = firebase.storage();
        const imageRef = storage.ref().child(`images/${index}`);

        // Show a warning before deleting the pet
        if (window.confirm('Are you sure you want to delete this pet?')) {
            // Delete the image from Firebase Storage
            imageRef.delete().then(() => {
                console.log('Image deleted from Firebase Storage.');
            }).catch((error) => {
                console.error('Error deleting image from Firebase Storage:', error);
            });

            // Delete the pet document from Firestore
            await petRef.delete();

            // Remove the deleted pet from the local state
            setPets(pets.filter(pet => pet.id !== id));
        }
    };


    return (
        <IonPage>
            <IonContent>
                <nav>
                    <div className="logo1">
                        <img className='navLogo1' src={navLogo} alt="" />
                        <h1 className="h1_logo1">FurPet</h1>
                    </div>
                    <div className="nav-links1">
                        <a href="/petOwnerHome">Home</a>
                        <a href="/petOwnerAdopt">Adopt</a>
                        <a href="/rehome">Rehome</a>
                        <a href="/petOwnerPetIdentifier">Identify</a>
                        <a href="/login">Log Out</a>
                    </div>
                </nav>
                <div className="rehome">
                    <h1 className="rehome_h1">Pet Listed</h1>
                    <a href="/addpet"><h1 className="addnewpet">Add Pet</h1></a>
                    <div className="rehome_container">
                        {pets.map((pet, i) => (
                            <div className="rehome_box">
                                <img className="rehome_img" key={i} src={imageUrls[i]} alt={pet.name} />
                                <h1 className="rehome_texth1" key={i}>{pet.name}</h1>
                                <h2 className="rehome_h2" key={i}>Owner Information: {pet.caretakerInfo}</h2>
                                <h2 className="rehome_h2" key={i}>Address: {pet.location}</h2>
                                <h2 className="rehome_h2" key={i}>Neutered:{pet.neutered}</h2>
                                <h2 className="rehome_h2" key={i}>Status:{pet.status}</h2>
                                <Link className="edit" to={`/updatePet/${pet.id}`}><img className="edit" src={edit} /></Link>
                                <img className="delete" src={Delete} onClick={() => deletePet(pet.id, pet.index)} />
                            </div>
                        ))}
                    </div>
                    <div className="space3"></div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;