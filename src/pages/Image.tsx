import React from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonButton,
} from "@ionic/react";



export const ImageList: React.FC = () => {
  const [toggle, setToggle] = React.useState<boolean>(true);

  return (
    <IonContent className="ion-padding">
      <IonButton
        onClick={() => setToggle(!toggle)}
        shape="round"
        color="primary"
      >
        Toggle State
      </IonButton>
      <IonList>
        <IonItem> <IonLabel>{toggle ? "ON" : "OFF"}</IonLabel></IonItem>
      </IonList>
    </IonContent>
  );
};

export default ImageList;
