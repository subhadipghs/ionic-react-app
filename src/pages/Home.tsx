import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useWatchPosition } from "@ionic/react-hooks/geolocation";

export const Home: React.FC = () => {
  const [pos, setPos] = React.useState<object>({});
  const { currentPosition, startWatch, clearWatch } = useWatchPosition();

  React.useEffect(() => {
    startWatch();
    setPos({
      latitude: currentPosition?.coords.latitude,
      longitude: currentPosition?.coords.longitude,
    });
    return () => clearWatch();
  }, [currentPosition]);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Geolocation React</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{JSON.stringify(pos, null, 2)}</IonContent>
    </>
  );
};

export default Home;
