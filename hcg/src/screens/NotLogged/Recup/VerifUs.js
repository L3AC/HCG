import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons

const VerifUs = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [text, setText] = useState(''); // Estado para el texto del input
  const [placeholderVisible, setPlaceholderVisible] = useState(true); // Estado para controlar la visibilidad del placeholder



  const onChangeTextHandler = (inputText) => { // pequeña constante para validar cuando el placeholder se muestre y cuando no 
    setText(inputText);
    if (inputText.length > 0) {
      setPlaceholderVisible(false);  // Ocultar el placeholder cuando se escriba algo
    } else {
      setPlaceholderVisible(true);   // Mostrar el placeholder si no hay texto
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón para volver a la pantalla anterior (en este caso a la pantalla de login) */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={40} color="black" />
      </TouchableOpacity>
      {/* Título de la pantalla de registro */}
      <Text style={styles.title}>Recuperación</Text>
      {/* Imagen alusiva a la pantalla*/}
      <Image
        style={styles.imagen}
        source={require('../../../img/Recup1.png')}
      />

      <Text style={styles.text}>Ingrese su usuario</Text>

      {/* Input para escribir el usuario a recuperar*/}
      <TextInput
        style={styles.input}
        onChangeText={onChangeTextHandler} 
        value={text}
        placeholder={placeholderVisible ? 'usuario' : ''}
      />

      {/* Contenedor para alinear solo el botón al centro de la pantalla*/}
      <View style={styles.containerButton}>
        {/* Botón de confirmación y agregado para al precionar mandar a la ventana de verificación de codigo */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VerifCode')}> 
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
    backgroundColor: '#d29c65', // Color de fondo
  },
  text: {
    marginTop: 40,
    fontSize: 24,
    textAlign: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  imagen: {
    marginTop: 60,
    marginStart: 80,
  },
  input: {
    marginTop: 30,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 20
  },
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

export default VerifUs;
