import React, { useEffect, useState } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

type Pet = {
    index: number;
    name: string;
    age: string;
    breed: string;
    location: string;
    about: string;
    caretakerInfo: string;
    caretakerNumber: string;
    weight: string;
    gender: 'male' | 'female';
    neutered: 'yes' | 'no';
    type: 'cat' | 'dog';
    status: 'adopted' | 'available';
    address: string;
};

const AdminUpdatePets: React.FC = () => {
    const history = useHistory();
    const [isActive, setIsActive] = useState(false);
    const { id } = useParams<{ id: string }>();
    const [pet, setPet] = useState<Pet>({
        index: Date.now(),
        name: '',
        age: '',
        breed: '',
        location: '',
        about: '',
        caretakerInfo: '',
        caretakerNumber: '',
        weight: '',
        gender: 'male',
        neutered: 'yes',
        type: 'cat',
        status: 'available',
        address: ''
    });

    useEffect(() => {
        const fetchPet = async () => {
            const db = firebase.firestore();
            const petDoc = await db.collection('pets').doc(id).get();
            setPet(petDoc.data() as Pet);
        };

        fetchPet();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPet({ ...pet, [e.target.name]: e.target.value });
    };

    const handleUpdateAndSubmit = async (e: React.FormEvent, updatedPet: Pet) => {
        e.preventDefault();
      
        const db = firebase.firestore();
        await db.collection('pets').doc(id).set(updatedPet);
      
        history.push('/adminPetList');
      };

    if (!pet) {
        return <div>Loading...</div>;
    }

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
                                <h2>Edit Appointment</h2>
                            </div>
                            <div className="header_avatar"><i className="fas fa-user-circle fw fa-xl"></i></div>
                        </header>
                        <aside className={`aside ${isActive ? 'active' : ''}`}>
                            <div className="aside_close-icon">
                                <strong>×</strong>
                            </div>
                            <h2 className="menu_title"><i className="fas fa-paw fw"></i> FurPet</h2>
                            <ul className="aside_list">
                                <a href="/adminHome">
                                    <li className="aside_list-item">
                                        <i className="fas fa-users fw"></i> Users
                                    </li>
                                </a>
                                <a href="/adminPetList">
                                    <li className="aside_list-item active-list">
                                        <i className="fas fa-clipboard fw"></i> Pet List
                                    </li>
                                </a>
                                <a href="/adminAppointments">
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> Appointments
                                    </li>
                                </a>
                                <a href="/petIdentifier">
                                    <li className="aside_list-item">
                                        <i className="fas fa-search fw"></i> Identify Breeds
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
                            <IonCard>
                                <IonCardContent className='card'>
                                    <form onSubmit={(e) => handleUpdateAndSubmit(e, pet)}>
                                        Pet Name: {pet.name}<br />
                                        Age: {pet.age}<br />
                                        Gender: {pet.gender}<br />
                                        Neutered: {pet.neutered}<br />
                                        Type: {pet.type}<br />
                                        Breed: {pet.breed}<br />
                                        Weight: {pet.weight}<br />
                                        Address: {pet.address}<br />
                                        About: {pet.about}<br />
                                        Breed: {pet.breed}<br />
                                        Caretaker Name: {pet.caretakerInfo}<br />
                                        Caretaker Contact Number: {pet.caretakerNumber}<br />
                                        Caretaker Location: {pet.location}<br />
                                        <label>
                                            Status:
                                            <select name="status" value={pet.status} onChange={handleChange}>
                                                <option value="Available">Available</option>
                                                <option value="Adopted">Adopted</option>
                                            </select>
                                        </label><br />
                                        <IonButton type="submit">Update Pet</IonButton><br /><br />

                                    </form>
                                </IonCardContent>
                            </IonCard>
                        </main>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AdminUpdatePets;