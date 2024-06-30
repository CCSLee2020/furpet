import React, { useState, useEffect } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
};

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

type Appointment = {
    id: string;
    index: string;
    appoint_name: string;
    appoint_number: string;
    appoint_email: string;
    appoint_address: string;
    appoint_date: string;
    pet_name: string;
    pet_caretaker: string;
    pet_number: string;
    pet_location: string;
    pet_index: string;
    imageUrl: string;
    status: string;
};

const AdminHome: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [userCount, setUserCount] = useState<number>(0);
    const { userID } = useParams<{ userID: string }>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [confirmedCount, setConfirmedCount] = useState<number>(0);
    const [pets, setPets] = useState<Pet[]>([]);
    const [denyCount, setDenyCount] = useState<number>(0);
    const [availableCount, setAvailableCount] = useState<number>(0);
    const [adoptedCount, setAdoptedCount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const data = await db.collection('users').get();
            setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User));
        };
        fetchData();
        const user = users.filter(user => user.role === 'user');
        setUserCount(user.length);
    }, [users]);

    useEffect(() => {
        const fetchAppointment = async () => {
            const db = firebase.firestore();
            const appointmentCollection = db.collection('appointments').orderBy('index');
            const appointmentSnapshot = await appointmentCollection.get();

            const appointmentList: Appointment[] = appointmentSnapshot.docs.map(doc => {
                const appointmentData = doc.data() as Appointment;
                return { ...appointmentData, id: doc.id } as Appointment;
            });

            setAppointments(appointmentList);
        };

        fetchAppointment();
        const pending = appointments.filter(appointment => appointment.status === 'Pending');
        const confirmed = appointments.filter(appointment => appointment.status === 'Confirmed');
        const deny = appointments.filter(appointment => appointment.status === 'Deny');

        setPendingCount(pending.length);
        setConfirmedCount(confirmed.length);
        setDenyCount(deny.length);
    }, [appointments]);

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

    const deleteUser = async (id: string) => {
        const db = firebase.firestore();
        const userRef = db.collection('users').doc(id);

        if (window.confirm('Are you sure you want to delete this user?')) {
            await userRef.delete();
            setUsers(users.filter(user => user.id !== id));
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
                                <h2>Dashboard</h2>
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
                                    <li className="aside_list-item active-list">
                                        <i className="fas fa-users fw"></i> Dashboard
                                    </li>
                                </a>
                                <a href={`/${userID}/adminUsers`}>
                                    <li className="aside_list-item ">
                                        <i className="fas fa-users fw"></i> Users
                                    </li>
                                </a>
                                <a href={`/${userID}/adminPetList`}>
                                    <li className="aside_list-item">
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
                            <IonCard className='card'>
                                <IonCardContent>
                                <strong>Registered Users:</strong> {userCount}
                                </IonCardContent>
                            </IonCard>
                            <IonCard className='card'>
                            <IonCardContent>
                                <strong>Available Pets:</strong> {availableCount}
                                </IonCardContent>
                            </IonCard>
                            <IonCard className='card'>
                            <IonCardContent>
                                <strong>Adopted Pets:</strong> {adoptedCount}
                                </IonCardContent>
                            </IonCard>
                            <IonCard className='card'>
                            <IonCardContent>
                                <strong>Pending Appointments:</strong> {pendingCount}
                                </IonCardContent>
                            </IonCard>
                            <IonCard className='card'>
                            <IonCardContent>
                                <strong>Confirmed Appointments:</strong> {confirmedCount}
                                </IonCardContent>
                            </IonCard>
                            <IonCard className='card'>
                            <IonCardContent>
                                <strong>Denied Appointments:</strong> {denyCount}
                                </IonCardContent>
                            </IonCard>
                        </main>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AdminHome;
