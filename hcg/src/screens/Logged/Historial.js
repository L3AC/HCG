import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SERVER } from '../../contexts/Network'; // Reemplaza con la URL de tu servidor

const Historial = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  const fetchData = async (query = '', estado = 'Pendiente') => {
    try {
      setRefreshing(true);
      const formData = new FormData();
      formData.append('valor', query);
      formData.append('estado', estado);

      const response = await fetch(`${SERVER}services/public/pedidos.php?action=searchByCliente`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === 1) {
        setOrders(data.dataset);  // Asegúrate de que `data.dataset` contiene la lista de pedidos
      } else {
        console.error('Error fetching data:', data.message);
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [estado]);

  const onRefresh = useCallback(() => {
    fetchData(search, estado);
  }, [search, estado]);

  const handleSearchChange = (text) => {
    setSearch(text);
    fetchData(text, estado);
  };

  const handleOrderPress = (orderId) => {
    navigation.navigate('OrderDetails', { orderId });  // Asegúrate de que tienes una pantalla 'OrderDetails' configurada en tu navegador
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Historial de compras</Text>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={search}
          onChangeText={handleSearchChange}
        />
        <Icon name="search" type="font-awesome" size={24} style={styles.searchIcon} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, estado === 'Pendiente' && styles.activeButton]} onPress={() => setEstado('Pendiente')}>
          <Text>Pendiente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, estado === 'Finalizado' && styles.activeButton]} onPress={() => setEstado('Finalizado')}>
          <Text>Finalizado</Text>
        </TouchableOpacity>
      </View>
      {orders.map(order => (
        <TouchableOpacity key={order.id} style={styles.card} onPress={() => handleOrderPress(order.id)}>
          <Text style={styles.cardText}>Pedido: {order.id}</Text>
          <Text style={styles.cardText}>Fecha: {order.fecha}</Text>
          <Text style={styles.cardText}>Total: ${order.total}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#d2a563',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    marginTop: 50,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E4CA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 40,
    marginTop: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#EDE8C9',
    padding: 10,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: '#C4B393',
  },
  card: {
    backgroundColor: '#F1E0C5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Historial;
