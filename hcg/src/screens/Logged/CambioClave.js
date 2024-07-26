import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Ionicons from 'react-native-vector-icons/Ionicons'; // Iconos de Ionicons
import { SERVER } from '../../contexts/Network';

const Producto = () => {
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
      <View style={styles.container}>

        <View style={styles.header}>
          {/* Botón de retroceso */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={32} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Cambio de clave</Text>
        </View>
        {/* Imagen alusiva a la pantalla nueva contraseña */}
        <Ionicons style={styles.icono} name="key" size={120} color="black" />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={setCurrentPassword}
            value={currentPassword}
            placeholder="Clave actual"
            secureTextEntry={!showCurrentPassword}
          />
          <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <Ionicons name={showCurrentPassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* Input para escribir su nueva contraseña (1) */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={setNewPassword}
            value={newPassword}
            placeholder="Nueva clave"
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Input para escribir su nueva contraseña (2) */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirmar clave"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginTop: 30,
    marginBottom: 20,
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

export default Producto;
