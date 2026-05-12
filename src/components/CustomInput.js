import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Theme } from '../theme/theme';

const CustomInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value} // el value es el texto que se muestra en el input, y se actualiza cada vez que el usuario escribe algo nuevo gracias al onChangeText.
        onChangeText={onChangeText} //guarda los estados del input
        placeholder={placeholder} 
        secureTextEntry={secureTextEntry} // esta propiedad es para contraseña ya que hacemos que se oculte el texto que el usuario escribe. [a futuro un boton para ver que lo questamos escribiendo]
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5, color: '#333', fontWeight: 'bold' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd', //Color gris clarito para el borde
    fontSize: 16
  }
});

export default CustomInput;