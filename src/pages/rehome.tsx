import React, { useEffect, useState } from "react";
import "./rehome.css";
import { IonContent, IonPage } from "@ionic/react";
import edit from "../assets/Vector.png";
import Delete from "../assets/material-symbols_delete-outline.png";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { Link, useParams } from "react-router-dom";
import navLogo from "../assets/anIOs_StartupLogo-PSC8.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

type Pet = {
  id: string;
  index: string;
  name: string;
  age: number;
  gender: "male" | "female";
  neutered: "yes" | "no";
  type: "cat" | "dog";
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
      const doc = await db.collection("users").doc(userID).get();
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
        const petCollection = db
          .collection("users")
          .doc(userID)
          .collection("pets")
          .orderBy("index");
        const petSnapshot = await petCollection.get();
        const petList: Pet[] = await Promise.all(
          petSnapshot.docs.map(async (doc) => {
            const petData = doc.data();
            const imageUrl = await storageRef
              .child(`images/${petData.index}`)
              .getDownloadURL();
            return { ...petData, id: doc.id, imageUrl } as Pet;
          })
        );
        setPets(petList);
      } catch (error) {
        console.error("Error fetching pets:", error);
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
        const result = await storageRef.child("images").listAll();
        const urlPromises = result.items.map((imageRef) =>
          imageRef.getDownloadURL()
        );
        const urls = await Promise.all(urlPromises);
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const deletePet = async (id: string, imageUrl: string) => {
    try {
      const db = firebase.firestore();
      const petRef = db.collection("pets").doc(id); // Main collection reference
      const subPetRef = db
        .collection("users")
        .doc(userID)
        .collection("pets")
        .doc(id); // Subcollection reference
      const imageRef = storageRef.child(`images/${imageUrl}`);
      const imageRef1 = storageRef.child(`images/${imageUrl}_1`);
      const imageRef2 = storageRef.child(`images/${imageUrl}_2`);
      const imageRef3 = storageRef.child(`images/${imageUrl}_3`);
      const imageRef4 = storageRef.child(`images/${imageUrl}_4`);
      const imageRef5 = storageRef.child(`images/${imageUrl}_5`);

      if (window.confirm("Are you sure you want to delete this pet?")) {
        // Delete the image from Firebase Storage
        await imageRef.delete();
        await imageRef1.delete();
        await imageRef2.delete();
        await imageRef3.delete();
        await imageRef4.delete();
        await imageRef5.delete();

        // Delete the pet document from the subcollection
        await subPetRef.delete();

        // Delete the pet document from the main collection
        await petRef.delete();

        // Update the local state to remove the pet
        setPets(pets.filter((pet) => pet.id !== id));
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const logUserActivity = async (activity: string) => {
    const db = firebase.firestore();
    await db.collection("userLogs").add({
      userID,
      activity,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  useEffect(() => {
    logUserActivity("filterOut");
  }, [userID]);

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
              onClick={() => logUserActivity("Navigated to Home")}
            >
              Home
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/Explore`}
              onClick={() => logUserActivity("Navigated to Explore")}
            >
              Explore
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/appointmentlist`}
              onClick={() => logUserActivity("Navigated to Appointments")}
            >
              Appointments
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/rehome`}
              onClick={() => logUserActivity("Navigated to Rehome")}
            >
              Rehome
            </a>
            </li>
            <li className="nav-item">
            <a
              href={`/${userID}/PetIdentifier`}
              onClick={() => logUserActivity("Navigated to Identify")}
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
              onClick={() => logUserActivity("Viewed Profile")}>Profile</a></li>
                <li><a className="dropdown-item" href={`/${userID}/myAppointments`}
              onClick={() => logUserActivity("Viewed My Appointments")}>My Appointment</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/Welcome" onClick={() => logUserActivity("Logged Out")}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>


        <div className="rehome">
          <h1 className="rehome_h1">Pet Listed</h1>
          <a href={`/${userID}/addpet`}>
            <h1
              className="addnewpet"
              onClick={() => logUserActivity("Create a New Pet")}
            >
              Add Pet
            </h1>
          </a>
          <div className="rehome_container">
            {pets.map((pet, i) => (
              <div className="rehome_box" key={pet.id}>
                <img className="rehome_img" src={pet.imageUrl} alt={pet.name} />
                <h1 className="rehome_texth1">{pet.name}</h1>
                <h2 className="rehome_h2">
                  <strong>Location:</strong> {pet.location}
                </h2>
                <h2 className="rehome_h2">
                  <strong>Neutered:</strong> {pet.neutered}
                </h2>
                <h2 className="rehome_h2">
                  <strong>Status:</strong> {pet.status}
                </h2>
                <Link
                  className="edit"
                  to={`/${userID}/updatePet/${pet.id}`}
                  onClick={() => logUserActivity("Edit Pet")}
                >
                  <img className="edit" src={edit} alt="edit" />
                </Link>
                <img
                  className="delete"
                  src={Delete}
                  alt="delete"
                  onClick={() => {
                    deletePet(pet.id, pet.index);
                    logUserActivity("Pet Deleted");
                  }}
                />
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
