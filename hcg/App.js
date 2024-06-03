import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import StackMain from './src/navigation/StackMain';
import StackAuth from './src/navigation/StackAuth';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

const App = () => {
  const { isLoggedIn } = useAuth();

  /*const [fontsLoaded] = useFonts({
    QuickSand: require("../../../assets/fonts/Quicksand-Regular.ttf"),
    QuickSandBold: require("../../../assets/fonts/Quicksand-Bold.ttf"),
  });
  
      const menuItems = [
    { id: '1', name: 'Club Sandwich', price: '$3', image: require('../../img/logo.png') },
    { id: '2', name: 'Hamburguesa', price: '$3', image:   require('../../img/logo.png') },
    { id: '3', name: 'Hamb de pollo', price: '$3', image: require('../../img/logo.png') },
    { id: '4', name: 'Nachos', price: '$3', image:        require('../../img/logo.png') },
  ];

  const complementItems = [
    { id: '5', name: 'Papas Fritas', price: '$1', image: require('../../img/logo.png') },
    { id: '6', name: 'Aros de Cebolla', price: '$1', image: require('../../img/logo.png') },
  ];
  */

  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen
              name="Main"
              component={StackMain}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Auth"
              component={StackAuth}
              options={{ headerShown: false }}
            />

          )}
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;

 
