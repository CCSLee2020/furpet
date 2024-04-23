import React, { useState, useEffect } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { Link } from 'react-router-dom';

type QnA = {
    id: string;
    pet_name: string;
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
};

const AdminQnA: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [qna, setQnA] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const data = await db.collection('QnA').get();
            setQnA(data.docs.map(doc => ({ ...doc.data(), id: doc.id }) as QnA));
        };
        fetchData();
    }, []);

    const deleteQnA = async (
        id: string
    ) => {
        const db = firebase.firestore();
        const userRef = db.collection('QnA').doc(id);

        if (window.confirm('Are you sure you want to delete this qna?')) {

            await userRef.delete();

            setQnA(qna.filter(qna => qna.id !== id));
        }
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
                                <h2>QnA</h2>
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
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> Appointments
                                    </li>
                                </a>
                                <a href="/petIdentifier">
                                    <li className="aside_list-item">
                                        <i className="fas fa-search fw"></i> Identify Breeds
                                    </li>
                                </a>
                                <a href="/adminQnA">
                                    <li className="aside_list-item active-list">
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
                            {qna.map(qna => (
                                <IonCard className='card' key={qna.id}>
                                    <IonCardContent>
                                        Pet Name: {qna.pet_name}<br />
                                        <IonButton color="light"><Link to={`/adminQnAView/${qna.id}`}>View</Link></IonButton>
                                        <IonButton color="danger" onClick={() => deleteQnA(
                                            qna.id
                                        )} >Delete</IonButton>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                        </main>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AdminQnA;
