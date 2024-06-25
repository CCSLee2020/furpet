import React, { useEffect, useState } from 'react';
import './adoptme.css';
import { IonContent, IonPage } from '@ionic/react';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import { useParams, Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

type Pet = {
    id: string;
    index: number;
    name: string;
    type: string;
    gender: string;
    age: number;
    breed: string;
    neutered: string;
    about: string;
    caretakerInfo: string;
    caretakerNumber: string;
    imageUrl: string;
    location: string;
    address: string;
    petOwnerID: string;
};

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
    name: string;
};

type OwnerUser = {
    id: string;
    firstname: string;
    lastname: string;
    address: string;
    contactNumber: string;
};

const LandingPage: React.FC = () => {
    const [pet, setPet] = useState<Pet | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [users, setUsers] = useState<User | null>(null);
    const [ownerUser, setOwnerUser] = useState<OwnerUser | null>(null);
    const { id } = useParams<{ id: string }>();
    const { userID } = useParams<{ userID: string }>();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const fetchPet = async () => {
            const db = firebase.firestore();
            const doc = await db.collection('pets').doc(id).get();
            const pet = { id: doc.id, ...doc.data() } as Pet;
            setPet(pet);
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
    }, []);

    useEffect(() => {
        const fetchOwnerUser = async () => {
            if (pet) {
                const db = firebase.firestore();
                const doc = await db.collection('users').doc(pet.petOwnerID).get();
                const ownerUser = { id: doc.id, ...doc.data() } as OwnerUser;
                setOwnerUser(ownerUser);
            }
        };

        fetchOwnerUser();
    }, [pet]);

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
                        <a href="/Menu">Home</a>
                        <a href="/Discover">Explore</a>
                        <a href="/IdentifyPets">Identify</a>
                        <a href="/login">Login</a>
                    </div>
                </nav>
                <div className="details">
                    <>
                        <div className="details_textSquare">
                            <h1 className="details_h1">{pet.name}</h1>
                            <h2 className="details_h2"><b>Type:</b> {pet.type}</h2>
                            <h2 className="details_h2"><b>Gender:</b> {pet.gender}</h2>
                            <h2 className="details_h2"><b>Breed:</b> {pet.breed}</h2>
                            <h2 className="details_h2"><b>Neutered:</b> {pet.neutered}</h2>
                            <h2 className="details_h2"><b>Location:</b> {pet.location}</h2>
                            <h2 className="details_h2"><b>Age &#40;months&#41;:</b> {pet.age}</h2>
                            <Link to="/login"><div className="details_appointment"><p className="details_appointment2">Take a QnA & Make an &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Appointment</p></div></Link>
                        </div>
                        {imageUrl && <img className="details_img" src={imageUrl} />}
                        <h1 className="details_aboutme">About Me</h1>
                        <p className="details_desc">{pet.about}</p>
                        <div className="caretaker_container">
                            {ownerUser && (
                                <div className="caretaker_box">
                                    <h1 className="caretaker_h1">Caretaker: {ownerUser.firstname} {ownerUser.lastname}</h1>
                                    <h2 className="caretaker_h2">Address: {ownerUser.address}</h2>
                                    <h2>Contact Number: {ownerUser.contactNumber}</h2>
                                </div>
                            )}
                        </div>
                        <div className="space2"></div>
                    </>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
