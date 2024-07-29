import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { SERVER } from '../../contexts/Network';
import SweetAlert from '../../components/alerts/SimpleAlert';
import { useFonts } from 'expo-font';

const Cuenta = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(3);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { setIsLoggedIn } = useAuth();

  const handleDelete = () => {
    setAlertMessage('¿Está seguro que desea eliminar esto?');
    setConfirmVisible(true);
  };

  const handleConfirm = async (result) => {
    setAlertVisible(false);
    if (result) {
      try {
        const response = await fetch(`${SERVER}services/public/clientes.php?action=logOut`, {
          method: 'POST'
        });
        const data = await response.json();
        if (data.status) {
          Alert.alert(data.message);
          setIsLoggedIn(false);
          navigation.navigate('Login');
        } else {
          console.log(data);
          Alert.alert('Error sesion', data.error);
        }
      } catch (error) {
        console.error(error, "Error en el catch");
        Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
      }
    }
    setConfirmVisible(false);
  };

  const logOut = async () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de cerrar las sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await fetch(`${SERVER}services/public/clientes.php?action=logOut`, {
                method: 'POST'
              });

              const data = await response.json();
              if (data.status) {
                Alert.alert(data.message);
                setIsLoggedIn(false);
                navigation.navigate('Login');
              } else {
                console.log(data);
                Alert.alert('Error sesion', data.error);
              }
            } catch (error) {
              console.error(error, "Error en el catch");
              Alert.alert('Error', 'Ocurrió un error al cerrar sesión');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cuenta</Text>
        <Ionicons name="log-out-outline" size={60} color="black" onPress={logOut} />
      </View>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Perfil')}>
        <Ionicons name="person-circle-outline" size={50} color="white" />
        <Text style={styles.cardText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CambioClave')}>
        <Ionicons name="lock-closed-outline" size={50} color="white" />
        <Text style={styles.cardText}>Clave</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SobreNosotros')}>
        <Ionicons name="people-circle-outline" size={50} color="white" />
        <Text style={styles.cardText}>Sobre nosotros</Text>
      </TouchableOpacity>
      <SweetAlert 
        isVisible={confirmVisible} 
        type={alertType} 
        text={alertMessage} 
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleConfirm}
        confirm
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#d2a563',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 60,
    marginBottom: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'QuickSandBold'
  },
  card: {
    backgroundColor: '#AA6231',
    width: '90%',
    height: '20%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  cardText: {
    marginTop: 10,
    fontSize: 22,
    color: '#fff',
    fontFamily: 'QuickSand'
  },
});

export default Cuenta;
