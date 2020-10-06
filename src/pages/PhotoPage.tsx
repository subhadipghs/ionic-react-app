import React from 'react';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonToolbar,
  IonActionSheet
} from '@ionic/react'
import { usePhoto, Photo } from '../hooks/usePhoto'
import { camera, close, trash } from 'ionicons/icons'


const PhotoPage : React.FC = () => {
  const { photos, takePhoto, locations, deletePhoto} = usePhoto();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Take photos with locations</IonTitle>
        </IonToolbar>
      </IonHeader>    
      <IonContent>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol className="ion-padding" size="12" key={index}>
                <IonImg src={photo.webviewPath} />
                Location: {JSON.stringify(locations[index])}
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton
            onClick={() => takePhoto()}
          >
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default PhotoPage;