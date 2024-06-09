import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cuenta from '../screens/Logged/Cuenta';
import Perfil from '../screens/Logged/Perfil';
import CambioClave from '../screens/Logged/CambioClave';
import Nosotros from '../screens/Logged/Nosotros';
import Login from '../screens/NotLogged/Login';

const Stack = createStackNavigator();

const StackCuenta = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cuenta" component={Cuenta} options={{ headerShown: false }} />
      <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
      <Stack.Screen name="CambioClave" component={CambioClave} options={{ headerShown: false }} />
      <Stack.Screen name="Nosotros" component={Nosotros} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default StackCuenta;