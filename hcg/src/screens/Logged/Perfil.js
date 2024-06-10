import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, RefreshControl, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SERVER } from '../../contexts/Network';

const PerfilScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre_cliente: '',
    apellido_cliente: '',
    correo_cliente: '',
    usuario_cliente: '',
    telefono_cliente: ''
  });

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${SERVER}services/public/clientes.php?action=readProfile`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status) {
        setProfileData(data.dataset);
      } else {
        Alert.alert('Error', 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error(error, "Error desde Catch");
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={35} color="black" />
        <Text style={styles.title}>Perfil</Text>
        <Ionicons name="pencil" size={35} color="black" />
      </View>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={profileData.nombre_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, nombre_cliente: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Apellido" 
            value={profileData.apellido_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, apellido_cliente: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Correo" 
            value={profileData.correo_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, correo_cliente: text })}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Usuario" 
            value={profileData.usuario_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, usuario_cliente: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefono</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Telefono" 
            value={profileData.telefono_cliente} 
            onChangeText={(text) => setProfileData({ ...profileData, telefono_cliente: text })}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#D59141',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F2E7CF',
  },
  button: {
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 8,
    marginTop: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PerfilScreen;
