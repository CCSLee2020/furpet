import React, { useEffect, useState } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Link, useParams } from 'react-router-dom';
import 'firebase/compat/storage';

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
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [confirmedCount, setConfirmedCount] = useState<number>(0);
    const [denyCount, setDenyCount] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const { userID } = useParams<{ userID: string }>();

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const data = await db.collection('users').get();
            setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User));
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            const result = await storageRef.child('documents').listAll();
            const urlPromises = result.items.map(imageRef => imageRef.getDownloadURL());
            return Promise.all(urlPromises);
        };

        const loadImages = async () => {
            const urls = await fetchImages();
            setImageUrls(urls);
        };

        loadImages();
    }, []);

    useEffect(() => {
        const fetchAppointment = async () => {
            const db = firebase.firestore();
            const appointmentCollection = db.collection('appointments').orderBy('index');
            const appointmentSnapshot = await appointmentCollection.get();
            const appointmentList: Appointment[] = await Promise.all(appointmentSnapshot.docs.map(async doc => {
                const appointmentData = doc.data() as Appointment;
                const imageUrl = await storageRef.child(`documents/${appointmentData.index}`).getDownloadURL();
                return { ...appointmentData, id: doc.id, imageUrl, index: appointmentData.index ?? '' } as Appointment;
            }));
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

    const deleteAppoint = async (id: string, imageUrl: string) => {
        try {
            const db = firebase.firestore();
            const appointmentRef = db.collection('appointments').doc(id); // Main collection reference
            const imageRef = storageRef.child(`documents/${imageUrl}`);
          
            if (window.confirm('Are you sure you want to delete this pet?')) {
              // Delete the image from Firebase Storage
              await imageRef.delete();
        
              // Delete the pet document from the main collection
              await appointmentRef.delete();
        
              // Update the local state to remove the pet
              setAppointments(appointments.filter(appointments => appointments.id !== id));
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
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> Pet List
                                    </li>
                                </a>
                                <a href={`/${userID}/adminAppointments`}>
                                    <li className="aside_list-item active-list">
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
                            <IonCard className="countbox">
                                <strong>Pending Appointments:</strong> {pendingCount}
                            </IonCard>
                            <IonCard className="countbox1">
                                <strong>Confirmed Appointments:</strong> {confirmedCount}
                            </IonCard>
                            <IonCard className="countbox2">
                                <strong>Denied Appointments:</strong> {denyCount}
                            </IonCard>
                            {appointments.map((appointment, i) => (
                                <IonCard className='card2'>
                                    <IonCardContent>
                                        <img className="document_img2   " key={i} src={appointment.imageUrl} alt={appointment.index} /><br />
                                        Pet Name: {appointment.pet_name}<br />
                                        Appointed Date: {appointment.appoint_date}<br />
                                        Status: {appointment.status}<br />
                                        <IonButton color="light"><Link to={`/${userID}/selectStatus/${appointment.id}`}>View and Select Status</Link></IonButton>
                                        <IonButton color="danger" onClick={() => deleteAppoint(appointment.id, appointment.index)} > Delete </IonButton>
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