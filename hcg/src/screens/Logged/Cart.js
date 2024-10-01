import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, Alert, TextInput, ActivityIndicator, Modal } from 'react-native';
import { SERVER } from '../../contexts/Network';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SimpleAlert from '../../components/alerts/SimpleAlert'; // Importa la alerta simple
import Input from '../../components/inputs/Input';
import PhoneInput from '../../components/inputs/PhoneInput';
import Confirm from '../../components/buttons/Confirm';

const Cart = () => {
  const [refreshing, setRefreshing] = useState(false); // Estado para indicar si se está refrescando la pantalla
  const [loading, setLoading] = useState(false); // Estado para indicar si se está cargando la lista de elementos del carrito
  const [cartItems, setCartItems] = useState([]); // Estado para almacenar los elementos del carrito
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [cantidad, setCantidad] = useState(''); // Estado para almacenar la cantidad de productos del modal
  const [nota, setNota] = useState(''); // Estado para almacenar la nota del producto del modal
  const [currentItemId, setCurrentItemId] = useState(null); // Estado para almacenar el ID del elemento actual del modal
  const [loadingModal, setLoadingModal] = useState(false); // Estado para indicar si se está cargando el modal
  const navigation = useNavigation(); // Hook de navegación para acceder a la navegación

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const handleShowSimpleAlert = (message, type = 'info', timer = 1500) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), timer);
  };

  // Función para obtener los datos del carrito desde el servidor
  const fetchMenuData = async (query = '') => {
    try {
      setLoading(true); // Indica que se está cargando
      const formData = new FormData();
      formData.append('producto', query);
      const response = await fetch(`${SERVER}services/public/pedidos.php?action=readDetail`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.status === 1) {
        setCartItems(data.dataset || []); // Actualiza los elementos del carrito
      } else {
        handleShowSimpleAlert('No hay ningún producto agregado', 'warning');
        setTimeout(() => {
          navigation.navigate('StackHome'); // Navega a la pantalla principal (home) después de 1.5 segundos
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error); // Muestra un error en la consola en caso de fallo
    } finally {
      setLoading(false); // Finaliza el estado de carga
      setRefreshing(false); // Finaliza el estado de refresco
    }
  };

  // Función para obtener los detalles de un producto específico
  const readOne = async (idDetallePedido) => {
    try {
      setLoadingModal(true); // Indica que se está cargando el modal
      const formData = new FormData();
      formData.append('idDetallePedido', idDetallePedido);
      const response = await fetch(`${SERVER}services/public/detallepedidos.php?action=readOne`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.status === 1) {
        setCantidad(data.dataset.cantidad_pedido.toString() || '1'); // Actualiza la cantidad del producto
        setNota(data.dataset.nota_pedido || 'Nota vacía'); // Actualiza la nota del producto
        setCurrentItemId(idDetallePedido); // Actualiza el ID del producto actual
        console.log(cantidad + ' ' + nota + idDetallePedido); // Muestra el modal
        setModalVisible(true);
      } else {
        console.error('Error fetching data:', data.error); // Muestra un error si falla la obtención de datos
        Alert.alert('Error', data.error); // Muestra una alerta con el mensaje de error
      }
    } catch (error) {
      console.error('Error:', error); // Muestra un error en la consola en caso de fallo
    } finally {
      setLoadingModal(false); // Finaliza el estado de carga del modal
    }
  };

  // Función para actualizar los detalles de un producto
  const updateDetalle = async (idDetallePedido) => {
    try {
      setLoading(true); // Indica que se está cargando
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
        fetchMenuData(); // Actualiza los elementos del carrito después de la actualización
        setModalVisible(false); // Oculta el modal
      } else {
        console.error('Error updating data:', data.error); // Muestra un error si falla la actualización
        Alert.alert('Error', data.error); // Muestra una alerta con el mensaje de error
      }
    } catch (error) {
      console.error('Error:', error); // Muestra un error en la consola en caso de fallo
    } finally {
      setLoading(false); // Finaliza el estado de carga
      setRefreshing(false); // Finaliza el estado de refresco
    }
  };

  // Función para eliminar un detalle de pedido
  const deleteDetalle = async (idDetallePedido) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este producto?",
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
              setLoading(true); // Indica que se está cargando
              const formData = new FormData();
              formData.append('idDetallePedido', idDetallePedido);
              const response = await fetch(`${SERVER}services/public/detallepedidos.php?action=deleteRow`, {
                method: 'POST',
                body: formData,
              });
              const data = await response.json();

              if (response.ok && data.status === 1) {
                fetchMenuData(); // Actualiza los elementos del carrito después de la eliminación
                setModalVisible(false); // Oculta el modal
              } else {
                Alert.alert('Error', data.error); // Muestra una alerta con el mensaje de error
              }
            } catch (error) {
              console.error('Error:', error); // Muestra un error en la consola en caso de fallo
            } finally {
              setLoading(false); // Finaliza el estado de carga
              setRefreshing(false); // Finaliza el estado de refresco
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Función para finalizar el pedido
  const finishOrder = async () => {
    try {
      setLoading(true); // Indica que se está cargando
      const response = await fetch(`${SERVER}services/public/pedidos.php?action=finishOrder`, {
        method: 'POST'
      });
      const data = await response.json();

      if (response.ok && data.status === 1) {
        Alert.alert(data.message);
        navigation.navigate('Home'); // Navega a la pantalla de inicio
      } else {
        console.error('Error:', data.error); // Muestra un error en la consola en caso de fallo
        Alert.alert('Error', data.error); // Muestra una alerta con el mensaje de error
      }
    } catch (error) {
      console.error('Error:', error); // Muestra un error en la consola en caso de fallo
    } finally {
      setLoading(false); // Finaliza el estado de carga
      setRefreshing(false); // Finaliza el estado de refresco
    }
  };

  useEffect(() => {
    fetchMenuData(); // Carga inicial de los datos del carrito al montar el componente
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMenuData();
    }, [])
  );

  // Función para manejar el evento de refresco
  const onRefresh = () => {
    setRefreshing(true); // Activa el estado de refresco
    fetchMenuData(); // Refresca los datos del carrito
  };

  // Calcula el total a pagar sumando el precio por cantidad de cada producto en el carrito
  const totalToPay = cartItems.reduce((total, item) => total + (item.precio_producto * item.cantidad_pedido), 0);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Componente RefreshControl para actualizar la lista
    >
      <Text style={styles.header}>Carrito de compras</Text>
      <Confirm onPress={() => finishOrder()} tittle={'Finalizar'}/>
      <Text style={styles.totalText}>Total a pagar: ${totalToPay.toFixed(2)}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // Mapea los elementos del carrito y renderiza la información de cada producto
        cartItems.map((item) => (
          <View key={item.id_producto.toString()} style={styles.cartItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.descripcion_producto}</Text>
              <View style={styles.iconsContainer}>
                {/* Botón para editar el producto */}
                <TouchableOpacity onPress={() => readOne(item.id_detalle_pedido)}>
                  <Ionicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
                {/* Botón para eliminar el producto */}
                <TouchableOpacity onPress={() => deleteDetalle(item.id_detalle_pedido)}>
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
      {/* Modal para editar detalles del producto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Overlay para cerrar el modal al hacer clic fuera del contenido */}
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {loadingModal ? ( // Mostrar círculo de carga mientras se está cargando el modal
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <Text style={styles.modalTitle}>Editar Producto</Text>
                {/* Input para la cantidad */}
                <PhoneInput
                  type={'custom'}
                  format={'9'}
                  value={cantidad}
                  onChangeText={setCantidad}
                  placeHolder='Cantidad'
                />
                <Input
                  placeHolder='Nota'
                  value={nota}
                  onChangeText={setNota}
                  multiline={true}
                />
                
                {/* Botón para confirmar la edición */}
                <Confirm onPress={() => updateDetalle(currentItemId)} tittle={'Confirmar'}/>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
      <SimpleAlert
        isVisible={alertVisible}
        type={alertType}
        text={alertMessage}
        timer={1500}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

// Estilos para el componente CartScreen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#d2a563',
    marginBottom:20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
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
    backgroundColor: '#d2a563',
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

export default Cart;
