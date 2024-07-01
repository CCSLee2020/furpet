import React, { useEffect, useState } from 'react';
import './rehome.css';
import { IonContent, IonPage } from '@ionic/react';
import edit from '../assets/Vector.png';
import Delete from '../assets/material-symbols_delete-outline.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { Link, useParams } from 'react-router-dom';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';

type Pet = {
  id: string;
  index: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  neutered: 'yes' | 'no';
  type: 'cat' | 'dog';
  breed: string;
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

const Rehome: React.FC = () => {
  const { userID } = useParams<{ userID: string }>();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const storageRef = firebase.storage().ref();
  const [pets, setPets] = useState<Pet[]>([]);
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

  // Fetch pets subcollection for the specific userID
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const db = firebase.firestore();
        const petCollection = db.collection('users').doc(userID).collection('pets').orderBy('index');
        const petSnapshot = await petCollection.get();
        const petList: Pet[] = await Promise.all(petSnapshot.docs.map(async doc => {
          const petData = doc.data();
          const imageUrl = await storageRef.child(`images/${petData.index}_1`).getDownloadURL();
          return { ...petData, id: doc.id, imageUrl } as Pet;
      }));
      setPets(petList);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    if (userID) {
      fetchPets();
    }
  }, [userID]);

  // Fetch images from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await storageRef.child('images').listAll();
        const urlPromises = result.items.map(imageRef => imageRef.getDownloadURL());
        const urls = await Promise.all(urlPromises);
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const deletePet = async (id: string, imageUrl: string) => {
    try {
      const db = firebase.firestore();
      const petRef = db.collection('pets').doc(id); // Main collection reference
      const subPetRef = db.collection('users').doc(userID).collection('pets').doc(id); // Subcollection reference
      const imageRef = storageRef.child(`images/${imageUrl}_1`);

      if (window.confirm('Are you sure you want to delete this pet?')) {
        // Delete the image from Firebase Storage
        await imageRef.delete();

        // Delete the pet document from the subcollection
        await subPetRef.delete();

        // Delete the pet document from the main collection
        await petRef.delete();

        // Update the local state to remove the pet
        setPets(pets.filter(pet => pet.id !== id));
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

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
            <img className='navLogo1' src={navLogo} alt="Logo" />
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
        <div className="rehome">
          <h1 className="rehome_h1">Pet Listed</h1>
          <a href={`/${userID}/addpet`}><h1 className="addnewpet" onClick={() => logUserActivity('Create a New Pet')}>Add Pet</h1></a>
          <div className="rehome_container">
            {pets.map((pet, i) => (
              <div className="rehome_box" key={pet.id}>
                <img className="rehome_img" src={pet.imageUrl} alt={pet.name} />
                <h1 className="rehome_texth1">{pet.name}</h1>
                <h2 className="rehome_h2"><strong>Address:</strong> {pet.location}</h2>
                <h2 className="rehome_h2"><strong>Neutered:</strong> {pet.neutered}</h2>
                <h2 className="rehome_h2"><strong>Status:</strong> {pet.status}</h2>
                <Link className="edit" to={`/${userID}/updatePet/${pet.id}`} onClick={() => logUserActivity('Edit Pet')}><img className="edit" src={edit} alt="edit" /></Link>
                <img className="delete" src={Delete} alt="delete" onClick={() => { deletePet(pet.id, pet.index); logUserActivity('Pet Deleted'); }} />
              </div>
            ))}
          </div>
          <div className="space3"></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Rehome;
