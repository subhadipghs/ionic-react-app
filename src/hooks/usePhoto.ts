import { useState, useEffect } from 'react'
import { useCamera } from '@ionic/react-hooks/camera'
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage'
import { isPlatform } from '@ionic/react'
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import GeolocationService from '../services/GeolocationService'

const PHOTO_STORAGE = "test_photos";

export interface GeoLocation {
  latitude?: number;
  longitude?: number;
}

export interface Photo {
  filepath: string;
  webviewPath?: string;
}

export function usePhoto() {

  const [photos, setPhotos] = useState<Photo[]>([]);  
  const [locations, setLocations] = useState<GeoLocation[]>([]);

  const { getPhoto } = useCamera();
  const { deleteFile, readFile, writeFile } = useFilesystem();
  const { get, set } = useStorage();

  useEffect(() => {
    const loadSaved = async () => {
      try {  
        const photosString = await get(PHOTO_STORAGE);
        const photosInStorage = (photosString ? JSON.parse(photosString) : []) as Photo[];
        // If running on the web...
        if (!isPlatform('hybrid')) {
          for (let photo of photosInStorage) {
            const file = await readFile({
              path: photo.filepath,
              directory: FilesystemDirectory.Data
            });
            // Web platform only: Load the photo as base64 data
            photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
          }
        }
        setPhotos(photosInStorage);
      } catch(error) {
        console.log(error);
      }
    };  
    loadSaved();
  }, [get, readFile]);


  /**
    Get the curent location
    @return {object|null}
  */
  const getLocation = async () => {
    const geolocation = new GeolocationService();
    const coordinates = await geolocation.getCurrentPosition();
    const {latitude, longitude} = coordinates.coords;
    return {
      latitude,
      longitude
    }
  }


  const writeLocationsOnFile = async (location: GeoLocation[] | null) => {
    try {
      const writtenFile = await writeFile({
        path: '/secrets/locations.txt',
        data: JSON.stringify(locations),
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8
      })
      console.log('Write success', writtenFile);
    } catch(error) {
      console.error(error);
    }
  }


  const takePhoto = async () => {
    try {
       const cameraPhoto = await getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });
      const fileName = new Date().getTime() + '.jpeg';
      // get the locations 
      const { longitude, latitude } = await getLocation();
      console.log({longitude, latitude});

      const savedFileImage = await savePicture(cameraPhoto, fileName);
      const newPhotos = [savedFileImage, ...photos];
      setPhotos(newPhotos);

      const newLocations = [{ latitude: latitude, longitude: longitude }, ...locations];
      setLocations(newLocations);
      writeLocationsOnFile(newLocations);
      set(PHOTO_STORAGE, JSON.stringify(newPhotos));
    } catch(error) {
      console.log(error);
    }
  };

  const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
    let base64Data: string;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform('hybrid')) {
      const file = await readFile({
        path: photo.path!
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }
    const savedFile = await writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (isPlatform('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's 
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  const deletePhoto = async (photo: Photo) => {
    // Remove this photo from the Photos reference data array
    const newPhotos = photos.filter(p => p.filepath !== photo.filepath);

    // Update photos array cache by overwriting the existing photo array
    set(PHOTO_STORAGE, JSON.stringify(newPhotos));

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data,

    });
    setPhotos(newPhotos);
  };

  return {
    deletePhoto,
    getLocation,
    locations,
    photos,
    takePhoto
  };
}