import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, Button } from 'react-native';
import { SERVER } from '../../contexts/Network';

const CartScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const fetchMenuData = async (query = '') => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('producto', query);

      const response = await fetch(`${SERVER}services/public/productos.php?action=searchProductos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === 1) {
        setCartItems(data.dataset.conjunto || []);
      } else {
        console.error('Error fetching data:', data.message);
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMenuData();
  };

  const totalToPay = cartItems.reduce((total, item) => total + item.subtotal, 0);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Carrito de compras</Text>
      <TouchableOpacity style={styles.finalizeButton}>
        <Text style={styles.finalizeButtonText}>Finalizar</Text>
      </TouchableOpacity>
      <Text style={styles.totalText}>Total a pagar: ${totalToPay}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text>Precio: ${item.price}</Text>
            <Text>Cantidad: {item.quantity}</Text>
            <Text>Subtotal: ${item.subtotal}</Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.icon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#d38b58',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  finalizeButton: {
    backgroundColor: '#e1e1e1',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  finalizeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  icon: {
    fontSize: 24,
  },
});

export default CartScreen;