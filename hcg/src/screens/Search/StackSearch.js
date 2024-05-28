import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from './Search';
import Producto from '../Producto'; 

const Stack = createStackNavigator();

const StackCart = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <Stack.Screen name="Producto" component={Producto} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default StackCart;