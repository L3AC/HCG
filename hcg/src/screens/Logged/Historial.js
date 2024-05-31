import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';

const data = [
  { id: '1', name: 'Club Sandwich', price: '$3', image: require('../../img/nachos.jpg') },
  { id: '2', name: 'Club Sandwich', price: '$3', image: require('../../img/nachos.jpg') },
  { id: '3', name: 'Club Sandwich', price: '$3', image: require('../../img/nachos.jpg') },
  { id: '4', name: 'Club Sandwich', price: '$3', image: require('../../img/nachos.jpg') },
];

const App = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput style={styles.searchInput} placeholder="Carne" />
        <Icon name="search" type="font-awesome" size={24} style={styles.searchIcon} />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFA56D',
    padding: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E4CA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  card: {
    backgroundColor: '#F0E4CA',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    width: '45%',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
  },
});

export default App;
