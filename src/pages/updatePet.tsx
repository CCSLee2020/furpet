import React, { useState, useEffect } from 'react';
import './addpet.css';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';

type Pet = {
  index: number;
  name: string;
  age: string;
  breed: string;
  location: string;
  about: string;
  caretakerInfo: string;
  caretakerNumber: string;
  weight: string;
  gender: 'male' | 'female';
  neutered: 'yes' | 'no';
  type: 'cat' | 'dog';
  status: 'adopted' | 'available';
  address: string;
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

const UpdatePet: React.FC = () => {
  const history = useHistory();
  const { id, userID } = useParams<{ id: string, userID: string }>();
  const [users, setUsers] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [images, setImages] = useState<FileList | null>(null);

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
  }, [userID]);

  useEffect(() => {
    const fetchPet = async () => {
      const db = firebase.firestore();
      const petDoc = await db.collection('users').doc(userID).collection('pets').doc(id).get();
      if (petDoc.exists) {
        setPet(petDoc.data() as Pet);
      }
    };
    fetchPet();
  }, [id, userID]);

  const validateForm = () => {
    const { name, age, breed, location, about, weight, gender, neutered, type } = pet || {};
    if (!name || !age || !breed || !location || !about || !weight || !gender || !neutered || !type) {
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (pet) {
      setPet({ ...pet, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleUpdateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill out all required fields, including selecting an image.');
      return;
    }

    if (pet) {
      const db = firebase.firestore();
      const batch = db.batch();

      const userPetRef = db.collection('users').doc(userID).collection('pets').doc(id);
      const mainPetRef = db.collection('pets').doc(id);

      batch.set(userPetRef, pet);
      batch.set(mainPetRef, pet);

      await batch.commit();

      if (images) {
        const storage = firebase.storage();
        const promises = [];

        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const storageRef = storage.ref(`images/${pet.index}_${i + 1}`);
          promises.push(storageRef.put(image));
        }

        await Promise.all(promises);
      }

      history.push(`/${userID}/rehome`);
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
        <div className="UpdatePet1">
          <div className="AddPetBox">
            <h1 className="AddPetBoxH1">Update Pet</h1>
            <form onSubmit={handleUpdateAndSubmit} className="UpdatePetform">
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
              <p>Add 5 Images for Your Pet</p><input type="file" multiple accept="image/*" onChange={handleFileChange} />
              <button className="AddPet_submit" type="submit">Update Pet</button>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UpdatePet;
