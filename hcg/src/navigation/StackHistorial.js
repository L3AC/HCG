import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Historial from '../screens/Logged/Historial';
import DetallePedido from '../screens/Logged/DetallePedido'; 

const Stack = createStackNavigator();

const StackHistorial = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Historial" component={Historial} options={{ headerShown: false }} />
      <Stack.Screen name="DetallePedido" component={DetallePedido} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default StackHistorial;