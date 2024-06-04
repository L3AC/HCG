import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, RefreshControl, TextInput, Alert } from 'react-native';
import { SERVER } from '../../contexts/Network';
import { Icon } from 'react-native-elements';

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [complementItems, setComplementItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData(search);
  }, [search]);

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

      //const text = await response.text();
      const data = await response.json();

      if (response.ok && data.status === 1) {
        setMenuItems(data.dataset.conjunto || []);
        setComplementItems(data.dataset.complementario || []);
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

  const handleSearchChange = (text) => {
    setSearch(text);
    fetchMenuData(text);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMenuData(search);
  };

  const renderCard = (item) => (
    <View key={item.id_producto} style={styles.card}>
      <Image source={{ uri: item.imagen_producto }} style={styles.image} />
      <Text style={styles.itemName}>{item.descripcion_producto}</Text>
      <Text style={styles.itemPrice}>${item.precio_producto}</Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        value={search}
        onChangeText={handleSearchChange}
      />
        <Icon name="search" type="font-awesome" size={24} style={styles.searchIcon} />
      </View>

      <Text style={styles.title}>Menú del Día</Text>
      <View style={styles.menuContainer}>
        {loading ? (
          <Text>Cargando...</Text>
        ) : (
          menuItems.map(renderCard)
        )}
      </View>
      <Text style={styles.title}>Complementos</Text>
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#d2a563',
    flexGrow: 1,
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
  /*searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },*/
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '48%',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default MenuScreen;
