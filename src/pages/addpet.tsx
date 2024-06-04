import React, { useState } from 'react';
import './addpet.css';
import { IonImg, IonContent, IonPage, IonButton } from '@ionic/react';
import addPet from '../assets/Group 54.png';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';


type Pet = {
  index: string;
  imageUrl: string;
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
  status: 'Available' | 'Adopted';
  address: string;
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

  const history = useHistory();

  const [pet, setPet] = useState<Pet>({
    index: generateUniqueFirestoreId(),
    name: '',
    age: '',
    breed: '',
    location: '',
    about: '',
    caretakerInfo: '',
    caretakerNumber: '',
    weight: '',
    gender: 'male',
    neutered: 'yes',
    type: 'cat',
    imageUrl: `images/${Date.now()}`,
    status: 'Available',
    address: ''
  });
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (image) {
      const storageRef = ref(storage, `images/${pet.index}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed',
        (snapshot) => {
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPet({ ...pet, imageUrl: downloadURL });
            addDoc(collection(db, 'pets'), pet);
          });
        }
      );
    }
    history.push('/rehome');
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
            <a href="/petOwnerHome">Home</a>
            <a href="/petOwnerAdopt">Adopt</a>
            <a href="/rehome">Rehome</a>
            <a href="/petOwnerPetIdentifier">Identify</a>
            <a href="/login">Log Out</a>
          </div>
        </nav>
        <div className="AddPet">
          <div className="AddPetBox">
            <h1 className="AddPetBoxH1">Re-Home Pet</h1>
            <img src={addPet} />
            <form onSubmit={handleSubmit} className="AddPetform">
              <input type="file" onChange={handleImageChange} />
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
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="AddPet_dropdown">
                <select className="AddPet_dropbtn" name="type" value={pet.type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>
              <input className="AddPetForm_input" type="text" placeholder="Breed" name="breed" value={pet.breed} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="Weight (kg)" name="weight" value={pet.weight} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="Address" name="location" value={pet.location} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="About" name="about" value={pet.about} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="Caretaker Name" name="caretakerInfo" value={pet.caretakerInfo} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="Caretaker Number" name="caretakerNumber" value={pet.caretakerNumber} onChange={handleChange} />
              <input className="AddPetForm_input" type="text" placeholder="Caretaker Location" name="address" value={pet.address} onChange={handleChange} />
              <a href="/home"><button className="AddPet_submit" type="submit">Add Pet</button></a>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;