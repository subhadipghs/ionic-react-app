import React from "react";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonLabel,
  IonInput,
  IonButton,
  IonToolbar,
  IonCol,
  IonImg,
  IonFab,
  IonIcon,
  IonFabButton,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import { useFilesystem, base64FromPath } from "@ionic/react-hooks/filesystem";
import { isPlatform } from "@ionic/react";

import {
  Plugins,
  CameraResultType,
  CameraPhoto,
  CameraSource,
} from "@capacitor/core";

const { Camera } = Plugins;

const UploadImage: React.FC<{}> = () => {
  const [imagePath, setImagePath] = React.useState<any>(null);
  const [imageWebviewPath, setImageWebviewPath] = React.useState<any>(null);
  const [msg, setMsg] = React.useState<string>("");
  const [image, setImage] = React.useState<any>();
  const [s3url, setS3url] = React.useState<string>('');
  const [imageName, setImageName] = React.useState<string>('');
  const [imageType, setImageType] = React.useState<string>('');
  const [testError, setTestError] = React.useState<string>('');

  

  const takePicture = async (): Promise<void> => {
    try {
      const image: CameraPhoto = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      });
      setImagePath(image.path);
      if (isPlatform("hybrid")) {
        setImageName(image.path?.substr(image.path?.lastIndexOf('/')+1)!)
      } else {
        setImageName(image.webPath?.substr(image.webPath.lastIndexOf('/')+1)!);
      }
      setImageType("image/"+image.format);
      setImageWebviewPath(image.webPath);
      setMsg(JSON.stringify(image));
    } catch (error) {
      console.error(error);
      setMsg(JSON.stringify(error));
    }
  };
  

  const sendFileToServer = async (dataTobeTransferred: string) => {
    try {  
      const data = new FormData();
      let base64String: string = dataTobeTransferred.split(',')[1];
      const decodedB64 = (atob(base64String));
      const decodedB64Length = decodedB64.length;
      const ia = new Uint8Array(decodedB64.length);
      for (let i = 0; i < decodedB64Length; i++) {
        ia[i] = decodedB64.charCodeAt(i);
      }
      const blobData = new Blob([ia], {
        type: imageType
      });
      data.append('image', blobData);
      const res = await (await fetch('http://192.168.1.202:4004/api/image-upload?section=general', {
        method: 'POST',
        body: data,
      })).json();
      setMsg(JSON.stringify(res));
      setS3url(res?.imageUrl);
    } catch (error) {
      console.log(error);
      setMsg(JSON.stringify(error));
    }
  }
  
  
  const uploadImageFn = async (evt: any): Promise<void> => {
    try {
      evt.preventDefault();
      let data : string = await base64FromPath(imageWebviewPath);
      sendFileToServer(data);
    } catch (error) {
      setMsg(JSON.stringify(error));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upload image</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>Image Path: {imagePath}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Error: {testError}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Image Type: {imageType}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Image webview: {imageWebviewPath}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Message: {JSON.stringify(msg)}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol> Image Name: {imageName}</IonCol>
          </IonRow>
          <IonRow>
            <form
              encType="multipart/form-data"
              onSubmit={(evt) => uploadImageFn(evt)}
            >
              <IonButton type="submit">Submit</IonButton>
            </form>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            <IonLabel className="">Image Preview</IonLabel>
          </IonRow>
          <IonRow>
            {!!imageWebviewPath ? (
              <IonCol className="ion-padding" size="12">
                <IonImg src={imageWebviewPath} />
              </IonCol>
            ) : null}
          </IonRow>
          <IonRow>
            {s3url ? (
               <IonImg src={s3url}/>
            ) : null}
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => takePicture()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default UploadImage;
