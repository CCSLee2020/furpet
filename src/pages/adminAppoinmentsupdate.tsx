import React, { useEffect, useState } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

type Appointment = {
    id: string;
    appoint_name: string;
    appoint_number: string;
    appoint_email: string;
    appoint_address: string;
    appoint_date: string;
    pet_name: string;
    pet_caretaker: string;
    pet_location: string;
    pet_index: string;
    status: 'Pending' | 'Confirmed' | 'Deny';
};

const AdminAppointmentsUpdate: React.FC = () => {

    const history = useHistory();
    const [isActive, setIsActive] = useState(false);
    const { id } = useParams<{ id: string }>();
    const [appointment, setAppointment] = useState<Appointment>({
        id: '',
        appoint_name: '',
        appoint_number: '',
        appoint_email: '',
        appoint_address: '',
        appoint_date: '',
        pet_name: '',
        pet_caretaker: '',
        pet_location: '',
        pet_index: '',
        status: 'Pending'
    });

    useEffect(() => {
        const fetchAppointment = async () => {
            const db = firebase.firestore();
            const petDoc = await db.collection('appointment').doc(id).get();
            setAppointment(petDoc.data() as Appointment);
        };

        fetchAppointment();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
    };

    const handleUpdateAndSubmit = async (e: React.FormEvent, updatedAppointment: Appointment) => {
        e.preventDefault();

        const db = firebase.firestore();
        await db.collection('appointment').doc(id).set(updatedAppointment);

        history.push('/adminAppointments');
    };

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    if (!appointment) {
        return <div>Loading...</div>;
    }

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
                            <IonCard>
                                <IonCardContent className='card'>
                                    <form onSubmit={(e) => handleUpdateAndSubmit(e, appointment)}>
                                        Pet Name: {appointment.pet_name}<br />
                                        Owner Information: {appointment.appoint_name}<br />
                                        Address: {appointment.appoint_address}<br />
                                        Your Name: {appointment.appoint_name}<br />
                                        Your Number: {appointment.appoint_number}<br />
                                        Your Email: {appointment.appoint_email}<br />
                                        <label>
                                            Status:
                                            <select name="status" value={appointment.status} onChange={handleChange}>
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Deny">Deny</option>
                                            </select>
                                        </label><br/>
                                        <IonButton type="submit">Update Appointment</IonButton>
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

export default AdminAppointmentsUpdate;
