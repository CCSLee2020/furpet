import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './appointment.css';
import { IonContent, IonPage } from '@ionic/react';
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { storage } from '../firebaseConfig';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
        setAppointment({ ...appointment, [e.target.name]: e.target.value });
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

    const validateForm = () => {
        const { appoint_date, appoint_time } = appointment;
        if (!appoint_date || !appoint_time || !image) {
            return false;
        }
        return true;
    };

    const checkExistingAppointment = async (date: string, time: string) => {
        const q = query(
            collection(db, 'appointments'),
            where('appoint_date', '==', date),
            where('appoint_time', '==', time)
        );

        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill out all required fields, including selecting an image.');
            return;
        }

        const { appoint_date, appoint_time } = appointment;

        const existingAppointment = await checkExistingAppointment(appoint_date, appoint_time);

        if (existingAppointment) {
            alert('There is already an appointment scheduled at this date and time. Please choose a different time.');
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
                                    <input type="file" className="schedule_file1" onChange={handleImageChange} required />
                                    <input className="schedule_input1" type="date" name="appoint_date" value={appointment.appoint_date} onChange={handleChange} required />
                                    <input className="schedule_input1" type="time" name="appoint_time" value={appointment.appoint_time} onChange={handleChange} required />
                                    <input className="schedule_submit1" type="submit" />
                                </div>
                            </div>
                        </form>
                    </>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
