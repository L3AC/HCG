import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Historial from '../screens/Logged/Cuenta';
import Producto from '../screens/Producto'; 

const Stack = createStackNavigator();

const StackHistorial = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cuenta" component={Cuenta} options={{ headerShown: false }} />
      <Stack.Screen name="Producto" component={Producto} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default StackHistorial;