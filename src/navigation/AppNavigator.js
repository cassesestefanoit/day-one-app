import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // importamos el stack navigator para manejar la navegación entre pantallas

// importamos la ruta de las pantallas
import WelcomeScreen from '../../src/screens/welcomeScreem';
import LoginScreen from '../../src/screens/logInScreen';
import RegisterScreen from '../../src/screens/registerScreen';
import HomeScreen from '../../src/screens/homeScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome" //La pantalla de beienvenida va a ser WELCOME.
      screenOptions={{
        headerShown: false, // Saco la barra de react que trae por defecto.
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}