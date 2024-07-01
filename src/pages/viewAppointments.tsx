import React, { useState, useEffect } from 'react';
import './addpet.css';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';


type Appointment = {
    appoint_date: string;
    appoint_time: string;
    pet_name: string;
    pet_index: string;
    status: string;
    index: string;
    imageUrl: string;
    appointmentPetOwnerID: string;
    appointmentOwnerID: string;
};

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
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
    q9: string;
    q10: string;
    q11: string;
    q12: string;
    q13: string;
    q14: string;
    q15: string;
    q16: string;
    q17: string;
    q18: string;
    q19: string;
};

const UpdatePet: React.FC = () => {
    const history = useHistory();
    const { id, userID } = useParams<{ id: string, userID: string }>();
    const [users, setUsers] = useState<User | null>(null);
    const [petOwnerUsers, setPetOwnerUsers] = useState<User | null>(null);
    const [ownerUsers, setOwnerUsers] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [appointment, setAppointment] = useState<Appointment | null>(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const fetchAppointment = async () => {
            const db = firebase.firestore();
            const petDoc = await db.collection('appointments').doc(id).get();
            console.log('Fetched appointment data:', petDoc.data());
            setAppointment(petDoc.data() as Appointment);
        };

        fetchAppointment();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('users').doc(userID).get();
            const user = { id: doc.id, ...doc.data() } as User;
            console.log('Fetched user data:', user);
            setUsers(user);
        };
        fetchData();
    }, [userID]);

    useEffect(() => {
        if (appointment) {
            const fetchPetOwnerData = async () => {
                const db = firebase.firestore();
                const doc = await db.collection('users').doc(appointment.appointmentPetOwnerID).get();
                const petOwnerUsers = { id: doc.id, ...doc.data() } as User;
                console.log('Fetched pet owner data:', petOwnerUsers);
                setPetOwnerUsers(petOwnerUsers);
            };
            fetchPetOwnerData();
        }
    }, [appointment]);

    useEffect(() => {
        if (appointment) {
            const fetchOwnerData = async () => {
                const db = firebase.firestore();
                const doc = await db.collection('users').doc(appointment.appointmentOwnerID).get();
                const ownerUsers = { id: doc.id, ...doc.data() } as User;
                console.log('Fetched owner data:', ownerUsers);
                setOwnerUsers(ownerUsers);
            };
            fetchOwnerData();
        }
    }, [appointment]);

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
                <nav>
                    <div className="logo1">
                        <img className='navLogo1' src={navLogo} alt="" />
                        <h1 className="h1_logo1">FurPet</h1>
                    </div>
                    <div className="nav-links1">
                        <a href={`/${userID}/Home`} onClick={() => logUserActivity('Navigated to Home')}>Home</a>
                        <a href={`/${userID}/Explore`} onClick={() => logUserActivity('Navigated to Explore')}>Explore</a>
                        <a href={`/${userID}/appointmentlist`} onClick={() => logUserActivity('Navigated to Appointments')}>Appointments</a>
                        <a href={`/${userID}/rehome`} onClick={() => logUserActivity('Navigated to Rehome')}>Rehome</a>
                        <a href={`/${userID}/PetIdentifier`} onClick={() => logUserActivity('Navigated to Identify')}>Identify</a>
                        <label></label>
                        {users && (
                            <button onClick={toggleMenu} className="nav-dropdown-btn">{users.name}</button>
                        )}
                        
                    </div>
                </nav>
                {menuOpen && (
                            <div className="nav-dropdown-menu">
                                <a href={`/${userID}/profile/${userID}`} onClick={() => logUserActivity('Viewed Profile')}><p className="nav-dropdowntext">View Profile</p></a>
                                <a href={`/${userID}/myAppointments`} onClick={() => logUserActivity('Viewed My Appointments')}><p className="nav-dropdowntext">My Appointments</p></a>
                                <a href="/Menu" onClick={() => logUserActivity('Logged Out')}><p className="nav-dropdowntext">Log Out</p></a>
                            </div>
                        )}
                <div className="AppointmentDetails1">
                    <div className="AppointmentDetailsBox1">
                        <form>
                            <h1 className="AppointmentDetailsH1_1">Appointment Details</h1>
                            <div className="UpdateAppointmentform1">
                                <p className="AppointmentDetailsText1"><strong>Pet Name:</strong> {appointment?.pet_name}<br /></p>
                                <p className="AppointmentDetailsText1"><strong>Date & Time:</strong> {appointment?.appoint_date} <strong>|</strong> {appointment?.appoint_time}<br /></p>
                                <p className="AppointmentDetailsText1"><strong>Owner:</strong> {`${petOwnerUsers?.firstname} ${petOwnerUsers?.lastname}`}<br /></p>
                                <p className="AppointmentDetailsText1"><strong>Address:</strong> {petOwnerUsers?.address}<br /></p>
                                <p className="AppointmentDetailsText1"><strong>Your Name:</strong> {`${ownerUsers?.firstname} ${ownerUsers?.lastname}`}<br /></p>
                                <p className="AppointmentDetailsText1"><strong>Your Number:</strong> {ownerUsers?.contactNumber}<br /></p>
                                <p className="AppointmentDetailsText1"><strong>Your Email:</strong> {ownerUsers?.email}<br /></p>
                                <p className="AppointmentDetailsText1"><strong>Status:</strong> {appointment?.status}<br /><br /><br /></p>
                                <h2>My Questions and Answers</h2><br />
                                {ownerUsers && Object.keys(ownerUsers).filter(key => key.startsWith('q')).map((key, index) => (
                                    <p className="AppointmentDetailsText1" key={key}>
                                        {index + 1}. {questionTexts[index]} <p style={{ color: 'blue' }}>{(ownerUsers as any)[key]}</p><br />
                                    </p>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

const questionTexts = [
    <>Have you adopted a pet within the last year?<br /></>,
    <>Do you currently own a pet?<br /></>,
    <>Did you adopt your pet from a local shelter or rescue organization?<br /></>,
    <>Are you aware of the local pet adoption programs in your area?<br /></>,
    <>Have you ever participated in a pet adoption event?<br /></>,
    <>Do you think there are enough resources for pet owners in your community?<br /></>,
    <>Are you satisfied with the veterinary services available in your area?<br /></>,
    <>Do you believe adopting pets is better than buying from breeders or pet stores?<br /></>,
    <>Have you ever considered adopting a senior pet?<br /></>,
    <>Do you regularly take your pet to the veterinarian for check-ups?<br /></>,
    <>Do you think there is a stray animal problem in your community?<br /></>,
    <>Have you ever volunteered at an animal shelter or rescue organization?<br /></>,
    <>Do you support spaying and neutering pets to control the pet population?<br /></>,
    <>Have you ever had to rehome a pet?<br /></>,
    <>Do you provide your pet with regular vaccinations?<br /></>,
    <>Do you think owning a pet has improved your quality of life?<br /></>,
    <>Have you ever donated to an animal welfare organization?<br /></>,
    <>Do you believe pets should have access to outdoor spaces and exercise areas?<br /></>,
    <>Have you ever fostered a pet before adopting it permanently?<br /></>
];;

export default UpdatePet;
