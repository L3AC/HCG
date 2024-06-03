import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, RefreshControl } from 'react-native';

const MenuScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular una solicitud de red
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const menuItems = [
    { id: '1', name: 'Club Sandwich', price: '$3', image: require('../../img/logo.png') },
    { id: '2', name: 'Hamburguesa', price: '$3', image: require('../../img/logo.png') },
    { id: '3', name: 'Hamb de pollo', price: '$3', image: require('../../img/logo.png') },
    { id: '4', name: 'Nachos', price: '$3', image: require('../../img/logo.png') },
    { id: '5', name: 'Hamb de pollo', price: '$3', image: require('../../img/logo.png') },
    { id: '6', name: 'Nachos', price: '$3', image: require('../../img/logo.png') },
  ];

  const complementItems = [
    { id: '5', name: 'Papas Fritas', price: '$1', image: require('../../img/logo.png') },
    { id: '6', name: 'Aros de Cebolla', price: '$1', image: require('../../img/logo.png') },
  ];

  return (
    <ScrollView
    contentContainerStyle={[styles.container, { flexGrow: 1 }]}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
  >
      <Text style={styles.title}>Menú del Día</Text>
      <View style={styles.menuContainer}>
        {menuItems.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.title}>Complementos</Text>
      <View style={styles.menuContainer}>
        {complementItems.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#d2a563',
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
