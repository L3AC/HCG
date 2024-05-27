import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Explorar from '../../screens/Logged/Explorar';
import Modelo from './Modelo';  // Importa la nueva pantalla de detalles

const Stack = createStackNavigator();

const StackCart = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explorar" component={Explorar} options={{ headerShown: false }} />
      <Stack.Screen name="Modelo" component={Modelo} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default StackCart;