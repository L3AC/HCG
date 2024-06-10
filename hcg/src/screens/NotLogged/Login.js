import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert,Button, TouchableOpacity,Image, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform,RefreshControl } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { SERVER } from '../../contexts/Network';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  //const [data, setData] = useState([]);
  const { setIsLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const { setIdUsuario } = useUser();
  const [usuario, setUsuario]=useState('')
  const [clave, setClave] = useState('')


  const onRefresh = () => {
    setRefreshing(true);
  };
  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('usu', usuario);
      formData.append('clave', clave);
      console.log(formData);
      //utilizar la direccion IP del servidor y no localhost
      const response = await fetch(`${SERVER}services/public/clientes.php?action=logIn`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.status) {
        Alert.alert('Correcto', data.message);
        setIsLoggedIn(true);
        setIdUsuario(response.dataset);
        navigation.navigate('Main');
      } else {
        console.log(data);
        // Alert the user about the error
        Alert.alert('Error sesion', data.error);
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };
  const handleCerrar = async () => {
    try {
      const formData = new FormData();
      formData.append('usu', usuario);
      formData.append('clave', clave);
      console.log(formData);
      const response = await fetch(`${SERVER}services/public/clientes.php?action=logOut`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.status) {
        Alert.alert('Correcto', data.message);
      } else {
        console.log(data);
        Alert.alert('Error sesion', data.error);
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  const irRegistrar = async () => {
    navigation.navigate('SignUp');
  };

  /*const [fontsLoaded] = useFonts({
    QuickSand: require("../../../assets/fonts/Quicksand-Regular.ttf"),
    QuickSandBold: require("../../../assets/fonts/Quicksand-Bold.ttf"),
  });*/
  
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
        <Button
          title="Confirmar"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          onPress={handleLogin}
        />
        <Button
          title="Cerrar"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          onPress={handleCerrar}
        />
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUp}>¿No tienes una cuenta?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

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
  button: {
    backgroundColor: '#ffffff', // Ajusta el color del botón según el fondo
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonTitle: {
    color: '#000000', // Ajusta el color del texto según el fondo
    fontSize: 16,
  },
  signUp: {
    color: '#ffffff', // Ajusta el color del texto según el fondo
    marginTop: 20,
  },
});

export default Login;
