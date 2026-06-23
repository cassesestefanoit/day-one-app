import { useState } from 'react';
import { Alert } from 'react-native';
import { useTaskStore } from '../store/taskStore';

import { handlePickImage } from '../hardware/imageHandler';
import { handleGetLocation } from '../hardware/locationHandler';
import { handleSelectContact } from '../hardware/contactHandler';
import { handleSyncCalendar, handleDeleteCalendarEvent } from '../hardware/alarmHandler';

export const useHomeLogic = (selectedDate) => {
  const { addTask, updateTask, deleteTask } = useTaskStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    desc: '',
    priority: 'Media',
    time: '09:00',
    image: null,
    location: null,
    contact: null,
    alarmSet: false, 
    alarmTime: null,
    calendarEventId: null
  });

  const openModal = (hour, task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        id: task.id,
        title: task.title || "",
        desc: task.desc || "",
        priority: task.priority || "Media",
        time: task.time || hour,
        date: task.date,
        image: task.image || null,
        location: task.location || null,
        contact: task.contact || null,
        alarmSet: task.alarmSet || false,
        alarmTime: task.alarmTime || null,
        calendarEventId: task.calendarEventId || null,
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: "",
        desc: "",
        priority: "Media",
        time: hour,
        image: null,
        location: null,
        contact: null,
        alarmSet: false,
        alarmTime: null,
        calendarEventId: null,
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!taskForm.title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    try {
      if (editingTask && editingTask.id) {
        console.log("LOG HOOK: Enviando cambios al Store de Zustand para ID:", editingTask.id);
        // Enviamos el formulario con la URI de la foto mutada directamente
        await updateTask(taskForm);
      } else {
        console.log("LOG HOOK: Creando tarea nueva");
        const taskDate = selectedDate.toDateString();
        await addTask(taskForm, taskDate);
      }
      
      setModalVisible(false);
      setEditingTask(null);
    } catch (error) {
      console.error("❌ Error en handleSave:", error);
      Alert.alert("Error", "No se pudo guardar la tarea.");
    }
  };

  const handleDelete = async () => {
    if (editingTask && editingTask.id) {
      if (taskForm.calendarEventId) {
        try {
          await handleDeleteCalendarEvent(taskForm, () => {});
        } catch (e) {
          console.log("No se pudo borrar el evento.");
        }
      }
      await deleteTask(editingTask.id);
      setModalVisible(false);
      setEditingTask(null);
    }
  };

  return {
    modalVisible,
    setModalVisible,
    editingTask,
    taskForm,
    setTaskForm,
    openModal,
    handleSave,
    handleDelete,
    handlePickImage: () => handlePickImage(setTaskForm),
    handleGetLocation: () => handleGetLocation(taskForm, setTaskForm),
    handleSelectContact: () => handleSelectContact(taskForm, setTaskForm),
    handleSyncCalendar: () => handleSyncCalendar(taskForm, setTaskForm),
    handleDeleteCalendarEvent: () => handleDeleteCalendarEvent(taskForm, setTaskForm)
  };
};