// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // Hook del contexto de autenticación
import { useUser } from '../../contexts/UserContext'; // Hook del contexto de usuario
import { SERVER } from '../../contexts/Network'; // URL del servidor para realizar solicitudes
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Boton from '../../components/buttons/Boton'; // Llamar a la plantilla para botón
import Input from '../../components/inputs/Input'; // Llama a la plantilla para los input
import InputLogin from '../../components/inputs/InputLogin'; // Llama a la plantilla para los input
import SimpleAlert from '../../components/alerts/SimpleAlert'; // Importa la alerta simple
import { useFonts } from 'expo-font';
import Confirm from '../../components/buttons/Confirm';

// Componente de función Login
const Login = () => {
  // Estados locales
  const [usuario, setUsuario] = useState(''); // Estado para el nombre de usuario
  const [clave, setClave] = useState(''); // Estado para la contraseña
  const [isContra, setIsContra] = useState(true); // Estado para mostrar/ocultar contraseña

  const { setIsLoggedIn } = useAuth(); // Método para establecer si el usuario está logueado
  const { setIdUsuario } = useUser(); // Método para establecer el ID del usuario
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  

  const [fontsLoaded] = useFonts({
    QuickSand: require("../../../assets/fonts/Quicksand-Regular.ttf"),
    QuickSandBold: require("../../../assets/fonts/Quicksand-Bold.ttf"),
  });

  const handleShowSimpleAlert = (message, type = 'info', timer = 1500) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), timer);
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('usu', usuario);
      formData.append('clave', clave);
      console.log(formData);

      const response = await fetch(`${SERVER}services/public/clientes.php?action=logIn`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status) {
        handleShowSimpleAlert('Login exitoso', 'success');
        setTimeout(() => {
          setIsLoggedIn(true);
          setIdUsuario(data.dataset);
          navigation.navigate('Main');
        }, 1000);
      } else {
        handleShowSimpleAlert(data.error, 'error', 3000);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  // Elementos que se muestran en la pantalla
  return (
    <ImageBackground source={require('../../img/fondo.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../../img/logo3.png')} style={styles.logo} />
        <Text style={styles.title}>Inicio de sesión</Text>
        <Input
          placeHolder='Usuario'
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
        />
        <InputLogin
          placeHolder='Contraseña'
          value={clave}
          onChangeText={setClave}
          clave={isContra}
          isContra={true} 
          setIsContra={setIsContra} 
        />
        <TouchableOpacity onPress={() => navigation.navigate('VerifUs')}>
          <Text style={styles.forgotPassword}>¿Olvidó su contraseña?</Text>
        </TouchableOpacity>
        <Confirm onPress={handleLogin} tittle={'Confirmar'}/>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUp}>¿No tienes una cuenta?</Text>
        </TouchableOpacity>
        <SimpleAlert
          isVisible={alertVisible}
          type={alertType}
          text={alertMessage}
          timer={2000}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </ImageBackground>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // o 'stretch'
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', // Puedes ajustar la opacidad aquí
  },
  logo: {
    width: 240,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#ffffff', // Ajusta el color del texto según el fondo
    fontFamily: 'QuickSandBold',
  },
  input: {
    width: '100%',
    height: 50, // Ajusta la altura según sea necesario
    borderRadius: 8, // Redondeo de los bordes
    backgroundColor: '#AA6231', // Color de fondo del input
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: 'QuickSand',
    color: '#ffffff',
  },
  forgotPassword: {
    color: '#ffffff', // Ajusta el color del texto según el fondo
    marginBottom: 15,
    fontSize: 18,
    fontFamily: 'QuickSand',
  },
  signUp: {
    color: '#ffffff', // Ajusta el color del texto según el fondo
    marginTop: 20,
    fontFamily: 'QuickSand',
    fontSize: 18,
  },
  button: {
    width: '80%',
    paddingVertical: 10,
    backgroundColor: '#2F2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'QuickSandBold',
  },
});

export default Login;
