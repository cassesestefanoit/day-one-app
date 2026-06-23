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

##  Punto Extra: IA Aplicada al Desarrollo

Para potenciar el desarrollo, la arquitectura, el diseño y el proceso de testing de **DayOneApp**, se incorporó asistencia avanzada mediante Inteligencia Artificial (LLM) utilizando **Gemini / ChatGPT**. A continuación se documentan los enfoques y los prompts clave aplicados:

### 1. Prompts Efectivos Aplicados (Ejemplos)

>  **Contexto de Rediseño Estético (Calendario Dinámico):**
> * **Prompt:** *"Actuá como un diseñador UI/UX experto en React Native. Tengo un componente de calendario básico que renderiza los días del mes en texto plano y vertical, lo cual es dificultoso y poco intuitivo para el cliente. Necesito transformarlo en una barra horizontal deslizable (`ScrollView` horizontal). Cada día debe ser una tarjeta con bordes redondeados que muestre el día de la semana arriba y el número abajo. Si el día está seleccionado, debe resaltar con un fondo oscuro (`#1D3557`) y el texto en blanco, y el resto de los días deben verse sutiles. Dame el código estructurado con StyleSheet optimizado."*
> * **Resultado:** Se logró la maquetación limpia y scannable de la barra de días que quedó integrada en el `HomeScreen`.

>  **Contexto de Debugging y Cobertura de Tests (Jest):**
> * **Prompt:** *"Estoy configurando Jest con `jest-expo` en React Native. Al intentar hacer un test unitario tradicional del store de Zustand y de funciones que manejan fechas, el entorno de pruebas me tira errores de ciclo de vida nativos porque intenta renderizar componentes del core de Expo. Necesito aislar la lógica de negocio. Escribime una suite de pruebas unitarias puras que use mocks para validar el cambio de meses en `calendarUtils` y las mutaciones del estado de las tareas sin depender del renderizado asíncrono."*
> * **Resultado:** Creación de los archivos de prueba en la carpeta `__tests__` que permitieron pasar toda la suite de tests a verde (`PASS`).
