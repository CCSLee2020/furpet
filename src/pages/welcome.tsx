import React from "react";
import "./welcome.css";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import navLogo from "../assets/anIOs_StartupLogo-PSC8.png";
import WelcomeImg from "../assets/HomepageIMG.jpg";
import VideoAvp from "../assets/anIOs.Infomercial Video.mp4";
import { logoFacebook, logoInstagram, mailOutline } from 'ionicons/icons';
import Service1 from "../assets/service1.jpg";
import Service2 from "../assets/service2.jpg";
import Service3 from "../assets/service3.jpg";
import profile1 from "../assets/profile2.png";
import profile2 from "../assets/profile3.png";
import profile3 from "../assets/profile1.png";
import profile4 from "../assets/profile4.png";
import GC from "../assets/GC.png";

const LandingPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <nav>
          <div className="logo1">
            <img className="navLogo1" src={navLogo} alt="" />
            <h1 className="h1_logo1">FurPet</h1>
          </div>
          <div className="nav-links2">
            <a href="/login">Login</a>
          </div>
        </nav>
        <div className="page_body">
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

          <section className="avp" id="promotional">
            <div className="titleAvp">
              <p>
                Check out our promotional AVP!
                <br />
                FurPet is an innovative Progressive Web App that
                <br />
                caters to both cat and dog lovers. With its intuitive
                <br />
                interface, users can explore various cat and dog breeds,
                <br />
                learn about their unique characteristics, and even
                <br />
                identify breeds through photos. Whether you’re a seasoned
                <br />
                pet owner or a curious beginner, FurPet provides a delightful
                <br />
                experience for all animal enthusiasts.
              </p>
            </div>

            <div className="video"></div>
            <video className="avpvideo" width="480" height="270" controls>
              <source src={VideoAvp} type="video/mp4" />
            </video>
          </section>

          <section className="service" id="services">
            <h1>Services</h1>
            <div className="container">
              <div className="box">
                <img src={Service1} alt="Service 1" />
                <h2>Pet Adoption Matching</h2>
                <p>
                  FurPet connects prospective pet owners with their perfect
                  furry companions. Users can browse through profiles of
                  available cats and dogs, filtering by breed, age, and
                  temperament. The app’s intelligent matching algorithm suggests
                  pets based on the user’s preferences, making the adoption
                  process seamless and joyful.
                </p>
              </div>
              <div className="box">
                <img src={Service2} alt="Service 2" />
                <h2>Breed Identification Tool</h2>
                <p>
                  Curious about a cat or dog’s breed? FurPet’s breed
                  identification feature allows users to upload photos of their
                  pets, and the app will analyze key characteristics to
                  determine the breed. Whether it’s a playful Siamese cat or a
                  loyal Labrador retriever, FurPet provides accurate breed
                  information to satisfy users’ curiosity.
                </p>
              </div>
              <div className="box">
                <img src={Service3} alt="Service 3" />
                <h2>Educational Resources</h2>
                <p>
                  FurPet goes beyond adoption and identification. It offers a
                  wealth of educational content for pet owners. From care tips
                  and grooming advice to health-related articles, users can
                  access reliable information about their beloved companions.
                  Whether you’re a first-time pet parent or a seasoned
                  enthusiast, FurPet ensures that you’re well-informed and
                  equipped to provide the best care for your furry friends.
                </p>
              </div>
            </div>
          </section>

          <section className="about" id="about">
            <div className="container2">
              {/* <div className="image-container">
                                <img src={Snow} alt="Two happy dogs" />
                            </div> */}
              <div className="info-container">
                <h1>About FurPet</h1>
                <p>
                  <i>“Where Whiskers Find Warmth”</i>
                </p>
                <p>
                  At FurPet, we believe that every wagging tail and every gentle
                  purr deserves a loving home. Our mission is to connect
                  compassionate pet lovers with their perfect feline or canine
                  companions. But we go beyond just matching hearts; we also
                  provide a unique feature: Breed Identification. Whether you’re
                  looking for a playful Siamese kitten or a loyal Labrador
                  retriever, our team of experts can help you find the ideal pet
                  that fits your lifestyle and preferences. With FurPet, care
                  meets comfort, and every adoption becomes a heartwarming tale
                  of tails and paws finding their forever home.
                </p>
              </div>
            </div>
          </section>

          <section className="team" id="team">
            <h1>Meet The Team</h1>
            <div className="container2">
              <div className="box2">
                <img src={profile1} alt="Service 1" />
                <h2>
                  <b>Realene Evangelista</b>
                </h2>
                <h2>
                  <i>FrontEnd</i>
                </h2>
                <p>
                  FurPet's user interface is being designed by Rea utilizing
                  Ionic React, HTML, and CSS. FurPet's system is both innovative
                  and user-friendly because of her leadership over the team,
                  which ensures that functionality and visuals fit modern
                  standards.
                </p>
              </div>
              <div className="box2">
                <img src={profile2} alt="Service 2" />
                <h2>
                  <b>Hancelet Iene Lee</b>
                </h2>
                <h2>
                  <i>BackEnd</i>
                </h2>
                <p>
                  Hancelet is in charge of overseeing the server-side logic and
                  database systems of FurPet using Firebase, making sure that
                  user interactions are supported by efficient data processing
                  and system functionality, and developing the Breed
                  Identification System with TensorFlow.js.
                </p>
              </div>
              <div className="box2">
                <img src={profile3} alt="Service 3" />
                <h2>
                  <b>Alda Nasam</b>
                </h2>
                <h2>
                  <i>Researcher</i>
                </h2>
                <p>
                  Alda, the inspiration behind FurPet's launch, is in charge of
                  the project's research and documentation. Through the process
                  of breaking down complex systems, he anticipates problems,
                  encourages innovation, and develops workable solutions. Alda's
                  painstaking documentation is a priceless resource that gives
                  the team the confidence to move on.
                </p>
              </div>
              <div className="box2">
                <img src={profile4} alt="Service 3" />
                <h2>
                  <b>Yheng Miel Mayer Sanchez</b>
                </h2>
                <h2>
                  <i>Project Adviser</i>
                </h2>
                <p>
                  Mrs. Mayer Sanchez, the project adviser for FurPet, provides
                  the team with important leadership. She guarantees perfect
                  execution of every assignment with painstaking attention to
                  detail, coordinating efforts with project objectives and
                  promoting an innovative culture. Mrs. Sanchez is in a position
                  to lead FurPet to unprecedented success.
                </p>
              </div>
            </div>
          </section>
        </div>


        <footer className="footer-container_welcome">
      <div className="footer-content_welcome">
        <div className="footer-brand_welcome">
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
        <div className="footer-social_welcome">
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
