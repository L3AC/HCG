import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/NotLogged/Login';
import NuevaClave from './src/screens/NotLogged/NuevaClave';
import VerifCode from './src/screens/NotLogged/VerifCode';
import VerifUs from './src/screens/NotLogged/VerifUs';

const Stack = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="NuevaClave" component={NuevaClave} options={{ headerShown: false }} />
      <Stack.Screen name="VerifCode" component={VerifCode} options={{ headerShown: false }} />
      <Stack.Screen name="VerifUs" component={VerifUs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );