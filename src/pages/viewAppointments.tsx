import React, { useState, useEffect } from 'react';
import './addpet.css';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';


type Appointment = {
    appoint_date: string;
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
                        <a href={`/${userID}/Adopt`}>Adopt</a>
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
                <div className="AppointmentDetails1">
                    <div className="AppointmentDetailsBox1">
                        <form>
                            <h1 className="AppointmentDetailsH1_1">Appointment Details</h1>
                            <div className="UpdateAppointmentform1">
                                <p className="AppointmentDetailsText1">Pet Name: {appointment?.pet_name}<br /></p>
                                <p className="AppointmentDetailsText1">Owner Information: {`${petOwnerUsers?.firstname} ${petOwnerUsers?.lastname}`}<br /></p>
                                <p className="AppointmentDetailsText1">Address: {petOwnerUsers?.address}<br /></p>
                                <p className="AppointmentDetailsText1">Your Name: {`${ownerUsers?.firstname} ${ownerUsers?.lastname}`}<br /></p>
                                <p className="AppointmentDetailsText1">Your Number: {ownerUsers?.contactNumber}<br /></p>
                                <p className="AppointmentDetailsText1">Your Email: {ownerUsers?.email}<br /></p>
                                <p className="AppointmentDetailsText1">Status: {appointment?.status}<br /><br /><br /></p>
                                <h2>Question and Answer</h2><br />
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
    <>Do you own your home?<br /></>,
    <>If renting, do you have permission from your landlord to have pets?<br /></>,
    <>Are there children in your household?<br /></>,
    <>Do you have other pets at home?<br /></>,
    <>Do you have other pets at home?<br /></>,
    <>Are you familiar with the specific needs of the chosen pet type/breed?<br /></>,
    <>Do you have a stable daily routine?<br /></>,
    <>Are you away from home for long periods during the day?<br /></>,
    <>Can you afford the costs associated with pet ownership, including food, veterinary care,<br />and unexpected expenses?<br /></>,
    <>Do you have a regular veterinarian?<br /></>,
    <>Are you willing to provide regular veterinary care, including vaccinations<br />and routine check-ups?<br /></>,
    <>Are you willing to attend training classes if necessary?<br /></>,
    <>Do you have experience in training pets?<br /></>,
    <>Will the pet primarily be kept indoors?<br /></>,
    <>Do you have a secure, fenced yard?<br /></>,
    <>Do you have a plan for emergencies or unforeseen circumstances?<br /></>,
    <>Are you willing to spay/neuter your pet if it is not already done?<br /></>,
    <>Can you provide personal or veterinarian references?<br /></>,
    <>Are you willing to allow a representative from the pet owner to conduct a home visit?<br /></>
];

export default UpdatePet;
