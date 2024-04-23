import React, { useState } from 'react';
import './signup.css';
import { useIonToast, IonContent, IonPage, IonGrid, IonCol } from '@ionic/react';
import registerImage from '../assets/bbaebdf1499184fa6c34242ca25181bb 1.png';
import { registerUser } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';


const SignUp: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [present, dismiss] = useIonToast()
    const history = useHistory();
    

    async function register() {
        const res = await registerUser(username, password, role) // Modify this line
        if (res) {
            present("You have registered successfully!", 2000)
        }
        history.push('/login');
    }

    return (
        <IonPage>
            <IonContent>
                <div className="signup_box">
                    <div className="rectangle_box">
                        <h1 className="h1_signUp">Create an Account</h1>
                        <IonGrid className="signup_form">
                            <input className="input_signUp" type="text" placeholder="Username" />
                            <input className="input_signUp" type="email" placeholder="Email" onChange={(e: any) => setUsername(e.target.value)} />
                            <input className="input_signUp" type="password" placeholder="Password" onChange={(e: any) => setPassword(e.target.value)} />
                            <select className="input_signUp" onChange={(e: any) => setRole(e.target.value)}> {/* Add this line */}
                                <option value="">Select Role</option>
                                <option value="adopter">Adopter</option>
                                <option value="pet owner">Pet Owner</option>
                            </select>
                            <input onClick={register} className="submit_signUp" type="submit" value="SignUp" />
                            <p>have a account? <a href="/login">login</a></p>
                        </IonGrid>
                    </div>
                    <img className="image_SignUp" src={registerImage} />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SignUp;
