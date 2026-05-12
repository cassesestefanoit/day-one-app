import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@user_session', // aca establecemos que guardamos la sesion del usuario
  TASKS: '@user_tasks' // aca vamos a guardar la lista de tareas
};

export const StorageService = {
  
// Lo mas importante es que guardemos lo que guardemos hay que hacerlo en formato JSON.

  // --- SECCIÓN USUARIO ---

  // Guardar datos del usuario
  saveUser: async (userData) => {
    try {
      const jsonValue = JSON.stringify(userData); // funcion para pasar de objeto a JSON.
      await AsyncStorage.setItem(KEYS.USER, jsonValue); // guardamos en el disco en apartado del user_session.
    } catch (e) {
      console.error("Error guardando usuario:", e);
    }
  },

  // Obtener datos del usuario para esto hay que reconvenrir el Json al objecto
  getUser: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.USER); 
      return jsonValue != null ? JSON.parse(jsonValue) : null; // si no hay dato devuelve null, sino devuelve el objeto convertido a partir del JSON.
    } catch (e) {
      console.error("Error obteniendo usuario:", e);
      return null;
    }
  },

  // --- SECCIÓN TAREAS ---

  // Guardar la lista completa de tareas
  saveTasks: async (tasks) => {
    try {
      // mismo proces que con el usuario, pero ahora con la lista de tareas. Convertimos el array de tareas a JSON y lo guardamos.
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(KEYS.TASKS, jsonValue);
    } catch (e) {
      console.error("Error guardando tareas:", e);
    }
  },

  // Obtener las tareas guardadas
  getTasks: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.TASKS);
      // mismo proceso que con el usuario, pero ahora con la lista de tareas. Si no hay tareas guardadas devuelve un array vacío,
      //  sino devuelve el array convertido a partir del JSON.
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error obteniendo tareas:", e);
      return [];
    }
  },

  // --- MANTENIMIENTO ---

  // Eliminar solo la sesión del usuario (Logout)
    removeUser: async () => {
    try {
      await AsyncStorage.removeItem(KEYS.USER);
    } catch (e) {
      console.error("Error eliminando sesión:", e);
    }
  },

  // Limpiar Todo.
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Error limpiando storage:", e);
    }
  }
};