import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Linking,
} from "react-native";
import { StorageService } from "../services/storageService";
import { useTaskStore } from "../store/taskStore";
import { useHomeLogic } from "../functions/useHomeLogic";
import { getDaysInMonth, calculateNewMonth } from "../functions/calendarUtils";
import ActionButton from "../components/ActionButton";
import { Feather } from "@expo/vector-icons";

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const hourStr = hour < 10 ? "0" + hour : hour;
  return `${hourStr}:${minutes}`;
});

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { tasks, fetchTasks } = useTaskStore();

  const {
    modalVisible,
    setModalVisible,
    editingTask,
    taskForm,
    setTaskForm,
    openModal,
    handleSave,
    handleDelete,
    handlePickImage,
    handleGetLocation,
    handleSelectContact,
    handleSyncCalendar,
    handleDeleteCalendarEvent,
  } = useHomeLogic(selectedDate);

  useEffect(() => {
    const prepareApp = async () => {
      const userData = await StorageService.getUser();
      setUser(userData);
      await fetchTasks();
    };
    prepareApp();
  }, []);

  // Forzamos actualización visual al cambiar día o cerrar modal
  useEffect(() => {
    fetchTasks();
  }, [modalVisible, selectedDate]);

  const handleLogout = async () => {
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const handleChangeMonth = (offset) => {
    const nextMonth = calculateNewMonth(currentMonth, offset);
    setCurrentMonth(nextMonth);
  };

  const getPriorityColor = (p) => {
    if (p === "Alta") return "#FF4D4D";
    if (p === "Media") return "#FFA500";
    return "#4CAF50";
  };

  const renderHourSlot = (hour) => {
    const hourlyTasks = tasks.filter(
      (t) => t.date === selectedDate.toDateString() && t.time === hour,
    );

    const [justHour, justMinutes] = hour.split(":");

    return (
      <View key={hour} style={styles.hourRow}>
        <View style={styles.hourLabelContainer}>
          <Text style={styles.hourTextNum}>{justHour}</Text>
          <Text style={styles.hourTextMin}>{`:${justMinutes}`}</Text>
        </View>

        <View style={styles.slotContent}>
          {hourlyTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                { borderLeftColor: getPriorityColor(task.priority) },
              ]}
              onPress={() => openModal(hour, task)}
            >
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc}>
                {task.priority} • {task.desc || "Sin desc."}
              </Text>
            </TouchableOpacity>
          ))}

          {hourlyTasks.length === 0 && (
            <TouchableOpacity
              style={styles.emptySlotButton}
              onPress={() => openModal(hour)}
            >
              <Text style={styles.emptySlotText}>+ Añadir tarea</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Hi, {user?.name || "User"}!</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarNav}>
          <TouchableOpacity onPress={() => handleChangeMonth(-1)}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity onPress={() => handleChangeMonth(1)}>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysScroll}
        >
          {getDaysInMonth(currentMonth).map((date, index) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[styles.dayLetter, isSelected && styles.textWhite]}
                >
                  {date.toLocaleString("default", { weekday: "short" })}
                </Text>
                <Text
                  style={[styles.dayNumber, isSelected && styles.textWhite]}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.timelineContent}>
        <Text style={styles.sectionTitle}>Ongoing Tasks</Text>
        {HOURS.map((hour) => renderHourSlot(hour))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContainer}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingTask ? "Editar Tarea" : "Nueva Tarea"}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Título de la tarea"
                value={taskForm.title}
                onChangeText={(t) => setTaskForm({ ...taskForm, title: t })}
              />
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Descripción"
                multiline
                value={taskForm.desc}
                onChangeText={(t) => setTaskForm({ ...taskForm, desc: t })}
              />

              <Text style={styles.label}>Prioridad:</Text>
              <View style={styles.priorityContainer}>
                {["Baja", "Media", "Alta"].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityBtn,
                      taskForm.priority === p && {
                        backgroundColor: getPriorityColor(p),
                      },
                    ]}
                    onPress={() => setTaskForm({ ...taskForm, priority: p })}
                  >
                    <Text style={styles.priorityBtnText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.hardwareSection}>
                {/* 🖼️ Render de Miniatura */}
                {taskForm.image && (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: taskForm.image }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageBadge}
                      onPress={() => setTaskForm({ ...taskForm, image: null })}
                    >
                      <Feather name="trash-2" size={14} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* 📍 Render Ubicación */}
                {taskForm.location && (
                  <View style={styles.locationContainer}>
                    <Feather name="map-pin" size={16} color="#4CAF50" />
                    <TouchableOpacity
                      style={styles.locationTextWrapper}
                      onPress={async () => {
                        if (taskForm.location.mapsUrl) {
                          const supported = await Linking.canOpenURL(
                            taskForm.location.mapsUrl,
                          );
                          if (supported)
                            await Linking.openURL(taskForm.location.mapsUrl);
                        }
                      }}
                    >
                      <Text style={styles.locationText} numberOfLines={1}>
                        {taskForm.location.address || "Ver en Google Maps"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setTaskForm({ ...taskForm, location: null })
                      }
                      style={styles.removeLocationBtn}
                    >
                      <Feather name="x" size={16} color="#FF4D4D" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* 👤 Render Contacto */}
                {taskForm.contact && (
                  <View style={styles.contactContainer}>
                    <Feather name="user" size={16} color="#35BFED" />
                    <View style={styles.contactTextWrapper}>
                      {/* 🚀 CORREGIDO: Eliminamos el objeto de estilos del contenido */}
                      <Text style={styles.contactName} numberOfLines={1}>
                        {taskForm.contact.name}
                      </Text>
                      <Text style={styles.contactPhone} numberOfLines={1}>
                        {taskForm.contact.phone}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        setTaskForm({ ...taskForm, contact: null })
                      }
                      style={styles.removeContactBtn}
                    >
                      <Feather name="x" size={16} color="#FF4D4D" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* ⏰ Render Alarma */}
                {Boolean(taskForm.alarmSet) && (
                  <View style={styles.alarmBadgeContainer}>
                    <View style={styles.alarmBadgeLeft}>
                      <Feather name="bell" size={16} color="#D97706" />
                      <Text style={styles.alarmBadgeText}>
                        Alarma: {taskForm.alarmTime || taskForm.time} hs
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteAlarmButton}
                      onPress={handleDeleteCalendarEvent}
                    >
                      <Feather name="trash-2" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.subLabel}>Recursos del Dispositivo</Text>

                <View style={styles.hwIconRow}>
                  <TouchableOpacity
                    style={styles.hwMiniButton}
                    onPress={handlePickImage}
                  >
                    <Feather name="camera" size={20} color="#35BFED" />
                    <Text style={styles.hwMiniButtonText}>Foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.hwMiniButton}
                    onPress={handleGetLocation}
                  >
                    <Feather name="map-pin" size={20} color="#35BFED" />
                    <Text style={styles.hwMiniButtonText}>Ubicación</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.hwMiniButton}
                    onPress={handleSelectContact}
                  >
                    <Feather name="user" size={20} color="#35BFED" />
                    <Text style={styles.hwMiniButtonText}>Contacto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.hwMiniButton}
                    onPress={handleSyncCalendar}
                  >
                    <Feather name="bell" size={20} color="#35BFED" />
                    <Text style={styles.hwMiniButtonText}>Alarma</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <ActionButton title="Guardar" onPress={handleSave} />
                {editingTask && (
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteText}>Eliminar Tarea</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#35BFED",
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
  },
  greeting: { fontSize: 24, color: "#FFF" },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 10,
  },
  logoutText: { color: "#FFF", fontWeight: "bold" },
  calendarNav: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  monthText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    marginHorizontal: 20,
    textTransform: "capitalize",
  },
  arrow: { fontSize: 24, color: "#FFF" },
  daysScroll: { marginTop: 15, paddingLeft: 20 },
  dayItem: {
    width: 50,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderRadius: 15,
  },
  dayItemSelected: { backgroundColor: "#1D3557" },
  dayLetter: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  dayNumber: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  textWhite: { color: "#FFF" },
  timelineContent: { paddingVertical: 25, paddingHorizontal: 10 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1D3557",
    paddingHorizontal: 15,
  },
  hourRow: { flexDirection: "row", minHeight: 55 },
  hourLabelContainer: {
    width: 65,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
  },
  hourTextNum: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  hourTextMin: { fontSize: 11, color: "#64748B", paddingTop: 2 },
  slotContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  taskCard: {
    backgroundColor: "#F1F5F9",
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginVertical: 2,
    elevation: 1,
  },
  taskTitle: { fontWeight: "bold", fontSize: 13, color: "#1E293B" },
  taskDesc: { fontSize: 11, color: "#64748B" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalScrollContainer: { paddingVertical: 40, paddingHorizontal: 20 },
  modalCard: { backgroundColor: "#FFF", borderRadius: 25, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  label: { marginBottom: 8, fontWeight: "bold" },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  priorityBtn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 5,
  },
  priorityBtnText: { fontWeight: "bold" },
  hardwareSection: {
    marginVertical: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  subLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: "center",
  },
  hwIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hwMiniButton: {
    flex: 1,
    alignItems: "center",
    justifyvalue: "center",
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  hwMiniButtonText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 11,
    marginTop: 6,
  },
  modalButtons: { gap: 8, marginTop: 10 },
  deleteBtn: { padding: 12, alignItems: "center" },
  deleteText: { color: "#FF4D4D", fontWeight: "bold" },
  cancelBtn: { padding: 8, alignItems: "center" },
  emptySlotButton: { flex: 1, justifyContent: "center", paddingVertical: 10 },
  emptySlotText: { color: "#CBD5E1", fontSize: 13, fontStyle: "italic" },
  imagePreviewContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    backgroundColor: "#E2E8F0",
  },
  removeImageBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF4D4D",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  locationTextWrapper: { flex: 1, marginLeft: 10, marginRight: 5 },
  locationText: {
    color: "#1D3557",
    fontSize: 13,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  removeLocationBtn: { padding: 4 },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  contactTextWrapper: { flex: 1, marginLeft: 10 },
  contactName: { color: "#1D3557", fontSize: 13, fontWeight: "600" },
  contactPhone: { color: "#64748B", fontSize: 11, marginTop: 2 },
  removeContactBtn: { padding: 4 },
  alarmBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FEF3C7",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  alarmBadgeLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  alarmBadgeText: {
    color: "#92400E",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "600",
  },
  deleteAlarmButton: {
    padding: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    marginLeft: 10,
  },
});

export default HomeScreen;
