import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackHome from './src/screens/Logged/Home';
import StackSearch from './src/navigation/Home/Navigation';
import Carrito from './src/screens/Logged/Carrito';

const Tab = createBottomTabNavigator();

const MainStack = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={StackHome} options={{ headerShown: false }} />
            <Tab.Screen name="ExplorarStack" component={StackSearch} options={{ headerShown: false }} />
            <Tab.Screen name="Carrito" component={Carrito} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default MainStack;
