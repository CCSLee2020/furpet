import React, { useEffect, useState } from 'react';
import './style.css';
import { IonContent, IonPage } from '@ionic/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useParams } from 'react-router-dom';
import 'firebase/compat/storage';

type UserLog = {
    id: string;
    userID: string;
    activity: string;
    timestamp: firebase.firestore.Timestamp;
};

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
};

const AdminAppointments: React.FC = () => {

    const [isActive, setIsActive] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [userLogs, setUserLogs] = useState<UserLog[]>([]);
    const { userID } = useParams<{ userID: string }>();

    useEffect(() => {
        const fetchUsers = async () => {
            const db = firebase.firestore();
            const userData = await db.collection('users').get();
            setUsers(userData.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User));
        };

        const fetchUserLogs = async () => {
            const db = firebase.firestore();
            const logsData = await db.collection('userLogs')
                .orderBy('timestamp', 'asc')
                .get();
            setUserLogs(logsData.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp }) as UserLog));
        };

        fetchUsers();
        fetchUserLogs();
    }, []);

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    const getUniqueLogs = (logs: UserLog[]) => {
        const uniqueLogs = logs.filter((log) =>
            log.activity !== 'filterOut'
        );
        return uniqueLogs;
    };

    const uniqueUserLogs = getUniqueLogs(userLogs);

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
                                <h2>User Log</h2>
                            </div>
                            <div className="header_avatar"><i className="fas fa-user-circle fw fa-xl"></i></div>
                        </header>
                        <aside className={`aside ${isActive ? 'active' : ''}`}>
                            <div className="aside_close-icon">
                                <strong>×</strong>
                            </div>
                            <h2 className="menu_title"><i className="fas fa-paw fw"></i> FurPet</h2>
                            <ul className="aside_list">
                                <a href={`/${userID}/adminDashboard`}>
                                    <li className="aside_list-item">
                                        <i className="fas fa-users fw"></i> Dashboard
                                    </li>
                                </a>
                                <a href={`/${userID}/adminUsers`}>
                                    <li className="aside_list-item">
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
                                <a href={`/${userID}/userLog`}>
                                    <li className="aside_list-item active-list">
                                        <i className="fas fa-clipboard fw"></i> User Log
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
                            <div className="user-logs-grid">
                                <div className="grid-header">
                                    <div>Timestamp</div>
                                    <div>Activity</div>
                                    <div>User ID</div>
                                </div>
                                {uniqueUserLogs.map(log => (
                                    <div className="grid-row" key={log.id}>
                                        <div>{log.timestamp.toDate().toLocaleString()}</div>
                                        <div>{log.activity}</div>
                                        <div>{log.userID}</div>
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AdminAppointments;
