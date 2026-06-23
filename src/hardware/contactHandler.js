import { Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { DevicePermissions } from '../functions/devicePermissions';

export const handleSelectContact = async (taskForm, setTaskForm) => {

  const hasPermission = await DevicePermissions.requestContactsPermissions();
  if (!hasPermission) return;

  try {
    console.log("LOG: Abriendo Selector Nativo de Contactos del Teléfono...");
    
    
    const contact = await Contacts.presentContactPickerAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    
    if (contact) {
      const name = contact.name || "Contacto sin nombre";
      
      
      const phone = contact.phoneNumbers && contact.phoneNumbers.length > 0 
        ? contact.phoneNumbers[0].number 
        : "Sin teléfono";

     
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