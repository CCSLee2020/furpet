import React, { useEffect, useState } from 'react';
import './adoptme.css';
import { IonContent, IonPage } from '@ionic/react';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import { useParams, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
    name: string;
    firstname: string;
    lastname: string;
    address: string;
    contactNumber: string;
};

const LandingPage: React.FC = () => {
    const [users, setUsers] = useState<User | null>(null);
    const { userID } = useParams<{ userID: string }>();
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


                <div className="details">
                    <>
                        <div className="details_textSquare2">
                            <h1 className="details_h1_1"> Profile</h1>
                            <h2 className="details_h2_1"><b>Name:</b> {users?.firstname} {users?.lastname}</h2>
                            <h2 className="details_h2_1"><b>Username:</b> {users?.name}</h2>
                            <h2 className="details_h2_1"><b>Contact Number:</b> {users?.contactNumber}</h2>
                            <h2 className="details_h2_1"><b>Address:</b> {users?.address}</h2>
                            <Link to={`${userID}/edit/${userID}`}><div className="edit_user" onClick={() => logUserActivity('Edit Profile')}><p className="edit_user2">Edit Profile</p></div></Link>
                        </div>
                    </>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
