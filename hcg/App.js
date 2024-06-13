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

 
