import React, { useState, useEffect } from 'react';
import './addpet.css';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [pet, setPet] = useState<Pet | null>(null);

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
    const fetchPet = async () => {
      const db = firebase.firestore();
      const petDoc = await db.collection('users').doc(userID).collection('pets').doc(id).get();
      if (petDoc.exists) {
        setPet(petDoc.data() as Pet);
      }
    };
    fetchPet();
  }, [id, userID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (pet) {
      setPet({ ...pet, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pet) {
      const db = firebase.firestore();
      const batch = db.batch();

      const userPetRef = db.collection('users').doc(userID).collection('pets').doc(id);
      const mainPetRef = db.collection('pets').doc(id);

      batch.set(userPetRef, pet);
      batch.set(mainPetRef, pet);

      await batch.commit();
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
            <a href={`/${userID}/Adopt`}>Adopt</a>
            <a href={`/${userID}/appointmentlist`}>Appointments</a>
            <a href={`/${userID}/rehome`}>Rehome</a>
            <a href={`/${userID}/PetIdentifier`}>Identify</a>
            <label></label>
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
            <h1 className="AddPetBoxH1">Re-Home Pet</h1>
            <form onSubmit={handleUpdateAndSubmit} className="UpdatePetform">
              <input type='text' className="AddPetForm_input" placeholder="Pet Name" name="name" value={pet.name} onChange={handleChange} />
              <input type='text' className="AddPetForm_input" placeholder="Age" name="age" value={pet.age} onChange={handleChange} />
              <div className="AddPet_dropdown">
                <select className="AddPet_dropbtn" name="gender" value={pet.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="AddPet_dropdown">
                <select className="AddPet_dropbtn" name="neutered" value={pet.neutered} onChange={handleChange}>
                  <option value="">Select Neutered</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="AddPet_dropdown">
                <select className="AddPet_dropbtn" name="type" value={pet.type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="cat">Cat</option>
                  <option value="dog">Dog</option>
                </select>
              </div>
              <input className="AddPetForm_input" type="text" placeholder="Breed" name="breed" value={pet.breed} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="Weight (kg)" name="weight" value={pet.weight} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="Address" name="location" value={pet.location} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="About" name="about" value={pet.about} onChange={handleChange} />
              <button className="AddPet_submit" type="submit">Save</button>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UpdatePet;
