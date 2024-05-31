import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Historial from '../screens/Logged/Historial';
import Producto from '../screens/Producto'; 

const Stack = createStackNavigator();

const StackHistorial = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Historial" component={Historial} options={{ headerShown: false }} />
      <Stack.Screen name="Producto" component={Producto} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default StackHistorial;