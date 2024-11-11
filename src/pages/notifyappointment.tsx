import React, { useEffect, useState } from 'react';
import './rehome.css';
import { IonContent, IonPage } from '@ionic/react';
import Delete from '../assets/material-symbols_delete-outline.png';
import edit from '../assets/Vector.png';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

type Appointment = {
    id: string;
    index: string;
    appoint_date: string;
    appoint_time: string;
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
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('users').doc(userID).get();
            const userData = { id: doc.id, ...doc.data() } as User;
            setUser(userData);
        };
        fetchData();
    }, [userID]);

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
                    .filter(appointment => appointment.appointmentPetOwnerID === userID);

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

    const logUserActivity = async (activity: string) => {
        const db = firebase.firestore();
        await db.collection('userLogs').add({
            userID,
            activity,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    };

    useEffect(() => {
        logUserActivity('filterOut');
    }, [userID]);

    return (
        <IonPage>
            <IonContent>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top overflow-visible">
      <div className="container-fluid">
        {/* Logo and Name */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src={navLogo} alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
          <span className="ms-2">FurPet</span>
        </a>

        {/* Toggler for mobile view */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links and Dropdown */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-aligned links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
            <a
              href={`/${userID}/Home`}
              onClick={() => logUserActivity("Navigated to Home")}
            >
              Home
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/Explore`}
              onClick={() => logUserActivity("Navigated to Explore")}
            >
              Explore
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/appointmentlist`}
              onClick={() => logUserActivity("Navigated to Appointments")}
            >
              Appointments
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/rehome`}
              onClick={() => logUserActivity("Navigated to Rehome")}
            >
              Rehome
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/PetIdentifier`}
              onClick={() => logUserActivity("Navigated to Identify")}
            >
              Identify
            </a>
            </li>
          </ul>

          {/* Right-aligned dropdown */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Profile
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href={`/${userID}/profile/${userID}`}
              onClick={() => logUserActivity("Viewed Profile")}>Profile</a></li>
                <li><a className="dropdown-item" href={`/${userID}/myAppointments`}
              onClick={() => logUserActivity("Viewed My Appointments")}>My Appointment</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/Welcome" onClick={() => logUserActivity("Logged Out")}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
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
                                    <h2 className="rehome_h2"><strong>Appointment Date:</strong> {appointment.appoint_date}</h2>
                                    <h2 className="rehome_h2">Appointment Time: {appointment.appoint_time}</h2>
                                    <h2 className="rehome_h2"><strong>Status:</strong> {appointment.status}</h2>
                                </div>
                                <Link className="edit1" to={`/${userID}/updateAppointment/${appointment.id}`}><img className="edit" src={edit} alt="edit" onClick={() => logUserActivity('Edit Appointment')} /></Link>
                                <img className="delete1" src={Delete} onClick={() => { deleteAppoint(appointment.id, appointment.index); logUserActivity('Delete Appoint') }} />
                            </div>
                        ))}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
