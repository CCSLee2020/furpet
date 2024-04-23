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

type Pet = {
    id: string;
    index: number;
    name: string;
    caretakerInfo: string;
    imageUrl: string;
    location: string;
};

type Appointment = {
    appoint_name: string;
    appoint_number: string;
    appoint_email: string;
    appoint_address: string;
    appoint_date: string;
    pet_name: string | null;
    pet_caretaker: string | null;
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
        pet_index: '',
        appoint_name: '',
        appoint_number: '',
        appoint_email: '',
        appoint_address: '',
        appoint_date: '',
        pet_name: '',
        pet_caretaker: '',
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
            setAppointment({ ...appointment, pet_index: pet.index.toString(), pet_name: pet.name.toString(), pet_caretaker: pet.caretakerInfo.toString(), pet_location: pet.location.toString() });

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
                    <h1 className="appointment_h1">Make An Appointment</h1>
                    <>
                        <div className="appointment_container">
                            <div className="appointment_box">
                                {imageUrl && <img src={imageUrl} />}
                                <h1 className="appointment_texth1">{pet.name}</h1>
                                <h2 className="appointment_h2">Caretaker: {pet.caretakerInfo}</h2>
                                <h2 className="appointment_h2">{pet.location}</h2>
                            </div>
                        </div>

                        <div className="scheduleBox">
                            <form onSubmit={handleSubmit} className="scheduleform">
                                <h1 className="schedule_h1">Schedule Your Visit</h1>
                                <h3 className="schedule_h1">↓Insert Document↓</h3>
                                <input type="file" onChange={handleImageChange} />
                                <input className="schedule_input" type="date" name="appoint_date" value={appointment.appoint_date} onChange={handleChange} />
                                <h1 className="schedule_h1">Fill your details</h1>
                                <input className="schedule_input" type="text" name="appoint_name" value={appointment.appoint_name} onChange={handleChange} placeholder="Full Name" />
                                <input className="schedule_input" type="text" name="appoint_number" value={appointment.appoint_number} onChange={handleChange} placeholder="Phone Number" />
                                <input className="schedule_input" type="email" name="appoint_email" value={appointment.appoint_email} onChange={handleChange} placeholder="Email" />
                                <input className="schedule_input" type="text" name="appoint_address" value={appointment.appoint_address} onChange={handleChange} placeholder="Address" />
                                <input className="hidden_input" type="text" name="pet_index" value={appointment.pet_index || ''} onChange={handleChange} disabled/>
                                <input className="hidden_input" type="text" name="pet_name" value={appointment.pet_name || ''} onChange={handleChange} disabled/>
                                <input className="hidden_input" type="text" name="pet_caretaker" value={appointment.pet_caretaker || ''} onChange={handleChange} disabled/>
                                <input className="hidden_input" type="text" name="pet_location" value={appointment.pet_location || ''} onChange={handleChange} disabled/>
                                <a href="/adopterHome"><input className="schedule_submit" type="submit" /></a>
                            </form>
                        </div>
                    </>
                    <div className="space3"></div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;