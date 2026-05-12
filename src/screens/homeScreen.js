import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Modal, TextInput, ScrollView, Alert, Platform 
} from 'react-native';
import { StorageService } from '../services/storageService';
import { Theme } from '../theme/theme';
import ActionButton from '../components/ActionButton';

// Generamos las 24 horas del día
const HOURS = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}:00`); //

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); // Datos del usuario
  const [tasks, setTasks] = useState([]);// Lista de tareas
  const [selectedDate, setSelectedDate] = useState(new Date()); // El día que el usuario toca en el calendario
  const [currentMonth, setCurrentMonth] = useState(new Date()); // El mes que estamos mostrando arriba
  
  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Si esto tiene algo, estamos editando; si es null, es una tarea nueva
  const [taskForm, setTaskForm] = useState({ title: '', desc: '', priority: 'Baja', time: '09:00' });

  // Cuando renderizamos, traemos los datos del Storage
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userData = await StorageService.getUser();
    const savedTasks = await StorageService.getTasks();
    setUser(userData);
    setTasks(savedTasks || []);
  };

  const handleLogout = async () => {
    // Aquí podrías limpiar el Storage si fuera necesario
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  // --- LÓGICA DE CALENDARIO ---
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); 
    const days = new Date(year, month + 1, 0).getDate(); // ponemos mes de 1, 0 en vez de 31 para que el sist, 
    // lo interprete como un dia antes del primero del, de esta forma es que podemos definir cuantos dias tiene ese mes
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset)); // Cambiamos de mes sumando o restando 1 al estado de currentMonth
    setCurrentMonth(new Date(newMonth));
  };

  // --- LÓGICA DE TAREAS ---
  const openModal = (hour, task = null) => {
    if (task) {
      // Si recibimos una tarea, cargamos el formulario con sus datos
      setEditingTask(task);
      setTaskForm({ title: task.title, desc: task.desc, priority: task.priority, time: task.time });
    } else {
      // Si no recibimos nada, limpiamos el formulario para una tarea nueva
      setEditingTask(null);
      setTaskForm({ title: '', desc: '', priority: 'Baja', time: hour });
    }
    setModalVisible(true);
  };

  const saveTask = async () => {
    if (!taskForm.title) return Alert.alert("Error", "El título es obligatorio");

    let updatedTasks;
    const taskDate = selectedDate.toDateString();

    if (editingTask) { // EDITAR: Buscamos la tarea por ID y la reemplazamos en el array
      updatedTasks = tasks.map(t => t.id === editingTask.id ? { ...t, ...taskForm } : t);
    } else { // CREAR: Creamos un objeto nuevo con un ID único basado en el tiempo actual
      const newTask = { id: Date.now().toString(), ...taskForm, date: taskDate };
      updatedTasks = [...tasks, newTask]; // Agregamos la nueva tarea a la lista existente
    }

    setTasks(updatedTasks); // de esta manera actualizamos la vista
    await StorageService.saveTasks(updatedTasks);
    setModalVisible(false);
  };

  const deleteTask = async (id) => {
    // Filtramos la lista: dejamos afuera la tarea que tiene el ID que queremos borrar
    const filtered = tasks.filter(t => t.id !== id);
    setTasks(filtered);
    await StorageService.saveTasks(filtered);
    setModalVisible(false);
  };

  // --- RENDERS ---
  const renderHourSlot = (hour) => {
    // FILTRADO CLAVE: Solo mostramos tareas que coincidan con la FECHA y la HORA de este slot
    const hourlyTasks = tasks.filter(t => t.date === selectedDate.toDateString() && t.time === hour);

    return (
      <View key={hour} style={styles.hourRow}>
        <Text style={styles.hourLabel}>{hour}</Text>
        <TouchableOpacity 
          style={styles.slotContent} 
          onPress={() => openModal(hour)} // Al tocar el espacio vacío, creamos tarea en esa hora
        >
          {hourlyTasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={[styles.taskCard, { borderLeftColor: getPriorityColor(task.priority) }]}
              onPress={() => openModal(hour, task)} // Al tocar la tarea, la editamos
            >
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc}>{task.priority} • {task.desc || 'Sin desc.'}</Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </View>
    );
  };

  const getPriorityColor = (p) => { // semaforo de prioridades
    if (p === 'Alta') return '#FF4D4D';
    if (p === 'Media') return '#FFA500';
    return '#4CAF50';
  };

  return (
    <View style={styles.container}>
      {/* HEADER & LOGOUT */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Hi, {user?.name || 'User'}!</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* CALENDARIO HORIZONTAL */}
        <View style={styles.calendarNav}>
          <TouchableOpacity onPress={() => changeMonth(-1)}><Text style={styles.arrow}>←</Text></TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}><Text style={styles.arrow}>→</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
          {getDaysInMonth(currentMonth).map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayLetter, isSelected && styles.textWhite]}>
                  {date.toLocaleString('default', { weekday: 'short' })}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.textWhite]}>{date.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* TIMELINE */}
      <ScrollView contentContainerStyle={styles.timelineContent}>
        <Text style={styles.sectionTitle}>Ongoing Tasks</Text>
        {HOURS.map(hour => renderHourSlot(hour))}
      </ScrollView>

      {/* MODAL DE TAREA */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Título de la tarea" 
              value={taskForm.title}
              onChangeText={t => setTaskForm({...taskForm, title: t})}
            />
            <TextInput 
              style={[styles.input, { height: 80 }]} 
              placeholder="Descripción" 
              multiline
              value={taskForm.desc}
              onChangeText={t => setTaskForm({...taskForm, desc: t})}
            />

            <Text style={styles.label}>Prioridad:</Text>
            <View style={styles.priorityContainer}>
              {['Baja', 'Media', 'Alta'].map(p => (
                <TouchableOpacity 
                  key={p} 
                  style={[styles.priorityBtn, taskForm.priority === p && { backgroundColor: getPriorityColor(p) }]}
                  onPress={() => setTaskForm({...taskForm, priority: p})}
                >
                  <Text style={styles.priorityBtnText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <ActionButton title="Guardar" onPress={saveTask} />
              {editingTask && (
                <TouchableOpacity onPress={() => deleteTask(editingTask.id)} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>Eliminar Tarea</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#35BFED',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, alignItems: 'center' },
  greeting: { fontSize: 24, fontFamily: Theme.fonts.title, color: '#FFF' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 10 },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
  
  calendarNav: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  monthText: { fontSize: 18, color: '#FFF', fontWeight: 'bold', marginHorizontal: 20, textTransform: 'capitalize' },
  arrow: { fontSize: 24, color: '#FFF' },
  
  daysScroll: { marginTop: 15, paddingLeft: 20 },
  dayItem: { width: 50, height: 70, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderRadius: 15 },
  dayItemSelected: { backgroundColor: '#1D3557' }, // Azul oscuro cuando hacés click
  dayLetter: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  dayNumber: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  textWhite: { color: '#FFF' },

  timelineContent: { padding: 25 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1D3557' },
  
  hourRow: { flexDirection: 'row', marginBottom: 20, minHeight: 60 },
  hourLabel: { width: 60, fontSize: 12, color: '#94A3B8', paddingTop: 5 },
  slotContent: { flex: 1, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingVertical: 5 }, //borderTopWidth: 1, línea finita para separar las horas
  
  taskCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 5,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  taskTitle: { fontWeight: 'bold', fontSize: 14 },
  taskDesc: { fontSize: 12, color: '#64748B' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 25, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 10, padding: 15, marginBottom: 15 },
  label: { marginBottom: 10, fontWeight: 'bold' },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  priorityBtn: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 10, backgroundColor: '#E2E8F0', marginHorizontal: 5 },
  priorityBtnText: { fontWeight: 'bold' },
  modalButtons: { gap: 10 },
  deleteBtn: { padding: 15, alignItems: 'center' },
  deleteText: { color: '#FF4D4D', fontWeight: 'bold' },
  cancelBtn: { padding: 10, alignItems: 'center' }
});

export default HomeScreen;