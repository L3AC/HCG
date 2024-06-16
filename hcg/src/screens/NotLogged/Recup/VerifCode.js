import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons

const Producto = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas

  return (

    <View style={styles.container}>
      {/* Botón para volver a la pantalla anterior (en este caso a la pantalla de login) */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={40} color="black" />
      </TouchableOpacity>
      {/* Título de la pantalla de registro */}
      <Text style={styles.title}>Recuperación</Text>
      <Text style={styles.text}>¡Hola, pato!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#d29c65', // Color de fondo
  },
  text: {
    marginTop: 40,
    fontSize: 24,
    textAlign: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default Producto;