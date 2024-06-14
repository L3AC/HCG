import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SERVER } from '../../contexts/Network'; 

const OrderDetailScreen = () => {
  const route = useRoute();
  const { orderId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

  const fetchOrderDetails = async () => {
    try {
      setRefreshing(true);
      const formData = new FormData();
      formData.append('orderId', orderId);

      const response = await fetch(`${SERVER}services/public/pedidos.php?action=getOrderDetails`, {
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
      <Text style={styles.header}>Detalle del pedido</Text>
      {orderItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Precio: ${item.price}</Text>
            <Text>Cantidad: {item.quantity}</Text>
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
    backgroundColor: '#D79951', // Background color of the screen
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
