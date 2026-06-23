import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { DevicePermissions } from '../functions/devicePermissions';

export const handleGetLocation = async (taskForm, setTaskForm) => {
  // 🛡️ Validamos primero los permisos de geolocalización
  const hasPermission = await DevicePermissions.requestLocationPermissions();
  if (!hasPermission) return;

  try {
    console.log("LOG: Permisos OK. Buscando GPS de alta precisión...");
    
    // Obtener las coordenadas del dispositivo
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    const { latitude, longitude } = currentLocation.coords;

    // 🗺️ Traducir coordenadas a una dirección humana (Calle, Altura, Ciudad)
    let addressString = "Ubicación obtenida";
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        // Formateamos una dirección legible (Ej: Av. Santa Fe 1234, CABA)
        addressString = `${place.street || ''} ${place.name || ''}, ${place.city || place.subregion || ''}`.trim();
        // Limpiamos comas consecutivas por si faltan datos
        addressString = addressString.replace(/^,|,$/g, '').trim();
      }
    } catch (geoError) {
      console.log("LOG: No se pudo resolver la dirección de texto, usando coordenadas por defecto.");
    }

    // 🔗 CORREGIDO: Enlace limpio y universal a Google Maps Search API
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    // Guardamos toda la estructura enriquecida en el formulario de la tarea
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