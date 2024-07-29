import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { SERVER } from '../../contexts/Network';
import Header from '../../components/containers/Header';

// Estados para manejar la interfaz y los datos del producto
const Producto= () => {
  const [refreshing, setRefreshing] = useState(false); // Estado para el control de refresco
  const [loading, setLoading] = useState(false); // Estado para el control de carga
  const [productInfo, setProductInfo] = useState({}); // Estado para la información del producto
  const [details, setDetails] = useState([]); // Estado para los detalles del producto
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [cantidad, setCantidad] = useState(''); // Estado para la cantidad del producto a agregar
  const [nota, setNota] = useState(''); // Estado para la nota del producto a agregar

  // Hooks de navegación y rutas
  const route = useRoute();
  const navigation = useNavigation(); // Hook para la navegación
  const { idProducto } = route.params; // Obtener el ID del producto desde los parámetros de la ruta

  // Función para obtener datos del producto desde el servidor
  const fetchMenuData = async () => {
    try {
      setLoading(true); // Activar estado de carga
      const formData = new FormData(); // Crear un nuevo objeto FormData
      formData.append('idProducto', idProducto); // Agregar el ID del producto a los datos del formulario

      // Hacer una solicitud a la API para obtener los datos del producto
      const response = await fetch(`${SERVER}services/public/detalleproductos.php?action=readByProducto2`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Parsear la respuesta a JSON
      if (response.ok && data.status === 1) {
        // Si la respuesta es exitosa y el estado es 1, actualizar los estados de producto y detalles
        setProductInfo(data.dataset.info || {});
        setDetails(data.dataset.detalles || []);
      } else {
        // Si hay un error en la respuesta, mostrar un mensaje de error
        console.error('Error fetching data:', data.message);
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      // Manejo de errores en la solicitud
      console.error('Error:', error);
    } finally {
      /*setLoading(false);
      setRefreshing(false);*/
    }
  };

  // Función para agregar el producto al carrito
  const addToCart = async () => {
    try {
      setLoading(true); // Activar estado de carga
      const formData = new FormData(); // Crear un nuevo objeto FormData
      formData.append('idProducto', idProducto); // Agregar el ID del producto a los datos del formulario
      formData.append('cantidadProducto', cantidad); // Agregar la cantidad del producto
      formData.append('notaProducto', nota); // Agregar la nota del producto

      // Hacer una solicitud a la API para agregar el producto al carrito
      const response = await fetch(`${SERVER}services/public/pedidos.php?action=createDetail`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Parsear la respuesta a JSON
      if (response.ok && data.status === 1) {
        // Si la respuesta es exitosa y el estado es 1, mostrar una alerta y navegar al carrito
        Alert.alert('Producto añadido', 'Se ha añadido el producto al carrito.');
        setModalVisible(false);
        navigation.navigate('Cart');
      }
      else if (response.ok && data.status === 2) {
        // Si la respuesta es exitosa y el estado es 2, mostrar un mensaje de alerta
        console.error(data.message);
        setModalVisible(false);
        Alert.alert('Alerta', data.message);
      }
      else {
        // Si hay un error en la respuesta, mostrar un mensaje de error
        console.error(data.error);
        setModalVisible(false);
        Alert.alert('Alerta', data.error);
      }
    } catch (error) {
      // Manejo de errores en la solicitud
      console.error('Error:', error);
    } finally {
      /*setLoading(false);
      setRefreshing(false);*/
    }
  };

  // Efecto para cargar datos del producto al montar el componente
  useEffect(() => {
    fetchMenuData();
  }, []);

  // Función de refresco de datos
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMenuData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Control de refresco
    >
      <Header onPress={() => navigation.goBack()} titulo={'Detalle'} />
      <View style={styles.container}>
        
        {/* Título del producto */}
        <Text style={styles.title}>{productInfo.descripcion_producto || 'Producto'}</Text>
        {/* Imagen del producto */}
        <View style={styles.contendor2}>
          <Image
            source={{ uri: productInfo.imagen_producto || 'https://example.com/placeholder.jpg' }}
            style={styles.image}
          />
          {/* Información del producto */}
          <View style={styles.infoRow}>
            <View style={styles.contenedorTexto}>
              <Text style={styles.infoText}> {productInfo.tipo_producto || 'N/A'}</Text>
            </View>
            <View style={styles.contenedorTexto}>
              <Text style={styles.infoText}> ${productInfo.precio_producto || '0.00'}</Text>
            </View>
          </View>
        </View>
        {/* Lista de detalles del producto */}
        <Text style={styles.itemsTitle}>Extra</Text>
        {details.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.descripcion_item}</Text>
            <Text style={styles.itemText}>{item.descripcion_tipo_item}</Text>
            <Text style={styles.itemText}>{item.cantidad_item}</Text>
          </View>
        ))}
        {/* Botón para abrir el modal de agregar al carrito */}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar el producto al carrito */}
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

// Estilos del componente
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
  contendor2: {
    backgroundColor: '#AA6231',
    borderRadius: 20,
    width: '100%'
  },
  contenedorTexto: {
    backgroundColor: '#E3DECA',
    borderRadius: 10,
    marginLeft: 30
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
  },
  title: {
    paddingTop: 0,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'QuickSand',
    textShadowColor: '#000',

  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 16,
    marginVertical: 16,
    alignSelf: 'center',
    borderColor: '#fff',
    borderWidth: 3,
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
    padding: 10,
    fontFamily: 'QuickSand'
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    fontFamily: 'QuickSandBold',
    marginTop: 10
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#AA6231',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    width: '90%',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'QuickSand'
  },
  addButton: {
    backgroundColor: '#2F2C2C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'QuickSand'
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
  flechita: {
    fontSize: 30,
  }
});

export default Producto;
