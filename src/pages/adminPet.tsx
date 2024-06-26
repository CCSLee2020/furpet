import React, { useEffect, useState } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Link, useParams } from 'react-router-dom';
import 'firebase/compat/storage';
import adoptpet from '../assets/adoptedpet.png';
import availablepet from '../assets/availablepet.png';

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

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
};

const AdminAppointments: React.FC = () => {

    const [isActive, setIsActive] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();
    const [availableCount, setAvailableCount] = useState<number>(0);
    const [adoptedCount, setAdoptedCount] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const { userID } = useParams<{ userID: string }>();

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
        const fetchData = async () => {
            const db = firebase.firestore();
            const data = await db.collection('users').get();
            setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User));
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchPets = async () => {
            const db = firebase.firestore();
            const petCollection = db.collection('pets').orderBy('index');
            const petSnapshot = await petCollection.get();
            const petList: Pet[] = petSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Pet);
            setPets(petList);
        };

        fetchPets();
        const available = pets.filter(pets => pets.status === 'Available');
        const adopted = pets.filter(pets => pets.status === 'Adopted');

        setAvailableCount(available.length);
        setAdoptedCount(adopted.length);
    }, [pets]);

    const deletePet = async (id: string, imageUrl: string) => {
        try {
          const db = firebase.firestore();
          const petRef = db.collection('pets').doc(id); // Main collection reference
          const subPetRef = db.collection('users').doc(userID).collection('pets').doc(id); // Subcollection reference
          const imageRef = storageRef.child(`images/${imageUrl}`);
          const imageRef1 = storageRef.child(`images/${imageUrl}_1`);
          const imageRef2 = storageRef.child(`images/${imageUrl}_2`);
          const imageRef3 = storageRef.child(`images/${imageUrl}_3`);
          const imageRef4 = storageRef.child(`images/${imageUrl}_4`);
          const imageRef5 = storageRef.child(`images/${imageUrl}_5`);
    
          if (window.confirm('Are you sure you want to delete this pet?')) {
            // Delete the image from Firebase Storage
            await imageRef.delete();
            await imageRef1.delete();
            await imageRef2.delete();
            await imageRef3.delete();
            await imageRef4.delete();
            await imageRef5.delete();
    
            // Delete the pet document from the subcollection
            await subPetRef.delete();
    
            // Delete the pet document from the main collection
            await petRef.delete();
    
            // Update the local state to remove the pet
            setPets(pets.filter(pet => pet.id !== id));
          }
        } catch (error) {
          console.error('Error deleting pet:', error);
        }
      };

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    return (
        <IonPage>
            <IonContent>
                <div className="adminHome">
                    <div className="grid-container">
                        <div className="menu-icon" onClick={toggleActive}>
                            <strong> ☰</strong>
                        </div>
                        <header className="header">
                            <div className="header_title">
                                <h2>Pets</h2>
                            </div>
                            <div className="header_avatar"><i className="fas fa-user-circle fw fa-xl"></i></div>
                        </header>
                        <aside className={`aside ${isActive ? 'active' : ''}`}>
                            <div className="aside_close-icon">
                                <strong>×</strong>
                            </div>
                            <h2 className="menu_title"><i className="fas fa-paw fw"></i> FurPet</h2>
                            <ul className="aside_list">
                                <a href={`/${userID}/adminDashboard`}>
                                    <li className="aside_list-item">
                                        <i className="fas fa-users fw"></i> Dashboard
                                    </li>
                                </a>
                                <a href={`/${userID}/adminUsers`}>
                                    <li className="aside_list-item">
                                        <i className="fas fa-users fw"></i> Users
                                    </li>
                                </a>
                                <a href={`/${userID}/adminPetList`}>
                                    <li className="aside_list-item active-list">
                                        <i className="fas fa-clipboard fw"></i> Pet List
                                    </li>
                                </a>
                                <a href={`/${userID}/adminAppointments`}>
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> Appointments
                                    </li>
                                </a>
                                <a href={`/${userID}/Identifier`}>
                                    <li className="aside_list-item">
                                        <i className="fas fa-search fw"></i> Identify Breeds
                                    </li>
                                </a>
                                <a href={`/${userID}/userLog`}>
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> User Log
                                    </li>
                                </a>
                            </ul>
                            <ul className="aside_footer">
                                <li className="aside_list-item">
                                    <a href="/login">
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </aside>
                        <main className="main">
                            <div className='dash_flexbox'>
                                <IonCard className='card_dash'>
                                    <IonCardContent>
                                        <img className='img_dash' src={availablepet} alt="" />
                                        <p className='.text_dash'><strong>Available Pets:</strong> {availableCount}</p>
                                    </IonCardContent>
                                </IonCard>
                                <IonCard className='card_dash'>
                                    <IonCardContent>
                                        <img className='img_dash' src={adoptpet} alt="" />
                                        <p className='.text_dash'><strong>Adopted Pets:</strong> {adoptedCount}</p>
                                    </IonCardContent>
                                </IonCard>
                            </div>
                            {pets.map((pet, i) => (
                                <IonCard className='card3'>
                                    <IonCardContent>
                                        <img className="document_img2" key={i} src={imageUrls[i]} alt={pet.name} /><br />
                                        Pet Name: {pet.name}<br />
                                        Address: {pet.location}<br />
                                        Neutered: {pet.neutered}<br />
                                        Pet Status: {pet.status}<br />
                                        <IonButton color="light"><Link to={`/${userID}/adminUpdatePet/${pet.id}`}>Select Status</Link></IonButton>
                                        <IonButton color="danger" onClick={() => deletePet(pet.id, pet.index)} > Delete </IonButton>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                        </main>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AdminAppointments;
