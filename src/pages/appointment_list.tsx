import React, { useEffect, useState } from 'react';
import './rehome.css';
import { IonContent, IonPage } from '@ionic/react';
import Delete from '../assets/material-symbols_delete-outline.png';
import view from '../assets/Vector1.png';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useParams, Link } from 'react-router-dom';

type Appointment = {
    id: string;
    index: string;
    appoint_date: string;
    pet_name: string;
    pet_index: string;
    imageUrl: string;
    status: string;
    appointmentPetOwnerID: string;
    appointmentOwnerID: string;
};

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
    name: string;
};

const LandingPage: React.FC = () => {
    const { userID } = useParams<{ userID: string }>();

    console.log("Extracted userID:", userID); // Debugging line

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();
    const [users, setUsers] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('users').doc(userID).get();
            const user = { id: doc.id, ...doc.data() } as User;
            setUsers(user);
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
        const fetchPets = async () => {
            try {
                const db = firebase.firestore();
                const appointmentCollection = db.collection('appointments').orderBy('index');
                const appointmentSnapshot = await appointmentCollection.get();
                const petList: Appointment[] = appointmentSnapshot.docs
                    .map(doc => ({ ...doc.data(), id: doc.id }) as Appointment)
                    .filter(appointment => appointment.appointmentOwnerID === userID);
                    
                setAppointments(petList);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        if (userID) {
            fetchPets();
        }
    }, [userID]);

    const deleteAppoint = async (id: string, imageUrl: string) => {
        try {
            const db = firebase.firestore();
            const appointment = appointments.find(appointment => appointment.id === id);
            
            if (!appointment) {
                throw new Error("Appointment not found");
            }
    
            const appointmentRef = db.collection('appointments').doc(id); // Main collection reference
            const imageRef = storageRef.child(`documents/${imageUrl}`);
            
            if (window.confirm('Are you sure you want to delete this appointment?')) {
                // Delete the image from Firebase Storage
                await imageRef.delete();
            
                // Delete the pet document from the main collection
                await appointmentRef.delete();
            
                // Update the local state to remove the pet
                setAppointments(appointments.filter(appointment => appointment.id !== id));
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
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
                        <a href={`/${userID}/Home`}>Home</a>
                        <a href={`/${userID}/Explore`}>Explore</a>
                        <a href={`/${userID}/appointmentlist`}>Appointments</a>
                        <a href={`/${userID}/rehome`}>Rehome</a>
                        <a href={`/${userID}/PetIdentifier`}>Identify</a>
                        <label></label>
                        {users && (
                            <button onClick={toggleMenu} className="nav-dropdown-btn">{users.name}</button>
                        )}
                        {menuOpen && (
                            <div className="nav-dropdown-menu">
                                <a href={`/${userID}/profile/${userID}`}><p className="nav-dropdowntext">View Profile</p></a>
                                <a href={`/${userID}/myAppointments`}><p className="nav-dropdowntext">My Appointments</p></a>
                                <a href="/Menu"><p className="nav-dropdowntext">Log Out</p></a>
                            </div>
                        )}
                    </div>
                </nav>
                <div className="rehome">
                    <h1 className="rehome_h1">My Appointments</h1>
                    <div className="rehome_container">
                        {appointments.map((appointment, i) => (
                            <div key={appointment.id} className="appointment_outerbox">
                                <img className="document_img" key={i} src={appointment.imageUrl} alt={appointment.index} />
                                <div className="appointment_innerbox2">
                                    <h1 className="rehome_texth1">{appointment.pet_name}</h1>
                                    <h2 className="rehome_h2">Appointment Date: {appointment.appoint_date}</h2>
                                    <h2 className="rehome_h2">Status: {appointment.status}</h2>
                                </div>
                                <Link className="edit1" to={`/${userID}/viewAppointment/${appointment.id}`}><img className="edit" src={view} alt="edit" /></Link>
                                <img className="delete1" src={Delete} onClick={() => deleteAppoint(appointment.id, appointment.index)} />
                            </div>
                        ))}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
