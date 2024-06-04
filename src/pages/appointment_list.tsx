import React, { useEffect, useState } from 'react';
import './rehome.css';
import { IonContent, IonPage } from '@ionic/react';
import Delete from '../assets/material-symbols_delete-outline.png';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
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

const LandingPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();

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

    return (
        <IonPage>
            <IonContent>
                <nav>
                    <div className="logo1">
                        <img className='navLogo1' src={navLogo} alt="" />
                        <h1 className="h1_logo1">FurPet</h1>
                    </div>
                    <div className="nav-links1">
                        <a href="/adopterHome">Home</a>
                        <a href="/adopterAdopt">Adopt</a>
                        <a href="/appointmentlist">Appointments</a>
                        <a href="/adopterPetIdentifier">Identify</a>
                        <a href="/login">Log Out</a>
                    </div>
                </nav>
                <div className="rehome">
                    <h1 className="rehome_h1">Appointment List</h1>
                    <div className="rehome_container">
                        {appointments.map((appointment, i) => (
                            <div key={appointment.id} className="appointment_outerbox">
                                <img className="document_img" key={i} src={appointment.imageUrl} alt={appointment.index} />
                                <div className="appointment_innerbox2">
                                    <h1 className="rehome_texth1">{appointment.pet_name}</h1>
                                    <h2 className="rehome_h2">Owner Name: {appointment.pet_caretaker}</h2>
                                    <h2 className="rehome_h2">Owner Number: {appointment.pet_number}</h2>
                                    <h2 className="rehome_h2">Owner Address: {appointment.pet_location}</h2>
                                    <h2 className="rehome_h2">Your Name: {appointment.appoint_name}</h2>
                                    <h2 className="rehome_h2">Your Number: {appointment.appoint_number}</h2>
                                    <h2 className="rehome_h2">Your Email: {appointment.appoint_email}</h2>
                                    <h2 className="rehome_h2">Status: {appointment.status}</h2>
                                </div>
                                <img className="deleteImg2" src={Delete} onClick={() => deleteAppoint(appointment.id, appointment.index)} />
                            </div>
                        ))}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
