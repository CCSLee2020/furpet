import React, { useState, useEffect } from 'react';
import './addpet.css';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';

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
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('users').doc(userID).get();
            const user = { id: doc.id, ...doc.data() } as User;
            setUsers(user);
        };
        fetchData();
    }, [userID]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (users) {
            setUsers({ ...users, [e.target.name]: e.target.value });
        }
    };

    const handleUpdateAndSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!users) return;

        const db = firebase.firestore();
        await db.collection('users').doc(userID).set(users);

        history.push(`/${userID}/profile/${userID}`);
    };

    if (!users) {
        return <div>Loading...</div>;
    }

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
                <div className="AddPet1">
                    <div className="AddPetBox1">
                        <h1 className="AddPetBoxH1">Update Profile</h1>
                        <form onSubmit={handleUpdateAndSubmit} className="UpdatePetform1">
                            <input type='text' className="AddPetForm_input1" placeholder="First Name" name="firstname" value={users.firstname} onChange={handleChange} />
                            <input type='text' className="AddPetForm_input1" placeholder="Last Name" name="lastname" value={users.lastname} onChange={handleChange} />
                            <input type='text' className="AddPetForm_input1" placeholder="Name" name="name" value={users.name} onChange={handleChange} />
                            <input className="AddPetForm_input1" type="text" placeholder="Contact Number" name="contactNumber" value={users.contactNumber} onChange={handleChange} />
                            <input className="AddPetForm_input1" type="text" placeholder="Address" name="address" value={users.address} onChange={handleChange} />

                            {/* Adding the questionnaire */}
                            <p className='QuestionUserUpdate'>1. Do you own your home?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q1" value="Yes" checked={users.q1 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q1" value="No" checked={users.q1 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>2. If renting, do you have permission from your landlord to have pets?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q2" value="Yes" checked={users.q2 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q2" value="No" checked={users.q2 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>3. Are there children in your household?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q3" value="Yes" checked={users.q3 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q3" value="No" checked={users.q3 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>4. Do you have other pets at home?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q4" value="Yes" checked={users.q4 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q4" value="No" checked={users.q4 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>5. Have you owned a pet before?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q5" value="Yes" checked={users.q5 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q5" value="No" checked={users.q5 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>6. Are you familiar with the specific needs of the chosen pet type/breed?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q6" value="Yes" checked={users.q6 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q6" value="No" checked={users.q6 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>7. Do you have a stable daily routine?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q7" value="Yes" checked={users.q7 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q7" value="No" checked={users.q7 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>8. Are you financially prepared for pet ownership?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q8" value="Yes" checked={users.q8 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q8" value="No" checked={users.q8 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>9. Do you have a fenced yard?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value="Yes" checked={users.q9 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value="No" checked={users.q9 === 'No'} onChange={handleChange} /> No
                                </label>
                                {/* <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value="<1 hour" checked={users.q9 === '<1 hour'} onChange={handleChange} /> Less than 1 hour
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value="1-2 hours" checked={users.q9 === '1-2 hours'} onChange={handleChange} /> 1-2 hours
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value="3-4 hours" checked={users.q9 === '3-4 hours'} onChange={handleChange} /> 3-4 hours
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value=">4 hours" checked={users.q9 === '>4 hours'} onChange={handleChange} /> More than 4 hours
                                </label> */}
                            </div>

                            <p className='QuestionUserUpdate'>10. Are you willing to spend on pet training if needed?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q10" value="Yes" checked={users.q10 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q10" value="No" checked={users.q10 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>11. Do you have any pet-related allergies?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q11" value="Yes" checked={users.q11 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q11" value="No" checked={users.q11 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>12. Are you prepared for the long-term commitment of pet ownership?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q12" value="Yes" checked={users.q12 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q12" value="No" checked={users.q12 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>13. Are you aware of the time commitment for pet grooming?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q13" value="Yes" checked={users.q13 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q13" value="No" checked={users.q13 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>14. Are you willing to provide a balanced diet for your pet?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q14" value="Yes" checked={users.q14 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q14" value="No" checked={users.q14 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>15. Are you aware of the importance of regular vet check-ups?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q15" value="Yes" checked={users.q15 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q15" value="No" checked={users.q15 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>16. Are you prepared for potential behavioral issues?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q16" value="Yes" checked={users.q16 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q16" value="No" checked={users.q16 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>17. Are you committed to ensuring your pet gets enough exercise?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q17" value="Yes" checked={users.q17 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q17" value="No" checked={users.q17 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>18. Are you willing to invest time in pet training?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q18" value="Yes" checked={users.q18 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q18" value="No" checked={users.q18 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>19. Do you have a plan for your pet if you travel or face an emergency?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q19" value="Yes" checked={users.q19 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q19" value="No" checked={users.q19 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <button className="AddPet_submit1" type="submit">Save</button>
                        </form>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default UpdatePet;
