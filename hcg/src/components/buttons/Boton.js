import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Boton = ({ textoBoton, accionBoton }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={accionBoton} style={styles.button}>
        <Text style={styles.buttonText}>{textoBoton}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Boton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  button: {
    backgroundColor: '#2F2C2C',
    padding: 12,
    borderRadius: 10,
    width: 120,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'QuickSand',
  },
});
