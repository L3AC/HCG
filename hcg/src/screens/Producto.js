import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { SERVER } from '../contexts/Network';

const ProductoScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState({});
  const [details, setDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidad, setCantidad] = useState('');
  const [nota, setNota] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { idProducto } = route.params;

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('idProducto', idProducto);

      const response = await fetch(`${SERVER}services/public/detalleproductos.php?action=readByProducto2`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.status === 1) {
        setProductInfo(data.dataset.info || {});
        setDetails(data.dataset.detalles || []);
      } else {
        console.error('Error fetching data:', data.message);
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      /*setLoading(false);
      setRefreshing(false);*/
    }
  };
  const addToCart = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('idProducto', idProducto);
      formData.append('cantidadProducto', cantidad);
      formData.append('notaProducto', nota);

      const response = await fetch(`${SERVER}services/public/pedidos.php?action=createDetail`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.status === 1) {
        Alert.alert('Producto añadido', 'Se ha añadido el producto al carrito.');
        setModalVisible(false);
        navigation.navigate('Carrito');
      }
      else if(response.ok && data.status ===2) {
        console.error(data.message);
        setModalVisible(false);
        Alert.alert('Alerta', data.message);
      }
      else{
        console.error(data.error);
        setModalVisible(false);
        Alert.alert('Alerta', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      /*setLoading(false);
      setRefreshing(false);*/
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMenuData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="font-awesome" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{productInfo.descripcion_producto || 'Producto'}</Text>
        <Image
          source={{ uri: productInfo.imagen_producto || 'https://example.com/placeholder.jpg' }}
          style={styles.image}
        />
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Tipo: {productInfo.tipo_producto || 'N/A'}</Text>
          <Text style={styles.infoText}>Precio: ${productInfo.precio_producto || '0.00'}</Text>
        </View>
        <Text style={styles.itemsTitle}>Items</Text>
        {details.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.descripcion_item}</Text>
            <Text style={styles.itemText}>{item.descripcion_tipo_item}</Text>
            <Text style={styles.itemText}>{item.cantidad_item}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar</Text>
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
            <TouchableOpacity style={styles.confirmButton} onPress={addToCart}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#d2a563',
  },
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#d2a563',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
  },
  title: {
    paddingTop:45,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#000',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 16,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 18,
    color: '#000',
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0E3',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    width: '90%',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
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

export default ProductoScreen;
