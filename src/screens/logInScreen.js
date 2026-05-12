import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { Theme } from '../theme/theme';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import { StorageService } from '../services/storageService';

const LoginScreen = ({ navigation }) => {
  // Estados para guardar el email y la contraseña que el usuario ingresa en los inputs.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => { // verificamos si se puede o no entrar
    // 1. Traemos al usuario que guardamos en el Registro
    const savedUser = await StorageService.getUser();

    // 2. Validamos si existe y si los datos coinciden
    if (savedUser && savedUser.email === email && savedUser.password === password) { // operador && para verificar tanto email y contraseña
      Alert.alert("¡Bienvenido!", `Hola de nuevo, ${savedUser.name}`); // si coincide pasamos al home y nos recibe un alert de bienvenida.
      navigation.navigate('Home');
    } else {
      // 3. Si algo no coincide, avisamos
      Alert.alert("Error", "Credenciales incorrectas o usuario no registrado.");
    }
  };

  return (
    <KeyboardAvoidingView // evitar overlapping del teclado
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} // posibilidad de escalabilidad y uso en disp.IOS
    >
      <Text style={styles.title}>Welcome Back</Text>
      
      <View style={styles.card}>
        <CustomInput 
          label="Email" 
          value={email} 
          onChangeText={setEmail} 
          placeholder="Ingresa tu email"
        />
        <CustomInput 
          label="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          placeholder="Ingresa tu contraseña"
        />
        
       <ActionButton title="Log IN" onPress={handleLogin} />  
      </View> 
    </KeyboardAvoidingView>
  );
}; // action button importado desde el componente

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', padding: 25 },
  title: { fontFamily: Theme.fonts.title, fontSize: 40, textAlign: 'center', marginBottom: 30 },
  card: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 20, borderRadius: 20 }
});

export default LoginScreen;