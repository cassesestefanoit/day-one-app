import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DevicePermissions } from '../functions/devicePermissions';

export const handlePickImage = async (setTaskForm) => {
  const hasPermission = await DevicePermissions.requestCameraPermissions();
  if (!hasPermission) return;

  Alert.alert(
    "Adjuntar Imagen",
    "¿Desde dónde querés subir la foto para tu tarea?",
    [
      {
        text: " Tomar Foto (Cámara)",
        onPress: () => openHardwareAction('camera', setTaskForm)
      },
      {
        text: " Elegir de Galería",
        onPress: () => openHardwareAction('library', setTaskForm)
      },
      {
        text: "Cancelar",
        style: "cancel"
      }
    ]
  );
};

const openHardwareAction = async (type, setTaskForm) => {
  try {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    };

    let result;
    if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      console.log("LOG HANDLER: Foto capturada:", selectedUri);
      
      // Mantiene todo lo que estaba en el modal intacto y solo pisa la key de la imagen
      setTaskForm((prev) => ({
        ...prev,
        image: selectedUri
      }));
    }
  } catch (error) {
    console.error("Error capturando foto:", error);
    Alert.alert("Error", "No se pudo acceder a la cámara o galería.");
  }
};