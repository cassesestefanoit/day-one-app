import { Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { DevicePermissions } from '../functions/devicePermissions';

export const handleSelectContact = async (taskForm, setTaskForm) => {
  // 🛡️ Validamos los permisos de la agenda
  const hasPermission = await DevicePermissions.requestContactsPermissions();
  if (!hasPermission) return;

  try {
    console.log("LOG: Abriendo Selector Nativo de Contactos del Teléfono...");
    
    // Abre directamente la interfaz nativa del sistema operativo para elegir un contacto existente
    const contact = await Contacts.presentContactPickerAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    // Si el usuario seleccionó un contacto de la lista
    if (contact) {
      const name = contact.name || "Contacto sin nombre";
      
      // Validamos si tiene un teléfono cargado, si no, ponemos un texto por defecto
      const phone = contact.phoneNumbers && contact.phoneNumbers.length > 0 
        ? contact.phoneNumbers[0].number 
        : "Sin teléfono";

      // Guardamos el objeto limpio directamente en el formulario
      setTaskForm({
        ...taskForm,
        contact: { name, phone }
      });
      
      console.log("LOG: Contacto asignado con éxito:", name);
    }
  } catch (error) {
    console.error("Error al seleccionar contacto:", error);
    Alert.alert("Error", "No se pudo abrir la lista de contactos.");
  }
};