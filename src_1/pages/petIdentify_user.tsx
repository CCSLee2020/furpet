import React, { useEffect, useState, useRef, useReducer } from "react";
import { IonContent, IonPage, } from '@ionic/react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import './petIdentifyNotAdmin.css';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useParams } from 'react-router-dom';


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
                <nav>
                    <div className="logo1">
                        <img className='navLogo1' src={navLogo} alt="" />
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