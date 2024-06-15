import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { SERVER } from '../../contexts/Network';

// Función de espera para simular una operación asíncrona
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
// Componente funcional CuentaScreen
const CuentaScreen = () => {
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar la actualización
  const { setIsLoggedIn } = useAuth(); // Extrae setIsLoggedIn del contexto de autenticación

  // Función para realizar el cierre de sesión
  const logOut = async () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de cerrar las sesión?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Eliminación cancelada"),
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              //utilizar la direccion IP del servidor y no localhost
              const response = await fetch(`${SERVER}services/public/clientes.php?action=logOut`, {
                method: 'POST'
              });
              
              const data = await response.json();
              if (data.status) {
                Alert.alert(data.message); // Muestra una alerta con el mensaje de éxito
                setIsLoggedIn(false); // Actualiza el estado de autenticación
                navigation.navigate('Login'); // Redirige a la pantalla de inicio de sesión
              } else {
                console.log(data);
                Alert.alert('Error sesion', data.error); // Muestra una alerta con el mensaje de error
              }
            } catch (error) {
              console.error(error, "Error en el catch"); // Registra el error en la consola
              Alert.alert('Error', 'Ocurrió un error al cerrar sesión'); // Muestra una alerta en caso de error
            }
          },
        },
      ],
      { cancelable: false }
    );
    
  };

  // Función para manejar la acción de actualización
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  // Renderizado del componente
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cuenta</Text>
        <Ionicons name="log-out-outline" size={60} color="black" onPress={() => logOut()} />
      </View>

      {/* Tarjeta para navegar al perfil */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Perfil')}>
        <Ionicons name="person-circle-outline" size={50} color="black" />
        <Text style={styles.cardText}>Perfil</Text>
      </TouchableOpacity>

      {/* Tarjeta para navegar a la pantalla de cambio de clave */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Clave')}>
        <Ionicons name="lock-closed-outline" size={50} color="black" />
        <Text style={styles.cardText}>Clave</Text>
      </TouchableOpacity>

      {/* Tarjeta para navegar a la pantalla "Sobre Nosotros" */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SobreNosotros')}>
        <Ionicons name="people-circle-outline" size={50} color="black" />
        <Text style={styles.cardText}>Sobre nosotros</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#d2a563', // Color de fondo del screen
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row', // Coloca los elementos en una fila
    justifyContent: 'space-between', // Distribuye los elementos horizontalmente
    alignItems: 'center', // Alinea los elementos verticalmente al centro
    width: '90%', // Ancho del contenedor
    marginTop: 60, // Margen superior
    marginBottom: 60, // Margen inferior
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#e8e8e8', // Color de fondo de las tarjetas
    width: '90%', // Ancho de las tarjetas
    height: '20%', // Altura de las tarjetas
    padding: 20, // Padding interno
    borderRadius: 10, // Bordes redondeados
    alignItems: 'center', // Alinea los elementos al centro horizontalmente
    marginBottom: 20, // Margen inferior
  },
  cardText: {
    marginTop: 10, // Margen superior del texto
    fontSize: 18, // Tamaño de fuente del texto
  },
});

export default CuentaScreen; // Exporta el componente CuentaScreen
