import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>HCG</Text>
      <Text style={styles.title}>Menu del día</Text>
      <View style={styles.grid}>
        <View style={styles.card}>
          <Image style={styles.image} source={{ uri: 'https://i.imgur.com/O1hRDdn.jpg' }} />
          <Text style={styles.itemName}>Club Sandwich</Text>
          <Text style={styles.price}>$3</Text>
        </View>
        <View style={styles.card}>
          <Image style={styles.image} source={{ uri: 'https://i.imgur.com/3kdc1rT.jpg' }} />
          <Text style={styles.itemName}>Hamburguesa</Text>
          <Text style={styles.price}>$3</Text>
        </View>
        <View style={styles.card}>
          <Image style={styles.image} source={{ uri: 'https://i.imgur.com/1WxHILm.jpg' }} />
          <Text style={styles.itemName}>Hamb de pollo</Text>
          <Text style={styles.price}>$3</Text>
        </View>
        <View style={styles.card}>
          <Image style={styles.image} source={{ uri: 'https://i.imgur.com/7U1UHD8.jpg' }} />
          <Text style={styles.itemName}>Nachos</Text>
          <Text style={styles.price}>$3</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Complementos</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#D3A66A',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 150,
    margin: 10,
    padding: 10,
    backgroundColor: '#F0E2B6',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Home;