import React, { useState } from 'react';
import './signup.css';
import { useIonToast, IonContent, IonPage, IonGrid } from '@ionic/react';
import registerImage from '../assets/bbaebdf1499184fa6c34242ca25181bb 1.png';
import { registerUser } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [q1, setQ1] = useState('')
    const [q2, setQ2] = useState('')
    const [q3, setQ3] = useState('')
    const [q4, setQ4] = useState('')
    const [q5, setQ5] = useState('')
    const [q6, setQ6] = useState('')
    const [q7, setQ7] = useState('')
    const [q8, setQ8] = useState('')
    const [q9, setQ9] = useState('')
    const [q10, setQ10] = useState('')
    const [q11, setQ11] = useState('')
    const [q12, setQ12] = useState('')
    const [q13, setQ13] = useState('')
    const [q14, setQ14] = useState('')
    const [q15, setQ15] = useState('')
    const [q16, setQ16] = useState('')
    const [q17, setQ17] = useState('')
    const [q18, setQ18] = useState('')
    const [q19, setQ19] = useState('')
    const [present, dismiss] = useIonToast()
    const history = useHistory();

    async function register() {
        const res = await registerUser(
            username,
            name,
            password,
            firstname,
            lastname,
            address,
            contactNumber,
            q1,
            q2,
            q3,
            q4,
            q5,
            q6,
            q7,
            q8,
            q9,
            q10,
            q11,
            q12,
            q13,
            q14,
            q15,
            q16,
            q17,
            q18,
            q19
        )
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
                            <input className="input_signUp" type="text" onChange={(e: any) => setName(e.target.value)} placeholder="Username" />
                            <input className="input_signUp" type="text" onChange={(e: any) => setFirstName(e.target.value)} placeholder="First Name" />
                            <input className="input_signUp" type="text" onChange={(e: any) => setLastName(e.target.value)} placeholder="Last Name" />
                            <input className="input_signUp" type="email" placeholder="Email" onChange={(e: any) => setUsername(e.target.value)} />
                            <input className="input_signUp" type="password" placeholder="Password" onChange={(e: any) => setPassword(e.target.value)} />
                            <input className="input_signUp" type="text" onChange={(e: any) => setAddress(e.target.value)} placeholder="Address" />
                            <input className="input_signUp" type="text" onChange={(e: any) => setContactNumber(e.target.value)} placeholder="Contact Number" />

                            <br /><br />Please Answer the Questions<br />
                            <p>1. Have you adopted a pet within the last year?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q1" value="Yes" checked={q1 === 'Yes'} onChange={(e) => setQ1(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q1" value="No" checked={q1 === 'No'} onChange={(e) => setQ1(e.target.value)} /> No
                                </label>
                            </div>

                            <p>2. Do you currently own a pet?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q2" value="Yes" checked={q2 === 'Yes'} onChange={(e) => setQ2(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q2" value="No" checked={q2 === 'No'} onChange={(e) => setQ2(e.target.value)} /> No
                                </label>
                            </div>

                            <p>3. Did you adopt your pet from a local shelter or rescue organization?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q3" value="Yes" checked={q3 === 'Yes'} onChange={(e) => setQ3(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q3" value="No" checked={q3 === 'No'} onChange={(e) => setQ3(e.target.value)} /> No
                                </label>
                            </div>

                            <p>4. Are you aware of the local pet adoption programs in your area?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q4" value="Yes" checked={q4 === 'Yes'} onChange={(e) => setQ4(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q4" value="No" checked={q4 === 'No'} onChange={(e) => setQ4(e.target.value)} /> No
                                </label>
                            </div>

                            <p>5. Have you ever participated in a pet adoption event?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q5" value="Yes" checked={q5 === 'Yes'} onChange={(e) => setQ5(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q5" value="No" checked={q5 === 'No'} onChange={(e) => setQ5(e.target.value)} /> No
                                </label>
                            </div>

                            <p>6. Do you think there are enough resources for pet owners in your community?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q6" value="Yes" checked={q6 === 'Yes'} onChange={(e) => setQ6(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q6" value="No" checked={q6 === 'No'} onChange={(e) => setQ6(e.target.value)} /> No
                                </label>
                            </div>

                            <p>7. Are you satisfied with the veterinary services available in your area?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q7" value="Yes" checked={q7 === 'Yes'} onChange={(e) => setQ7(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q7" value="No" checked={q7 === 'No'} onChange={(e) => setQ7(e.target.value)} /> No
                                </label>
                            </div>

                            <p>8. Do you believe adopting pets is better than buying from breeders or pet stores?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q8" value="Yes" checked={q8 === 'Yes'} onChange={(e) => setQ8(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q8" value="No" checked={q8 === 'No'} onChange={(e) => setQ8(e.target.value)} /> No
                                </label>
                            </div>

                            <p>9. Have you ever considered adopting a senior pet?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q9" value="Yes" checked={q9 === 'Yes'} onChange={(e) => setQ9(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q9" value="No" checked={q9 === 'No'} onChange={(e) => setQ9(e.target.value)} /> No
                                </label>
                            </div>

                            <p>10. Do you regularly take your pet to the veterinarian for check-ups?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q10" value="Yes" checked={q10 === 'Yes'} onChange={(e) => setQ10(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q10" value="No" checked={q10 === 'No'} onChange={(e) => setQ10(e.target.value)} /> No
                                </label>
                            </div>

                            <p>11. Do you think there is a stray animal problem in your community?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q11" value="Yes" checked={q11 === 'Yes'} onChange={(e) => setQ11(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q11" value="No" checked={q11 === 'No'} onChange={(e) => setQ11(e.target.value)} /> No
                                </label>
                            </div>

                            <p>12. Have you ever volunteered at an animal shelter or rescue organization?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q12" value="Yes" checked={q12 === 'Yes'} onChange={(e) => setQ12(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q12" value="No" checked={q12 === 'No'} onChange={(e) => setQ12(e.target.value)} /> No
                                </label>
                            </div>

                            <p>13. Do you support spaying and neutering pets to control the pet population?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q13" value="Yes" checked={q13 === 'Yes'} onChange={(e) => setQ13(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q13" value="No" checked={q13 === 'No'} onChange={(e) => setQ13(e.target.value)} /> No
                                </label>
                            </div>

                            <p>14. Have you ever had to rehome a pet?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q14" value="Yes" checked={q14 === 'Yes'} onChange={(e) => setQ14(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q14" value="No" checked={q14 === 'No'} onChange={(e) => setQ14(e.target.value)} /> No
                                </label>
                            </div>

                            <p>15. Do you provide your pet with regular vaccinations?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q15" value="Yes" checked={q15 === 'Yes'} onChange={(e) => setQ15(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q15" value="No" checked={q15 === 'No'} onChange={(e) => setQ15(e.target.value)} /> No
                                </label>
                            </div>

                            <p>16. Do you think owning a pet has improved your quality of life?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q16" value="Yes" checked={q16 === 'Yes'} onChange={(e) => setQ16(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q16" value="No" checked={q16 === 'No'} onChange={(e) => setQ16(e.target.value)} /> No
                                </label>
                            </div>

                            <p>17. Have you ever donated to an animal welfare organization?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q17" value="Yes" checked={q17 === 'Yes'} onChange={(e) => setQ17(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q17" value="No" checked={q17 === 'No'} onChange={(e) => setQ17(e.target.value)} /> No
                                </label>
                            </div>

                            <p>18. Do you believe pets should have access to outdoor spaces and exercise areas?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q18" value="Yes" checked={q18 === 'Yes'} onChange={(e) => setQ18(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q18" value="No" checked={q18 === 'No'} onChange={(e) => setQ18(e.target.value)} /> No
                                </label>
                            </div>

                            <p>19. Have you ever fostered a pet before adopting it permanently?</p>
                            <div className="AddUser_radio">
                                <label className="radioMargin_user">
                                    <input
                                        type="radio" name="q19" value="Yes" checked={q19 === 'Yes'} onChange={(e) => setQ19(e.target.value)} /> Yes
                                </label>
                                <label className="radioMargin_user">
                                    <input type="radio" name="q19" value="No" checked={q19 === 'No'} onChange={(e) => setQ19(e.target.value)} /> No
                                </label>
                            </div>

                            <input onClick={register} className="submit_signUp" type="submit" value="SignUp" />
                                <p>have a account? <a href="/login">login</a></p>
                        </IonGrid>
                    </div>
                    <img className="image_SignUp" src={registerImage} />
                </div>
            </IonContent>
        </IonPage>
    )
}

export default SignUp;
