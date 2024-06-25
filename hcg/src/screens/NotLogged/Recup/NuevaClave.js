import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons

const Producto = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [text, setText] = useState(''); // Estado para el texto del input
  const [placeholderVisible, setPlaceholderVisible] = useState(true); // Estado para controlar la visibilidad del placeholder


  const onChangeTextHandler = (inputText) => { // Constante para validar cuando el placeholder se muestre y cuando no 
    setText(inputText);
    if (inputText.length > 0) {
      setPlaceholderVisible(false);  // Ocultar el placeholder cuando se escriba algo
    } else {
      setPlaceholderVisible(true);   // Mostrar el placeholder si no hay texto
    }
  };

  return (
    <View style={styles.container}>
      {/* Título de la pantalla de recuperación */}
      <Text style={styles.title}>Cambio de contraseña</Text>

       {/* Imagen alusiva a la pantalla nueva contraseña*/}
       <Ionicons style={styles.icono} name="key" size={120} color="black" />

      {/* Input para escribir su nueva contraseña (1)*/}
      <Text style={styles.text}>Ingrese su nueva contraseña</Text>

      {/* Input para escribir el usuario a recuperar*/}
      <TextInput
        style={styles.input}
        onChangeText={onChangeTextHandler} 
        value={text}
        placeholder={placeholderVisible ? 'contraseña' : ''}
      />
      {/* Input para escribir su nueva contraseña (2)*/}
      <Text style={styles.text}>Confirmar contraseña</Text>

      {/* Input para escribir el usuario a recuperar*/}
      <TextInput
        style={styles.input}
        onChangeText={onChangeTextHandler} 
        value={text}
        placeholder={placeholderVisible ? 'contraseña' : ''}
      />

      {/* Contenedor para alinear solo el botón al centro de la pantalla*/}
      <View style={styles.containerButton}>
        {/* Botón de confirmación y agregado para al precionar mandar a la ventana de verificación de codigo */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}> 
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
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 39,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  icono:{ // estilo para el icono del escudo
    textAlign: 'center',
    marginTop: 40,
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

export default Producto;