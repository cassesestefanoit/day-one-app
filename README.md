#DayOneApp - Agenda & Gestor de tareas

¡Bienvenido a **DayOneApp**! Una aplicación móvil nativa desarrollada con **React Native** y **Expo** diseñada para la gestión eficiente de tareas diarias, eventos y hábitos, integrada con recursos de hardware del dispositivo y un flujo robusto de arquitectura de estado.

---

## Características Principales

* **Calendario Dinámico:** Navegación por meses y selección de días con actualización en tiempo real de tareas en curso.
* **Gestión de Tareas (Zustand):** Operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) utilizando un store global persistente y asíncrono.
* **Recursos de Hardware Utilizados:**
    * 📷 **Cámara/Galería (`expo-image-picker`):** Permite asociar una miniatura visual a cada tarea.
    * 👤 **Contactos (`expo-contacts`):** Vinculación directa de un contacto de la agenda a una tarea específica.
    * ⏰ **Alarmas/Calendario (`expo-calendar`):** Sincronización de alertas con el calendario nativo del celular.
    * 📍 **Ubicación (GPS) (`expo-location`):** Captura de coordenadas de alta precisión, traducción a dirección humana (Reverse Geocoding) y enlace dinámico a Google Maps.

---

## Tecnologías y Librerías Utilizadas

* **Framework:** React Native (Managed Workflow con Expo)
* **Gestión de Estado:** Zustand (con persistencia en almacenamiento local)
* **Iconografía:** `@expo/vector-icons` (Feather)
* **Testing:** Jest + `jest-expo` + `react-test-renderer`

---

## Suite de Tests Unitarios

La aplicación cuenta con una cobertura de pruebas unitarias enfocada en la lógica pura de negocio y consistencia, evitando dependencias del ciclo de vida asíncrono del renderizador de componentes nativos:

1.  `calendarUtils.test.js`: Validación de algoritmos de cálculo de días y meses.
2.  `taskStore.test.js`: Verificación de la inmutabilidad y acciones del estado global (Zustand).
3.  `CustomInput.test.js` & `locationHandler.test.js`: Pruebas de consistencia de tipado de datos y formateo de URLs de geolocalización.

Para correr los tests en tu máquina ejecuta:
```bash
npm test
