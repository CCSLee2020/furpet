import React, { useEffect, useState } from 'react';
import './landingpage.css';
import { IonContent, IonPage } from '@ionic/react';
import dog1 from '../assets/dog 1.png';
import footprint1 from '../assets/footprint 1.png';
import cat1 from '../assets/cat 1.png';
import { Link, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';


type Pet = {
    id: string;
    index: number,
    name: string;
    age: number;
    gender: 'male' | 'female';
    neutered: 'yes' | 'no';
    type: 'cat' | 'dog';
    breed: string;
    weight: number;
    location: string;
    about: string;
    caretakerInfo: string;
    imageUrl: string;
    status: string;
};

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
    name: string;
};

const LandingPage: React.FC = () => {
    const { userID } = useParams<{ userID: string }>();

    console.log("Extracted userID:", userID); // Debugging line
    
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();
    const [selectedType, setSelectedType] = useState<'Cat' | 'Dog' | 'all'>('all');
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
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            const result = await storageRef.child('images').listAll();
            const urlPromises = result.items.map(imageRef => imageRef.getDownloadURL());
            return Promise.all(urlPromises);
        };

        const loadImages = async () => {
            const urls = await fetchImages();
            setImageUrls(urls);
        };

        loadImages();
    }, []);

    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
        const fetchPets = async () => {
            const db = firebase.firestore();
            const petCollection = db.collection('pets').orderBy('index');
            const petSnapshot = await petCollection.get();
            const petList: Pet[] = await Promise.all(petSnapshot.docs.map(async doc => {
                const petData = doc.data();
                const imageUrl = await storageRef.child(`images/${petData.index}_1`).getDownloadURL();
                return { ...petData, id: doc.id, imageUrl } as Pet;
            }));
            setPets(petList);
        };

        fetchPets();
    }, []);

    const logUserActivity = async (activity: string) => {
        const db = firebase.firestore();
        await db.collection('userLogs').add({
            userID,
            activity,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    };

    useEffect(() => {
        logUserActivity('filterOut');
    }, [userID]);


    return (
        <IonPage>
            <IonContent>
                <nav>
                    <div className="logo1">
                        <img className='navLogo1' src={navLogo} alt="" />
                        <h1 className="h1_logo1">FurPet</h1>
                    </div>
                    <div className="nav-links1">
                        <a href={`/${userID}/Home`} onClick={() => logUserActivity('Navigated to Home')}>Home</a>
                        <a href={`/${userID}/Explore`} onClick={() => logUserActivity('Navigated to Explore')}>Explore</a>
                        <a href={`/${userID}/appointmentlist`} onClick={() => logUserActivity('Navigated to Appointments')}>Appointments</a>
                        <a href={`/${userID}/rehome`} onClick={() => logUserActivity('Navigated to Rehome')}>Rehome</a>
                        <a href={`/${userID}/PetIdentifier`} onClick={() => logUserActivity('Navigated to Identify')}>Identify</a>
                        <label></label>
                        {users && (
                            <button onClick={toggleMenu} className="nav-dropdown-btn">{users.name}</button>
                        )}
                        
                    </div>
                </nav>
                {menuOpen && (
                            <div className="nav-dropdown-menu">
                                <a href={`/${userID}/profile/${userID}`} onClick={() => logUserActivity('Viewed Profile')}><p className="nav-dropdowntext">View Profile</p></a>
                                <a href={`/${userID}/myAppointments`} onClick={() => logUserActivity('Viewed My Appointments')}><p className="nav-dropdowntext">My Appointments</p></a>
                                <a href="/Menu" onClick={() => logUserActivity('Logged Out')}><p className="nav-dropdowntext">Log Out</p></a>
                            </div>
                        )}
                <div className="categories2">
                <h1 className="categories_h1">Categories</h1>
                    <div className="categories_container">
                        <div className="categories_box" onClick={() => { setSelectedType('all'); logUserActivity('Selected All Categories'); }}>
                            <img src={footprint1} />
                        </div>
                        <div className="categories_box" onClick={() => { setSelectedType('Dog'); logUserActivity('Selected Dog Category'); }}>
                            <img src={dog1} />
                        </div>
                        <div className="categories_box" onClick={() => { setSelectedType('Cat'); logUserActivity('Selected Cat Category'); }}>
                            <img src={cat1} />
                        </div>
                    </div>
                </div>
                <div className="adoption2">
                    <h1 className="adpotion_h1">For Adoption</h1>
                    <div className="adoption_container">
                        {pets.filter(pet => selectedType === 'all' || pet.type.toLowerCase() === selectedType.toLowerCase()).map((pet, i) => (
                            <div className="adoption_box">
                                <img className="adoption_image" src={pet.imageUrl} alt={pet.name} />
                                <p className="adoption_text">{pet.name}</p>
                                <p className="adoption_desc">{pet.breed}</p>
                                <p className="adoption_desc">{pet.age} Months Old</p>
                                <p className="adoption_desc">{pet.gender}</p>
                                <p className="adoption_desc">{pet.weight} kg</p>
                                <p className="adoption_desc">{pet.location}</p>
                                <p className="adoption_desc">{pet.status}</p>
                                <Link to={`/${userID}/PetView/${pet.id}`} onClick={() => logUserActivity(`Viewed Pet ${pet.name}`)}><div className="adoptMe"><p className='adoption_button'>View More</p></div></Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space"></div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;