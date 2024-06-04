import React, { useState, useEffect } from 'react';
import './addpet.css';
import { IonContent, IonPage, } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
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


const LandingPage: React.FC = () => {

    const history = useHistory();

    const { id } = useParams<{ id: string }>();
    const [pet, setPet] = useState<Pet>({
        index: Date.now(),
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
        status: 'available',
        address: ''
    });

    useEffect(() => {
        const fetchPet = async () => {
            const db = firebase.firestore();
            const petDoc = await db.collection('pets').doc(id).get();
            setPet(petDoc.data() as Pet);
        };

        fetchPet();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPet({ ...pet, [e.target.name]: e.target.value });
    };

    const handleUpdateAndSubmit = async (e: React.FormEvent, updatedPet: Pet) => {
        e.preventDefault();
      
        const db = firebase.firestore();
        await db.collection('pets').doc(id).set(updatedPet);
      
        history.push('/rehome');
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
                        <form onSubmit={(e) => handleUpdateAndSubmit(e, pet)} className="UpdatePetform">
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
                            <input className="AddPetForm_input" type="text" placeholder="Caretaker Information" name="caretakerInfo" value={pet.caretakerInfo} onChange={handleChange} />
                            <input className="AddPetForm_input" type="text" placeholder="Caretaker Number" name="caretakerNumber" value={pet.caretakerNumber} onChange={handleChange} />
                            <input className="AddPetForm_input" type="text" placeholder="Caretaker Location" name="address" value={pet.address} onChange={handleChange} />
                            <a href="/home"><button className="AddPet_submit" type="submit">Save</button></a>
                        </form>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;