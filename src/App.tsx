import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import SignUp from './pages/signup';
import Login from './pages/login';
import AdopterHome from './pages/landingpage_adopter';
import PetOwnerHome from './pages/landingpage_petOwner';
import AdopterAdopt from './pages/adopt_adopter';
import PetOwnerAdopt from './pages/adopt_petOwner';
import AdopterAdoptMe from './pages/adoptme_adopter';
import PetOwnerAdoptMe from './pages/adoptme_petOwner';
import Appointment from './pages/appointment';
import ReHome from './pages/rehome';
import AddPet from './pages/addpet';
import UpdateForm from './pages/updatePet';
import AppointmentList from './pages/appointment_list';
import PetIdentifier from './pages/PetIdentify';
import AdminHome from './pages/adminHome';
import AdminAppointments from './pages/adminAppointments';
import AdminAppointmentsUpdate from './pages/adminAppoinmentsupdate';
import AdminQnA from './pages/adminQnA';
import AdminQnAView from './pages/adminQnAView';
import PetIdentifyOwner from './pages/petIdentify_petOwner';
import PetIdentifyAdopter from './pages/petIdentify_adopter';
import QnA from './pages/qNA';

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
        <Route exact path="/petIdentifier">
          <PetIdentifier />
        </Route>
        <Route exact path="/petOwnerPetIdentifier">
          <PetIdentifyOwner />
        </Route>
        <Route exact path="/adopterPetIdentifier">
          <PetIdentifyAdopter />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/adopterHome">
          <AdopterHome />
        </Route>
        <Route exact path="/petOwnerHome">
          <PetOwnerHome />
        </Route>
        <Route exact path="/adopterAdopt">
          <AdopterAdopt />
        </Route>
        <Route exact path="/petOwnerAdopt">
          <PetOwnerAdopt />
        </Route>
        <Route exact path="/adopterAdoptme/:id">
          <AdopterAdoptMe />
        </Route>
        <Route exact path="/petOwnerAdoptme/:id">
          <PetOwnerAdoptMe />
        </Route>
        <Route exact path="/appointmentlist">
          <AppointmentList />
        </Route>
        <Route exact path="/qna/:id">
          <QnA />
        </Route>
        <Route exact path="/appointment/:id">
          <Appointment />
        </Route>
        <Route exact path="/rehome">
          <ReHome />
        </Route>
        <Route exact path="/addpet">
          <AddPet />
        </Route>
        <Route exact path="/updatepet/:id">
          <UpdateForm />
        </Route>
        <Route exact path="/adminHome">
          <AdminHome />
        </Route>
        <Route exact path="/adminAppointments">
          <AdminAppointments />
        </Route>
        <Route exact path="/selectStatus/:id">
          <AdminAppointmentsUpdate />
        </Route>
        <Route exact path="/adminQnA">
          <AdminQnA />
        </Route>
        <Route exact path="/adminQnAView/:id">
          <AdminQnAView />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
