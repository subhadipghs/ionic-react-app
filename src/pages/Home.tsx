import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton
} from "@ionic/react";

import GeolocationService from '../services/GeolocationService'

type GetLocationState = {
  loading?: boolean,
  data?: Array<object> | object,
  error?: string
}

type Location = {
  latitude: number,
  longitude: number,
}

const initialLocationState : GetLocationState = {
  loading: false,
  data: [],
  error: ''
}


function locationReducer(state: GetLocationState, action: any) {
  switch(action.TYPE) {
    case 'LOADING':
      return {
        ...state,
        loading: true
      };
    case 'LOCATION_RECEIVED':
      return {
        ...state,
        data: Object.assign({}, action.PAYLOAD),
        loading: false
      };
    case 'ERROR_OCCURED':
      return {
        ...state,
        error: action.ERROR_PAYLOAD
      };
    default:
      return state;
  }
}

export const Home: React.FC = () => {    

  const [state, dispatch] = React.useReducer(locationReducer, initialLocationState)
  const [searchLocation, setSearchLocation] = React.useState<boolean>(false)


  React.useEffect(
    () => {
      async function loadLocation() {
        dispatch({ TYPE: 'LOADING' })
        const geolocation = new GeolocationService();
        const coordinates = await geolocation.getCurrentPosition();
        const {latitude, longitude} = coordinates.coords;
        console.info(latitude, longitude);
        dispatch({ 
          TYPE: 'LOCATION_RECEIVED', 
          PAYLOAD: {
            latitude: latitude,
            longitude: longitude,
          } 
        })
      }
      if (searchLocation) {
        loadLocation();
        setSearchLocation(false);
      } 
    },
    [searchLocation]
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Geolocation React</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton
          onClick={() => setSearchLocation(true)}
        >
          Know your location
        </IonButton>
        {(state.loading) ? (
          <IonList>
            <IonItem>Loading your location....</IonItem>
          </IonList>
        ) : (
          <IonList>
            <IonItem>Latitude: {state.data?.latitude}</IonItem>
            <IonItem>Longitude: {state.data?.longitude}</IonItem>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
