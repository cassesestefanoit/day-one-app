import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

export const DevicePermissions = {
  //  Permiso de Cámara y Galería
  requestCameraPermissions: async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
      Alert.alert(
        "Permiso Denegado",
        "Se necesitan permisos de Cámara y Galería para adjuntar fotos a tus tareas."
      );
      return false;
    }
    return true;
  },

  // Permiso de Ubicación (GPS)
  requestLocationPermissions: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permiso Denegado",
        "Se necesita acceso a la ubicación para registrar dónde realizás la tarea."
      );
      return false;
    }
    return true;
  },

  // Permiso de Contactos
  requestContactsPermissions: async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permiso Denegado",
        "Se necesita acceso a los contactos para asignar un responsable a la tarea."
      );
      return false;
    }
    return true;
  },

  //  Permiso de Calendario Nativo
  requestCalendarPermissions: async () => {
    const calendarStatus = await Calendar.requestCalendarPermissionsAsync();
    // En iOS se suele requerir también el permiso de recordatorios
    const remindersStatus = await Calendar.requestRemindersPermissionsAsync();
    
    if (calendarStatus.status !== 'granted' || remindersStatus.status !== 'granted') {
      Alert.alert(
        "Permiso Denegado",
        "Se necesitan permisos de calendario para sincronizar las tareas con tu agenda nativa."
      );
      return false;
    }
    return true;
  }
};