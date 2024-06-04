import React, { useState, useEffect } from 'react';
import './style.css';
import { IonContent, IonPage, IonCard, IonCardContent, IonButton } from '@ionic/react';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

type User = {
    id: string;
    email: string;
    role: string;
};

const AdminHome: React.FC = () => {
    const [isActive, setIsActive] = useState(false); 
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const data = await db.collection('users').get();
            setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User));
        };
        fetchData();
    }, []);

    const deleteUser = async (id: string, email: string, role: string ) => {
        const db = firebase.firestore();
        const userRef = db.collection('users').doc(id);

        if (window.confirm('Are you sure you want to delete this user?')) {

            await userRef.delete();

            setUsers(users.filter(user => user.id !== id));
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
                                <h2>Users</h2>
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
                                    <li className="aside_list-item active-list">
                                        <i className="fas fa-users fw"></i> Users
                                    </li>
                                </a>
                                <a href="/adminPetList">
                                    <li className="aside_list-item">
                                        <i className="fas fa-clipboard fw"></i> Pet List
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
                            {users.map(user => (
                                <IonCard className='card' key={user.id}>
                                    <IonCardContent>
                                        Email: {user.email}<br/>
                                        Role: {user.role}<br/>
                                        <IonButton color="danger" onClick={() => deleteUser(user.id, user.email, user.role)} >Delete</IonButton>
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

export default AdminHome;
