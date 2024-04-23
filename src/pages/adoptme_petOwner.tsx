import React, { useEffect, useState } from 'react';
import './adoptme.css';
import { IonContent, IonPage, } from '@ionic/react';
import profile from '../assets/Profile 1.png';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

type Pet = {
    id: string;
    index: number;
    name: string;
    type: string;
    gender: string;
    age: number;
    breed: string;
    neutered: string;
    about: string;
    caretakerInfo: string;
    imageUrl: string;
    location: string;
    address: string;
};


const LandingPage: React.FC = () => {
    const [pet, setPet] = useState<Pet | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPet = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('pets').doc(id).get();
            const pet = { id: doc.id, ...doc.data() } as Pet;
            setPet(pet);
        };

        fetchPet();
    }, [id]);

    useEffect(() => {
        const fetchImage = async () => {
            if (pet) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${pet.index}`);
                const url = await imageRef.getDownloadURL();
                return url;
            }
            return null;
        };

        const loadImages = async () => {
            const url = await fetchImage();
            setImageUrl(url);
            console.log(imageUrl);
        };

        loadImages();
    }, [pet]);



    if (!pet) {
        return <div>Loading...</div>;
    }

    return (
        <IonPage>
            <IonContent>
                <nav>
                    <div className="logo">
                        <h1 className="h1_logo">FurPet</h1>
                    </div>
                    <div className="nav-links">
                        <a href="/petOwnerHome">Home</a>
                        <a href="/petOwnerAdopt">Adopt</a>
                        <a href="/rehome">Rehome</a>
                        <a href="/petOwnerPetIdentifier">Identify</a>
                        <a href="/login">Log Out</a>
                    </div>
                </nav>
                <div className="details">
                    <>
                        <div className="details_textBox">
                            <h1 className="details_h1">{pet.name}</h1>
                            <h2 className="details_h2"><b>Type:</b> {pet.type}</h2>
                            <h2 className="details_h2"><b>Gender:</b> {pet.gender}</h2>
                            <h2 className="details_h2"><b>Breed:</b> {pet.breed}</h2>
                            <h2 className="details_h2"><b>Neutered:</b> {pet.neutered}</h2>
                            <h2 className="details_h2"><b>Age &#40;months&#41;:</b> {pet.age}</h2>
                        </div>
                        {imageUrl && <img className="details_img" src={imageUrl} />}
                        <h1 className="details_aboutme">About Me</h1>
                        <p className="details_desc">{pet.about}</p>
                        <h1 className="details_caretaker">Caretaker</h1>
                        <div className="caretaker_container">
                            <div className="caretaker_box">
                                <h1 className="caretaker_h1">Caretaker: {pet.caretakerInfo}</h1>
                                <h2 className="caretaker_h2">{pet.address}</h2>
                            </div>
                        </div>
                        <div className="space2"></div>
                    </>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;