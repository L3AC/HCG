import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  Alert, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons
import { SERVER } from '../../contexts/Network';
import InputLogin from '../../components/inputs/InputLogin';
import Header from '../../components/containers/Header';

const CambioClave = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Aquí puedes realizar la lógica de actualización de datos
    setTimeout(() => setRefreshing(false), 2000); // Simulación de tiempo de actualización
  };

  // Estados para almacenar las contraseñas actual, nueva y de confirmación
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Estados para manejar la visibilidad de las contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changeP = async () => {
    try {
      // Se crea un objeto FormData con las contraseñas
      const formData = new FormData();
      formData.append('claveActual', currentPassword);
      formData.append('claveNueva', newPassword);
      formData.append('confirmarClave', confirmPassword);
      // Se realiza una solicitud POST al servidor para cambiar la contraseña
      const response = await fetch(`${SERVER}services/public/clientes.php?action=changePassword`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      // Si la respuesta es exitosa, se muestra un mensaje y se navega a la pantalla de cuenta
      if (data.status) {
        Alert.alert(data.message);
        navigation.goBack();
      } else {
        // Si hay un error, se muestra el mensaje de error
        console.log(data);
        Alert.alert(data.error);
      }
    } catch (error) {
      console.error('Error :', error);
      Alert.alert('Error', 'Error al registrar');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Header onPress={() => navigation.goBack()} titulo={'Clave'} />
      <View style={styles.container}>

        {/* Imagen alusiva a la pantalla nueva contraseña */}
        <Ionicons style={styles.icono} name="key" size={120} color="black" />
        <View style={styles.inputContainer}>
            <InputLogin 
              placeHolder='Clave actual' 
              value={currentPassword} 
              onChangeText={setCurrentPassword} 
              clave={showCurrentPassword} 
              isContra={true} 
              setIsContra={setShowCurrentPassword} 
            />
        </View>

        <View style={styles.inputContainer}>
            <InputLogin 
              placeHolder='Nueva clave' 
              value={newPassword} 
              onChangeText={setNewPassword} 
              clave={showNewPassword} 
              isContra={true} 
              setIsContra={setShowNewPassword} 
            />
        </View>
        <View style={styles.inputContainer}>
            <InputLogin 
              placeHolder='Confirmar clave' 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              clave={showConfirmPassword} 
              isContra={true} 
              setIsContra={setShowConfirmPassword} 
            />
        </View>

        {/* Contenedor para alinear solo el botón al centro de la pantalla */}
        <View style={styles.containerButton}>
          {/* Botón de confirmación y agregado para al precionar mandar a la ventana de verificación de código */}
          <TouchableOpacity style={styles.button} onPress={changeP}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#d2a563', // Color de fondo
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    marginLeft: 30,
    fontSize: 25,
    fontWeight: 'bold',
  },
  icono: { // estilo para el icono del escudo
    textAlign: 'center',
    marginTop: 40,
  },
  input: {
    flex: 1,
    height: 60,
    borderBottomColor: 'black',
    paddingHorizontal: 10,
    fontSize: 20,
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: 25,
  },
  button: {
    height: 50,
    width: 170,
    backgroundColor: '#2F2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
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
  },
});

export default CambioClave;
