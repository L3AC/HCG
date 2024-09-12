import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import StackMain from './src/navigation/StackMain';
import StackAuth from './src/navigation/StackAuth';
import SplashScreen from './src/screens/SplashScreen';
import { SERVER } from './src/contexts/Network';
import { enableScreens } from 'react-native-screens';
enableScreens();

const Stack = createStackNavigator();

const App = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la pantalla de carga

  const getSession = async () => {
    try {
      const response = await fetch(`${SERVER}services/public/clientes.php?action=getUser`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.status) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoggedIn(false); // Manejo de error: Se asume que la sesión no está iniciada
    } finally {
      setIsLoading(false); // Deja de mostrar la pantalla de carga
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator>
          {isLoading ? (
            <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
            initialParams={{ log: isLoading}}
          />
          ) : isLoggedIn ? (
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
