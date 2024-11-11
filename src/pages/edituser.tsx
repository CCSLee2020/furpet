import React, { useState, useEffect } from 'react';
import './edituser.css';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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

    const validateForm = () => {
        const { firstname, lastname, name, contactNumber, address } = users || {};
        if (!firstname || !lastname || !name || !contactNumber || !address) {
          return false;
        }
        return true;
      };

    const handleUpdateAndSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill out all required fields, including selecting an image.');
            return;
          }

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
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top overflow-visible">
      <div className="container-fluid">
        {/* Logo and Name */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src={navLogo} alt="Logo" width="30" height="30" className="d-inline-block align-text-top" />
          <span className="ms-2">FurPet</span>
        </a>

        {/* Toggler for mobile view */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links and Dropdown */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-aligned links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
            <a
              href={`/${userID}/Home`}
              onClick={() => ("Navigated to Home")}
            >
              Home
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/Explore`}
              onClick={() => ("Navigated to Explore")}
            >
              Explore
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/appointmentlist`}
              onClick={() => ("Navigated to Appointments")}
            >
              Appointments
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/rehome`}
              onClick={() => ("Navigated to Rehome")}
            >
              Rehome
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/PetIdentifier`}
              onClick={() => ("Navigated to Identify")}
            >
              Identify
            </a>
            </li>
          </ul>

          {/* Right-aligned dropdown */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Profile
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href={`/${userID}/profile/${userID}`}
              onClick={() => ("Viewed Profile")}>Profile</a></li>
                <li><a className="dropdown-item" href={`/${userID}/myAppointments`}
              onClick={() => ("Viewed My Appointments")}>My Appointment</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/Welcome" onClick={() => ("Logged Out")}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

                <div className="AddPet1">
                    <div className="AddPetBox1">
                        <h1 className="UpdatePetH1">Update Profile</h1>
                        <form onSubmit={handleUpdateAndSubmit} className="UpdatePetform1">
                            <input type='text' className="AddPetForm_input1" placeholder="First Name" name="firstname" value={users.firstname} onChange={handleChange} />
                            <input type='text' className="AddPetForm_input1" placeholder="Last Name" name="lastname" value={users.lastname} onChange={handleChange} />
                            <input type='text' className="AddPetForm_input1" placeholder="Name" name="name" value={users.name} onChange={handleChange} />
                            <input className="AddPetForm_input1" type="text" placeholder="Contact Number" name="contactNumber" value={users.contactNumber} onChange={handleChange} />
                            <input className="AddPetForm_input1" type="text" placeholder="Address" name="address" value={users.address} onChange={handleChange} />

                            {/* Adding the questionnaire */}
                            <p className='QuestionUserUpdate'>1. Have you adopted a pet within the last year?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q1" value="Yes" checked={users.q1 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q1" value="No" checked={users.q1 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>2. Do you currently own a pet?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q2" value="Yes" checked={users.q2 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q2" value="No" checked={users.q2 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>3. Did you adopt your pet from a local shelter or rescue organization?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q3" value="Yes" checked={users.q3 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q3" value="No" checked={users.q3 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>4. Are you aware of the local pet adoption programs in your area?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q4" value="Yes" checked={users.q4 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q4" value="No" checked={users.q4 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>5. Have you ever participated in a pet adoption event?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q5" value="Yes" checked={users.q5 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q5" value="No" checked={users.q5 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>6. Do you think there are enough resources for pet owners in your community?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q6" value="Yes" checked={users.q6 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q6" value="No" checked={users.q6 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>7. Are you satisfied with the veterinary services available in your area?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q7" value="Yes" checked={users.q7 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q7" value="No" checked={users.q7 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>8. Do you believe adopting pets is better than buying from breeders or pet stores?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q8" value="Yes" checked={users.q8 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q8" value="No" checked={users.q8 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>9. Have you ever considered adopting a senior pet?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value="Yes" checked={users.q9 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q9" value="No" checked={users.q9 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>10. Do you regularly take your pet to the veterinarian for check-ups?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q10" value="Yes" checked={users.q10 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q10" value="No" checked={users.q10 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>11. Do you think there is a stray animal problem in your community?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q11" value="Yes" checked={users.q11 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q11" value="No" checked={users.q11 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>12. Have you ever volunteered at an animal shelter or rescue organization?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q12" value="Yes" checked={users.q12 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q12" value="No" checked={users.q12 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>13. Do you support spaying and neutering pets to control the pet population?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q13" value="Yes" checked={users.q13 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q13" value="No" checked={users.q13 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>14. Have you ever had to rehome a pet?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q14" value="Yes" checked={users.q14 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q14" value="No" checked={users.q14 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>15. Do you provide your pet with regular vaccinations?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q15" value="Yes" checked={users.q15 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q15" value="No" checked={users.q15 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>16. Do you think owning a pet has improved your quality of life?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q16" value="Yes" checked={users.q16 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q16" value="No" checked={users.q16 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>17. Have you ever donated to an animal welfare organization?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q17" value="Yes" checked={users.q17 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q17" value="No" checked={users.q17 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>18. Do you believe pets should have access to outdoor spaces and exercise areas?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q18" value="Yes" checked={users.q18 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q18" value="No" checked={users.q18 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <p className='QuestionUserUpdate'>19. Have you ever fostered a pet before adopting it permanently?</p>
                            <div className="AddUser_radio1">
                                <label className="radioMargin_user1">
                                    <input
                                        type="radio" name="q19" value="Yes" checked={users.q19 === 'Yes'} onChange={handleChange} /> Yes
                                </label>
                                <label className="radioMargin_user1">
                                    <input type="radio" name="q19" value="No" checked={users.q19 === 'No'} onChange={handleChange} /> No
                                </label>
                            </div>

                            <button className="AddPet_submit1" type="submit">Save Changes</button>
                        </form>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default UpdatePet;
