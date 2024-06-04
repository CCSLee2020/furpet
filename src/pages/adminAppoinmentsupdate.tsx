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
        status: 'Pending',
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
        q7: "",
        q8: "",
        q9: "",
        q10: "",
        q11: "",
        q12: "",
        q13: "",
        q14: "",
        q15: "",
        q16: "",
        q17: "",
        q18: "",
        q19: ""
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
                                <a href="/adminPetList">
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> Pet List
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
                                        </label><br />
                                        <IonButton type="submit">Update Appointment</IonButton><br /><br />

                                        <strong>Question and Answer</strong><br />
                                        1. Do you own your home? <p style={{ color: 'blue' }}>{appointment.q1}</p><br />
                                        2. If renting, do you have permission from your landlord to have pets? <p style={{ color: 'blue' }}>{appointment.q2}</p><br />
                                        3. Are there children in your household? <p style={{ color: 'blue' }}>{appointment.q3}</p><br />
                                        4. Do you have other pets at home? <p style={{ color: 'blue' }}>{appointment.q4}</p><br />
                                        5. Do you have other pets at home? <p style={{ color: 'blue' }}>{appointment.q5}</p><br />
                                        6. Are you familiar with the specific needs of the chosen pet type/breed? <p style={{ color: 'blue' }}>{appointment.q6}</p><br />
                                        7. Do you have a stable daily routine? <p style={{ color: 'blue' }}>{appointment.q7}</p><br />
                                        8. Are you away from home for long periods during the day? <p style={{ color: 'blue' }}>{appointment.q8}</p><br />
                                        9. Can you afford the costs associated with pet ownership, including food, veterinary care, and unexpected expenses? <p style={{ color: 'blue' }}>{appointment.q9}</p><br />
                                        10. Do you have a regular veterinarian? <p style={{ color: 'blue' }}>{appointment.q10}</p><br />
                                        11. Are you willing to provide regular veterinary care, including vaccinations and routine check-ups? <p style={{ color: 'blue' }}>{appointment.q11}</p><br />
                                        12. Are you willing to attend training classes if necessary? <p style={{ color: 'blue' }}>{appointment.q12}</p><br />
                                        13. Do you have experience in training pets? <p style={{ color: 'blue' }}>{appointment.q13}</p><br />
                                        14. Will the pet primarily be kept indoors? <p style={{ color: 'blue' }}>{appointment.q14}</p><br />
                                        15. Do you have a secure, fenced yard? <p style={{ color: 'blue' }}>{appointment.q15}</p><br />
                                        16. Do you have a plan for emergencies or unforeseen circumstances? <p style={{ color: 'blue' }}>{appointment.q16}</p><br />
                                        17. Are you willing to spay/neuter your pet if it is not already done? <p style={{ color: 'blue' }}>{appointment.q17}</p><br />
                                        18. Can you provide personal or veterinarian references? <p style={{ color: 'blue' }}>{appointment.q18}</p><br />
                                        19. Are you willing to allow a representative from the pet owner to conduct a home visit? <p style={{ color: 'blue' }}>{appointment.q19}</p><br />

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
