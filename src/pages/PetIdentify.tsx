import React, { useState, useRef, useReducer } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./PetIdentify.css";
import './style.css';

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

const PetIdentifier: React.FC = () => {
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
    <div className="adminHome">
      <div className="grid-container">
        <div className="menu-icon">
          <strong> &#9776;</strong>
        </div>
        <header className="header">
          <div className="header_title">
            <h2>Identify Breeds</h2>
          </div>
          <div className="header_avatar"><i className="fas fa-user-circle fw fa-xl"></i></div>
        </header>
        <aside className="aside">
          <div className="aside_close-icon">
            <strong>&times;</strong>
          </div>
          <h2 className="menu_title"><i className="fas fa-paw fw"></i> FurPet</h2>
          <ul className="aside_list">
            <a href="/adminHome">
              <li className="aside_list-item">
                <i className="fas fa-users fw"></i> Users
              </li>
            </a>
            <a href="/adminPetList">
              <li className="aside_list-item">
                <i className="fas fa-clipboard fw"></i> Pet List
              </li>
            </a>
            <a href="/adminAppointments">
              <li className="aside_list-item">
                <i className="fas fa-clipboard fw"></i> Appointments
              </li>
            </a>
            <a href="/petIdentifier">
              <li className="aside_list-item active-list">
                <i className="fas fa-search fw"></i> Identify Breeds
              </li>
            </a>
          </ul>
          <ul className="aside_footer">
            <li className="aside_list-item">
              <a href="/login">
                Logout
              </a>
            </li>
          </ul>
        </aside>
        <main className="main">
          <div className="petIdentifierBody2">
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
      </div>
    </div>
  );
}

export default PetIdentifier;
