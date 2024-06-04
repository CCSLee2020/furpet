import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './appointment.css';
import { IonContent, IonPage } from '@ionic/react';
import { collection, addDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { storage } from '../firebaseConfig';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';

type Pet = {
    id: string;
    index: number;
    name: string;
    caretakerInfo: string;
    caretakerNumber: string;
    imageUrl: string;
    location: string;
};

type Appointment = {
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
    appoint_name: string;
    appoint_number: string;
    appoint_email: string;
    appoint_address: string;
    appoint_date: string;
    pet_name: string | null;
    pet_caretaker: string | null;
    pet_number: string | null;
    pet_location: string | null;
    pet_index: string | null;
    status: string;
    index: string;
    imageUrl: string,
};

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateUniqueFirestoreId(): string {
    let autoId = '';
    for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
}

var db = firebase.firestore();

const LandingPage: React.FC = () => {

    const history = useHistory();
    const [pet, setPet] = useState<Pet | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const { id } = useParams<{ id: string }>();
    const [appointment, setAppointment] = useState<Appointment>({
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
        q19: "",
        pet_index: '',
        appoint_name: '',
        appoint_number: '',
        appoint_email: '',
        appoint_address: '',
        appoint_date: '',
        pet_name: '',
        pet_caretaker: '',
        pet_number: '',
        pet_location: '',
        index: generateUniqueFirestoreId(),
        status: 'Pending',
        imageUrl: `documents/${generateUniqueFirestoreId()}`
    });

    useEffect(() => {
        const fetchPet = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('pets').doc(id).get();
            const pet = { id: doc.id, ...doc.data() } as Pet;
            setPet(pet);
            setAppointment({
                ...appointment,
                pet_index: pet.index.toString(),
                pet_name: pet.name.toString(),
                pet_caretaker: pet.caretakerInfo.toString(),
                pet_number: pet.caretakerNumber.toString(),
                pet_location: pet.location.toString()
            });

        };

        fetchPet();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value, });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    useEffect(() => {
        const fetchImage = async () => {
            if (pet) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${pet.index}`);
                const url = await imageRef.getDownloadURL();
                return url;
            }
            return null;
        };

        const loadImages = async () => {
            const url = await fetchImage();
            setImageUrl(url);
            console.log(imageUrl);
        };

        loadImages();
    }, [pet]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            appointment.q1 === "",
            appointment.q2 === "",
            appointment.q3 === "",
            appointment.q4 === "",
            appointment.q5 === "",
            appointment.q6 === "",
            appointment.q7 === "",
            appointment.q8 === "",
            appointment.q9 === "",
            appointment.q10 === "",
            appointment.q11 === "",
            appointment.q12 === "",
            appointment.q13 === "",
            appointment.q14 === "",
            appointment.q15 === "",
            appointment.q16 === "",
            appointment.q17 === "",
            appointment.q18 === "",
            appointment.q19 === ""
        ) {
            alert('Please go back to "QnA" answer all questions.');
            return;
        }

        if (image) {
            const storageRef = ref(storage, `documents/${appointment.index}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed',
                (snapshot) => {
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setAppointment({ ...appointment, imageUrl: downloadURL });
                        addDoc(collection(db, 'appointment'), appointment);
                    });
                }
            );
        }

        history.push('/adopterHome');
    };


    if (!pet) {
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
                        <a href="/adopterHome">Home</a>
                        <a href="/adopterAdopt">Adopt</a>
                        <a href="/appointmentlist">Appointments</a>
                        <a href="/adopterPetIdentifier">Identify</a>
                        <a href="/login">Log Out</a>
                    </div>
                </nav>
                <div className="appointment">
                    <h1 className="appointment_h1">Question and Answer & Make An Appointment</h1>
                    <>
                        <div className="appointment_container">
                            <div className="appointment_box">
                                {imageUrl && <img src={imageUrl} />}
                                <h1 className="appointment_texth1">{pet.name}</h1>
                                <h2 className="appointment_h2">Caretaker: {pet.caretakerInfo}</h2>
                                <h2 className="appointment_h2">{pet.location}</h2>
                                <h2 className="appointment_h2">{pet.caretakerNumber}</h2>
                            </div>
                        </div>


                        <form onSubmit={handleSubmit}>
                            <div className="qnaBox">
                                <div className="qnaform">
                                    Please Answer the Questions<br />
                                    <p>1. Do you own your home?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q1" value="Yes" checked={appointment.q1 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q1" value="No" checked={appointment.q1 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>2. If renting, do you have permission from your landlord to have pets?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q2" value="Yes" checked={appointment.q2 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q2" value="No" checked={appointment.q2 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>3. Are there children in your household?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q3" value="Yes" checked={appointment.q3 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q3" value="No" checked={appointment.q3 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>4. Do you have other pets at home?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q4" value="Yes" checked={appointment.q4 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q4" value="No" checked={appointment.q4 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>5. Have you owned a pet before?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q5" value="Yes" checked={appointment.q5 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q5" value="No" checked={appointment.q5 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>6. Are you familiar with the specific needs of the chosen pet type/breed?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q6" value="Yes" checked={appointment.q6 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q6" value="No" checked={appointment.q6 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>7. Do you have a stable daily routine?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q7" value="Yes" checked={appointment.q7 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q7" value="No" checked={appointment.q7 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>8. Are you away from home for long periods during the day?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q8" value="Yes" checked={appointment.q8 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q8" value="No" checked={appointment.q8 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>9. Can you afford the costs associated with pet ownership, including food, veterinary care, and unexpected expenses?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q9" value="Yes" checked={appointment.q9 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q9" value="No" checked={appointment.q9 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>10. Do you have a regular veterinarian?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q10" value="Yes" checked={appointment.q10 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q10" value="No" checked={appointment.q10 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>11. Are you willing to provide regular veterinary care, including vaccinations and routine check-ups?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q11" value="Yes" checked={appointment.q11 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q11" value="No" checked={appointment.q11 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>12. Are you willing to attend training classes if necessary?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q12" value="Yes" checked={appointment.q12 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q12" value="No" checked={appointment.q12 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>13. Do you have experience in training pets?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q13" value="Yes" checked={appointment.q13 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q13" value="No" checked={appointment.q13 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>14. Will the pet primarily be kept indoors?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q14" value="Yes" checked={appointment.q14 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q14" value="No" checked={appointment.q14 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>15. Do you have a secure, fenced yard?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q15" value="Yes" checked={appointment.q15 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q15" value="No" checked={appointment.q15 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>16. Do you have a plan for emergencies or unforeseen circumstances?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q16" value="Yes" checked={appointment.q16 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q16" value="No" checked={appointment.q16 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>17. Are you willing to spay/neuter your pet if it is not already done?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q17" value="Yes" checked={appointment.q17 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q17" value="No" checked={appointment.q17 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>18. Can you provide personal or veterinarian references?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q18" value="Yes" checked={appointment.q18 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q18" value="No" checked={appointment.q18 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <p>19. Are you willing to allow a representative from the pet owner to conduct a home visit?</p>
                                    <div className="AddPet_radio">
                                        <label className="radioMargin">
                                            <input
                                                type="radio" name="q19" value="Yes" checked={appointment.q19 === "Yes"} onChange={handleChange} /> Yes
                                        </label>
                                        <label className="radioMargin">
                                            <input type="radio" name="q19" value="No" checked={appointment.q19 === "No"} onChange={handleChange} /> No
                                        </label>
                                    </div>

                                    <div className="scheduleBox1">
                                        <div className="scheduleform">
                                            <h1 className="schedule_h1">Schedule Your Visit</h1>
                                            <h3 className="schedule_h1">↓Insert ID Here↓</h3>
                                            <input type="file" className="schedule_file" onChange={handleImageChange} />
                                            <input className="schedule_input1" type="date" name="appoint_date" value={appointment.appoint_date} onChange={handleChange} />
                                            <h1 className="schedule_h1">Fill your details</h1>
                                            <input className="schedule_input1" type="text" name="appoint_name" value={appointment.appoint_name} onChange={handleChange} placeholder="Full Name" />
                                            <input className="schedule_input1" type="text" name="appoint_number" value={appointment.appoint_number} onChange={handleChange} placeholder="Phone Number" />
                                            <input className="schedule_input1" type="email" name="appoint_email" value={appointment.appoint_email} onChange={handleChange} placeholder="Email" />
                                            <input className="schedule_input1" type="text" name="appoint_address" value={appointment.appoint_address} onChange={handleChange} placeholder="Address" />
                                            <input className="hidden_input" type="text" name="pet_index" value={appointment.pet_index || ''} onChange={handleChange} disabled />
                                            <input className="hidden_input" type="text" name="pet_name" value={appointment.pet_name || ''} onChange={handleChange} disabled />
                                            <input className="hidden_input" type="text" name="pet_number" value={appointment.pet_number || ''} onChange={handleChange} disabled />
                                            <input className="hidden_input" type="text" name="pet_caretaker" value={appointment.pet_caretaker || ''} onChange={handleChange} disabled />
                                            <input className="hidden_input" type="text" name="pet_location" value={appointment.pet_location || ''} onChange={handleChange} disabled />
                                        </div>
                                    </div>
                                    <input className="schedule_submit1" type="submit" />
                                </div>
                            </div>
                        </form>
                    </>
                </div>
            </IonContent>
        </IonPage >
    );
};

export default LandingPage;