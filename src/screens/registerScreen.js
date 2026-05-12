import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard,ScrollView } from 'react-native';
import { Theme } from '../theme/theme';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import { StorageService } from '../services/storageService';

const RegisterScreen = ({ navigation }) => {
  // Estados para capturar lo que el usuario escribe
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //2. Al cargar la pantalla, mostramos un mensaje de aviso sobre el prototipo
  useEffect(() => {
  // Este código se ejecuta una sola vez al entrar a la pantalla
  Alert.alert(
    "Aviso de Prototipo",
    "Esta es una simulación para fines académicos. No existe verificación real de correo, por lo que puedes usar datos ficticios. ¡Tus datos se guardarán solo localmente!",
    [{ text: "Entendido", style: "cancel" }]
  );
}, []); // Los brackets vacíos [] aseguran que solo salga UNA VEZ al cargar la pantalla

  // 3. Función lógica del botón (Asíncrona)
  const handleRegister = async () => {
    //Que no haya campos vacíos
    if (!name || !email || !password) {
      Alert.alert("Por favor, completa todos los campos para continuar.");
      return;
    }

    try {
      // Creamos el objeto usuario
      const newUser = {
        name: name,
        email: email,
        password: password,
        
      };

      //Guardamos usando AWAIT para evitar el colapso de la app.
      await StorageService.saveUser(newUser);

      
      Alert.alert("¡Éxito!", `Bienvenido ${name}, tu cuenta ha sido creada.`);
      
      // 5. Ingreso al Home mediante navigation
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No pudimos guardar tus datos. Reintentá.");
    }
  };

  return (
   <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Permite cerrar el teclado al tocar cualquier parte vacía */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.headerTitle}>DAY ONE</Text>
          
          <View style={styles.card}>
            <Text style={styles.welcomeText}>Hi!</Text>
            
            <CustomInput 
              label="Nombre" 
              placeholder="Tu nombre aquí" 
              value={name}
              onChangeText={setName} 
            />
            
            <CustomInput 
              label="Email" 
              placeholder="ingresa tu email" 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address" // esto es para que el teclado del usuario incluya en la solapa principal el @
              autoCapitalize="none" // // Para que no ponga la primera del mail en mayúscula
            />
            
            <CustomInput 
              label="Password" 
              placeholder="ingresa tu contraseña" 
              secureTextEntry={true} // ocultamos la contraseña en un futuro si escala podemos agregar el boton para ver lo que se esta escribiendo
              value={password}
              onChangeText={setPassword} 
            />

            <View style={styles.buttonWrapper}>
              <ActionButton title="Sign IN" onPress={handleRegister} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: 30,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Theme.fonts.title,
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)', // El efecto traslúcido de la card
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  welcomeText: {
    fontFamily: Theme.fonts.title,
    fontSize: 38,
    marginBottom: 15,
    color: '#000',
  },
  buttonWrapper: {
    marginTop: 20,
    width: '100%',
    alignSelf: 'center'
  }
});

export default RegisterScreen;