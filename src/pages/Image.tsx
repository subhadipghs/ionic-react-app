import React from "react";
import {
  IonList,
  IonItem,
  IonThumbnail,
  IonImg,
  IonLabel,
  IonContent,
  IonButton,
} from "@ionic/react";

type Item = {
  src: string;
  text: string;
};
const items: Item[] = [
  { src: "http://placekitten.com/g/200/300", text: "a picture of a cat" },
];

export const ImageList: React.FC = () => {
  const [toggle, setToggle] = React.useState<boolean>(true);

  return (
    <IonContent>
      <IonButton
        onClick={() => setToggle(!toggle)}
        className="ion-padding"
        shape="round"
        color="primary"
      >
        Toggle State
      </IonButton>
      <IonList>
        {/*items.map((image, i) => (
        <IonItem key={i}>
          <IonThumbnail slot="start">
            <IonImg src={image.src} />
          </IonThumbnail>
          <IonLabel>{image.text}</IonLabel>
        </IonItem>
      ))*/}
        <IonItem> <IonLabel>{toggle ? "ON" : "OFF"}</IonLabel></IonItem>
      </IonList>
    </IonContent>
  );
};

export default ImageList;
