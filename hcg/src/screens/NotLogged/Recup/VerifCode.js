import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons

const Producto = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas

  // Constantes para los valores del input
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [number4, setNumber4] = useState('');
  const [number5, setNumber5] = useState('');

  // Función que maneja el cambio de texto en el TextInput
  const onChangeText = (text, setNumber) => {
    if (/^\d$/.test(text)) {
      setNumber(text);

      // Verifica si todos los campos están llenos
      if (number1 && number2 && number3 && number4 && text) {
        handlePin(number1 + number2 + number3 + number4 + text);
      }
    }
  };

  const handlePin = async (pin) => {
    try {
      const formData = new FormData();
      formData.append('pinCliente', pin);
      const response = await fetch(`${SERVER}services/public/clientes.php?action=verifPin`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status) {
        navigation.navigate('NuevaClave');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={40} color="black" />
      </TouchableOpacity>

      <Ionicons style={styles.icono} name="shield-checkmark-sharp" size={140} color="black" />
      <Text style={styles.text}>Ingrese el pin enviado a su correo</Text>

      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber1)} // Función que maneja el cambio de texto
          value={number1}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber2)} // Función que maneja el cambio de texto
          value={number2}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber3)} // Función que maneja el cambio de texto
          value={number3}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber4)} // Función que maneja el cambio de texto
          value={number4}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber5)} // Función que maneja el cambio de texto
          value={number5}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button} onPress={() => handlePin(number1 + number2 + number3 + number4 + number5)}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#d2a563', // Color de fondo
  },
  text: {
    marginTop: 40,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'QuickSand'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  icono: { // estilo para el icono del escudo
    textAlign: 'center',
    marginTop: 20,
  },
  input: { // apartado de input
    marginTop: 30,
    height: 60,
    width: 60,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 35,
    textAlign: 'center',
    margin: 5
  },
  inputsContainer: {
    flexDirection: 'row', // Alinear los TextInput en una fila
    justifyContent: 'center', // Centrar los TextInput horizontalmente
    alignItems: 'center', // Centrar los TextInput verticalmente
  },
  // comienzo estilo de boton
  button: {
    height: 50,
    width: 170,
    backgroundColor: '#2F2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  buttonText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'QuickSand'
  },
  containerButton: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Producto;
