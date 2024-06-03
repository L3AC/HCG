import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native'; // Cambiado Image por ImageBackground
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
  return (
    <ImageBackground source={require('../../img/fondo.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../../img/logo2.png')} style={styles.logo} />
        <Text style={styles.title}>Inicio de sesión</Text>
        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#8e8e8e"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#8e8e8e"
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
    height: 40,
    borderColor: '#ffffff', // Ajusta el color del borde según el fondo
    borderBottomWidth: 1,
    marginBottom: 20,
    color: '#ffffff', // Ajusta el color del texto según el fondo
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
