import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../img/logo.png')} style={styles.logo} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D29145',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderBottomWidth: 1,
    marginBottom: 20,
    color: '#000',
  },
  forgotPassword: {
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 16,
  },
  signUp: {
    color: '#000',
    marginTop: 20,
  },
});

export default Login;
