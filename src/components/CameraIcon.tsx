import {IonIcon, IonButton} from '@ionic/react'
import React from 'react';
import './CameraIcon.css';
import {camera} from 'ionicons/icons'



const CameraIcon: React.FC = () => {
  return (
    <div className="container">
      <IonButton shape="round" color="primary">
        <IonIcon icon={camera} slot="icon-only"/>
      </IonButton>
    </div>
  );
};

export default CameraIcon;
