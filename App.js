import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'; //controlar la pantalla de carga para que no se muestre hasta que las fuentes estén listas.
import { useFonts } from 'expo-font'; // cargamos las fuentes
import { AlfaSlabOne_400Regular } from '@expo-google-fonts/alfa-slab-one';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

// Importamos nuestro navegador
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync(); // cargar la pantalla solo hasta que las fuenten esten listas.

export default function App() {
  const [fontsLoaded] = useFonts({
    //booleano si es true las fuentes estan listas y podemos renderizar.
    'AlfaSlabOne': AlfaSlabOne_400Regular, 
    'Montserrat_Regular': Montserrat_400Regular,
    'Montserrat_Bold': Montserrat_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]); // ultimo paso de verificacion para ver si las fuentes estan listas, si lo estan ocultamos la pantalla de carga.

  if (!fontsLoaded) return null;

  return (
    //El NavigationContainer envuelve toda la app para que funcione el paso de pantallas
    <NavigationContainer onReady={onLayoutRootView}>
      <AppNavigator />
    </NavigationContainer>
  );
}