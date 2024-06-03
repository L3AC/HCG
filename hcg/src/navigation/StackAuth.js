import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/NotLogged/Login';
import SignUp from '../screens/NotLogged/SignUp';
import NuevaClave from '../screens/NotLogged/Recup/NuevaClave';
import VerifCode from '../screens/NotLogged/Recup/VerifCode';
import VerifUs from '../screens/NotLogged/Recup/VerifUs';

const Stack = createStackNavigator();

const StackAuth = () => (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="NuevaClave" component={NuevaClave} options={{ headerShown: false }} />
      <Stack.Screen name="VerifCode" component={VerifCode} options={{ headerShown: false }} />
      <Stack.Screen name="VerifUs" component={VerifUs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );

export default StackAuth;