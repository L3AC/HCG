import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // Hooks de react-navigation
import { SERVER } from '../../contexts/Network'; // URL del servidor
import Header from '../../components/containers/Header';

// Componente funcional OrderDetailScreen
const DetallePedido = () => {
  const route = useRoute(); // Obtiene la ruta actual
  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas
  const { orderId } = route.params; // Obtiene el orderId de los parámetros de la ruta
  const [refreshing, setRefreshing] = useState(false); // Estado para el control de la actualización
  const [orderItems, setOrderItems] = useState([]); // Estado para almacenar los items del pedido

  // Función para obtener los detalles del pedido desde el servidor
  const fetchOrderDetails = async () => {
    try {
      setRefreshing(true); // Activa el estado de actualización
      const formData = new FormData();
      formData.append('idPedido', orderId); // Añade el idPedido al FormData

      const response = await fetch(`${SERVER}services/public/detallepedidos.php?action=searchByPedido`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Convierte la respuesta a JSON

      if (response.ok && data.status === 1) {
        setOrderItems(data.dataset); // Actualiza los items del pedido
      } else {
        console.error('Error fetching data:', data.message);
        Alert.alert('Error', data.message); // Muestra una alerta en caso de error
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to fetch order details'); // Muestra una alerta en caso de error
    } finally {
      setRefreshing(false); // Desactiva el estado de actualización
    }
  };

  // useEffect para obtener los detalles del pedido al montar el componente
  useEffect(() => {
    fetchOrderDetails();
  }, []);

  // Renderizado del componente
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrderDetails} />}
    >
      <Header onPress={() => navigation.goBack()} titulo={'Detalles'} />
      {/* Mapeo de los items del pedido */}
      {orderItems.map((item) => (
        <View key={item.id_detalle_pedido} style={styles.card}>
          <Image source={{ uri: item.imagen_producto }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.descripcion_producto}</Text>
            <Text>Precio: ${item.precio_producto}</Text>
            <Text>Cantidad: {item.cantidad_pedido}</Text>
            <Text>Subtotal: ${item.subtotal}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#d2a563', // Color de fondo del screen
  },
  card: {
    flexDirection: 'row', // Coloca los elementos en una fila
    backgroundColor: '#F4F0E4', // Color de fondo de las tarjetas
    padding: 16,
    borderRadius: 10, // Bordes redondeados
    marginBottom: 16,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Offset de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 5, // Radio de la sombra
    elevation: 5, // Elevación de la sombra
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10, // Bordes redondeados de la imagen
    marginRight: 16,
  },
  textContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'center', // Alinea los elementos verticalmente al centro
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default DetallePedido;
