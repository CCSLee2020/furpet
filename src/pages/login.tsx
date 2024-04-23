import React, { useState } from 'react';
import './login.css';
import { IonContent, IonPage, IonGrid } from '@ionic/react';
import loginImage from '../assets/5c401a7abf8b11aeed9402034d1ae693 1.png';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/auth';
import 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../firebaseConfig'; // Import loginUser function

const LogIn: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const signIn = async () => {
        try {
            const role = await loginUser(email, password); // Fetch the role of the user

            switch (role) {
                case 'adopter':
                    history.push('/adopterHome');
                    break;
                case 'pet owner':
                    history.push('/petOwnerHome');
                    break;
                case 'admin':
                    history.push('/adminHome');
                    break;
                default:
                    if (window.confirm('Wrong Username or Password')) {
                        history.push('/login');
                    }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <IonPage>
            <IonContent>
                <div className="login_box">
                    <img className="image_Login" src={loginImage} />
                    <div className="rectangle_box">
                        <h1 className="h1_login">Login</h1>
                        <IonGrid className="login_form">
                            <input className="input_login" type="text" placeholder="Email" onChange={(e: any) => setEmail(e.target.value)} />
                            <input className="input_login" type="password" placeholder="Password" onChange={(e: any) => setPassword(e.target.value)} />
                            <a><input onClick={signIn} className="submit_login" type="submit" value="Login" /></a>
                            <p>need account? <a href="/signup">signup</a></p>
                        </IonGrid>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LogIn;
