import { Alert, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

// Función auxiliar para programar el evento una vez que ya tenemos la fecha/hora exacta
const createCalendarAlarm = async (chosenDate, taskForm, setTaskForm) => {
  try {
    // 1. Solicitar permisos de Calendario
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso denegado", "Necesitamos acceso al calendario para crear la alarma.");
      return;
    }

    // 2. Obtener el calendario por defecto con fallback inteligente para Xiaomi/Android
    let defaultCalendarId;
    if (Platform.OS === 'ios') {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      defaultCalendarId = defaultCalendar.id;
    } else {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      // LOG DE CONTROL: Para ver en tu terminal los calendarios disponibles en tu Xiaomi
      console.log("=== CALENDARIOS DETECTADOS ===");
      calendars.forEach(cal => {
        console.log(`ID: ${cal.id} | Name: ${cal.name} | Type: ${cal.accountType} | Primary: ${cal.isPrimary}`);
      });

      // Selección inteligente para evitar el calendario "mudo" local de MIUI:
      // Prioriza Google Calendar, sino el primario del sistema, sino el primero de la lista.
      const targetCalendar = 
        calendars.find(cal => cal.accountType === 'com.google') || 
        calendars.find(cal => cal.isPrimary) || 
        calendars[0];

      if (!targetCalendar) {
        Alert.alert("Error", "No se encontró un calendario válido en el dispositivo.");
        return;
      }
      
      console.log(`-> Seleccionado para guardar: ID ${targetCalendar.id} (${targetCalendar.name})`);
      defaultCalendarId = targetCalendar.id;
    }

    // El evento durará 30 minutos en la agenda
    const endDate = new Date(chosenDate.getTime() + 30 * 60 * 1000);

    // Formateamos la hora exacta elegida en formato HH:MM para mostrar en el badge
    const hoursStr = chosenDate.getHours().toString().padStart(2, '0');
    const minutesStr = chosenDate.getMinutes().toString().padStart(2, '0');
    const exactTimeStr = `${hoursStr}:${minutesStr}`;

    // 3. Crear el evento en el calendario real con canal de sonido activo
    const eventId = await Calendar.createEventAsync(defaultCalendarId, {
      title: `⏰ DayOne: ${taskForm.title || 'Recordatorio'}`,
      startDate: chosenDate,
      endDate: endDate,
      timeZone: 'GMT-3',
      notes: taskForm.desc || 'Creado desde DayOne App',
      alarms: [{ relativeOffset: 0, method: Calendar.AlarmMethod.SOUND }],
    });

    // 4. Guardamos el estado con la hora exacta real (ej: 06:25)
    if (typeof setTaskForm === 'function') {
      setTaskForm({
        ...taskForm,
        alarmSet: true,
        alarmTime: exactTimeStr,
        calendarEventId: eventId
      });
    }

    Alert.alert("🎉 Alarma Seteada", `Sincronizado en tu calendario exactamente a las ${exactTimeStr} hs.`);

  } catch (error) {
    console.error("❌ Error en expo-calendar:", error);
    Alert.alert("Error", "No se pudo vincular la tarea con el calendario.");
  }
};

// --- FUNCIÓN PRINCIPAL QUE DISPARA EL BOTÓN ---
export const handleSyncCalendar = async (taskForm, setTaskForm) => {
  if (!taskForm.time) {
    Alert.alert("Atención", "Falta el horario base de la tarea.");
    return;
  }

  // Preparamos la fecha base usando el slot actual
  const [hour, minute] = taskForm.time.split(':');
  const baseDate = new Date();
  baseDate.setHours(parseInt(hour, 10));
  baseDate.setMinutes(parseInt(minute, 10));
  baseDate.setSeconds(0);

  // Si la hora del slot ya pasó hoy, asumimos que es para mañana
  if (baseDate < new Date()) {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  // Si es Android, disparamos el reloj flotante nativo
  if (Platform.OS === 'android') {
    DateTimePickerAndroid.open({
      value: baseDate,
      mode: 'time',
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          // El usuario eligió una hora exacta (ej: 06:25). Procedemos a guardar.
          createCalendarAlarm(selectedDate, taskForm, setTaskForm);
        }
      },
    });
  } else {
    // Para iOS o fallback rápido
    createCalendarAlarm(baseDate, taskForm, setTaskForm);
  }
};

// --- FUNCIÓN PARA ELIMINAR EL EVENTO ---
export const handleDeleteCalendarEvent = async (taskForm, setTaskForm) => {
  if (!taskForm.calendarEventId) return;
  try {
    await Calendar.deleteEventAsync(taskForm.calendarEventId);
    if (typeof setTaskForm === 'function') {
      setTaskForm({ ...taskForm, alarmSet: false, alarmTime: null, calendarEventId: null });
    }
    Alert.alert("Alarma Eliminada", "El recordatorio se removió de tu calendario.");
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
    if (typeof setTaskForm === 'function') {
      setTaskForm({ ...taskForm, alarmSet: false, alarmTime: null, calendarEventId: null });
    }
  }
};