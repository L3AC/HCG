// Importación de librerías y componentes necesarios
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons

// Componente de función SignUp
const SignUp = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas

  return (
    <View style={styles.container}>
      {/* Botón para volver a la pantalla anterior */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Registro</Text> {/* Título de la pantalla de registro */}

      {/* Contenedor para el input de Nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#000" />
      </View>
      {/* Contenedor para el input de Apellido */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#000" />
      </View>
      {/* Contenedor para el input de Correo */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo</Text>
        <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#000" />
      </View>
      {/* Contenedor para el input de Teléfono */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefono</Text>
        <TextInput style={styles.input} placeholder="Telefono" placeholderTextColor="#000" />
      </View>
      {/* Contenedor para el input de Usuario */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#000" />
      </View>
      {/* Contenedor para el input de Contraseña */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#000" secureTextEntry={true} />
      </View>

      {/* Botón de confirmación */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#d29c65', // Background color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black', // Text color
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: 'black', // Text color
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'black', // Text color
    marginBottom: 4,
  },
  input: {
    marginBottom: 6,
    marginTop: 6,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F2E7CF',
  },
  button: {
    height: 60,
    width: 170,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUp;
