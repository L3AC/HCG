import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native'; // Cambiado Image por ImageBackground
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';

const Login = () => {
  const [fontsLoaded] = useFonts({
    QuickSand: require("../../../assets/fonts/Quicksand-Regular.ttf"),
    QuickSandBold: require("../../../assets/fonts/Quicksand-Bold.ttf"),
  });
  
  return (
    <ImageBackground source={require('../../img/fondo.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../../img/logo2.png')} style={styles.logo} />
        <Text style={styles.title}>Inicio de sesión</Text>
        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#fff"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#fff"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>¿Olvidó su contraseña?</Text>
        </TouchableOpacity>
        <Button
          title="Confirmar"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <TouchableOpacity>
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
    fontFamily: 'QuickSand'// Ajusta el color del texto según el fondo
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
