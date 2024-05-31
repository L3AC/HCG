import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackHome from '../screens/Logged/Home/StackHome';
import StackHistorial from './Search/Logged/StackHistorial';
import StackCuenta from './Search/Logged/StackCuenta';
import StackCart from './Cart/Logged/StackCart';

const Tab = createBottomTabNavigator();

const StackMain = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="StackHome" component={StackHome} options={{ headerShown: false }} />
            <Tab.Screen name="StackHistorial" component={StackHistorial} options={{ headerShown: false }} />
            <Tab.Screen name="StackCuenta" component={StackCuenta} options={{ headerShown: false }} />
            <Tab.Screen name="StackCart" component={StackCart} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default StackMain;
