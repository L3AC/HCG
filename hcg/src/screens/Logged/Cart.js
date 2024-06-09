import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, Alert,TextInput, ActivityIndicator,Modal } from 'react-native';
import { SERVER } from '../../contexts/Network';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidad, setCantidad] = useState('');
  const [nota, setNota] = useState('');
  const [currentItemId, setCurrentItemId] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchMenuData = async (query = '') => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('producto', query);
      const response = await fetch(`${SERVER}services/public/pedidos.php?action=readDetail`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.status === 1) {
        setCartItems(data.dataset|| []);
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
  const readOne = async (idDetallePedido) => {
    try {
      setLoadingModal(true);
      const formData = new FormData();
      formData.append('idDetallePedido', idDetallePedido);
      const response = await fetch(`${SERVER}services/public/detallepedidos.php?action=readOne`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.status === 1) {
        setCantidad(data.dataset.cantidad_pedido.toString() || '1');
        setNota(data.dataset.nota_pedido || 'Nota vacía');
        setCurrentItemId(idDetallePedido);
        console.log( cantidad+' '+nota+idDetallePedido );
        setModalVisible(true);
      } else {
        console.error('Error fetching data:', data.error);
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingModal(false);
    }
  };

  const updateDetalle = async (idDetallePedido) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('idDetallePedido', idDetallePedido);
      formData.append('cantidadPedido', cantidad);
      formData.append('notaPedido', nota);
      const response = await fetch(`${SERVER}services/public/detallepedidos.php?action=updateRow`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.status === 1) {
        fetchMenuData(); // Refresh the cart items after update
        setModalVisible(false);
      } else {
        console.error('Error updating data:', data.error);
        Alert.alert('Error', data.error);
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

  const totalToPay = cartItems.reduce((total, item) => total + (item.precio_producto * item.cantidad_pedido), 0);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Carrito de compras</Text>
      <TouchableOpacity style={styles.finalizeButton}>
        <Text style={styles.finalizeButtonText}>Finalizar</Text>
      </TouchableOpacity>
      <Text style={styles.totalText}>Total a pagar: ${totalToPay.toFixed(2)}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        cartItems.map((item) => (
          <View key={item.id_producto.toString()} style={styles.cartItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.descripcion_producto}</Text>
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => readOne(item.id_detalle_pedido)}>
                  <Ionicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemContent}>
              <Image source={{ uri: item.imagen_producto }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text>Precio: ${item.precio_producto}</Text>
                <Text>Cantidad: {item.cantidad_pedido}</Text>
                <Text>Subtotal: ${(item.precio_producto * item.cantidad_pedido).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {loadingModal ? ( // Mostrar círculo de carga mientras se está cargando el modal
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <Text style={styles.modalTitle}>Editar Producto</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Cantidad"
                  value={cantidad}
                  onChangeText={setCantidad}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.modalTextArea}
                  placeholder="Nota"
                  value={nota}
                  onChangeText={setNota}
                  multiline
                />
                <TouchableOpacity style={styles.confirmButton} onPress={() => updateDetalle(currentItemId)}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

  

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#d2a563',
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#F5D7A4',
  },
  modalTextArea: {
    width: '100%',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#F5D7A4',
  },
  confirmButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;