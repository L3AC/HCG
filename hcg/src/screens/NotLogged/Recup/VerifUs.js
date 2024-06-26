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
      {/* Título de la pantalla de recuperación */}
      {/* Imagen alusiva a la pantalla recuperación*/}
      <Image
        style={styles.imagen}
        source={require('../../../img/lock.png')}
      />
      <View style={styles.contenedor2}>
        <Text style={styles.indi}>Ingresa tu nombre de usuario y te enviaremos un enlace para recuperar el acceso a tu cuenta.</Text>
      </View>

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
    backgroundColor: '#d2a563', // Color de fondo
  },
  contenedor2:{
    backgroundColor: '#AA6231',
    paddingBottom: 20,
    borderRadius:20,
    borderColor: '#fff',
    borderWidth: 1
  },
  text: {
    marginTop: 40,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'QuickSand',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'QuickSand'
  },
  indi: {
    fontFamily: 'QuickSand',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20
  },
  imagen: {
    marginTop: 20,
    alignSelf: 'center',
    width: 100,
    marginBottom: 10,
    height: 110,
  },
  input: {
    marginTop: 30,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 20,
    fontFamily: 'QuickSand'
  },
  button: {
    height: 50,
    width: 170,
    backgroundColor: '#2F2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
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

export default VerifUs;
