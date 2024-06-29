import React, { useEffect, useState } from 'react';
import './adoptme.css';
import { IonContent, IonPage } from '@ionic/react';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import { useParams, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

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
                <div className="details">
                    <>
                        <div className="details_textSquare2">
                            <h1 className="details_h1_1"> Profile</h1>
                            <h2 className="details_h2_1"><b>Name:</b> {users?.firstname} {users?.lastname}</h2>
                            <h2 className="details_h2_1"><b>Nickname:</b> {users?.name}</h2>
                            <h2 className="details_h2_1"><b>Contact Number:</b> {users?.contactNumber}</h2>
                            <h2 className="details_h2_1"><b>Address:</b> {users?.address}</h2>
                            <Link to={`${userID}/edit/${userID}`}><div className="details_appointment_1"><p className="details_appointment4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Edit User</p></div></Link>
                        </div>
                        <div className="space2"></div>
                    </>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
