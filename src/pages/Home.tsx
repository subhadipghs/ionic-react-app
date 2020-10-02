import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Plugins } from "@capacitor/core";

const { Geolocation } = Plugins;

/**
 * a text component
 */
const Text: React.FC<{ children?: React.ReactChild }> = ({ children }) => (
  <div className="text">{children}</div>
);

// sample image with geotag
const imagePath: string =
  "https://www.geoimgr.com/images/samples/england-london-bridge-225.jpg";

export const Home: React.FC = () => {
  const [pos, setPos] = React.useState<object>({});

  /*
    set the location state
    @param {function} setState which set the state based on location
    @return {null}
  */
  const setLocation = async (setState: (obj: object) => void) => {
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;
    setState({
      latitude: latitude,
      longitude: longitude,
    });
  };

  React.useEffect(() => {
    setLocation(setPos);
  }, [pos]);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Image with EXIF data</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{JSON.stringify(pos, null, 2)}</IonContent>
    </>
  );
};

export default Home;
