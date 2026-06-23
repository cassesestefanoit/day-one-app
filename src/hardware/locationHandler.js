import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { DevicePermissions } from '../functions/devicePermissions';

export const handleGetLocation = async (taskForm, setTaskForm) => {
 
  const hasPermission = await DevicePermissions.requestLocationPermissions();
  if (!hasPermission) return;

  try {
    console.log("LOG: Permisos OK. Buscando GPS de alta precisión...");
    
    
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    const { latitude, longitude } = currentLocation.coords;

    
    let addressString = "Ubicación obtenida";
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        
        addressString = `${place.street || ''} ${place.name || ''}, ${place.city || place.subregion || ''}`.trim();
       
        addressString = addressString.replace(/^,|,$/g, '').trim();
      }
    } catch (geoError) {
      console.log("LOG: No se pudo resolver la dirección de texto, usando coordenadas por defecto.");
    }

    
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;


    setTaskForm({
      ...taskForm,
      location: {
        latitude,
        longitude,
        address: addressString || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, // Fallback por si queda vacío
        mapsUrl: googleMapsUrl  
      }
    });

    Alert.alert("Éxito", `Ubicación guardada:\n${addressString}`);
  } catch (error) {
    console.error("Error de GPS:", error);
    Alert.alert("Error", "No se pudo obtener la posición actual del GPS.");
  }
};