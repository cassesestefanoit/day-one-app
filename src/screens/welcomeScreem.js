import React from 'react';
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import ActionButton from '../components/ActionButton';
import { Theme } from '../theme/theme';

const brandingImage = require('../../assets/Logo.png');  // traemos la foto del logo que esta almacenada en assets
const { width } = Dimensions.get('window'); // de esta manera la imagen se adapte en el ancho a cualquier celular

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      {/* SECCIÓN SUPERIOR: Logo y Título */}
      <View style={styles.brandingContainer}>
        <Image 
          source={brandingImage} 
          style={styles.brandingImage} 
          resizeMode="contain" // de esta manera no se deforma la imagen cuando escala
        />
        {/* Texto más pegado mediante margen negativo */}
        <Text style={styles.title}>DAY ONE</Text>
      </View>

      {/* SECCIÓN INFERIOR: Botones Unificados */}
      <View style={styles.buttonsContainer}>
        <ActionButton 
          title="Ingresar" 
          type="primary" 
          onPress={() => navigation.navigate('Login')}
        />
        <ActionButton 
          title="Crear cuenta" 
          type="primary" 
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Theme.colors.background, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 80, 
  },
  brandingContainer: {
    flex: 2, // Le damos un poco más de peso al contenedor de marca
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -90,
  },
  brandingImage: {
    width: width * 0.75, 
    height: width * 0.75,
    marginBottom: 0, // Eliminamos el espacio extra
  },
  title: {
    fontSize: 52, 
    fontFamily: Theme.fonts.title,
    color: '#0F172A',
    letterSpacing: -1, 
    textAlign: 'center',
    marginTop: -90, // MARGEN NEGATIVO para pegar el texto al logo
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 20,
    gap: 10, // Espaciado entre botones
  }
});

export default WelcomeScreen;