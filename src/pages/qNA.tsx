import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './appointment.css';
import { IonContent, IonPage } from '@ionic/react';
import { collection, addDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

type Pet = {
    id: string;
    index: string;
    name: string;
    caretakerInfo: string;
    imageUrl: string;
    location: string;
};

type QnA = {
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

var db = firebase.firestore();

const LandingPage: React.FC = () => {

    const history = useHistory();
    const [pet, setPet] = useState<Pet>({
        id: '',
        index: '',
        name: '',
        caretakerInfo: '',
        imageUrl: '',
        location: ''
    });
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    const [qna, setQnA] = useState<QnA>({
        pet_name: "",
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
    });

    useEffect(() => {
        const fetchPet = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('pets').doc(id).get();
            const pet = { id: doc.id, ...doc.data() } as Pet;
            setPet(pet);
            setQnA({ ...qna, pet_name: pet.name.toString() });

        };

        fetchPet();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setQnA({ ...qna, [e.target.name]: e.target.value, });
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
            qna.q1 === "",
            qna.q2 === "",
            qna.q3 === "",
            qna.q4 === "",
            qna.q5 === "",
            qna.q6 === "",
            qna.q7 === "",
            qna.q8 === "",
            qna.q9 === "",
            qna.q10 === "",
            qna.q11 === "",
            qna.q12 === "",
            qna.q13 === "",
            qna.q14 === "",
            qna.q15 === "",
            qna.q16 === "",
            qna.q17 === "",
            qna.q18 === "",
            qna.q19 === ""
        ) {
            alert('Please answer all question.');
            return;
        } else {
            addDoc(collection(db, 'QnA'), qna);
            window.confirm('You Have Submitted sucessfully.');
            history.push(`/appointment/${pet.id}`);
        }

    };

    if (!pet) {
        return <div>Loading...</div>;
    }

    return (
        <IonPage>
            <IonContent>
                <nav>
                    <div className="logo">
                        <h1 className="h1_logo">FurPet</h1>
                    </div>
                    <div className="nav-links">
                        <a href="/adopterHome">Home</a>
                        <a href="/adopterAdopt">Adopt</a>
                        <a href="/appointmentlist">Appointments</a>
                        <a href="/petOwnerPetIdentifier">Identify</a>
                        <a href="/login">Log Out</a>
                    </div>
                </nav>
                <div className="appointment">
                    <h1 className="appointment_h1">Question and Answers</h1>
                    <>
                        <div className="appointment_container">
                            <div className="appointment_box">
                                {imageUrl && <img src={imageUrl} />}
                                <h1 className="appointment_texth1">{pet.name}</h1>
                                <h2 className="appointment_h2">Caretaker: {pet.caretakerInfo}</h2>
                                <h2 className="appointment_h2">{pet.location}</h2>
                            </div>
                        </div>

                        <div className="qnaBox">
                            <form onSubmit={handleSubmit} className="qnaform">
                                <input className="hidden_input" type="text" name="pet_name" value={qna.pet_name || ''} onChange={handleChange} disabled/>
                                <p>1. Do you own your home?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q1" value={qna.q1} onChange={handleChange}>
                                        <option value="">1. Select Answer</option>
                                        <option value="Yes">1. Yes</option>
                                        <option value="No">1. No</option>
                                    </select>
                                </div>
                                <p>2. If renting, do you have permission from your landlord to have pets?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q2" value={qna.q2} onChange={handleChange}>
                                        <option value="">2. Select Answer</option>
                                        <option value="Yes">2. Yes</option>
                                        <option value="No">2. No</option>
                                    </select>
                                </div>
                                <p>3. Are there children in your household?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q3" value={qna.q3} onChange={handleChange}>
                                        <option value="">3. Select Answer</option>
                                        <option value="Yes">3. Yes</option>
                                        <option value="No">3. No</option>
                                    </select>
                                </div>
                                <p>4. Do you have other pets at home?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q4" value={qna.q4} onChange={handleChange}>
                                        <option value="">4. Select Answer</option>
                                        <option value="Yes">4. Yes</option>
                                        <option value="No">4. No</option>
                                    </select>
                                </div>
                                <p>5. Have you owned a pet before?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q5" value={qna.q5} onChange={handleChange}>
                                        <option value="">5. Select Answer</option>
                                        <option value="Yes">5. Yes</option>
                                        <option value="No">5. No</option>
                                    </select>
                                </div>
                                <p>6. Are you familiar with the specific needs of the chosen pet type/breed?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q6" value={qna.q6} onChange={handleChange}>
                                        <option value="">6. Select Answer</option>
                                        <option value="Yes">6. Yes</option>
                                        <option value="No">6. No</option>
                                    </select>
                                </div>
                                <p>7. Do you have a stable daily routine?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q7" value={qna.q7} onChange={handleChange}>
                                        <option value="">7. Select Answer</option>
                                        <option value="Yes">7. Yes</option>
                                        <option value="No">7. No</option>
                                    </select>
                                </div>
                                <p>8. Are you away from home for long periods during the day?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q8" value={qna.q8} onChange={handleChange}>
                                        <option value="">8. Select Answer</option>
                                        <option value="Yes">8. Yes</option>
                                        <option value="No">8. No</option>
                                    </select>
                                </div>
                                <p>9. Can you afford the costs associated with pet ownership, including food, veterinary care, and unexpected expenses?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q9" value={qna.q9} onChange={handleChange}>
                                        <option value="">9. Select Answer</option>
                                        <option value="Yes">9. Yes</option>
                                        <option value="No">9. No</option>
                                    </select>
                                </div>
                                <p>10. Do you have a regular veterinarian?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q10" value={qna.q10} onChange={handleChange}>
                                        <option value="">10. Select Answer</option>
                                        <option value="Yes">10. Yes</option>
                                        <option value="No">10. No</option>
                                    </select>
                                </div>
                                <p>11. Are you willing to provide regular veterinary care, including vaccinations and routine check-ups?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q11" value={qna.q11} onChange={handleChange}>
                                        <option value="">11. Select Answer</option>
                                        <option value="Yes">11. Yes</option>
                                        <option value="No">11. No</option>
                                    </select>
                                </div>
                                <p>12. Are you willing to attend training classes if necessary?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q12" value={qna.q12} onChange={handleChange}>
                                        <option value="">12. Select Answer</option>
                                        <option value="Yes">12. Yes</option>
                                        <option value="No">12. No</option>
                                    </select>
                                </div>
                                <p>13. Do you have experience in training pets?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q13" value={qna.q13} onChange={handleChange}>
                                        <option value="">13. Select Answer</option>
                                        <option value="Yes">13. Yes</option>
                                        <option value="No">13. No</option>
                                    </select>
                                </div>
                                <p>14. Will the pet primarily be kept indoors?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q14" value={qna.q14} onChange={handleChange}>
                                        <option value="">14. Select Answer</option>
                                        <option value="Yes">14. Yes</option>
                                        <option value="No">14. No</option>
                                    </select>
                                </div>
                                <p>15. Do you have a secure, fenced yard?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q15" value={qna.q15} onChange={handleChange}>
                                        <option value="">15. Select Answer</option>
                                        <option value="Yes">15. Yes</option>
                                        <option value="No">15. No</option>
                                    </select>
                                </div>
                                <p>16. Do you have a plan for emergencies or unforeseen circumstances?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q16" value={qna.q16} onChange={handleChange}>
                                        <option value="">16. Select Answer</option>
                                        <option value="Yes">16. Yes</option>
                                        <option value="No">16. No</option>
                                    </select>
                                </div>
                                <p>17. Are you willing to spay/neuter your pet if it is not already done?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q17" value={qna.q17} onChange={handleChange}>
                                        <option value="">17. Select Answer</option>
                                        <option value="Yes">17. Yes</option>
                                        <option value="No">17. No</option>
                                    </select>
                                </div>
                                <p>18. Can you provide personal or veterinarian references?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q18" value={qna.q18} onChange={handleChange}>
                                        <option value="">18. Select Answer</option>
                                        <option value="Yes">18. Yes</option>
                                        <option value="No">18. No</option>
                                    </select>
                                </div>
                                <p>19. Are you willing to allow a representative from the pet owner to conduct a home visit?</p>
                                <div className="AddPet_dropdown">
                                    <select className="AddPet_dropbtn" name="q19" value={qna.q19} onChange={handleChange}>
                                        <option value="">19. Select Answer</option>
                                        <option value="Yes">19. Yes</option>
                                        <option value="No">19. No</option>
                                    </select>
                                </div>
                                <br />
                                <input className='schedule_submit' type="submit" />
                            </form>
                        </div>
                    </>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;