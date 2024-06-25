// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Button, TouchableOpacity, Image, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // Hook del contexto de autenticación
import { useUser } from '../../contexts/UserContext'; // Hook del contexto de usuario
import { SERVER } from '../../contexts/Network'; // URL del servidor para realizar solicitudes
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Icon from 'react-native-vector-icons/FontAwesome'; // Iconos de FontAwesome
import Boton from '../../components/Button/Boton'; // Llamar al la plantilla para boton
import Input from '../../components/inputs/InputLogin' // Llama a la plantilla para los input
import SweetAlert from '../../components/alerts/Alert';


// Componente de función Login
const Login = () => {
  // Estados locales
  const [usuario, setUsuario] = useState(''); // Estado para el nombre de usuario
  const [clave, setClave] = useState(''); // Estado para la contraseña
  const [isContra, setIsContra] = useState(true); // Estado para mostrar/ocultar contraseña

  const { setIsLoggedIn } = useAuth(); // Método para establecer si el usuario está logueado
  const { setIdUsuario } = useUser(); // Método para establecer el ID del usuario
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const { setIdUsuario } = useUser(); // Método para establecer el ID del usuario
  const [usuario, setUsuario] = useState('') // Estado para el nombre de usuario
  const [clave, setClave] = useState('') // Estado para la contraseña
  const [isContra, setIsContra] = useState(true);

  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState(1);
  const [alertText, setAlertText] = useState('');
  const showAlert = (type, text, timer) => {
    setAlertType(type);
    setAlertText(text);
    setIsVisible(true);
    if (timer) {
      setTimeout(() => {
        setIsVisible(false);
      }, timer);
    }
  };

  // Función para manejar la actualización de la pantalla
  const onRefresh = () => {
    setRefreshing(true);
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('usu', usuario);
      formData.append('clave', clave);

      const response = await fetch(`${SERVER}services/public/clientes.php?action=logIn`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Convierte la respuesta en formato JSON
      if (data.status) { // Si el inicio de sesión es exitoso
        showAlert(1, data.message, 1000) // Muestra una alerta con el mensaje de éxito
        setIsLoggedIn(true); // Establece el estado de logueado en verdadero
        setIdUsuario(response.dataset); // Guarda el ID del usuario
        navigation.navigate('Main'); // Navega a la pantalla principal
      } else {
        showAlert(2, data.error, 1000)
      }
    } catch (error) {
      console.error(error, "Error desde Catch");

      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  // Función para navegar a la pantalla de registro
  const irRegistrar = async () => {
    navigation.navigate('SignUp');
  };

  /*const [fontsLoaded] = useFonts({
    QuickSand: require("../../../assets/fonts/Quicksand-Regular.ttf"),
    QuickSandBold: require("../../../assets/fonts/Quicksand-Bold.ttf"),
  });*/

  // Elementos que se muestran en la pantalla
  return (
    <ImageBackground source={require('../../img/fondo.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../../img/logo3.png')} style={styles.logo} />
        <Text style={styles.title}>Inicio de sesión</Text>
        <TextInput
          placeholder='Usuario'
          placeholderTextColor="#fff"
          setValor={usuario}
          setTextChange={setUsuario}  
          style={[styles.input]}
        />
        <TextInput
          placeholder='Contraseña'
          placeholderTextColor="#fff"
          setValor={clave}
          setTextChange={setClave}
          clave={isContra}    
          style={[styles.input]}
        />
        <TouchableOpacity onPress={() => navigation.navigate('VerifUs')}>
          <Text style={styles.forgotPassword}>¿Olvidó su contraseña?</Text>
        </TouchableOpacity>
        <Boton
          textoBoton='Confirmar' accionBoton={handleLogin}
        />
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUp}>¿No tienes una cuenta?</Text>
        </TouchableOpacity>
        <SweetAlert
          isVisible={isVisible}
          type={alertType}
          text={alertText}
          onClose={() => setIsVisible(false)}
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
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
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
    marginBottom: 20,
    color: '#ffffff',
    //fontFamily: 'QuickSand'// Ajusta el color del texto según el fondo
  },
  forgotPassword: {
    color: '#ffffff', // Ajusta el color del texto según el fondo
    marginBottom: 20,
    fontFamily: 'QuickSand',
  },
  signUp: {
    color: '#ffffff', // Ajusta el color del texto según el fondo
    marginTop: 20,
    fontFamily: 'QuickSand',
  },
  button: {
    width: '80%',
    paddingVertical: 10,
    backgroundColor: '#2F2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'QuickSandBold',
  },
});

export default Login;
