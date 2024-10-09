import React, { useEffect, useState } from 'react'; 
import { View, Text, Image, ScrollView, StyleSheet, RefreshControl, Alert, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SERVER } from '../../contexts/Network';
import Header from '../../components/containers/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Importar FontAwesome

const DetallePedido = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [selectedNote, setSelectedNote] = useState(''); // Estado para la nota seleccionada

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

  // Función para mostrar el modal con la nota
  const showNoteModal = (nota) => {
    setSelectedNote(nota); // Establece la nota seleccionada
    setModalVisible(true); // Muestra el modal
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent} style={{ flex: 1 }} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrderDetails} />}
    >
      <Header onPress={() => navigation.goBack()} titulo={'Detalles'} />
      <View style={styles.container}>
        {orderItems.map((item) => (
          <View key={item.id_detalle_pedido} style={styles.card}>
            <Image source={{ uri: item.imagen_producto }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.descripcion_producto}</Text>
              <Text>Precio: ${item.precio_producto}</Text>
              <Text>Cantidad: {item.cantidad_pedido}</Text>
              <Text>Subtotal: ${item.subtotal}</Text>
            </View>
            {/* Ícono de la nota, solo se muestra si la nota no es "Nota vacía" */}
            {item.nota !== "Nota vacía" && (
              <Pressable onPress={() => showNoteModal(item.nota_pedido)}>
                <FontAwesome name="sticky-note" size={30} color="#FF0000" style={styles.noteIcon} />
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* Modal para mostrar la nota */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Nota del Pedido</Text>
                <Text style={styles.modalText}>{selectedNote}</Text>
                
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 30,
    padding: 30,
    paddingBottom: 400,
    backgroundColor: '#d2a563',
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F4F0E4',
    padding: 16,
    borderRadius: 10,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center', // Alinear verticalmente al centro
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
  noteIcon: {
    marginLeft: 10, // Espacio entre el ícono y el texto
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Centrar el título
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center', // Centrar el texto
  },
  closeButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DetallePedido;
