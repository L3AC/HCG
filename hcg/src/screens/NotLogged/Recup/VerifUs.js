import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons


const Producto = () => {
  return (
    <View style={styles.container}>
      {/* Botón para volver a la pantalla anterior (en este caso a la pantalla de login) */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={40} color="black" />
      </TouchableOpacity>
      {/* Título de la pantalla de registro */}
      <Text style={styles.title}>Recuperación</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#d29c65', // Background color
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize : 30,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Producto;