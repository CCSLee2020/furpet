import React, { useEffect, useState } from 'react';
import './landingpage.css';
import { IonImg, IonContent, IonPage, IonButton } from '@ionic/react';
import dog1 from '../assets/dog 1.png';
import footprint1 from '../assets/footprint 1.png';
import cat1 from '../assets/cat 1.png';
import paw1 from '../assets/paw 1.png';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';


type Pet = {
    id: string;
    index: number,
    name: string;
    age: number;
    gender: 'male' | 'female';
    neutered: 'yes' | 'no';
    type: 'cat' | 'dog';
    breed: string;
    weight: number;
    location: string;
    about: string;
    caretakerInfo: string;
    imageUrl: string;
    status: string;
};

const LandingPage: React.FC = () => {

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();
    const [selectedType, setSelectedType] = useState<'Cat' | 'Dog' | 'all'>('all');

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
            const petList: Pet[] = await Promise.all(petSnapshot.docs.map(async doc => {
                const petData = doc.data();
                const imageUrl = await storageRef.child(`images/${petData.index}`).getDownloadURL();
                return { ...petData, id: doc.id, imageUrl } as Pet;
            }));
            setPets(petList);
        };

        fetchPets();
    }, []);


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
                <div className="categories2">
                    <h1 className="categories_h1">Categories</h1>
                    <div className="categories_container">
                        <div className="categories_box" onClick={() => setSelectedType('all')}>
                            <img src={footprint1} />
                            <p className="categories_text">All</p>
                        </div>
                        <div className="categories_box" onClick={() => setSelectedType('Dog')}>
                            <img src={dog1} />
                            <p className="categories_text">Dogs</p>
                        </div>
                        <div className="categories_box" onClick={() => setSelectedType('Cat')}>
                            <img src={cat1} />
                            <p className="categories_text">Cats</p>
                        </div>
                    </div>
                </div>
                <div className="adoption2">
                    <h1 className="adpotion_h1">For Adoption</h1>
                    <div className="adoption_container">
                        {pets.filter(pet => selectedType === 'all' || pet.type.toLowerCase() === selectedType.toLowerCase()).map((pet, i) => (
                            <div className="adoption_box">
                                <img className="adoption_image" src={pet.imageUrl} alt={pet.name} />
                                <p className="adoption_text">{pet.breed}</p>
                                <p className="adoption_desc">Age: {pet.age} Years Old</p>
                                <p className="adoption_desc">Gender: {pet.gender}</p>
                                <p className="adoption_desc">Weight: {pet.weight} kg</p>
                                <p className="adoption_desc">Address: {pet.location}</p>
                                <p className="adoption_desc">Status: {pet.status}</p>
                                <Link to={`/petOwnerAdoptme/${pet.id}`}><div className="adoptMe"><p className='adoption_button'>Adopt Me</p></div></Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space"></div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;