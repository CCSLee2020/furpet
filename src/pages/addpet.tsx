import React, { useEffect, useState } from 'react';
import './addpet.css';
import { IonImg, IonContent, IonPage, IonButton } from '@ionic/react';
import addPet from '../assets/Group 54.png';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

type Pet = {
  index: string;
  imageUrl: string;
  name: string;
  age: string;
  breed: string;
  location: string;
  about: string;
  weight: string;
  gender: 'male' | 'female';
  neutered: 'yes' | 'no';
  type: 'cat' | 'dog';
  status: 'Available' | 'Adopted';
  petOwnerID: string;
};

type User = {
  userID: string;
  id: string;
  email: string;
  role: string;
  name: string;
};

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateUniqueFirestoreId(): string {
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return autoId;
}

const LandingPage: React.FC = () => {
  const { userID } = useParams<{ userID: string }>();

  console.log("Extracted userID:", userID); // Debugging line

  const history = useHistory();

  const [pet, setPet] = useState<Pet>({
    index: generateUniqueFirestoreId(),
    name: '',
    age: '',
    breed: '',
    location: '',
    about: '',
    weight: '',
    gender: 'male',
    neutered: 'yes',
    type: 'cat',
    imageUrl: `${userID}`,
    status: 'Available',
    petOwnerID: `${userID}`
  });
  const [image, setImage] = useState<File | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const { name, age, breed, location, about, weight, gender, neutered, type } = pet;
    if (!name || !age || !breed || !location || !about || !weight || !gender || !neutered || !type || !image) {
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
      const documentId = pet.index; // Use the generated document ID

      if (image) {
        const storageRef = ref(storage, `images/${documentId}`);
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
              const petWithImageUrl = { ...pet, imageUrl: downloadURL };

              await setDoc(doc(db, 'pets', documentId), petWithImageUrl); // Add to pets collection
              await setDoc(doc(db, `users/${userID}/pets`, documentId), petWithImageUrl); // Add to user's pets subcollection

              history.push(`/${userID}/rehome`);
            });
          }
        );
      } else {
        await setDoc(doc(db, 'pets', documentId), pet); // Add to pets collection
        await setDoc(doc(db, `users/${userID}/pets`, documentId), pet); // Add to user's pets subcollection

        history.push(`/${userID}/rehome`);
      }
    }
  };

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
            {users && (
              <button onClick={toggleMenu} className="nav-dropdown-btn">{users.name}</button>
            )}
            {menuOpen && (
              <div className="nav-dropdown-menu">
                <a href={`/${userID}/profile/${userID}`}><p className="nav-dropdowntext">View Profile</p></a>
                <a href={`/${userID}/myAppointments`}><p className="nav-dropdowntext">My Appointments</p></a>
                <a href="/"><p className="nav-dropdowntext">Log Out</p></a>
              </div>
            )}
          </div>
        </nav>
        <div className="AddPet">
          <div className="AddPetBox">
            <h1 className="AddPetBoxH1">Add Pet</h1>
            <img src={addPet} />
            <form onSubmit={handleSubmit} className="AddPetform">
              <input type="file" onChange={handleImageChange} required />
              <input type='text' className="AddPetForm_input" placeholder="Pet Name" name="name" value={pet.name} onChange={handleChange} required />
              <input type='text' className="AddPetForm_input" placeholder="Age (Months | Numbers Only)" name="age" value={pet.age} onChange={handleChange} required />
              <div className="AddPet_dropdown">
                <select className="AddPet_dropbtn" name="gender" value={pet.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="AddPet_dropdown">
                <select className="AddPet_dropbtn" name="neutered" value={pet.neutered} onChange={handleChange} required>
                  <option value="">Select Neutered</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="AddPet_dropdown">
                <select className="AddPet_dropbtn" name="type" value={pet.type} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>
              <input className="AddPetForm_input" type="text" placeholder="Breed" name="breed" value={pet.breed} onChange={handleChange} required />
              <input className="AddPetForm_input" type="text" placeholder="Weight (Kilogram [kg] | Numbers Only)" name="weight" value={pet.weight} onChange={handleChange} required />
              <input className="AddPetForm_input" type="text" placeholder="Location (Municipality/City, Province)" name="location" value={pet.location} onChange={handleChange} required />
              <input className="AddPetForm_input" type="text" placeholder="About" name="about" value={pet.about} onChange={handleChange} required />
              <button className="AddPet_submit" type="submit">Add Pet</button>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
