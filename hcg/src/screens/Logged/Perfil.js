// Importación de librerías y componentes necesarios
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, RefreshControl, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos de Ionicons
import { SERVER } from '../../contexts/Network'; // URL del servidor
import { useNavigation } from '@react-navigation/native'; // Hook de navegación
import Input from '../../components/inputs/Input' // Llama a la plantilla para los input
import InputCorreo from '../../components/inputs/InputCorreo' // Llama a la plantilla para los input
import PhoneInput from '../../components/inputs/PhoneInput';
import Header from '../../components/containers/Header';

// Componente de función PerfilScreen
const Perfil = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [refreshing, setRefreshing] = useState(false); // Estado para control de la actualización
  const [profileData, setProfileData] = useState({
    nombre_cliente: '',
    apellido_cliente: '',
    correo_cliente: '',
    usuario_cliente: '',
    telefono_cliente: ''
  }); // Estado para almacenar los datos del perfil

  // Función para obtener los datos del perfil
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${SERVER}services/public/clientes.php?action=readProfile`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status) {
        setProfileData(data.dataset); // Actualiza los datos del perfil
      } else {
        Alert.alert('Error', 'Failed to fetch profile data'); // Muestra un alerta en caso de error
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión'); // Muestra un alerta en caso de error
    }
  };
// Función para editar el perfil del usuario y enviar los datos al servidor
const editP = async () => {
  try {
      const formData = new FormData();
      formData.append('nombreCliente', profileData.nombre_cliente);
      formData.append('apellidoCliente', profileData.apellido_cliente);
      formData.append('correoCliente', profileData.correo_cliente);
      formData.append('telefonoCliente', profileData.telefono_cliente);
      formData.append('aliasCliente', profileData.usuario_cliente);
      console.log(profileData);
      const response = await fetch(`${SERVER}services/public/clientes.php?action=editProfile`, {
          method: 'POST',
          body: formData,
      });
      const data = await response.json();
      if (data.status) {
          Alert.alert(data.message);
      } else {
          console.log(data);
          Alert.alert(data.error);
      }
  } catch (error) {
      console.error('Error :', error);
      console.log(error);
      Alert.alert('Error', 'Error al registrar');
  }
};
  // useEffect para obtener los datos del perfil al montar el componente
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Función de actualización
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData().finally(() => setRefreshing(false));
  }, []);

  return (
    // Contenedor de desplazamiento con control de actualización
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Encabezado con íconos de retroceso y edición */}
      <Header onPress={() => navigation.goBack()} titulo={'Perfil'} />

      {/* Formulario para los datos del perfil */}
      <View style={styles.form}>
        <View style={styles.contenedor2}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <Input
              placeHolder='Nombre'
              value={profileData.nombre_cliente}
              onChangeText={(text) => setProfileData({ ...profileData, nombre_cliente: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido</Text>
            <Input 
              placeHolder='Apellido'
              value={profileData.apellido_cliente}
              onChangeText={(text) => setProfileData({ ...profileData, apellido_cliente: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo</Text>
            <InputCorreo
              placeHolder='Correo'
              value={profileData.correo_cliente}
              onChangeText={(text) => setProfileData({ ...profileData, correo_cliente: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <Input
              placeHolder='Usuario'
              value={profileData.usuario_cliente}
              onChangeText={(text) => setProfileData({ ...profileData, usuario_cliente: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <PhoneInput
              type={'custom'}
              format={'9999-9999'}
              value={profileData.telefono_cliente}
              onChangeText={(text) => setProfileData({ ...profileData, telefono_cliente: text })}
              placeHolder='Teléfono'
            />
          </View>
        </View>
        {/* Botón para guardar los cambios */}
        <TouchableOpacity style={styles.button} onPress={editP}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Permite que el contenido se expanda y se desplace
    padding: 0,
    backgroundColor: '#d2a563', // Color de fondo
    justifyContent: 'center', // Centra el contenido verticalmente
  },
  contenedor2:{
    backgroundColor: '#AA6231',
    width: '100%',
    padding:20,
    borderRadius:20
  },
  topBackground: {
    height: 100, // Ajusta esta altura según sea necesario
    backgroundColor: '#5C2C0C', // Color de fondo para la parte superior
  },
  iconoHeader: {
    paddingBottom: 5,
    paddingLeft: 16,
    paddingRight: 16,

  },
  header: {
    flexDirection: 'row', // Coloca los elementos en una fila
    justifyContent: 'space-between', // Espacia los elementos de manera equitativa
    alignItems: 'center', // Alinea los elementos verticalmente al centro
    marginBottom: 10,
    marginTop: -50, // Ajusta este value según sea necesario
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Color del texto del título
    fontFamily: 'QuickSand'
  },
  form: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  inputContainer: {
    marginBottom: 25, // Margen inferior entre los contenedores de entrada
    width: '100%', // Asegura que los inputs ocupen el ancho completo del contenedor
  },
  label: {
    fontSize: 16,
    color: '#fff', // Color del texto de las etiquetas
    marginBottom: 1,
    fontFamily: 'QuickSand'
  },
  input: {
    height: 40,
    borderColor: '#ccc', // Color del borde del input
    borderWidth: 1, // Ancho del borde del input
    paddingHorizontal: 8, // Relleno horizontal dentro del input
    borderRadius: 8, // Bordes redondeados
    backgroundColor: '#F2E7CF', // Color de fondo del input
  },
  button: {
    height: 50,
    width: '50%', // Ajusta el ancho del botón
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    backgroundColor: '#2F2C2C', // Color de fondo del botón
    borderRadius: 8, // Bordes redondeados del botón
    marginTop: 20, // Margen superior del botón
    marginBottom: 70,
  },
  buttonText: {
    color: 'white', // Color del texto del botón
    fontFamily: 'QuickSandBold',
    fontSize: 16

  },
});

export default Perfil; // Exporta el componente PerfilScreen
