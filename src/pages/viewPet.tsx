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
    const [imageUrl1, setImageUrl1] = useState<string | null>(null);
    const [imageUrl2, setImageUrl2] = useState<string | null>(null);
    const [imageUrl3, setImageUrl3] = useState<string | null>(null);
    const [imageUrl4, setImageUrl4] = useState<string | null>(null);
    const [imageUrl5, setImageUrl5] = useState<string | null>(null);
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
                setImageUrl(url);
            }
        };

        const fetchImage1 = async () => {
            if (pet) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${pet.index}_1`);
                const url = await imageRef.getDownloadURL();
                setImageUrl1(url);
            }
        };

        const fetchImage2 = async () => {
            if (pet) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${pet.index}_2`);
                const url = await imageRef.getDownloadURL();
                setImageUrl2(url);
            }
        };

        const fetchImage3 = async () => {
            if (pet) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${pet.index}_3`);
                const url = await imageRef.getDownloadURL();
                setImageUrl3(url);
            }
        };
        
        const fetchImage4 = async () => {
            if (pet) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${pet.index}_4`);
                const url = await imageRef.getDownloadURL();
                setImageUrl4(url);
            }
        };

        const fetchImage5 = async () => {
            if (pet) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${pet.index}_5`);
                const url = await imageRef.getDownloadURL();
                setImageUrl5(url);
            }
        };

        fetchImage();
        fetchImage1();
        fetchImage2();
        fetchImage3();
        fetchImage4();
        fetchImage5();
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
                    <div className="nav-links2">
                        <a href="/Menu">Home</a>
                        <a href="/Discover">Explore</a>
                        <a href="/IdentifyPets">Identify</a>
                        <a href="/login">Login</a>
                    </div>
                </nav>
                <div className="details">
          <div className="details_textSquare">
            <h1 className="details_h1">{pet.name}</h1>
            <h2 className="details_h2">
              <b>Type:</b> {pet.type}
            </h2>
            <h2 className="details_h2">
              <b>Gender:</b> {pet.gender}
            </h2>
            <h2 className="details_h2">
              <b>Breed:</b> {pet.breed}
            </h2>
            <h2 className="details_h2">
              <b>Neutered:</b> {pet.neutered}
            </h2>
            <h2 className="details_h2">
              <b>Location:</b> {pet.location}
            </h2>
            <h2 className="details_h2">
              <b>Age &#40;months&#41;:</b> {pet.age}
            </h2>
            <h1 className="details_h2">About Me</h1>
            <p className="details_desc">{pet.about}</p>
          </div>
          <div className="petImg">
            {" "}
            {imageUrl && (
              <img
                className="details_img"
                src={`${imageUrl}`}
                alt={`${pet.name}`}
              />
            )}
           <Link to="/login"><div className="details_appointment"><p className="details_appointment2">&nbsp;Please Log In to make<br />&nbsp;&nbsp;&nbsp;&nbsp;an Appointment</p></div></Link>
          </div>
        </div>

        <div className="space2"></div>
        <h1 className="titleGallery">
          <br />
          <br />
          Gallery
        </h1>
        <div className="details_gallery">
          {imageUrl1 && <img src={`${imageUrl1}`} alt={`${pet.name}`} />}
          {imageUrl2 && <img src={`${imageUrl2}`} alt={`${pet.name}`} />}
          {imageUrl3 && <img src={`${imageUrl3}`} alt={`${pet.name}`} />}
          {imageUrl4 && <img src={`${imageUrl4}`} alt={`${pet.name}`} />}
          {imageUrl5 && <img src={`${imageUrl5}`} alt={`${pet.name}`} />}
        </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
