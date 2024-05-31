import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from '../screens/Logged/Cart';
import Home from '../screens/Logged/Home';  // Importa la nueva pantalla de detalles

const Stack = createStackNavigator();

const StackCart = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default StackCart;