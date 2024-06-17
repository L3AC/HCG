// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert,Button, TouchableOpacity,Image, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform,RefreshControl } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // Hook del contexto de autenticación
import { useUser } from '../../contexts/UserContext'; // Hook del contexto de usuario
import { SERVER } from '../../contexts/Network'; // URL del servidor para realizar solicitudes
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Icon from 'react-native-vector-icons/FontAwesome'; // Iconos de FontAwesome
import Boton from '../../components/Button/Boton';


// Componente de función Login
const Login = () => {
  // Estados locales
  const [loading, setLoading] = useState(true); // Estado de carga
  const [refreshing, setRefreshing] = useState(false); // Estado de actualización
  //const [data, setData] = useState([]);
  const { setIsLoggedIn } = useAuth(); // Método para establecer si el usuario está logueado
  const [search, setSearch] = useState(''); // Estado para el término de búsqueda
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const { setIdUsuario } = useUser(); // Método para establecer el ID del usuario
  const [usuario, setUsuario]=useState('') // Estado para el nombre de usuario
  const [clave, setClave] = useState('') // Estado para la contraseña

  // Función para manejar la actualización de la pantalla
  const onRefresh = () => {
    setRefreshing(true);
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      const formData = new FormData(); // Crea un nuevo objeto FormData para enviar los datos
      formData.append('usu', usuario); // Agrega el nombre de usuario al formulario
      formData.append('clave', clave); // Agrega la contraseña al formulario
      console.log(formData);
      // Realiza una solicitud POST al servidor para iniciar sesión
      const response = await fetch(`${SERVER}services/public/clientes.php?action=logIn`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json(); // Convierte la respuesta en formato JSON
      if (data.status) { // Si el inicio de sesión es exitoso
        Alert.alert('Correcto', data.message); // Muestra una alerta con el mensaje de éxito
        setIsLoggedIn(true); // Establece el estado de logueado en verdadero
        setIdUsuario(response.dataset); // Guarda el ID del usuario
        navigation.navigate('Main'); // Navega a la pantalla principal
      } else {
        console.log(data);
        // Muestra una alerta con el mensaje de error
        Alert.alert('Error sesion', data.error);
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  // Función para manejar el cierre de sesión
  const handleCerrar = async () => {
    try {
      const formData = new FormData(); // Crea un nuevo objeto FormData para enviar los datos
      formData.append('usu', usuario); // Agrega el nombre de usuario al formulario
      formData.append('clave', clave); // Agrega la contraseña al formulario
      console.log(formData);
      // Realiza una solicitud POST al servidor para cerrar sesión
      const response = await fetch(`${SERVER}services/public/clientes.php?action=logOut`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json(); // Convierte la respuesta en formato JSON
      if (data.status) { // Si el cierre de sesión es exitoso
        Alert.alert('Correcto', data.message); // Muestra una alerta con el mensaje de éxito
      } else {
        console.log(data); // Imprime la respuesta en la consola
        Alert.alert('Error sesion', data.error); // Muestra una alerta con el mensaje de error
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión'); // Muestra una alerta con un mensaje genérico de error
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
        <Image source={require('../../img/logo2.png')} style={styles.logo} />
        <Text style={styles.title}>Inicio de sesión</Text>
        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#fff"
          style={styles.input}
          onChangeText={setUsuario}
            value={usuario}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#fff"
          secureTextEntry
          style={styles.input}
          onChangeText={setClave}
            value={clave}
        />
        <TouchableOpacity onPress={() => navigation.navigate('VerifUs')}>
          <Text style={styles.forgotPassword}>¿Olvidó su contraseña?</Text>
        </TouchableOpacity>
        <Boton
        textoBoton='Confirmar' accionBoton={handleLogin}/>
        <Boton
        textoBoton='Cerrar' accionBoton={handleCerrar}/>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUp}>¿No tienes una cuenta?</Text>
        </TouchableOpacity>
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
  },
  signUp: {
    color: '#ffffff', // Ajusta el color del texto según el fondo
    marginTop: 20,
  },
});

export default Login;
