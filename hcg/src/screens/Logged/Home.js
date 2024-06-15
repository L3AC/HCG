// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, RefreshControl, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVER } from '../../contexts/Network'; // URL del servidor
import { Icon } from 'react-native-elements'; // Iconos de react-native-elements

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]); // Estado para almacenar los items del menú
  const [complementItems, setComplementItems] = useState([]); // Estado para almacenar los items complementarios
  const [refreshing, setRefreshing] = useState(false); // Estado para el control de la actualización
  const [search, setSearch] = useState(''); // Estado para el control de la búsqueda
  const [loading, setLoading] = useState(true); // Estado para el control de la carga

  const navigation = useNavigation(); // Hook de navegación para cambiar entre pantallas

  // useEffect para obtener los datos del menú al montar el componente o cambiar la búsqueda
  useEffect(() => {
    fetchMenuData(search);
  }, [search]);

  // Función para obtener los datos del menú
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
        setMenuItems(data.dataset.conjunto || []); // Actualiza los items del menú
        setComplementItems(data.dataset.complementario || []); // Actualiza los items complementarios
      } else {
        console.error('Error fetching data:', data.message);
        Alert.alert('Error', data.message); // Muestra un alerta en caso de error
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (text) => {
    setSearch(text);
    fetchMenuData(text);
  };

  // Función de actualización
  const onRefresh = () => {
    setRefreshing(true);
    fetchMenuData(search);
  };

  // Función para renderizar cada tarjeta del menú
  const renderCard = (item) => (
    <TouchableOpacity key={item.id_producto} style={styles.card} onPress={() => navigation.navigate('Producto', { idProducto: item.id_producto })}>
      <Image source={{ uri: item.imagen_producto }} style={styles.image} />
      <Text style={styles.itemName}>{item.descripcion_producto}</Text>
      <Text style={styles.itemPrice}>${item.precio_producto}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Barra de búsqueda */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={search}
          onChangeText={handleSearchChange}
        />
        <Icon name="search" type="font-awesome" size={24} style={styles.searchIcon} />
      </View>
      {/* Título del menú del día */}
      <Text style={styles.title}>Menú del Día</Text>
      {/* Contenedor de los items del menú */}
      <View style={styles.menuContainer}>
        {loading ? (
          <Text>Cargando...</Text>
        ) : (
          menuItems.map(renderCard)
        )}
      </View>
      {/* Título de los complementos */}
      <Text style={styles.title}>Complementos</Text>
      {/* Contenedor de los items complementarios */}
      <View style={styles.menuContainer}>
        {loading ? (
          <Text>Cargando...</Text>
        ) : (
          complementItems.map(renderCard)
        )}
      </View>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#d2a563', // Color de fondo
    flexGrow: 1,
  },
  searchBarContainer: {
    flexDirection: 'row', // Coloca los elementos en una fila
    alignItems: 'center', // Alinea los elementos verticalmente al centro
    backgroundColor: '#F0E4CA', // Color de fondo de la barra de búsqueda
    borderRadius: 10, // Bordes redondeados
    padding: 10,
    marginBottom: 40,
    marginTop: 40,
  },
  searchInput: {
    flex: 1, // Permite que el campo de búsqueda ocupe el máximo espacio disponible
    fontSize: 18,
    color: '#000', // Color del texto del campo de búsqueda
  },
  searchIcon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuContainer: {
    paddingBottom: 40, // Padding inferior
    flexDirection: 'row', // Coloca los elementos en una fila
    flexWrap: 'wrap', // Permite que los elementos se envuelvan a la siguiente línea
    justifyContent: 'space-between', // Distribuye el espacio equitativamente entre los elementos
  },
  card: {
    backgroundColor: '#f4f4f4', // Color de fondo de la tarjeta
    borderRadius: 8, // Bordes redondeados
    padding: 16,
    marginVertical: 8,
    alignItems: 'center', // Alinea los elementos horizontalmente al centro
    width: '48%', // Ancho de la tarjeta
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8, // Bordes redondeados de la imagen
  },
  itemName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Alinea el texto al centro
  },
  itemPrice: {
    fontSize: 14,
    color: '#333', // Color del texto del precio
    textAlign: 'center', // Alinea el texto al centro
  },
});

export default MenuScreen; // Exporta el componente MenuScreen
