import React, { useEffect, useState } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import edit from '../assets/Vector.png';
import Delete from '../assets/material-symbols_delete-outline.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Link } from 'react-router-dom';
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
    pet_location: string;
    pet_index: string;
    imageUrl: string;
    status: string;
};

const AdminAppointments: React.FC = () => {

    const [isActive, setIsActive] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

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
            const appointmentCollection = db.collection('appointment').orderBy('index');
            const appointmentSnapshot = await appointmentCollection.get();
            const appointmentList: Appointment[] = await Promise.all(appointmentSnapshot.docs.map(async doc => {
                const appointmentData = doc.data() as Appointment;
                const imageUrl = await storageRef.child(`documents/${appointmentData.index}`).getDownloadURL();
                return { ...appointmentData, id: doc.id, imageUrl, index: appointmentData.index ?? '' } as Appointment;
            }));
            setAppointments(appointmentList);
        };

        fetchAppointment();
    }, []);

    const deleteAppoint = async (id: string, index: string) => {
        const db = firebase.firestore();
        const appointmentRef = db.collection('appointment').doc(id);
        const storage = firebase.storage();
        const imageRef = storage.ref().child(`documents/${index}`);

        if (window.confirm('Are you sure you want to delete this appointment?')) {
            imageRef.delete().then(() => {
                console.log('Image deleted from Firebase Storage.');
            }).catch((error) => {
                console.error('Error deleting image from Firebase Storage:', error);
            });

            await appointmentRef.delete();

            setAppointments(appointments.filter(appointment => appointment.id !== id));
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
                                <h2>Appointments</h2>
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
                                <a href="/adminAppointments">
                                    <li className="aside_list-item active-list">
                                        <i className="fas fa-clipboard fw"></i> Appointments
                                    </li>
                                </a>
                                <a href="/petIdentifier">
                                    <li className="aside_list-item">
                                        <i className="fas fa-search fw"></i> Identify Breeds
                                    </li>
                                </a>
                                <a href="/adminQnA">
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> QnA
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
                            {appointments.map((appointment, i) => (
                                <IonCard className='card'>
                                    <IonCardContent>
                                        <img className="document_img2   " key={i} src={appointment.imageUrl} alt={appointment.index} /><br />
                                        Pet Name: {appointment.pet_name}<br />
                                        Owner Information: {appointment.appoint_name}<br />
                                        Address: {appointment.appoint_address}<br />
                                        Your Name: {appointment.appoint_name}<br />
                                        Your Number: {appointment.appoint_number}<br />
                                        Your Email: {appointment.appoint_email}<br />
                                        Status: {appointment.status}<br />
                                        <IonButton color="light"><Link to={`/selectStatus/${appointment.id}`}>Select Status</Link></IonButton>
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
