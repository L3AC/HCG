import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons

// ruta para iconos
// https://github.com/oblador/react-native-vector-icons/tree/master/glyphmaps

const Producto = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas

  
  // Constantes para los valores del input
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [number4, setNumber4] = useState('');
  const [number5, setNumber5] = useState('');

  // Función que maneja el cambio de texto en el TextInput
  const onChangeText = (inputText) => {
    // Verifica si el texto ingresado es un solo dígito
    if (/^\d$/.test(inputText)) {
      // Actualiza el estado `number` con el texto ingresado
      setNumber(inputText);
    }
  };

  return (

    <View style={styles.container}>
      {/* Botón para volver a la pantalla anterior (en este caso a la pantalla de VerifUs) */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={40} color="black" />
      </TouchableOpacity>
      {/* Título de la pantalla de recuperación */}
      <Text style={styles.title}>Recuperación</Text>

      {/* Imagen alusiva a la pantalla recuperación*/}
      <Ionicons style={styles.icono} name="shield-checkmark-sharp" size={140} color="black" />

      {/* SubTítulo de la pantalla recuperación */}
      <Text style={styles.text}>Ingrese el pin enviado a su correo</Text>


      {/* Contenedor de los 5 input, del  codigo de verificación*/}
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber1)}// Función que maneja el cambio de texto
          value={number1}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber2)}// Función que maneja el cambio de texto
          value={number2}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber3)}// Función que maneja el cambio de texto
          value={number3}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber4)}// Función que maneja el cambio de texto
          value={number4}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text, setNumber5)}// Función que maneja el cambio de texto
          value={number5}
          placeholder=""
          keyboardType="numeric"
          maxLength={1}
        />
      </View>
      {/* Contenedor para alinear solo el botón al centro de la pantalla*/}
      <View style={styles.containerButton}>
        {/* Botón de confirmación y agregado para al precionar mandar a la ventana de verificación de codigo */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NuevaClave')}> 
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
    textAlign: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  icono:{ // estilo para el icono del escudo
    textAlign: 'center',
    marginTop: 60,
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
    color: '#B3B3B3',
    fontSize: 18,
  },
  containerButton: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Producto;