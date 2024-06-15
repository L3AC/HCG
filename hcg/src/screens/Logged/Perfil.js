// Importación de librerías y componentes necesarios
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, RefreshControl, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos de Ionicons
import { SERVER } from '../../contexts/Network'; // URL del servidor
import { useRoute, useNavigation } from '@react-navigation/native'; // Hook de navegación

// Componente de función PerfilScreen
const PerfilScreen = () => {
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
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={35} color="black" onPress={() => navigation.goBack()}/>
        <Text style={styles.title}>Perfil</Text>
        <Ionicons name="pencil" size={35} color="black" />
      </View>
      {/* Formulario para los datos del perfil */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={profileData.nombre_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, nombre_cliente: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Apellido" 
            value={profileData.apellido_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, apellido_cliente: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Correo" 
            value={profileData.correo_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, correo_cliente: text })}
            keyboardType="email-address" // Teclado específico para direcciones de correo
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Usuario" 
            value={profileData.usuario_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, usuario_cliente: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefono</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Telefono" 
            value={profileData.telefono_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, telefono_cliente: text })}
            keyboardType="phone-pad" // Teclado específico para números de teléfono
          />
        </View>
      </View>
      {/* Botón para guardar los cambios */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Permite que el contenido se expanda y se desplace
    padding: 16,
    backgroundColor: '#d2a563', // Color de fondo
  },
  header: {
    flexDirection: 'row', // Coloca los elementos en una fila
    justifyContent: 'space-between', // Espacia los elementos de manera equitativa
    alignItems: 'center', // Alinea los elementos verticalmente al centro
    marginBottom: 30,
    marginTop: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Color del texto del título
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 25, // Margen inferior entre los contenedores de entrada
  },
  label: {
    fontSize: 16,
    color: 'black', // Color del texto de las etiquetas
    marginBottom: 15,
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
    width: 100,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    backgroundColor: 'black', // Color de fondo del botón
    borderRadius: 8, // Bordes redondeados del botón
    marginTop: 0, // Margen superior del botón
  },
  buttonText: {
    color: 'white', // Color del texto del botón
    fontWeight: 'bold', // Peso de la fuente (negrita)
  },
});

export default PerfilScreen; // Exporta el componente PerfilScreen
