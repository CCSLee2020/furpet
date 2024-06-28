import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import SignUp from './pages/signup';
import Login from './pages/login';
import Home from './pages/landingpage';
import Adopt from './pages/adopt';
import AdoptMe from './pages/adoptme';
import Appointment from './pages/appointment';
import ViewApointment from './pages/viewAppointments';
import UpdateAppointment from './pages/updateAppointment';
import NotifAppointment from './pages/notifyappointment';
import ReHome from './pages/rehome';
import AddPet from './pages/addpet';
import UpdateForm from './pages/updatePet';
import AppointmentList from './pages/appointment_list';
import PetIdentifier from './pages/PetIdentify';
import AdminHome from './pages/adminHome';
import AdminPet from './pages/adminPet';
import AdminUpdatePet from './pages/adminUpdatePet'
import AdminAppointments from './pages/adminAppointments';
import AdminAppointmentsUpdate from './pages/adminAppoinmentsupdate';
import PetIdentifyUser from './pages/petIdentify_user';
import Profile from './pages/profile';
import UpdateProfile from './pages/edituser';
import LoggedOutHome from './pages/home';
import Explore from './pages/explore';
import LoggedOutIdentify from './pages/loggedOut_identify';
import ViewPet from './pages/viewPet';
import Welcome from './pages/welcome';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const fontsLink = document.createElement('link');
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Aclonica&display=swap';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Odor+Mean+Chey&display=swap';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Forum&display=swap';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&display=swap';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Acme&display=swap';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap';
fontsLink.rel = 'stylesheet';
document.head.appendChild(fontsLink);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/:userID/Identifier">
          <PetIdentifier />
        </Route>
        <Route exact path="/:userID/PetIdentifier">
          <PetIdentifyUser />
        </Route>
        <Route exact path="/IdentifyPets">
          <LoggedOutIdentify />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/:userID/Home">
          <Home />
        </Route>
        <Route exact path="/Menu">
          <LoggedOutHome />
        </Route>
        <Route exact path="/Welcome">
          <Welcome />
        </Route>
        <Route exact path="/:userID/Explore">
          <Adopt />
        </Route>
        <Route exact path="/Discover">
          <Explore />
        </Route>
        <Route exact path="/:userID/PetView/:id">
          <AdoptMe />
        </Route>
        <Route exact path="/ViewPet/:id">
          <ViewPet />
        </Route>
        <Route exact path="/:userID/appointmentlist">
          <NotifAppointment />
        </Route>
        <Route exact path="/:userID/myAppointments">
          <AppointmentList />
        </Route>
        <Route exact path="/:userID/viewAppointment/:id">
          <ViewApointment />
        </Route>
        <Route exact path="/:userID/updateAppointment/:id">
          <UpdateAppointment />
        </Route>
        <Route exact path="/:userID/PetView/:userID/appointment/:id">
          <Appointment />
        </Route>
        <Route exact path="/:userID/rehome">
          <ReHome />
        </Route>
        <Route exact path="/:userID/addpet">
          <AddPet />
        </Route>
        <Route exact path="/:userID/updatepet/:id">
          <UpdateForm />
        </Route>
        <Route exact path="/:userID/adminHome">
          <AdminHome />
        </Route>
        <Route exact path="/:userID/adminAppointments">
          <AdminAppointments />
        </Route>
        <Route exact path="/:userID/selectStatus/:id">
          <AdminAppointmentsUpdate />
        </Route>
        <Route exact path="/:userID/adminPetList">
          <AdminPet />
        </Route>
        <Route exact path="/:userID/adminUpdatePet/:id">
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
          {({ match }) => (
            match ? <Redirect to={`/${match.params.userID}/Home`} /> : null
          )}
        </Route>
        <Route path="/:userID/updateAppointment/:UserID/appointmentlist">
          {({ match }) => (
            match ? <Redirect to={`/${match.params.userID}/appointmentlist`} /> : null
          )}
        </Route>
        <Route path="/:userID/selectStatus/:UserID/adminAppointments">
          {({ match }) => (
            match ? <Redirect to={`/${match.params.userID}/adminAppointments`} /> : null
          )}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
