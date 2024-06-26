import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa el paquete de iconos
import StackHome from '../navigation/StackHome';
import StackHistorial from '../navigation/StackHistorial';
import StackCuenta from '../navigation/StackCuenta';
import StackCart from '../navigation/StackCart';

const Tab = createBottomTabNavigator();

// Componente para manejar animaciones de los iconos
const AnimatedIcon = ({ name, focused, size, color }) => {
    const spinValue = new Animated.Value(0);
    const scaleValue = new Animated.Value(1);

    if (focused) {
        Animated.parallel([
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 0.8, // Reduce el tamaño del icono
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1.2, // Aumenta el tamaño del icono
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            spinValue.setValue(0); // Reinicia la animación de rotación
            scaleValue.setValue(1); // Reinicia la escala
        });
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }, { scale: scaleValue }] }}>
            <Icon name={name} size={size} color={color} />
        </Animated.View>
    );
};

// Componente principal que define la navegación de pestañas inferiores
const StackMain = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size = 40 }) => { // Ajusta el tamaño de los iconos a 35
                    let iconName;

                    if (route.name === 'StackHome') {
                        iconName = focused ? 'home' : 'home-outline'; // Elige el icono que prefieras
                    } else if (route.name === 'StackCart') {
                        iconName = focused ? 'cart' : 'cart'; // Elige el icono que prefieras
                    } else if (route.name === 'StackHistorial') {
                        iconName = focused ? 'history' : 'history'; // Elige el icono que prefieras
                    } else if (route.name === 'StackCuenta') {
                        iconName = focused ? 'account' : 'account'; // Elige el icono que prefieras
                    }

                    return <AnimatedIcon name={iconName} focused={focused} size={size} color={color} />;
                },
                tabBarShowLabel: false, // Ocultar el texto
                tabBarActiveTintColor: '#DDA35D',
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: styles.tabBar, // Añadir estilo personalizado
                tabBarItemStyle: styles.tabBarItem,
            })}
        >
            {/* Define las pantallas para cada pestaña */}
            <Tab.Screen
                name="StackHome"
                component={StackHome}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="StackCart"
                component={StackCart}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="StackHistorial"
                component={StackHistorial}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="StackCuenta"
                component={StackCuenta}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
};

// Estilos para la barra de pestañas y sus ítems
const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        backgroundColor: '#5C2C0C',
        height: 75, // Ajusta la altura para acomodar iconos más grandes
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    tabBarItem: {
        margin: 5,
        
    },
});

export default StackMain;
