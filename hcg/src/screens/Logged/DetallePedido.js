import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SERVER } from '../../contexts/Network'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const OrderDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { orderId } = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
  
    const fetchOrderDetails = async () => {
      try {
        setRefreshing(true);
        const formData = new FormData();
        formData.append('idPedido', orderId);
  
        const response = await fetch(`${SERVER}services/public/detallepedidos.php?action=searchByPedido`, {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok && data.status === 1) {
          setOrderItems(data.dataset);
        } else {
          console.error('Error fetching data:', data.message);
          Alert.alert('Error', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to fetch order details');
      } finally {
        setRefreshing(false);
      }
    };
  
    useEffect(() => {
      fetchOrderDetails();
    }, []);
  
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrderDetails} />}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={40} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Detalle del pedido</Text>
        </View>
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
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: '#d2a563', // Background color of the screen
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 40,
      marginTop: 60,
    },
    backButton: {
      marginRight: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: '#F4F0E4', // Background color of the cards
      padding: 16,
      borderRadius: 10,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });
  
  export default OrderDetailScreen;