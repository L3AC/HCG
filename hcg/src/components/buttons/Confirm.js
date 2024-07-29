import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const Confirm = ({ tittle, onPress }) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{tittle}</Text>
        </TouchableOpacity>
    </View>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  button: {
    height: 50,
    width: '50%', // Ajusta el ancho del botón
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    backgroundColor: '#2F2C2C', // Color de fondo del botón
    borderRadius: 8, // Bordes redondeados del botón
    marginTop: 20, // Reducir margen superior del botón
    marginBottom: 20, //
  },
  buttonText: {
    color: 'white', // Color del texto del botón
    fontFamily: 'QuickSandBold',
    fontSize: 16
  },
});
