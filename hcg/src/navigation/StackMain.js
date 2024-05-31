import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StackHome from '../screens/Home/StackHome';
import StackSearch from './Search/StackSearch';
import StackCart from './Cart/StackCart';

const Tab = createBottomTabNavigator();

const MainStack = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="StackHome" component={StackHome} options={{ headerShown: false }} />
            <Tab.Screen name="StackSearch" component={StackSearch} options={{ headerShown: false }} />
            <Tab.Screen name="StackCart" component={StackCart} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default MainStack;
