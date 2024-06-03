import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignUp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>Inicia una nueva experiencia</Text>

      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#000" />
      <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#000" />
      <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#000" />
      <TextInput style={styles.input} placeholder="Telefono" placeholderTextColor="#000" />
      <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#000" />
      <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#000" secureTextEntry={true} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
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
  input: {
    height: 40,
    borderColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black', // Text color
  },
  button: {
    height: 40,
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
