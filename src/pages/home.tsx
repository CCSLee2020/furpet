import React, { useEffect, useState } from "react";
import "./landingpage.css";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import welcomeImg from "../assets/welcomeImg2.jpg";
import dog1 from "../assets/dog 1.png";
import footprint1 from "../assets/footprint 1.png";
import cat1 from "../assets/cat 1.png";
import adoptionProcess from "../assets/Group 32.png";
import { Link, useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import navLogo from "../assets/anIOs_StartupLogo-PSC8.png";
import WelcomeImg from "../assets/HomepageIMG.jpg";
import step1 from "../assets/step1.jpg"
import step2 from "../assets/step2.jpg"
import step3 from "../assets/step-3.jpg"
import { logoFacebook, logoInstagram, mailOutline } from "ionicons/icons";
import GC from "../assets/GC.png";




type Pet = {
  id: string;
  index: number;
  name: string;
  age: number;
  gender: "male" | "female";
  neutered: "yes" | "no";
  type: "cat" | "dog";
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
  const [selectedType, setSelectedType] = useState<"Dog" | "Cat" | "all">(
    "all"
  );
  const [users, setUsers] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const result = await storageRef.child("images").listAll();
      const urlPromises = result.items.map((imageRef) =>
        imageRef.getDownloadURL()
      );
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
      const petCollection = db.collection("pets").orderBy("index");
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
    };

    fetchPets();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(userID).get();
      const user = { id: doc.id, ...doc.data() } as User;
      setUsers(user);
    };
    fetchData();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <nav>
          <div className="logo1">
            <img className="navLogo1" src={navLogo} alt="" />
            <h1 className="h1_logo1">FurPet</h1>
          </div>
          <div className="nav-links2">
            <a href="/Menu">Home</a>
            <a href="/Discover">Explore</a>
            <a href="/IdentifyPets">Identify</a>
            <a href="/login">Login</a>
          </div>
        </nav>
       
        <section className="welcome" id="welcome">
            <div className="imgContainer">
              <img className="HomeIMG" src={WelcomeImg} alt="" />
            </div>
            <div className="overlayComponent">
              {" "}
              <h1 className="welText">Ready to Adopt!</h1>
              <p className="together">Together we can rescue, rehabilitate,</p>
              <p className="and">and rehome pets in need</p>
              <a href="/Menu" className="login">
                Menu
              </a>
            </div>
          </section>
          
          
     
        <div className="categories1">
          <h1 className="categories_h1">Categories</h1>
          <div className="categories_container">
            <div
              className="categories_box"
              onClick={() => setSelectedType("all")}
            >
              <img src={footprint1} />
            </div>
            <div
              className="categories_box"
              onClick={() => setSelectedType("Dog")}
            >
              <img src={dog1} />
            </div>
            <div
              className="categories_box"
              onClick={() => setSelectedType("Cat")}
            >
              <img src={cat1} />
            </div>
          </div>
        </div>
        <div className="adoption1">
          <h1 className="adpotion_h1">For Adoption</h1>
          <div className="adoption_container">
            {pets
              .filter(
                (pet) =>
                  selectedType === "all" ||
                  pet.type.toLowerCase() === selectedType.toLowerCase()
              )
              .slice(0, 3)
              .map((pet, i) => (
                <div className="adoption_box" key={pet.id}>
                  <img
                    className="adoption_image"
                    src={pet.imageUrl}
                    alt={pet.name}
                  />
                  <p className="adoption_text">{pet.name}</p>
                  <p className="adoption_desc">{pet.breed}</p>
                  <p className="adoption_desc">{pet.age} Months Old</p>
                  <p className="adoption_desc">{pet.gender}</p>
                  <p className="adoption_desc">{pet.weight} kg</p>
                  <p className="adoption_desc">{pet.location}</p>
                  <p className="adoption_desc">Status: {pet.status}</p>
                  <Link to={`/ViewPet/${pet.id}`}>
                    <div className="adoptMe">
                      <p className="adoption_button">View More</p>
                    </div>
                  </Link>
                </div>
              ))}
            <div className="adoption_box2">
              <img src={footprint1} />
              <a href="/Discover">
                <div className="adoptMe2">
                  <p className="adoption_button1">Meet More</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="adoption-journey-container">
      <div className="journey-header">
        <h1>Adoption Journey</h1>
        <p>Follow these simple steps to find your perfect companion.</p>
      </div>
      <div className="journey-steps">
        <div className="step">
        <img src={step2} alt="" />
          <h3>Step 1</h3>
          <p>Browse available pets.</p>
        </div>
        <div className="step">
        <img src={step1} alt="" />
          <h3>Step 2</h3>
          <p>Submit your application.</p>
        </div>
        <div className="step">
        <img src={step3} alt="" />
          <h3>Step 3</h3>
          <p>Meet your new friend!</p>
        </div>
      </div>
    </div>

    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>FurPet Adoption</h2>
          <p>Connecting pets with loving families.</p>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <IonIcon icon={logoFacebook} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <IonIcon icon={logoInstagram} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <IonIcon icon={mailOutline} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 FurPet Adoption. All rights reserved.</p>
        <img className="footerLogo1" src={navLogo} alt="" />
        <img className="footerLogo2" src={GC} alt="" />
      </div>
    </footer>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
