import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Home from "./pages/landingpage";
import Adopt from "./pages/adopt";
import AdoptMe from "./pages/adoptme";
import Appointment from "./pages/appointment";
import ViewApointment from "./pages/viewAppointments";
import UpdateAppointment from "./pages/updateAppointment";
import NotifAppointment from "./pages/notifyappointment";
import ReHome from "./pages/rehome";
import AddPet from "./pages/addpet";
import UpdateForm from "./pages/updatePet";
import AppointmentList from "./pages/appointment_list";
import PetIdentifier from "./pages/PetIdentify";
import AdminHome from "./pages/adminHome";
import AdminPet from "./pages/adminPet";
import AdminUpdatePet from "./pages/adminUpdatePet";
import AdminAppointments from "./pages/adminAppointments";
import AdminAppointmentsUpdate from "./pages/adminAppoinmentsupdate";
import PetIdentifyUser from "./pages/petIdentify_user";
import Profile from "./pages/profile";
import UpdateProfile from "./pages/edituser";
import LoggedOutHome from "./pages/home";
import Explore from "./pages/explore";
import Discover from "./pages/discover";
import LoggedOutIdentify from "./pages/loggedOut_identify";
import ViewPet from "./pages/viewPet";
import Welcome from "./pages/welcome";
import Dashboard from "./pages/adminDashboard";
import UserLog from "./pages/userlog";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const fontsLink = document.createElement("link");
fontsLink.href =
  "https://fonts.googleapis.com/css2?family=Aclonica&display=swap";
fontsLink.href =
  "https://fonts.googleapis.com/css2?family=Odor+Mean+Chey&display=swap";
fontsLink.href = "https://fonts.googleapis.com/css2?family=Forum&display=swap";
fontsLink.href =
  "https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&display=swap";
fontsLink.href = "https://fonts.googleapis.com/css2?family=Acme&display=swap";
fontsLink.href =
  "https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap";
fontsLink.rel = "stylesheet";
document.head.appendChild(fontsLink);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/:userID/Identifier"> 
          {" "}
          {/* DESIGN RETAIN */}
          <PetIdentifier />
        </Route>
        <Route exact path="/:userID/PetIdentifier">
          {" "}
          {/* DESIGN RETAIN */}
          <PetIdentifyUser />
        </Route>
        <Route exact path="/IdentifyPets">
          {" "}
          {/* DESIGN RETAIN */}
          <LoggedOutIdentify />
        </Route>
        <Route exact path="/signup">
          {" "}
          {/*MODIFIED DESIGN*/}
          <SignUp />
        </Route>
        <Route exact path="/login">
          {" "}
          {/*MODIFIED DESIGN*/}
          <Login />
        </Route>
        <Route exact path="/:userID/Home"> {/*@landingpage.tsx*/}
          {" "}
       {/*MODIFIED DESIGN*/}
          <Home />
        </Route>
        <Route exact path="/Menu">
          {" "}
          {/*MODIFIED DESIGN "not yet done"*/}
          <LoggedOutHome />
        </Route>
        <Route exact path="/Welcome">
          {" "}
          {/*MODIFIED DESIGN*/}
          <Welcome />
        </Route>
        <Route exact path="/:userID/Explore"> {/* DESIGN RETAIN */}
          <Adopt />
        </Route>
        <Route exact path="/Discover">  {/* DESIGN RETAIN */}
          <Discover />
        </Route>
        <Route exact path="/:userID/PetView/:id"> {/* DESIGN RETAIN */}
          <AdoptMe />
        </Route>
        <Route exact path="/ViewPet/:id"> {/* DESIGN RETAIN */}
          <ViewPet />
        </Route>
        <Route exact path="/:userID/appointmentlist"> {/* DESIGN RETAIN */}
          <NotifAppointment />
        </Route>
        <Route exact path="/:userID/myAppointments">  {/* DESIGN RETAIN */}
          <AppointmentList />
        </Route>
        <Route exact path="/:userID/viewAppointment/:id">  {/* DESIGN RETAIN */}
          {" "}
          /**/
          <ViewApointment />
        </Route>
        <Route exact path="/:userID/updateAppointment/:id"> {/* DESIGN RETAIN */}
          <UpdateAppointment />
        </Route>
        <Route exact path="/:userID/PetView/:userID/appointment/:id"> {/* DESIGN RETAIN */}
          \\
          <Appointment />
        </Route>
        <Route exact path="/:userID/rehome"> {/* DESIGN RETAIN */}
          <ReHome />
        </Route>
        <Route exact path="/:userID/addpet">{ /* DESIGN RETAIN */}
          <AddPet />
        </Route>
        <Route exact path="/:userID/updatepet/:id"> { /* DESIGN RETAIN */}
          <UpdateForm />
        </Route>
        <Route exact path="/:userID/adminDashboard"> { /* WORKING... */}
          <Dashboard />
        </Route>
        <Route exact path="/:userID/adminUsers"> { /* DESIGN RETAIN */}
          <AdminHome />
        </Route>
        <Route exact path="/:userID/adminAppointments"> { /* DESIGN RETAIN */}
          <AdminAppointments />
        </Route>
        <Route exact path="/:userID/selectStatus/:id"> { /* DESIGN RETAIN */}
          <AdminAppointmentsUpdate />
        </Route>
        <Route exact path="/:userID/adminPetList"> { /* DESIGN RETAIN */}
          <AdminPet />
        </Route>
        <Route exact path="/:userID/userLog"> { /* DESIGN RETAIN */}
          <UserLog />
        </Route>
        <Route exact path="/:userID/adminUpdatePet/:id"> { /* DESIGN RETAIN */}
          <AdminUpdatePet />
        </Route>
        <Route exact path="/:userID/profile/:userID">
          <Profile />
        </Route>
        <Route exact path="/:userID/profile/:userID/edit/:userID">
          <UpdateProfile />
        </Route>
        <Route exact path="/">
          <Redirect to="/Welcome" />
        </Route>
        <Route path="/:userID/PetView/:anotherUserID/appointment/:appointmentID/Home">
          {({ match }) =>
            match ? <Redirect to={`/${match.params.userID}/Home`} /> : null
          }
        </Route>
        <Route path="/:userID/updateAppointment/:UserID/appointmentlist">
          {({ match }) =>
            match ? (
              <Redirect to={`/${match.params.userID}/appointmentlist`} />
            ) : null
          }
        </Route>
        <Route path="/:userID/selectStatus/:UserID/adminAppointments">
          {({ match }) =>
            match ? (
              <Redirect to={`/${match.params.userID}/adminAppointments`} />
            ) : null
          }
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
