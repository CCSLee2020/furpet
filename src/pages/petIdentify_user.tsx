import React, { useEffect, useState, useRef, useReducer } from "react";
import { IonContent, IonPage, } from '@ionic/react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import './petIdentifyNotAdmin.css';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


type State = 'initial' | 'loadingModel' | 'modelReady' | 'imageReady' | 'identifying' | 'complete';
type Event = 'next';

interface Result {
    className: string;
    probability: number;
}

interface Machine {
    initial: State;
    states: {
        [state in State]: {
            on: {
                [event in Event]?: State;
            };
            showImage?: boolean;
            showResults?: boolean;
        };
    };
}

type User = {
    userID: string;
    id: string;
    email: string;
    role: string;
    name: string;
};

const machine: Machine = {
    initial: "initial",
    states: {
        initial: { on: { next: "loadingModel" } },
        loadingModel: { on: { next: "modelReady" } },
        modelReady: { on: { next: "imageReady" } },
        imageReady: { on: { next: "identifying" }, showImage: true },
        identifying: { on: { next: "complete" } },
        complete: { on: { next: "modelReady" }, showImage: true, showResults: true }
    }
};

const PetIdentifyAdopter: React.FC = () => {

    const [results, setResults] = useState<Result[]>([]);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [model, setModel] = useState<any | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [users, setUsers] = useState<User | null>(null);
    const { userID } = useParams<{ userID: string }>();
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

    const reducer = (state: State, event: Event) =>
        machine.states[state].on[event] || machine.initial;

    const [appState, dispatch] = useReducer(reducer, machine.initial);
    const next = () => dispatch("next");

    const loadModel = async () => {
        next();
        const model = await mobilenet.load();
        setModel(model);
        next();
    };

    const identify = async () => {
        next();
        if (imageRef.current) {
            const results = await model.classify(imageRef.current);
            setResults(results);
        }
        next();
    };

    const reset = async () => {
        setResults([]);
        next();
    };

    const upload = () => inputRef.current?.click();

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files && files.length > 0) {
            const url = URL.createObjectURL(files[0]);
            setImageURL(url);
            next();
        }
    };

    const actionButton = {
        initial: { action: loadModel, text: "Load Model" },
        loadingModel: { action: () => { }, text: "Loading Model..." },
        modelReady: { action: upload, text: "Upload Image" },
        imageReady: { action: identify, text: "Identify Breed" },
        identifying: { action: () => { }, text: "Identifying..." },
        complete: { action: reset, text: "Reset" }
    };


    const { showImage, showResults } = machine.states[appState];

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


                <main className="main">
                    <div className="petIdentifierBody">
                        <div className="petIdentifierDiv">
                            {showImage && <img className="petIdentifierImg" src={imageURL || undefined} alt="upload-preview" ref={imageRef} />}
                            <input
                                className="petIdentifierInput"
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleUpload}
                                ref={inputRef}
                            />

                            {showResults && (
                                <ul className="petIdentifierUl">
                                    {results.map(({ className, probability }) => (
                                        <li className="petIdentifierLi" key={className}>{`${className}: %${(probability * 100).toFixed(
                                            2
                                        )}`}</li>
                                    ))}
                                </ul>
                            )}
                            <button className="petIdentifierButton" onClick={actionButton[appState].action || (() => { })}>
                                {actionButton[appState].text}
                            </button>
                        </div>
                    </div>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default PetIdentifyAdopter;