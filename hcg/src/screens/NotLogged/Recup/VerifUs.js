import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput,ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons
import { SERVER } from '../../../contexts/Network'; // URL del servidor para realizar solicitudes
import Header from '../../../components/containers/Header';
import Confirm from '../../../components/buttons/Confirm';

const VerifUs = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [placeholderVisible, setPlaceholderVisible] = useState(true); // Estado para controlar la visibilidad del placeholder
  const [usuario, setUsuario] = useState(''); // Estado para el nombre de usuario

  const onChangeTextHandler = (inputText) => { // pequeña constante para validar cuando el placeholder se muestre y cuando no 
    setUsuario(inputText);
    if (inputText.length > 0) {
      setPlaceholderVisible(false);  // Ocultar el placeholder cuando se escriba algo
    } else {
      setPlaceholderVisible(true);   // Mostrar el placeholder si no hay texto
    }
  };

  const handleUs = async () => {
    try {
      const formData = new FormData();
      formData.append('aliasCliente', usuario);

      const response = await fetch(`${SERVER}services/public/clientes.php?action=verifUs`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status) {
        sendMail(data.dataset);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };
  const sendMail = async (data) => {
    try {
      const formData = new FormData();
      formData.append('pin', data.pin_cliente);
      formData.append('user', data.usuario_cliente);
      formData.append('email', data.correo_cliente);

      const response = await fetch(`${SERVER}libraries/sendCode.php`, {
        method: 'POST',
        body: formData,
      });
      Alert.alert('Pin de seguridad', 'Revise su correo electrónico');
      navigation.navigate('VerifCode');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.toString());
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header onPress={() => navigation.goBack()} titulo={'Recuperación'} />
      <View style={styles.container}>
        <Image
          style={styles.imagen}
          source={require('../../../img/lock.png')}
        />
        <View style={styles.contenedor2}>
          <Text style={styles.indi}>Ingresa tu nombre de usuario y te enviaremos un email al correo enlazado a tu cuenta.</Text>
        </View>

        <Text style={styles.text}>Ingrese su usuario</Text>

        {/* Input para escribir el usuario a recuperar*/}
        <TextInput
          style={styles.input}
          onChangeText={onChangeTextHandler}
          value={usuario}
          placeholder={placeholderVisible ? 'usuario' : ''}
        />

        {/* Contenedor para alinear solo el botón al centro de la pantalla*/}
        <View style={styles.containerButton}>
          {/* Botón de confirmación y agregado para al precionar mandar a la ventana de verificación de codigo */}
          <Confirm onPress={handleUs} tittle={'Confirmar'}/>
        </View>
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#d2a563', // Color de fondo
  },
  contenedor2: {
    backgroundColor: '#AA6231',
    paddingBottom: 20,
    borderRadius: 20,
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
    fontSize: 20,
    textAlign: 'center',
    color:'white',
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
