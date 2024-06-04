import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, RefreshControl, TextInput } from 'react-native';

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [complementItems, setComplementItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [filteredComplementItems, setFilteredComplementItems] = useState([]);

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [search, menuItems, complementItems]);

  const fetchMenuData = () => {
    // Realiza la solicitud a tu API para obtener los datos
    fetch('https://yourapiendpoint.com/menu')
      .then(response => response.json())
      .then(data => {
        setMenuItems(data.menuItems);
        setComplementItems(data.complementItems);
      })
      .catch(error => console.error(error));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMenuData();
    setRefreshing(false);
  };

  const filterItems = () => {
    const filteredMenu = menuItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredComplement = complementItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredMenuItems(filteredMenu);
    setFilteredComplementItems(filteredComplement);
  };

  const renderCard = (item) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        value={search}
        onChangeText={text => setSearch(text)}
      />
      <Text style={styles.title}>Menú del Día</Text>
      <View style={styles.menuContainer}>
        {filteredMenuItems.map(renderCard)}
      </View>
      <Text style={styles.title}>Complementos</Text>
      <View style={styles.menuContainer}>
        {filteredComplementItems.map(renderCard)}
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
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
