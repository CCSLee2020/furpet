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
            const petCollection = db.collection('users').doc(userID).collection('appointments').orderBy('index');
            const petSnapshot = await petCollection.get();
            const petList: Appointment[] = petSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Appointment);
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
            const appointmentRef = db.collection('appointments').doc(id); // Main collection reference
            const subAppointmentRef = db.collection('users').doc(userID).collection('appointments').doc(id); // Subcollection reference
            const imageRef = storageRef.child(`documents/${imageUrl}`);
          
            if (window.confirm('Are you sure you want to delete this appointment?')) {
              // Delete the image from Firebase Storage
              await imageRef.delete();
        
              // Delete the pet document from the subcollection
              await subAppointmentRef.delete();
        
              // Delete the pet document from the main collection
              await appointmentRef.delete();
        
              // Update the local state to remove the pet
              setAppointments(appointments.filter(appointments => appointments.id !== id));
            }
          } catch (error) {
            console.error('Error deleting pet:', error);
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
                                <a href="/"><p className="nav-dropdowntext">Log Out</p></a>
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
