import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Logged/Home';
import Producto from '../Producto'; 

const Stack = createStackNavigator();

const StackHome = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Producto" component={Producto} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default StackHome;