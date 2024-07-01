import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './appointment.css';
import { IonContent, IonPage } from '@ionic/react';
import { doc, setDoc } from 'firebase/firestore';
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
    imageUrl: string;
    location: string;
    petOwnerID: string;
};

type Appointment = {
    appoint_date: string;
    appoint_time: string;
    pet_name: string | null;
    pet_index: string | null;
    status: string;
    index: string;
    imageUrl: string;
    appointmentPetOwnerID: string;
    appointmentOwnerID: string;
};

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
};

type OwnerUser = {
    userID: string;
    id: string;
    firstname: string;
    lastname: string;
    address: string;
    contactNumber: string;
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
    const { userID } = useParams<{ userID: string }>();
    const [users, setUsers] = useState<User | null>(null);
    const [ownerUser, setOwnerUser] = useState<OwnerUser | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const [appointment, setAppointment] = useState<Appointment>({
        pet_index: '',
        pet_name: '',
        appoint_date: '',
        appoint_time: '',
        index: generateUniqueFirestoreId(),
        status: 'Pending',
        imageUrl: `documents/${generateUniqueFirestoreId()}`,
        appointmentPetOwnerID: '',
        appointmentOwnerID: `${userID}`

    });

    useEffect(() => {
        const fetchPet = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('pets').doc(id).get();
            const pet = { id: doc.id, ...doc.data() } as Pet;
            setPet(pet);
            setAppointment({
                ...appointment,
                pet_name: pet.name.toString(),
                pet_index: pet.index.toString(),
            });

        };

        fetchPet();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('users').doc(userID).get();
            const user = { id: doc.id, ...doc.data() } as User;
            setUsers(user);
        };
        fetchData();
    }, [users]);

    useEffect(() => {
        const fetchOwnerUser = async () => {
            if (pet) {
                const db = firebase.firestore();
                const doc = await db.collection('users').doc(pet.petOwnerID).get();
                const ownerUser = { id: doc.id, ...doc.data() } as OwnerUser;
                setOwnerUser(ownerUser);
                setAppointment({
                    ...appointment,
                    appointmentPetOwnerID: pet.petOwnerID.toString(),
                });
            }
        };

        fetchOwnerUser();
    }, [pet]);

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
                const imageRef = storageRef.child(`images/${pet.index}_1`);
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

    const validateForm = () => {
        const { appoint_date, appoint_time } = appointment;
        if (!appoint_date || !appoint_time || !image) {
          return false;
        }
        return true;
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill out all required fields, including selecting an image.');
            return;
          }

        if (userID) {
            const documentId = appointment.index; // Use the generated document ID

            if (image) {
                const storageRef = ref(storage, `documents/${documentId}`);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Handle progress
                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            const appointmentWithImageUrl = { ...appointment, imageUrl: downloadURL };

                            await setDoc(doc(db, 'appointments', documentId), appointmentWithImageUrl); // Add to appointments collection

                            history.push(`${userID}/Home`);
                        });
                    }
                );
            } else {
                await setDoc(doc(db, 'appointments', documentId), appointment); // Add to appointments collection

                history.push(`${userID}/Home`);
            }
        }
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
                        <a href={`/${userID}/Home`}>Home</a>
                        <a href={`/${userID}/Explore`}>Explore</a>
                        <a href={`/${userID}/appointmentlist`}>Appointments</a>
                        <a href={`/${userID}/rehome`}>Rehome</a>
                        <a href={`/${userID}/PetIdentifier`}>Identify</a>
                        <label></label>
                        {users && (
                            <button onClick={toggleMenu} className="nav-dropdown-btn">{users.name}</button>
                        )}
                        
                    </div>
                </nav>
                {menuOpen && (
                            <div className="nav-dropdown-menu">
                                <a href={`/${userID}/profile/${userID}`}><p className="nav-dropdowntext">View Profile</p></a>
                                <a href={`/${userID}/myAppointments`}><p className="nav-dropdowntext">My Appointments</p></a>
                                <a href="/Menu"><p className="nav-dropdowntext">Log Out</p></a>
                            </div>
                        )}
                <div className="appointment">
                    <h1 className="appointment_h1">Make An Appointment</h1>
                    <>
                        <div className="appointment_container">
                            <div className="appointment_box">
                                {imageUrl && <img src={imageUrl} />}
                                <h1 className="appointment_texth1">{pet.name}</h1>
                                {ownerUser && (
                                    <h2 className="appointment_h2"><strong>Owner Name:</strong> {ownerUser.firstname} {ownerUser.lastname}</h2>
                                )}
                                <h2 className="appointment_h2"><strong>Location:</strong> {pet.location}</h2>
                                {ownerUser && (
                                    <h2 className="appointment_h2"><strong>Contact Number:</strong> {ownerUser.contactNumber}</h2>
                                )}
                            </div>
                        </div>


                        <form onSubmit={handleSubmit}>
                            <div className="scheduleBox1">
                                <div className="scheduleform">
                                    <h1 className="schedule_h1"><strong>Schedule Your Visit</strong></h1>
                                    <h2 className="schedule_h1">↓Insert ID Here <strong>|</strong> Image Only↓</h2>
                                    <input type="file" className="schedule_file1" onChange={handleImageChange} required/>
                                    <input className="schedule_input1" type="date" name="appoint_date" value={appointment.appoint_date} onChange={handleChange} required/>
                                    <input className="schedule_input1" type="time" name="appoint_time" value={appointment.appoint_time} onChange={handleChange} required/>
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