import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PurchaseHistoryScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Aquí iría la lógica para refrescar los datos.
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Historial de compras</Text>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Buscar" />
        <Ionicons name="search" size={24} color="black" />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text>Pendiente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Finalizado</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>Pedido: HJD902</Text>
        <Text style={styles.cardText}>Fecha: 8/6/2024</Text>
        <Text style={styles.cardText}>Total: $3</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>Pedido: HJD902</Text>
        <Text style={styles.cardText}>Fecha: 8/6/2024</Text>
        <Text style={styles.cardText}>Total: $3</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F4A261',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#EDE8C9',
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#EDE8C9',
    padding: 10,
    borderRadius: 25,
  },
  card: {
    backgroundColor: '#F1E0C5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default PurchaseHistoryScreen;
