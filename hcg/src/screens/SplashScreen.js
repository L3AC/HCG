import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { useRoute,useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();
  const [counter, setCounter] = useState(3); // Constante para la cuenta regresiva, indicando que cuente desde el 3 hacia el 1
  const positionValue = useRef(new Animated.Value(0)).current; // Constante para la posición del humo
  const route = useRoute(); // Obtiene la ruta actual
  const { log } = route.params;

  useEffect(() => {
    // Inicia el temporizador de cuenta regresiva
    const timer = setInterval(() => {
      setCounter(prevCounter => {
        if (prevCounter > 0) {
          return prevCounter - 1;
        } else {
          clearInterval(timer); // Limpia el temporizador
          return 0;
        }
      });
    }, 1000);

    // Animación de humo 
    Animated.timing(positionValue, {
      toValue: -100,  // Mueve el humo hacia arriba
      duration: 2000, // Duración de la animación en milisegundos
      easing: Easing.linear, // Tipo de animación
      useNativeDriver: true,
    }).start();

    // Limpia el temporizador cuando el componente se desmonta
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Navega al componente 'Auth' cuando el contador llega a 0
    if (counter === 0) {
      if(log){
        navigation.navigate('Main');
      }
      else{
        navigation.navigate('Auth');
      }
    }
  }, [counter, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenidos</Text>
      
      {/* Imagen de humo */}
      <Animated.Image
        source={require('../../assets/humo.png')}
        style={{
          position: 'absolute',
          bottom: 330,
          width: 260,
          height: 260,
          transform: [{ translateY: positionValue }],
        }}
      />
      {/* Imagen de taza de café */}
      <Animated.Image
        source={require('../../assets/taza.png')}
        style={{ width: 250, height: 250 }}
      />
      <Text style={styles.paragraph}>Cargando... {counter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDA35D',
    padding: 8,
  },
  title: {
    margin: 24,
    marginBottom: 50,
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
  },
});
