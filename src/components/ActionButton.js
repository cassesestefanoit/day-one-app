import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, Platform } from 'react-native';

const ActionButton = ({ title, onPress, type = 'primary', style }) => { 
  const animatedValue = useRef(new Animated.Value(1)).current;   // useRef para evitar que se resetee en cada renderizado

  const handlePressIn = () => { // La idea es achicar el componente cuando se prsiona el boton
    Animated.spring(animatedValue, {
      toValue: 0.96, // Valor de la escala para el efecto de pulsación
      useNativeDriver: true, 
    }).start();
  };

  const handlePressOut = () => { // aca hacemos que al soltar el botón vuelva a su tamaño original
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = (pressed) => [
    styles.button,
    type === 'primary' && styles.primary, // aca tiene el azul original
    type === 'secondary' && styles.secondary, // El mismo azul pero en outline
    pressed && styles.pressed, // si esta apretado, se aplica el estilo de opacidad
    style,
  ];

  const getTextStyle = () => [
    styles.text,
    type === 'primary' && styles.textPrimary, // el color que blanco que defini mas abajo.
    type === 'secondary' && styles.textSecondary, // Color azul que que se define mas abajo
  ];

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: animatedValue }] }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={({ pressed }) => getButtonStyle(pressed)}
      >
        <Text style={getTextStyle()}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

// los estilos son declarativos tanto para android como para IOS pensando en una posible futura publicación en ambas plataformas.
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  button: {
    paddingVertical: 18, 
    borderRadius: 16,    
    alignItems: 'center',
    justifyContent: 'center',
    // Esto es para que las sombras funcionen en los dos sistemas ya que ambos manejan las sombras de manera diferente.
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  // --- OPCIÓN 1: AZUL NOCHE SOBRIO ---
  primary: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#0F172A',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0F172A', 
  },

  pressed: {
    opacity: 0.9,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase', // Para que el texto siempre esté en mayúsculas
  },
  textPrimary: { 
    color: '#FFFFFF' 
  },
  textSecondary: { 
    color: '#0F172A' 
  },
});

export default ActionButton;