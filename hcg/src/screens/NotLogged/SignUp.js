// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons
import Input from '../../components/inputs/Input' // Llama a la plantilla para los input
import InputCorreo from '../../components/inputs/InputCorreo' // Llama a la plantilla para los input
import Boton from '../../components/Button/Boton'; // Llamar al la plantilla para boton

// Componente de función SignUp
const SignUp = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [isContra, setIsContra] = useState(true) 

  return (
    <View style={styles.container}>
      {/* Botón para volver a la pantalla anterior */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {/* Título de la pantalla de registro */}
      <Text style={styles.title}>Registro</Text>

      {/* Contenedor para el input de Nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <Input placeHolder='Nombre'/>
      </View>
      {/* Contenedor para el input de Apellido */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido</Text>
        <Input placeHolder='Apellido'/>
      </View>
      {/* Contenedor para el input de Correo */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo</Text>
        <InputCorreo placeHolder='Correo'/>
      </View>
      {/* Contenedor para el input de Teléfono */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefono</Text>
        <Input placeHolder='Telefono'/>
      </View>
      {/* Contenedor para el input de Usuario */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <Input placeHolder='Usuario'/>
      </View>
      {/* Contenedor para el input de Contraseña */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <Input placeHolder='Contraseña' clave={isContra} />
      </View>

      {/* Botón de confirmación */}
      <Boton
        textoBoton='Confirmar'
        />
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
