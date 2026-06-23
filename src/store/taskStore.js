import { create } from 'zustand';
import { StorageService } from '../services/storageService';

export const useTaskStore = create((set, get) => ({
  tasks: [],

  fetchTasks: async () => {
    try {
      const storedTasks = await StorageService.getTasks();
      set({ tasks: storedTasks || [] });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  addTask: async (taskForm, dateStr) => {
    try {
      const currentTasks = get().tasks;
      const newTask = {
        ...taskForm,
        id: Date.now().toString(),
        date: dateStr,
      };
      const updatedList = [...currentTasks, newTask];
      await StorageService.saveTasks(updatedList);
      set({ tasks: updatedList });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  updateTask: async (updatedTask) => {
    try {
      const currentTasks = get().tasks;
      // Buscamos la tarea por ID y la reemplazamos por el bloque nuevo con la foto incluida
      const updatedList = currentTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );
      
      await StorageService.saveTasks(updatedList);
      set({ tasks: updatedList });
      console.log("LOG STORE: Tarea actualizada con éxito en Storage.");
    } catch (error) {
      console.error("Error updating task in store:", error);
    }
  },

  deleteTask: async (taskId) => {
    try {
      const currentTasks = get().tasks;
      const updatedList = currentTasks.filter((task) => task.id !== taskId);
      await StorageService.saveTasks(updatedList);
      set({ tasks: updatedList });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));