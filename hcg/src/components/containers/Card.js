import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SERVER } from '../../contexts/Network';

const Card = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item.id_modelo)}>
    <Image source={{ uri: `${SERVER}images/modelos/${item.foto_modelo}` }} style={styles.image} />
    <Text style={styles.cardTitle}>{item.descripcion_modelo}</Text>
    <Text style={styles.cardSubtitle}>{item.marca}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 8,
    margin: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Card;
