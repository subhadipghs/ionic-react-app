import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

export default class GeolocationService {
  /*
    @return {object|null}
  */
  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  }
}
