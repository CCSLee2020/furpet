import React, { useEffect, useState } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

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

const AdminAppointmentsUpdate: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const history = useHistory();
    const { id, userID } = useParams<{ id: string, userID: string }>();
    const [users, setUsers] = useState<User | null>(null);
    const [petOwnerUsers, setPetOwnerUsers] = useState<User | null>(null);
    const [ownerUsers, setOwnerUsers] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [appointment, setAppointment] = useState<Appointment | null>(null);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (appointment) {
            setAppointment({ ...appointment, [e.target.name]: e.target.value });
        }
    };

    const handleUpdateAndSubmit = async (e: React.FormEvent, updatedAppointment: Appointment) => {
        e.preventDefault();

        if (!appointment) return;  // Add this line to ensure appointment is not null

        const db = firebase.firestore();
        await db.collection('appointments').doc(id).set(updatedAppointment);
        await db.collection('users').doc(`${appointment?.appointmentOwnerID}`).collection('appointments').doc(id).set(updatedAppointment);

        history.push(`${userID}/adminAppointments`);
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
                                <a href={`/${userID}/adminHome`}>
                                    <li className="aside_list-item active-list">
                                        <i className="fas fa-users fw"></i> Users
                                    </li>
                                </a>
                                <a href={`/${userID}/adminPetList`}>
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> Pet List
                                    </li>
                                </a>
                                <a href={`/${userID}/adminAppointments`}>
                                    <li className="aside_list-item">
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
                            <IonCard>
                                <IonCardContent className='card'>
                                    <form onSubmit={(e) => appointment && handleUpdateAndSubmit(e, appointment)}>
                                        Pet Name: {appointment?.pet_name}<br />
                                        Owner Information: {`${petOwnerUsers?.firstname} ${petOwnerUsers?.lastname}`}<br />
                                        Address: {petOwnerUsers?.address}<br />
                                        Your Name: {`${ownerUsers?.firstname} ${ownerUsers?.lastname}`}<br />
                                        Your Number: {ownerUsers?.contactNumber}<br />
                                        Your Email: {ownerUsers?.email}<br />
                                        <label>
                                            Status:<br />
                                            <select name="status" value={appointment?.status} onChange={handleChange}>
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Deny">Deny</option>
                                            </select>
                                        </label><br /><br />
                                        <IonButton type="submit">Save Appointment</IonButton><br /><br /><br />
                                        <h2>Question and Answer</h2><br />
                                        {ownerUsers && Object.keys(ownerUsers).filter(key => key.startsWith('q')).map((key, index) => (
                                            <p key={key}>
                                                {index + 1}. {questionTexts[index]} <p style={{ color: 'blue' }}>{(ownerUsers as any)[key]}</p><br />
                                            </p>
                                        ))}
                                    </form>
                                </IonCardContent>
                            </IonCard>
                        </main>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

const questionTexts = [
    "Do you own your home?",
    "If renting, do you have permission from your landlord to have pets?",
    "Are there children in your household?",
    "Do you have other pets at home?",
    "Do you have other pets at home?",
    "Are you familiar with the specific needs of the chosen pet type/breed?",
    "Do you have a stable daily routine?",
    "Are you away from home for long periods during the day?",
    "Can you afford the costs associated with pet ownership, including food, veterinary care, and unexpected expenses?",
    "Do you have a regular veterinarian?",
    "Are you willing to provide regular veterinary care, including vaccinations and routine check-ups?",
    "Are you willing to attend training classes if necessary?",
    "Do you have experience in training pets?",
    "Will the pet primarily be kept indoors?",
    "Do you have a secure, fenced yard?",
    "Do you have a plan for emergencies or unforeseen circumstances?",
    "Are you willing to spay/neuter your pet if it is not already done?",
    "Can you provide personal or veterinarian references?",
    "Are you willing to allow a representative from the pet owner to conduct a home visit?"
];

export default AdminAppointmentsUpdate;
