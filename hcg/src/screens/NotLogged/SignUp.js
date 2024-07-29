// Importación de librerías y componentes necesarios
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons
import Input from '../../components/inputs/Input'; // Llama a la plantilla para los input
import InputCorreo from '../../components/inputs/InputCorreo'; // Llama a la plantilla para los input
import Boton from '../../components/Button/Boton'; // Llamar al la plantilla para botón
import InputLogin from '../../components/inputs/InputLogin'; // Llama a la plantilla para input de login
import PhoneInput from '../../components/inputs/PhoneInput';
import { SERVER } from '../../contexts/Network';
import Header from '../../components/containers/Header';

// Componente de función SignUp
const SignUp = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [nombreCliente, setNombreCliente] = useState('');
  const [apellidoCliente, setApellidoCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [usuarioCliente, setUsuarioCliente] = useState('');
  const [claveCliente, setClaveCliente] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [isContra, setIsContra] = useState(true);
  const [isContra2, setIsContra2] = useState(true);

  // Función para manejar el registro del usuario
  const signin = async () => {
    try {
      const formData = new FormData();
      formData.append('nombreCliente', nombreCliente);
      formData.append('apellidoCliente', apellidoCliente);
      formData.append('correoCliente', correoCliente);
      formData.append('telefonoCliente', telefonoCliente);
      formData.append('usuarioCliente', usuarioCliente);
      formData.append('claveCliente', claveCliente);
      formData.append('confirmarClave', confirmarClave);

      const response = await fetch(`${SERVER}services/public/clientes.php?action=signUp`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status) {
        Alert.alert(data.message); // Muestra un mensaje de éxito
        navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión
      } else {
        console.log(data);
        Alert.alert(data.error); // Muestra un mensaje de error
      }
    } catch (error) {
      console.error('Error :', error);
      Alert.alert('Error', 'Error al registrar'); // Muestra un mensaje de error
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header onPress={() => navigation.goBack()} titulo={'Registro'} />
      <View style={styles.container}>
        <View style={styles.contendor2}>
          {/* Contenedor para el input de Nombre */}
          <View style={styles.inputContainer}>
            <Input placeHolder='Nombre' value={nombreCliente} onChangeText={setNombreCliente} />
          </View>
          {/* Contenedor para el input de Apellido */}
          <View style={styles.inputContainer}>
            <Input placeHolder='Apellido' value={apellidoCliente} onChangeText={setApellidoCliente} />
          </View>
          {/* Contenedor para el input de Correo */}
          <View style={styles.inputContainer}>
            <InputCorreo placeHolder='Correo' value={correoCliente} onChangeText={setCorreoCliente} />
          </View>
          {/* Contenedor para el input de Teléfono */}
          <View style={styles.inputContainer}>
            <PhoneInput
              type={'custom'}
              format={'9999-9999'}
              value={telefonoCliente}
              onChangeText={setTelefonoCliente}
              placeHolder='Teléfono'
            />
          </View>
          {/* Contenedor para el input de Usuario */}
          <View style={styles.inputContainer}>
            <Input placeHolder='Usuario' value={usuarioCliente} setTextChange={setUsuarioCliente} />
          </View>
          {/* Contenedor para el input de Contraseña */}
          <View style={styles.inputContainer}>
            <InputLogin 
              placeHolder='Contraseña' 
              value={claveCliente} 
              onChangeText={setClaveCliente} 
              clave={isContra} 
              isContra={true} 
              setIsContra={setIsContra} 
            />
          </View>
          {/* Contenedor para el input de Confirmar Contraseña */}
          <View style={styles.inputContainer}>
            <InputLogin 
              placeHolder='Confirmar' 
              value={confirmarClave} 
              onChangeText={setConfirmarClave} 
              clave={isContra2} 
              isContra={true} 
              setIsContra={setIsContra2} 
            />
          </View>
        </View>
        {/* Botón de confirmación */}
        <Boton textoBoton='Confirmar' accionBoton={signin} />
      </View>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 30,
    backgroundColor: '#d29c65', // Background color
  },
  contendor2: {
    backgroundColor: '#AA6231',
    padding: 20,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black', // Text color
    fontFamily: 'QuickSand',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default SignUp;
