import React, { useState, useRef, useReducer } from "react";
import { IonContent, IonPage, } from '@ionic/react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import './petIdentifyNotAdmin.css';
import navLogo from '../assets/anIOs_StartupLogo-PSC8.png';

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

const PetIdentifyOwner: React.FC = () => {

    const [results, setResults] = useState<Result[]>([]);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [model, setModel] = useState<any | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

export default PetIdentifyOwner;